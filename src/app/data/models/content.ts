export interface News {
  slug: string;
  title: string;
  category: string;
  date: string;
  image: string;
  intro: string;
  body: string[];
}
export interface Museum {
  slug: string;
  name: string;
  city: string;
  type: string;
  image: string;
  description: string;
  address: string;
  hours: string;
  contact: string;
  orientation: string;
}
export interface Edition {
  title: string;
  label: string;
  intro: string;
  editorial: string;
  newsSlugs: string[];
}
