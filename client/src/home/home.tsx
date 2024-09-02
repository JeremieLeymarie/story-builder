import { LastGameSection } from "./last-game-section";
import { Story } from "@/lib/storage/domain";
import { BuilderShowcase } from "./builder-showcase";
import { LibrarySection } from "./library-section";
import { Divider } from "@/design-system/components";
import { StoreSection } from "./store-section";

type Props = {
  lastPlayedGame?: Story | null;
  storeItems: Story[] | null;
  libraryStories: Story[];
};

export const Home = ({ lastPlayedGame, storeItems, libraryStories }: Props) => {
  return (
    <div className="h-full w-full">
      {!!lastPlayedGame && (
        <>
          <LastGameSection lastGame={lastPlayedGame} />
          <Divider />
        </>
      )}
      {libraryStories.length > 3 && <LibrarySection stories={libraryStories} />}
      {storeItems && storeItems.length > 3 && (
        <>
          <StoreSection stories={storeItems} />
          <Divider />
        </>
      )}
      <BuilderShowcase />
      <Divider />

      {/* TODO: add about section */}
    </div>
  );
};
