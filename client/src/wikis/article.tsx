import { Title } from "@/design-system/components";
import { Editor } from "@/design-system/components/editor/blocks/editor";
import { Button } from "@/design-system/primitives";
import { Badge } from "@/design-system/primitives/badge";
import { WikiArticle, WikiCategory } from "@/lib/storage/domain";
import { SerializedEditorState } from "lexical";
import { PencilIcon } from "lucide-react";
import { useState } from "react";
import { ArticleEditor } from "./article-editor";

export const Article = ({
  article,
  category,
}: {
  article: WikiArticle;
  category: WikiCategory | null;
}) => {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing)
    return (
      <ArticleEditor
        defaultValues={{
          title: article.title,
          content: article.content,
          image: article.image,
          categoryKey: article.categoryKey,
        }}
      />
    );

  // TODO: handle permissions
  return (
    <div>
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Title variant="article">{article.title}</Title>
            <Button
              className="gap-2"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <PencilIcon />
              Edit
            </Button>
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
          className="border-primary w-[400px] rounded border-2 shadow-lg"
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
