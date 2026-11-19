import { Routes } from "@angular/router";
export const routes: Routes = [
  {
    path: "admin",
    title: "Administración · Museos de Córdoba",
    loadComponent: () =>
      import("./features/admin/admin-shell.component").then(
        (m) => m.AdminShellComponent,
      ),
    children: [
      {
        path: "",
        pathMatch: "full",
        loadComponent: () =>
          import("./features/admin/dashboard.component").then(
            (m) => m.DashboardComponent,
          ),
      },
      ...["noticias", "newsletter", "directorio"].flatMap((section) => [
        {
          path: section,
          data: { section },
          loadComponent: () =>
            import("./features/admin/content.component").then(
              (m) => m.AdminContentComponent,
            ),
        },
        {
          path: section + "/:id",
          data: { section },
          loadComponent: () =>
            import("./features/admin/content.component").then(
              (m) => m.AdminContentComponent,
            ),
        },
      ]),
    ],
  },
  {
    path: "",
    title: "Inicio · Museos de Córdoba",
    loadComponent: () =>
      import("./features/inicio/inicio.component").then(
        (m) => m.InicioComponent,
      ),
  },
  {
    path: "noticias",
    title: "Noticias · Museos de Córdoba",
    loadComponent: () =>
      import("./features/noticias/noticias.component").then(
        (m) => m.NoticiasComponent,
      ),
  },
  {
    path: "noticias/:slug",
    title: "Nota · Museos de Córdoba",
    loadComponent: () =>
      import("./features/noticias/nota.component").then((m) => m.NotaComponent),
  },
  {
    path: "directorio",
    title: "Directorio · Museos de Córdoba",
    loadComponent: () =>
      import("./features/directorio/directorio.component").then(
        (m) => m.DirectorioComponent,
      ),
  },
  {
    path: "directorio/:slug",
    title: "Museo · Museos de Córdoba",
    loadComponent: () =>
      import("./features/directorio/ficha.component").then(
        (m) => m.FichaComponent,
      ),
  },
  {
    path: "newsletter",
    title: "Newsletter · Museos de Córdoba",
    loadComponent: () =>
      import("./features/newsletter/newsletter.component").then(
        (m) => m.NewsletterComponent,
      ),
  },
  {
    path: "newsletter/edicion-de-ejemplo",
    title: "Edición de ejemplo · Museos de Córdoba",
    loadComponent: () =>
      import("./features/newsletter/edicion.component").then(
        (m) => m.EdicionComponent,
      ),
  },
  { path: "**", redirectTo: "" },
];
