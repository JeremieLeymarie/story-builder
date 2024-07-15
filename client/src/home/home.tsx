import { Story } from "@/lib/storage/dexie/dexie-db";
import { LastGameSection } from "./last-game-section";
import { Divider } from "./divider";
import { StoreItems } from "./store-items";

type Props = {
  lastPlayedGame?: Story | null;
  storeItems: Story[] | null;
};

export const Home = ({ lastPlayedGame, storeItems }: Props) => {
  return (
    <div className="w-full h-full">
      {!!lastPlayedGame && (
        <>
          <LastGameSection lastGame={lastPlayedGame} />
          <Divider />
        </>
      )}
      {/* TODO: add library section */}
      {storeItems && (
        <>
          <StoreItems stories={storeItems} />
          <Divider />
        </>
      )}
      {/* TODO: add builder section */}
    </div>
  );
};
