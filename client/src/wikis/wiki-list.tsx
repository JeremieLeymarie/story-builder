import { Wiki } from "@/lib/storage/domain";
import { Title } from "@/design-system/components";
import { BaseCard } from "@/design-system/components/base-card";

export const WikiList = ({ wikis }: { wikis: Wiki[] }) => {
  return (
    <div className="flex flex-col items-center space-y-8 px-16 py-8 sm:items-start sm:px-32">
      <Title variant="secondary">Wikis</Title>
      <p className="text-muted-foreground">
        All the wikis you've created are here.
      </p>
      {wikis.length ? (
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
          {wikis.map((wiki) => {
            return (
              <BaseCard
                key={wiki.key}
                title={wiki.name}
                description={wiki.description ?? ""}
                backgroundURL={wiki.image}
              />
            );
          })}
        </div>
      ) : (
        <p>No wikis...</p>
      )}
    </div>
  );
};
