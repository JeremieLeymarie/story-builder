import { Wiki } from "@/lib/storage/domain";
import { Title } from "@/design-system/components";
import { BaseCard } from "@/design-system/components/base-card";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/design-system/primitives";
import { MoveRightIcon, PlusIcon } from "lucide-react";
import { WikiFormDialog } from "./wiki-form";
import { useCreateWiki } from "./hooks/use-create-wiki";
import { Link, useNavigate } from "@tanstack/react-router";

export const WikiList = ({ wikis }: { wikis: Wiki[] }) => {
  const navigate = useNavigate();
  const { createWiki } = useCreateWiki();

  return (
    <div className="flex flex-col items-center space-y-8 px-16 py-8 sm:items-start sm:px-32">
      <Title variant="secondary">Wikis</Title>
      <p className="text-muted-foreground">
        All the wikis you've created are here.
      </p>
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
        <Card className="h-[225px] w-[275px] border-dashed">
          <CardHeader>
            <CardTitle>New wiki</CardTitle>
            <CardDescription>
              Describe the world your stories take place in
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center gap-2">
            <WikiFormDialog
              onSubmit={createWiki}
              trigger={
                <Button size="sm">
                  <PlusIcon size="16px" /> &nbsp;Create your own world!
                </Button>
              }
              title="Your Wiki"
              description="Create your own world!"
            />
          </CardContent>
        </Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
          {wikis.map((wiki) => {
            return (
              <BaseCard
                key={wiki.key}
                title={wiki.name}
                description={wiki.description ?? ""}
                backgroundURL={wiki.image}
                onClick={() =>
                  navigate({
                    to: "/wikis/$wikiKey",
                    params: { wikiKey: wiki.key },
                  })
                }
                button={
                  <Link to="/wikis/$wikiKey" params={{ wikiKey: wiki.key }}>
                    <Button
                      className={`absolute right-4 bottom-4 opacity-0 transition duration-300 ease-in-out group-hover:opacity-100`}
                    >
                      Edit &nbsp;
                      <MoveRightIcon size="15px" className="animate-bounce" />
                    </Button>
                  </Link>
                }
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
