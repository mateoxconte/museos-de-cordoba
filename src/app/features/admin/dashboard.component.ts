import { Component, inject } from "@angular/core";
import { DatePipe } from "@angular/common";
import { RouterLink } from "@angular/router";
import { DemoStore } from "../../data/demo-store.service";
@Component({
  selector: "app-admin-dashboard",
  imports: [RouterLink, DatePipe],
  template: `<header class="admin-heading">
      <span class="eyebrow">TU PRÓXIMA HISTORIA EMPIEZA ACÁ</span>
      <h1>¡Hola, Cristian!<br />¿Qué novedades hay hoy?</h1>
      <p>Compartí lo que pasa en nuestros museos.</p>
    </header>
    <div class="admin-actions">
      <a class="action-card" routerLink="/admin/noticias/nueva"
        ><span class="action-icon" aria-hidden="true">＋</span>
        <div>
          <h2>Crear noticia</h2>
          <p>Una historia para el portal.</p>
        </div>
        <span aria-hidden="true">→</span></a
      ><a class="action-card" routerLink="/admin/newsletter/nueva"
        ><span class="action-icon" aria-hidden="true">✉</span>
        <div>
          <h2>Crear newsletter</h2>
          <p>Noticias y contenido exclusivo.</p>
        </div>
        <span aria-hidden="true">→</span></a
      >
    </div>
    <div class="section-heading">
      <h2>Actividad reciente</h2>
      <span></span>
    </div>
    @if (store.activity().length) {
      <div class="admin-list">
        @for (item of store.activity(); track item.type + item.id) {
          <article class="admin-row">
            <div>
              <span class="eyebrow">{{ item.type }}</span>
              <h3>{{ item.title }}</h3>
              <small>{{ item.date | date: "dd/MM/yyyy HH:mm" }}</small>
            </div>
            <span class="status-badge" [class.draft]="item.draft">{{
              item.status
            }}</span
            ><a [routerLink]="item.url" class="text-link"
              >{{ item.draft ? "Continuar borrador" : "Editar" }}
              <span aria-hidden="true">→</span></a
            >
          </article>
        }
      </div>
    } @else {
      <div class="empty">
        <h2>Todo listo para empezar</h2>
        <p>
          Creá una noticia o una edición. Tus cambios aparecerán acá para
          retomarlos.
        </p>
      </div>
    }
    <a class="secondary-access" routerLink="/admin/directorio"
      ><span
        ><strong>Directorio de museos</strong><br />Actualizá fichas, horarios y
        datos de visita.</span
      ><span aria-hidden="true">→</span></a
    >`,
  styleUrl: "./admin.component.css",
})
export class DashboardComponent {
  store = inject(DemoStore);
}
