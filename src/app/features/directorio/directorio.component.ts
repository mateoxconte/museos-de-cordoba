import { DemoStore } from "../../data/demo-store.service";
import { Component, inject, signal, computed } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { museums, normalize, cities, types } from "../../data/mocks/content";
import { CardComponent } from "../../shared/components/card.component";
@Component({
  selector: "app-directorio",
  imports: [FormsModule, CardComponent],
  templateUrl: "./directorio.component.html",
  styleUrl: "./directorio.component.css",
})
export class DirectorioComponent {
  store = inject(DemoStore);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  get cities() {
    return this.store.cities();
  }
  get types() {
    return this.store.types();
  }
  draftQ = "";
  draftCity = "";
  draftType = "";
  q = signal("");
  city = signal("");
  type = signal("");
  filtered = computed(() =>
    this.store
      .publicMuseums()
      .filter(
        (m) =>
          normalize(m.name).includes(normalize(this.q())) &&
          (!this.city() || m.city === this.city()) &&
          (!this.type() || m.type === this.type()),
      ),
  );
  query = computed(() => ({
    q: this.q() || null,
    localidad: this.city() || null,
    tipo: this.type() || null,
  }));
  constructor() {
    this.route.queryParamMap.subscribe((p) => {
      this.q.set(p.get("q") || "");
      this.city.set(p.get("localidad") || "");
      this.type.set(p.get("tipo") || "");
      this.draftQ = this.q();
      this.draftCity = this.city();
      this.draftType = this.type();
    });
  }
  search() {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        q: this.draftQ || null,
        localidad: this.draftCity || null,
        tipo: this.draftType || null,
      },
    });
  }
  clear() {
    this.draftQ = "";
    this.draftCity = "";
    this.draftType = "";
    this.search();
  }
}
