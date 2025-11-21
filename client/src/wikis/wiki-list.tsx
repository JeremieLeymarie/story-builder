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
import { ReactNode } from "react";

const WikiSection = ({
  title,
  description,
  wikis,
  firstCard = null,
}: {
  title: string;
  description: string;
  wikis: Wiki[];
  firstCard?: ReactNode;
}) => {
  const navigate = useNavigate();

  return (
    <section>
      <Title variant="sub-section">{title}</Title>
      <p className="text-muted-foreground mb-4">{description}</p>
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
        {firstCard}
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
    </section>
  );
};

export const WikiList = ({
  userWikis,
  importedWikis,
}: {
  userWikis: Wiki[];
  importedWikis: Wiki[];
}) => {
  const { createWiki } = useCreateWiki();

  return (
    <div className="flex flex-col items-center space-y-8 px-16 py-8 sm:items-start sm:px-32">
      <Title variant="secondary">Wikis</Title>
      <WikiSection
        title="Your wikis"
        description="All the wikis you've created are here."
        wikis={userWikis}
        firstCard={
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
        }
      />
      <WikiSection
        title="Imported wikis"
        description="The wikis you've imported are here."
        wikis={importedWikis}
      />
    </div>
  );
};
