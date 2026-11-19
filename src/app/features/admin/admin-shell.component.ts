import { Component } from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";
@Component({
  selector: "app-admin-shell",
  imports: [RouterLink, RouterOutlet],
  template: `<div class="admin-shell">
    <div class="admin-topline">
      <div>
        <span class="eyebrow">MUSEOS DE CÓRDOBA · ESPACIO EDITORIAL</span
        ><span class="demo-badge">Modo demo</span>
      </div>
      <a routerLink="/" class="text-link"
        >Ver portal <span aria-hidden="true">↗</span></a
      >
    </div>
    <p class="admin-demo-note">
      Prueba local sin login ni correos reales. Los cambios editoriales se
      guardan solo en este navegador.
    </p>
    <router-outlet />
  </div>`,
  styleUrl: "./admin.component.css",
})
export class AdminShellComponent {}
