import { DemoStore } from "../../data/demo-store.service";
import { Component, inject, signal } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { museums } from "../../data/mocks/content";
import { Museum } from "../../data/models/content";
@Component({
  selector: "app-ficha",
  imports: [RouterLink],
  templateUrl: "./ficha.component.html",
  styleUrl: "./ficha.component.css",
})
export class FichaComponent {
  store = inject(DemoStore);
  private route = inject(ActivatedRoute);
  museum = signal<Museum | undefined>(undefined);
  private title = inject(Title);
  constructor() {
    this.route.paramMap.subscribe((p) => {
      const m = this.store
        .publicMuseums()
        .find((m) => m.slug === p.get("slug"));
      this.museum.set(m);
      this.title.setTitle(
        (m?.name || "Museo no encontrado") + " · Museos de Córdoba",
      );
    });
  }
}
