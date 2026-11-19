import {
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  inject,
  signal,
} from "@angular/core";
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from "@angular/router";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
@Component({
  selector: "app-header",
  imports: [RouterLink, RouterLinkActive],
  styleUrl: "./header.component.css",
  template: `<header class="site-navigation">
    <div class="container navigation-inner">
      <a
        class="compact-brand"
        routerLink="/"
        aria-label="Museos de Córdoba, ir a Inicio"
        ><img
          src="images/escudo-argentino.png"
          alt="Escudo Nacional argentino"
          width="42"
          height="64"
        /><span>Museos de Córdoba</span></a
      >
      <button
        #menuButton
        class="menu-toggle"
        type="button"
        aria-controls="site-menu"
        [attr.aria-expanded]="menuOpen()"
        [attr.aria-label]="
          menuOpen() ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'
        "
        (click)="menuOpen.set(!menuOpen())"
      >
        <span class="hamburger" [class.is-open]="menuOpen()" aria-hidden="true"
          ><i></i><i></i><i></i></span
        ><span>Menú</span>
      </button>
      <nav
        id="site-menu"
        class="site-links"
        [class.menu-open]="menuOpen()"
        aria-label="Navegación principal"
      >
        @for (item of items; track item.path) {
          <a
            [routerLink]="item.path"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: item.path === '/' }"
            ariaCurrentWhenActive="page"
            (click)="menuOpen.set(false)"
            >{{ item.label }}</a
          >
        }
      </nav>
    </div>
  </header>`,
})
export class HeaderComponent {
  menuOpen = signal(false);
  private element = inject(ElementRef<HTMLElement>);
  @ViewChild("menuButton") menuButton?: ElementRef<HTMLButtonElement>;
  items = [
    { path: "/", label: "Inicio" },
    { path: "/noticias", label: "Noticias" },
    { path: "/directorio", label: "Directorio" },
    { path: "/newsletter", label: "Newsletter" },
    // Visible para el recorrido de la demo; en producción dependerá del rol autenticado.
    { path: "/admin", label: "Admin" },
  ];
  constructor() {
    inject(Router)
      .events.pipe(takeUntilDestroyed())
      .subscribe((event) => {
        if (event instanceof NavigationEnd) this.menuOpen.set(false);
      });
  }
  @HostListener("document:keydown.escape") escape() {
    if (this.menuOpen()) {
      this.menuOpen.set(false);
      this.menuButton?.nativeElement.focus();
    }
  }
  @HostListener("document:click", ["$event"]) outside(event: MouseEvent) {
    if (
      this.menuOpen() &&
      !this.element.nativeElement.contains(event.target as Node)
    )
      this.menuOpen.set(false);
  }
}
