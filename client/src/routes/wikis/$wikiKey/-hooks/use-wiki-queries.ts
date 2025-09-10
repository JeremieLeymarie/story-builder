import { getWikiService } from "@/domains/wiki/wiki-service";
import { getWikiPermissionContext } from "@/domains/wiki/wiki-permission-context";
import { useQuery } from "@tanstack/react-query";

const WIKI_PERMISSIONS_QUERY_KEY = ["wiki-permissions"] as const;

export const useWikiPermissions = ({ wikiKey }: { wikiKey: string }) => {
  const { data, isLoading, refetch } = useQuery({
    queryFn: async () => getWikiPermissionContext(wikiKey),
    queryKey: [...WIKI_PERMISSIONS_QUERY_KEY, wikiKey],
  });

  return { permissions: data, isLoading, refetch };
};

const WIKI_DATA_QUERY_KEY = ["wiki-data"] as const;

export const useWikiData = ({ wikiKey }: { wikiKey: string }) => {
  const svc = getWikiService();

  const { data, isLoading, refetch } = useQuery({
    queryFn: async () => svc.getWikiData(wikiKey),
    queryKey: [...WIKI_DATA_QUERY_KEY, wikiKey],
  });

  return { wikiData: data, isLoading, refetch };
};

export const useWikiQueries = ({ wikiKey }: { wikiKey: string }) => {
  const {
    isLoading: isWikiDataLoading,
    wikiData,
    refetch,
  } = useWikiData({ wikiKey });
  const { isLoading: isPermissionsLoading, permissions } = useWikiPermissions({
    wikiKey,
  });

  return {
    wikiData,
    permissions,
    isLoading: isWikiDataLoading || isPermissionsLoading,
    refetch,
  };
};
