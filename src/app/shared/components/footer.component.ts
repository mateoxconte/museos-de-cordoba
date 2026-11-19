import { Component } from "@angular/core";
@Component({
  selector: "app-footer",
  template: `<footer>
    <div class="container footer-copy">
      <span>Museos de Córdoba</span>
      <p>Una ventana a nuestro patrimonio.</p>
      <small
        >Demo de diseño · Contenidos y datos ilustrativos · Sin envíos
        reales</small
      >
    </div>
    <svg viewBox="0 0 1440 65" preserveAspectRatio="none" aria-hidden="true">
      <path
        fill="#c7eaff"
        d="M0 20L90 40 180 24 290 50 410 20 530 44 650 28 780 50 910 22 1060 40 1190 18 1320 42 1440 20V65H0Z"
      />
      <path
        fill="#85cced"
        d="M0 40L80 28 200 53 330 35 450 46 580 21 720 55 860 36 1000 50 1120 28 1270 50 1380 30 1440 40V65H0Z"
      />
    </svg>
  </footer>`,
})
export class FooterComponent {}
