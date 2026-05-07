import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/design-system/primitives";

import { useWikiStore } from "./hooks/use-wiki-store";
import { useWikiSearch } from "./hooks/use-wiki-search";
import { useState } from "react";
import { RichText } from "@/design-system/components/editor/components/rich-text-editor";
import { EditorContextProvider } from "@/design-system/components/editor/hooks/use-editor-context";
import { WikiNode } from "@/builder/lexical-wiki-node";
import { useDebouncer } from "@tanstack/react-pacer/debouncer";
import { useNavigate } from "@tanstack/react-router";

export const WikiSearch = () => {
  const [wikiKey, isOpen, open, close_] = useWikiStore((state) => [
    state.wikiData.wiki.key,
    state.isSearchOpen,
    state.openSearch,
    state.closeSearch,
  ]);
  const [searchValue, setSearchValue] = useState("");
  const { searchResults } = useWikiSearch(searchValue);
  const navigate = useNavigate();

  const debouncer = useDebouncer(
    (searchValue: string) => {
      setSearchValue(searchValue);
    },
    { wait: 400 },
  );

  const close = () => {
    setSearchValue("");
    close_();
  };

  return (
    <CommandDialog
      open={isOpen}
      onOpenChange={(shouldOpen) => (shouldOpen ? open() : close())}
    >
      <Command className="rounded-lg border" shouldFilter={false}>
        <CommandInput
          placeholder="Search..."
          onValueChange={(value) => debouncer.maybeExecute(value)}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {searchResults?.length ? (
            <CommandGroup heading="Results">
              {searchResults.map((article) => (
                <CommandItem
                  key={article.key}
                  className="w-full justify-between"
                  onSelect={() => {
                    close();
                    navigate({
                      to: "/wikis/$wikiKey/$articleKey",
                      params: { articleKey: article.key, wikiKey },
                    });
                  }}
                >
                  <div>
                    <div>
                      {article.category && (
                        <>
                          <span style={{ color: article.category.color }}>
                            {article.category.name}
                          </span>
                          <span>&nbsp;&gt;&nbsp;</span>
                        </>
                      )}
                      <span className="font-semibold">{article.title}</span>
                    </div>
                    <EditorContextProvider
                      entityType="wiki-article"
                      entityKey={article.key}
                    >
                      <RichText
                        editable={false}
                        initialState={article.content}
                        editorNodes={[WikiNode]}
                        textDisplayMode="summary"
                        className="text-muted-foreground text-xs"
                      />
                    </EditorContextProvider>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
        </CommandList>
      </Command>
    </CommandDialog>
  );
};
