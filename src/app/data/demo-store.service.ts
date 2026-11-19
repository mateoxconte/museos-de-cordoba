import { Injectable, computed, signal } from "@angular/core";
import { news, museums, normalize } from "./mocks/content";
import {
  NewsRecord,
  NewsletterRecord,
  MuseumRecord,
  DemoState,
} from "./models/admin";
@Injectable({ providedIn: "root" })
export class DemoStore {
  private readonly key = "museos-cordoba-editorial-demo-v1";
  private seed(): DemoState {
    return {
      version: 1,
      notes: news.map((n) => ({
        id: n.slug,
        draft: structuredClone(n),
        published: structuredClone(n),
        updatedAt: "",
      })),
      editions: [],
      museums: museums.map((m) => ({
        data: structuredClone(m),
        updatedAt: "",
      })),
      featured: news.slice(0, 3).map((n) => n.slug),
    };
  }
  storageWarning = signal("");
  private read(): DemoState {
    try {
      const raw = localStorage.getItem(this.key);
      if (!raw) return this.seed();
      const s = JSON.parse(raw);
      if (
        s.version === 1 &&
        Array.isArray(s.notes) &&
        Array.isArray(s.editions) &&
        Array.isArray(s.museums) &&
        Array.isArray(s.featured) &&
        s.notes.every(
          (n: NewsRecord) => n.draft && Array.isArray(n.draft.body),
        ) &&
        s.museums.every((m: MuseumRecord) => m.data?.slug) &&
        s.editions.every((e: NewsletterRecord) => Array.isArray(e.blocks))
      )
        return s;
    } catch {}
    return this.seed();
  }
  private state = signal<DemoState>(this.read());
  notes = computed(() => this.state().notes);
  editions = computed(() => this.state().editions);
  museumRecords = computed(() => this.state().museums);
  published = computed(() =>
    this.notes().flatMap((n) => (n.published ? [n.published] : [])),
  );
  publicMuseums = computed(() => this.museumRecords().map((m) => m.data));
  featuredIds = computed(() => this.state().featured);
  homeNews = computed(() => {
    const notes = this.published();
    return [
      ...this.featuredIds()
        .map((id) => notes.find((n) => n.slug === id))
        .filter((n) => !!n),
    ];
  });
  cities = computed(() => [
    ...new Set(this.publicMuseums().map((m) => m.city)),
  ]);
  types = computed(() => [...new Set(this.publicMuseums().map((m) => m.type))]);
  activity = computed(() =>
    [
      ...this.notes()
        .filter((n) => n.updatedAt)
        .map((n) => ({
          id: n.id,
          title: n.draft.title || "Noticia sin título",
          type: "Noticia",
          status: this.isDraft(n) ? "Borrador" : "Publicada en la demo",
          date: n.updatedAt,
          url: "/admin/noticias/" + n.id,
          draft: this.isDraft(n),
        })),
      ...this.editions().map((e) => ({
        id: e.id,
        title: e.subject || "Edición sin asunto",
        type: "Newsletter",
        status: e.status === "draft" ? "Borrador" : "Envío simulado",
        date: e.updatedAt,
        url: "/admin/newsletter/" + e.id,
        draft: e.status === "draft",
      })),
      ...this.museumRecords()
        .filter((m) => m.updatedAt)
        .map((m) => ({
          id: m.data.slug,
          title: m.data.name,
          type: "Museo",
          status: "Actualizado en la demo",
          date: m.updatedAt,
          url: "/admin/directorio/" + m.data.slug,
          draft: false,
        })),
    ].sort((a, b) => b.date.localeCompare(a.date)),
  );
  isDraft(n: NewsRecord) {
    return (
      !n.published || JSON.stringify(n.draft) !== JSON.stringify(n.published)
    );
  }
  uid() {
    return crypto.randomUUID();
  }
  slug(title: string) {
    return (
      normalize(title)
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") || "contenido"
    );
  }
  saveNote(record: NewsRecord, publish: boolean) {
    const n = structuredClone(record);
    n.updatedAt = new Date().toISOString();
    if (publish) {
      n.draft.date = new Intl.DateTimeFormat("es-AR", {
        dateStyle: "long",
      }).format(new Date());
      n.published = structuredClone(n.draft);
    }
    this.commit({
      ...this.state(),
      notes: [n, ...this.notes().filter((x) => x.id !== n.id)],
    });
    return n;
  }
  setFeatured(slug: string, on: boolean) {
    const ids = this.featuredIds();
    if (on && !ids.includes(slug) && ids.length >= 3) return false;
    this.commit({
      ...this.state(),
      featured: on
        ? [...new Set([...ids, slug])]
        : ids.filter((id) => id !== slug),
    });
    return true;
  }
  saveEdition(record: NewsletterRecord, sent: boolean) {
    const e = structuredClone(record);
    e.status = sent ? "sent" : "draft";
    e.updatedAt = new Date().toISOString();
    this.commit({
      ...this.state(),
      editions: [e, ...this.editions().filter((x) => x.id !== e.id)],
    });
    return e;
  }
  saveMuseum(record: MuseumRecord) {
    const m = structuredClone(record);
    m.updatedAt = new Date().toISOString();
    this.commit({
      ...this.state(),
      museums: [
        ...this.museumRecords().filter((x) => x.data.slug !== m.data.slug),
        m,
      ],
    });
    return m;
  }
  private commit(state: DemoState) {
    this.state.set(state);
    try {
      localStorage.setItem(this.key, JSON.stringify(state));
      this.storageWarning.set("");
    } catch {
      this.storageWarning.set(
        "Los cambios funcionan durante esta sesión, pero el navegador no permite conservarlos al recargar.",
      );
    }
  }
}
