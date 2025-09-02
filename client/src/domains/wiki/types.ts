import { Wiki, WikiCategory } from "@/lib/storage/domain";

export type WikiSection = {
  category: WikiCategory | null;
  articles: { key: string; title: string }[];
};

export type WikiData = {
  wiki: Wiki;
  sections: WikiSection[];
};
