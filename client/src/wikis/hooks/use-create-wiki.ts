import { getWikiService } from "@/domains/wiki/wiki-service";
import { WikiSchema } from "../wiki-form";
import { useNavigate } from "@tanstack/react-router";

export const useCreateWiki = () => {
  const svc = getWikiService();
  const navigate = useNavigate();

  const createWiki = async (wiki: WikiSchema) => {
    const wikiKey = await svc.createWiki(wiki);

    navigate({
      to: "/wikis/$wikiKey",
      params: { wikiKey },
    });
  };

  return { createWiki };
};
