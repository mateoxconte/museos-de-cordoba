import { Component, inject } from "@angular/core";
import { Router, RouterOutlet, NavigationEnd } from "@angular/router";
import { HeaderComponent } from "./shared/components/header.component";
import { FooterComponent } from "./shared/components/footer.component";
@Component({
  selector: "app-root",
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `<a class="skip" href="#contenido" (click)="skipToContent($event)"
      >Saltar al contenido</a
    ><app-header />
    <main id="contenido" tabindex="-1" class="container">
      <router-outlet />
    </main>
    <app-footer />`,
})
export class AppComponent {
  skipToContent(event: Event) {
    event.preventDefault();
    const content = document.getElementById("contenido");
    content?.focus({ preventScroll: true });
    content?.scrollIntoView({ block: "start", behavior: "instant" });
  }
  private router = inject(Router);
  private lastPath = "";
  constructor() {
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        const path = e.urlAfterRedirects.split("?")[0];
        if (path === this.lastPath) return;
        const initialNavigation = this.lastPath === "";
        this.lastPath = path;
        if (initialNavigation) return;
        requestAnimationFrame(() =>
          document.getElementById("contenido")?.focus({ preventScroll: true }),
        );
      }
    });
  }
}
