import { LastGameSection } from "./last-game-section";
import { Divider } from "../design-system/components/divider";
import { StoreItems } from "./store-items";
import { Story } from "@/lib/storage/domain";
import { BuilderShowcase } from "./builder-showcase";
import { LibrarySection } from "./library-section";

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
      <LibrarySection stories={libraryStories} />
      <Divider />
      {storeItems && (
        <>
          <StoreItems stories={storeItems} />
          <Divider />
        </>
      )}
      <BuilderShowcase />
      {/* TODO: add about section */}
    </div>
  );
};
