import { DemoStore } from "../../data/demo-store.service";
import { Component, inject, signal, computed } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { news, normalize } from "../../data/mocks/content";
import { CardComponent } from "../../shared/components/card.component";
@Component({
  selector: "app-noticias",
  imports: [FormsModule, CardComponent],
  templateUrl: "./noticias.component.html",
  styleUrl: "./noticias.component.css",
})
export class NoticiasComponent {
  store = inject(DemoStore);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  q = signal("");
  category = signal("Todas");
  categories = ["Todas", "Exposiciones", "Patrimonio", "Actividades"];
  filtered = computed(() =>
    this.store
      .published()
      .filter(
        (n) =>
          normalize(n.title).includes(normalize(this.q())) &&
          (this.category() === "Todas" || n.category === this.category()),
      ),
  );
  query = computed(() => ({
    q: this.q() || null,
    categoria: this.category() === "Todas" ? null : this.category(),
  }));
  constructor() {
    this.route.queryParamMap.subscribe((p) => {
      this.q.set(p.get("q") || "");
      const c = p.get("categoria") || "Todas";
      this.category.set(this.categories.includes(c) ? c : "Todas");
    });
  }
  update(q: string, c: string) {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { q: q || null, categoria: c === "Todas" ? null : c },
      replaceUrl: true,
    });
  }
  clear() {
    this.update("", "Todas");
  }
}
