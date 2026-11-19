import { DemoStore } from "../../data/demo-store.service";
import { Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { SubscribeComponent } from "../../shared/components/subscribe.component";
import { CardComponent } from "../../shared/components/card.component";
import { news } from "../../data/mocks/content";
@Component({
  selector: "app-newsletter",
  imports: [RouterLink, SubscribeComponent, CardComponent],
  templateUrl: "./newsletter.component.html",
  styleUrl: "./newsletter.component.css",
})
export class NewsletterComponent {
  store = inject(DemoStore);
  get news() {
    return this.store
      .published()
      .filter((n) =>
        ["nueva-mirada-arte-cordobes", "muestra-en-familia"].includes(n.slug),
      );
  }
}
