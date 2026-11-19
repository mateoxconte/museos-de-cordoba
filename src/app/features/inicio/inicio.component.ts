import { DemoStore } from "../../data/demo-store.service";
import { Component, inject } from "@angular/core";
import { RouterLink, Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { CardComponent } from "../../shared/components/card.component";
import { SubscribeComponent } from "../../shared/components/subscribe.component";
import { EntranceState } from "./entrance-state.service";
@Component({
  selector: "app-inicio",
  imports: [RouterLink, FormsModule, CardComponent, SubscribeComponent],
  templateUrl: "./inicio.component.html",
  styleUrl: "./inicio.component.css",
})
export class InicioComponent {
  readonly animateEntry = inject(EntranceState).claim();
  store = inject(DemoStore);
  get latestNews() {
    return [
      ...this.store.homeNews(),
      ...this.store
        .published()
        .filter((n) => !this.store.featuredIds().includes(n.slug)),
    ].slice(0, 3);
  }
  get cities() {
    return this.store.cities();
  }
  get types() {
    return this.store.types();
  }
  city = "";
  type = "";
  constructor(private router: Router) {}
  explore() {
    const target = document.getElementById("museum-search");
    target?.scrollIntoView({
      block: "start",
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
    target?.focus({ preventScroll: true });
  }
  search() {
    void this.router.navigate(["/directorio"], {
      queryParams: { localidad: this.city || null, tipo: this.type || null },
    });
  }
}
