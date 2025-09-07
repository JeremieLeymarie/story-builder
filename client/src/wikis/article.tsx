import { Title } from "@/design-system/components";
import { Editor } from "@/design-system/components/editor/blocks/editor";
import { Button } from "@/design-system/primitives";
import { Badge } from "@/design-system/primitives/badge";
import { WikiArticle, WikiCategory } from "@/lib/storage/domain";
import { Link } from "@tanstack/react-router";
import { SerializedEditorState } from "lexical";
import { PencilIcon } from "lucide-react";

export const Article = ({
  article,
  category,
}: {
  article: WikiArticle;
  category: WikiCategory | null;
}) => {
  // TODO: handle permissions
  return (
    <div>
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Title variant="article">{article.title}</Title>
            <Link
              to="/wikis/$wikiKey/$articleKey/edit"
              params={{ articleKey: article.key, wikiKey: article.wikiKey }}
            >
              <Button className="gap-2" size="sm">
                <PencilIcon />
                Edit
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {category ? (
              <Badge>{category.name} </Badge>
            ) : (
              <span className="font-semibold">No category</span>
            )}
            <p className="text-muted-foreground text-sm">
              Last edited on {article.updatedAt.toLocaleDateString()}, at{" "}
              {article.updatedAt.toLocaleTimeString()}
            </p>
          </div>
        </div>
        <img
          src={article.image}
          className="border-primary w-[500px] rounded border-3 shadow-lg"
        />
      </div>
      <article>
        <Editor
          initialState={article.content as unknown as SerializedEditorState}
          editable={false}
        />
      </article>
    </div>
  );
};
