import { Component, input } from "@angular/core";
import { RouterLink, Params } from "@angular/router";
import { News, Museum } from "../../data/models/content";
@Component({
  selector: "app-card",
  imports: [RouterLink],
  template: `<article class="editorial-card">
    @if (note(); as n) {
      <a
        [routerLink]="['/noticias', n.slug]"
        [queryParams]="query()"
        class="card-image"
        tabindex="-1"
        aria-hidden="true"
        ><img
          [src]="'images/' + n.image + '.jpg'"
          [alt]="n.title"
          loading="lazy"
      /></a>
      <div class="meta">
        <span>{{ n.category }}</span
        ><span>{{ n.date }}</span>
      </div>
      <h3>
        <a [routerLink]="['/noticias', n.slug]" [queryParams]="query()">{{
          n.title
        }}</a>
      </h3>
      <div class="gold-rule"></div>
      <a
        class="text-link"
        [routerLink]="['/noticias', n.slug]"
        [queryParams]="query()"
        [attr.aria-label]="'Leer nota: ' + n.title"
        >Leer nota <span aria-hidden="true">→</span></a
      >
    }
    @if (museum(); as m) {
      <a
        [routerLink]="['/directorio', m.slug]"
        [queryParams]="query()"
        class="card-image"
        tabindex="-1"
        aria-hidden="true"
        ><img
          [src]="'images/' + m.image + '.jpg'"
          [alt]="m.name"
          loading="lazy"
      /></a>
      <div class="meta museum-meta">
        {{ m.city }} <span>{{ m.type }}</span>
      </div>
      <h3>
        <a [routerLink]="['/directorio', m.slug]" [queryParams]="query()">{{
          m.name
        }}</a>
      </h3>
      <div class="gold-rule"></div>
      <a
        class="text-link"
        [routerLink]="['/directorio', m.slug]"
        [queryParams]="query()"
        [attr.aria-label]="'Ver ficha: ' + m.name"
        >Ver ficha <span aria-hidden="true">→</span></a
      >
    }
  </article>`,
})
export class CardComponent {
  note = input<News>();
  museum = input<Museum>();
  query = input<Params>({});
}
