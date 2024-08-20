import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/design-system/primitives";
import { Link } from "@tanstack/react-router";
import { MoveRightIcon} from "lucide-react";
import { StoryList } from "./story-list";
import { Title } from "@/design-system/components";
import { Story } from "@/lib/storage/domain";
import { ImportModal } from "@/builder/components/import-modal";

type Library = {
  storiesFromStore: Story[];
  userStories: Story[];
  finishedGameKeys: string[];
};

/** Component that displays the current user's library
 *
 * @param {Story[]} storiesFromStore Stories published in the store
 * @param {Story[]} userStories Stories created by the current user
 * @param {string[]} finishedGameKeys Keys of finished games
 * @returns
 */
export const Library = ({
  storiesFromStore,
  userStories,
  finishedGameKeys,
}: Library) => {
  return (
    <div className="flex flex-col items-center space-y-8 p-8 px-16 sm:items-start sm:px-32">
      <div className="flex flex-col items-center space-y-8 sm:items-start">
        <Title variant="secondary">Your games</Title>
        <Card className="h-[225px] w-[275px] border-dashed">
            <CardHeader>
              <CardTitle>Import your game</CardTitle>
              <CardDescription>Import a story from a JSON file</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center gap-2">
                <ImportModal />
          </CardContent>
        </Card>
        {storiesFromStore.length > 0 ? (
          <StoryList
            stories={storiesFromStore}
            finishedGameKeys={finishedGameKeys}
          />
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
      <div className="flex flex-col items-center space-y-8 sm:items-start">
        <Title variant="secondary">Games you've created</Title>
        {userStories.length > 0 ? (
          <StoryList
            stories={userStories}
            finishedGameKeys={finishedGameKeys}
          />
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
