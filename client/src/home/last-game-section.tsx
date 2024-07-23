import { StoryGenreBadge, Title } from "@/design-system/components";
import { Button } from "@/design-system/primitives";
import { Story } from "@/lib/storage/domain";
import { Link } from "@tanstack/react-router";
import { MoveRightIcon } from "lucide-react";

export const LastGameSection = ({ lastGame }: { lastGame: Story }) => {
  return (
    <div
      className={`flex h-[60vh] w-full select-none flex-wrap items-center justify-center gap-32 px-8 max-lg:gap-12 max-md:h-[55vh] max-md:gap-12`}
      style={{
        background: `url('${lastGame.image}')`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="space-y-4">
        <Title variant="section">Pick up where you left off:</Title>
        <Title>{lastGame.title}</Title>
        {lastGame.genres.length && (
          <div className="flex flex-wrap gap-2">
            {lastGame.genres.map((genre) => (
              <StoryGenreBadge variant={genre} />
            ))}
          </div>
        )}
        {!!lastGame.author && (
          <p className="font-bold uppercase text-primary">
            Story by: {lastGame.author?.username}
          </p>
        )}
      </div>

      <div className="flex h-max w-max flex-col items-center justify-center">
        <Link to="/library/$storyKey" params={{ storyKey: lastGame.key }}>
          <Button className="text-xl shadow-3xl shadow-primary/50 max-md:text-lg">
            Resume game &nbsp;
            <MoveRightIcon />
          </Button>
        </Link>
      </div>
    </div>
  );
};
