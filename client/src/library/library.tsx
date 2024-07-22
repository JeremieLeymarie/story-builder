import { Button } from "@/design-system/primitives";
import { Link } from "@tanstack/react-router";
import { MoveRightIcon } from "lucide-react";
import { Story } from "@/lib/storage/dexie/dexie-db";
import { StoryList } from "./story-list";
import { Title } from "@/design-system/components";

type Library = {
  storiesFromStore: Story[];
  userStories: Story[];
};

/** Component that displays the current user's library
 *
 * @param {Story[]} storiesFromStore Stories published in the store
 * @param {Story[]} userStories Stories created by the current user
 * @returns
 */
export const Library = ({ storiesFromStore, userStories }: Library) => {
  return (
    <div className="space-y-8 p-8">
      <div className="space-y-8">
        <Title variant="secondary">Your games</Title>
        {storiesFromStore.length > 0 ? (
          <StoryList stories={storiesFromStore} />
        ) : (
          <div>
            <p className="text-sm text-muted-foreground">
              You don't have any games in your library...
            </p>
            <Link to="/store">
              <Button variant="link" className="text-md p-0">
                Go to the store to find free adventure to play &nbsp;
                <MoveRightIcon size="15px" className="animate-bounce" />
              </Button>
            </Link>
          </div>
        )}
      </div>
      <div className="space-y-8">
        <Title variant="secondary">Games you've created</Title>
        {userStories.length > 0 ? (
          <StoryList stories={userStories} />
        ) : (
          <div>
            <p className="text-sm text-muted-foreground">
              You haven't created any game yet...
            </p>
            <Link to="/store">
              <Button variant="link" className="text-md p-0">
                Start building your own adventure &nbsp;
                <MoveRightIcon size="15px" className="animate-bounce" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
