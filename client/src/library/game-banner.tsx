import { StoryGenreBadge, Title } from "@/design-system/components";
import { Story } from "@/lib/storage/domain";

export const GameBanner = ({ story }: { story: Story }) => {
  return (
    <div
      className="border-primary flex h-[250px] w-full flex-col justify-center gap-4 border-b-4 px-12"
      style={{
        background: `url('${story.image}')`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Title variant="article" className="block h-max text-xl md:text-3xl">
        {story.title}
      </Title>
      <div className="h-max">
        {story.genres.length && (
          <div className="flex flex-wrap gap-2">
            {story.genres.map((genre) => (
              <StoryGenreBadge key={genre} variant={genre} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
