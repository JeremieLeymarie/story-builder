import { LastGameSection } from "./last-game-section";
import { Story } from "@/lib/storage/domain";
import { BuilderShowcase } from "./builder-showcase";
import { LibrarySection } from "./library-section";
import { Divider } from "@/design-system/components";

type Props = {
  lastPlayedGame?: Story | null;
  libraryStories: Story[];
};

export const Home = ({ lastPlayedGame, libraryStories }: Props) => {
  return (
    <div className="h-full w-full">
      {!!lastPlayedGame && (
        <>
          <LastGameSection lastGame={lastPlayedGame} />
          <Divider />
        </>
      )}
      {libraryStories.length > 3 && <LibrarySection stories={libraryStories} />}
      <BuilderShowcase />
      <Divider />

      {/* TODO: add about section */}
    </div>
  );
};
