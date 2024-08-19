import { LastGameSection } from "./last-game-section";
import { Divider } from "../design-system/components/divider";
import { StoreItems } from "./store-items";
import { Story } from "@/lib/storage/domain";

type Props = {
  lastPlayedGame?: Story | null;
  storeItems: Story[] | null;
};

export const Home = ({ lastPlayedGame, storeItems }: Props) => {
  return (
    <div className="h-full w-full">
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
