import { DemoStore } from "../../data/demo-store.service";
import { Component, inject, signal } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { news } from "../../data/mocks/content";
import { News } from "../../data/models/content";
@Component({
  selector: "app-nota",
  imports: [RouterLink],
  templateUrl: "./nota.component.html",
  styleUrl: "./nota.component.css",
})
export class NotaComponent {
  store = inject(DemoStore);
  route = inject(ActivatedRoute);
  note = signal<News | undefined>(undefined);
  private title = inject(Title);
  constructor() {
    this.route.paramMap.subscribe((p) => {
      const n = this.store.published().find((n) => n.slug === p.get("slug"));
      this.note.set(n);
      this.title.setTitle(
        (n?.title || "Nota no encontrada") + " · Museos de Córdoba",
      );
    });
  }
}
