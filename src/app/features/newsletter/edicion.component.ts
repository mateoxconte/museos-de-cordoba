import { DemoStore } from "../../data/demo-store.service";
import { Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { edition, news } from "../../data/mocks/content";
import { CardComponent } from "../../shared/components/card.component";
@Component({
  selector: "app-edicion",
  imports: [RouterLink, CardComponent],
  templateUrl: "./edicion.component.html",
  styleUrl: "./edicion.component.css",
})
export class EdicionComponent {
  store = inject(DemoStore);
  edition = edition;
  get notes() {
    return this.store
      .published()
      .filter((n) => edition.newsSlugs.includes(n.slug));
  }
}
