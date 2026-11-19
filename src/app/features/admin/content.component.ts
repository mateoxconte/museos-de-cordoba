import { Component, inject, signal } from "@angular/core";
import { DatePipe } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { DemoStore } from "../../data/demo-store.service";
import {
  NewsRecord,
  NewsletterRecord,
  MuseumRecord,
} from "../../data/models/admin";
import { News } from "../../data/models/content";
@Component({
  selector: "app-admin-content",
  imports: [FormsModule, RouterLink, DatePipe],
  templateUrl: "./content.component.html",
  styleUrl: "./admin.component.css",
})
export class AdminContentComponent {
  store = inject(DemoStore);
  route = inject(ActivatedRoute);
  router = inject(Router);
  section = this.route.snapshot.data["section"] as
    "noticias" | "newsletter" | "directorio";
  editing = false;
  notFound = false;
  preview = signal(false);
  message = signal("");
  errors = signal<string[]>([]);
  note!: NewsRecord;
  edition!: NewsletterRecord;
  museum!: MuseumRecord;
  categories = ["Exposiciones", "Patrimonio", "Actividades"];
  images = [
    { id: "palacio", label: "Galería del Palacio" },
    { id: "familia", label: "Visita en familia" },
    { id: "estancia", label: "Estancia histórica" },
    { id: "ceramica", label: "Piezas de cerámica" },
    { id: "regional", label: "Museo regional" },
    { id: "arte", label: "Arte contemporáneo" },
    { id: "dinosaurio", label: "Ciencias naturales" },
  ];
  body = "";
  newsChoice = "";
  dirty = false;
  get heading() {
    return this.section === "noticias"
      ? "Noticias"
      : this.section === "newsletter"
        ? "Newsletter"
        : "Directorio de museos";
  }
  get createLabel() {
    return this.section === "noticias"
      ? "Crear noticia"
      : this.section === "newsletter"
        ? "Crear newsletter"
        : "Agregar museo";
  }
  constructor() {
    this.route.paramMap.subscribe((p) => this.load(p.get("id")));
  }
  private load(id: string | null) {
    this.editing = !!id;
    this.notFound = false;
    this.preview.set(false);
    this.message.set("");
    this.errors.set([]);
    this.dirty = false;
    if (!id) return;
    const fresh = id === "nueva";
    if (this.section === "noticias") {
      const existing = this.store.notes().find((n) => n.id === id);
      this.notFound = !fresh && !existing;
      this.note = structuredClone(
        existing || {
          id: this.store.uid(),
          draft: {
            slug: "",
            title: "",
            category: "Exposiciones",
            date: "",
            intro: "",
            body: [],
            image: "palacio",
          },
          updatedAt: "",
        },
      );
      this.body = this.note.draft.body.join("\n\n");
    }
    if (this.section === "newsletter") {
      const existing = this.store.editions().find((e) => e.id === id);
      this.notFound = !fresh && !existing;
      this.edition = structuredClone(
        existing || {
          id: this.store.uid(),
          subject: "",
          title: "",
          intro: "",
          blocks: [],
          status: "draft",
          updatedAt: "",
        },
      );
      this.newsChoice = this.store.published()[0]?.slug || "";
    }
    if (this.section === "directorio") {
      const existing = this.store
        .museumRecords()
        .find((m) => m.data.slug === id);
      this.notFound = !fresh && !existing;
      this.museum = structuredClone(
        existing || {
          updatedAt: "",
          data: {
            slug: "",
            name: "",
            city: "Córdoba capital",
            type: "Arte",
            image: "palacio",
            description: "",
            address: "",
            hours: "",
            contact: "",
            orientation:
              "Consultá las condiciones de accesibilidad antes de la visita.",
          },
        },
      );
    }
  }
  changed() {
    this.dirty = true;
    this.preview.set(false);
    this.message.set("");
  }
  paragraphs(value: string) {
    return value
      .split(/\n\s*\n/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  published(slug: string): News | undefined {
    return this.store.published().find((n) => n.slug === slug);
  }
  addNews() {
    if (!this.newsChoice) return;
    this.edition.blocks.push({
      id: this.store.uid(),
      kind: "news",
      newsSlug: this.newsChoice,
    });
    this.changed();
  }
  addExclusive() {
    this.edition.blocks.push({
      id: this.store.uid(),
      kind: "exclusive",
      title: "",
      text: "",
    });
    this.changed();
  }
  move(index: number, delta: number) {
    const target = index + delta;
    if (target < 0 || target >= this.edition.blocks.length) return;
    const [block] = this.edition.blocks.splice(index, 1);
    this.edition.blocks.splice(target, 0, block);
    this.changed();
    requestAnimationFrame(() =>
      document.getElementById("block-" + block.id)?.focus(),
    );
  }
  remove(index: number) {
    this.edition.blocks.splice(index, 1);
    this.changed();
  }
  private valid(kind: "noticia" | "newsletter" | "museo") {
    const errors: string[] = [];
    if (kind === "noticia") {
      if (!this.note.draft.title.trim()) errors.push("Completá el título.");
      if (!this.note.draft.intro.trim()) errors.push("Completá el resumen.");
      if (!this.body.trim()) errors.push("Escribí el cuerpo de la noticia.");
    }
    if (kind === "newsletter") {
      if (!this.edition.subject.trim()) errors.push("Completá el asunto.");
      if (!this.edition.blocks.length)
        errors.push("Agregá al menos un bloque con contenido.");
      if (
        this.edition.blocks.some((b) =>
          b.kind === "exclusive" ? !b.text.trim() : !this.published(b.newsSlug),
        )
      )
        errors.push(
          "Completá el contenido de todos los bloques o quitá los vacíos.",
        );
    }
    if (kind === "museo") {
      for (const [label, value] of [
        ["nombre", this.museum.data.name],
        ["localidad", this.museum.data.city],
        ["tipo", this.museum.data.type],
        ["dirección", this.museum.data.address],
        ["horarios", this.museum.data.hours],
        ["descripción", this.museum.data.description],
        ["contacto", this.museum.data.contact],
      ]) {
        if (!value.trim()) errors.push("Completá " + label + ".");
      }
    }
    this.errors.set(errors);
    if (errors.length)
      requestAnimationFrame(() =>
        document.getElementById("editor-errors")?.focus(),
      );
    return !errors.length;
  }
  saveNote(publish = false) {
    if (publish && !this.valid("noticia")) return;
    this.note.draft.body = this.paragraphs(this.body);
    if (!this.note.draft.slug)
      this.note.draft.slug =
        this.store.slug(this.note.draft.title) + "-" + this.note.id.slice(0, 8);
    this.note = this.store.saveNote(this.note, publish);
    this.saved(
      publish
        ? "Noticia publicada en la demo."
        : "Borrador guardado. El portal conserva la última versión publicada.",
      this.note.id,
    );
  }
  saveEdition(sent = false) {
    if (sent && !this.valid("newsletter")) return;
    this.edition = this.store.saveEdition(this.edition, sent);
    this.saved(
      sent
        ? "Envío simulado. No se envió ningún correo"
        : "Borrador de newsletter guardado.",
      this.edition.id,
    );
  }
  saveMuseum() {
    if (!this.valid("museo")) return;
    if (!this.museum.data.slug)
      this.museum.data.slug =
        this.store.slug(this.museum.data.name) +
        "-" +
        this.store.uid().slice(0, 8);
    this.museum = this.store.saveMuseum(this.museum);
    this.saved(
      "Ficha actualizada en el directorio de la demo.",
      this.museum.data.slug,
    );
  }
  private saved(message: string, id: string) {
    this.dirty = false;
    this.errors.set([]);
    this.preview.set(false);
    if (this.route.snapshot.paramMap.get("id") === "nueva") {
      void this.router
        .navigate(["/admin", this.section, id], { replaceUrl: true })
        .then(() => this.message.set(message));
    } else this.message.set(message);
  }
  toggleFeatured(slug: string, on: boolean, event?: Event) {
    if (!this.store.setFeatured(slug, on)) {
      if (event?.target) (event.target as HTMLInputElement).checked = false;
      this.message.set(
        "Inicio admite hasta 3 destacadas. Desmarcá una antes de elegir otra.",
      );
    } else
      this.message.set(
        on ? "Noticia destacada en Inicio." : "Noticia retirada de destacados.",
      );
  }
  showPreview() {
    if (this.section === "noticias") {
      this.note.draft.body = this.paragraphs(this.body);
    }
    this.preview.set(!this.preview());
    if (this.preview())
      requestAnimationFrame(() => {
        const el = document.getElementById("editor-preview");
        el?.focus();
        el?.scrollIntoView({ block: "start", behavior: "instant" });
      });
  }
}
