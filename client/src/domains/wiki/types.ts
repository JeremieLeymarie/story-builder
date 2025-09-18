import { Wiki, WikiCategory } from "@/lib/storage/domain";

export type WikiDataCategory = Omit<WikiCategory, "wikiKey">;

export type WikiSection = {
  category: WikiDataCategory | null;
  articles: { key: string; title: string }[];
};

export type WikiData = {
  wiki: Wiki;
  sections: WikiSection[];
};

export type ArticleUpdatePayload = {
  title?: string;
  content?: Record<string, unknown>;
  image?: string;
  categoryKey?: string;
};
