import { News, Museum } from "./content";
export interface NewsRecord {
  id: string;
  draft: News;
  published?: News;
  updatedAt: string;
}
export type NewsletterBlock =
  | { id: string; kind: "news"; newsSlug: string }
  | { id: string; kind: "exclusive"; title: string; text: string };
export interface NewsletterRecord {
  id: string;
  subject: string;
  title: string;
  intro: string;
  blocks: NewsletterBlock[];
  status: "draft" | "sent";
  updatedAt: string;
}
export interface MuseumRecord {
  data: Museum;
  updatedAt: string;
}
export interface DemoState {
  version: 1;
  notes: NewsRecord[];
  editions: NewsletterRecord[];
  museums: MuseumRecord[];
  featured: string[];
}
