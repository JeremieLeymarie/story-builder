import {
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/design-system/primitives";
import { Link } from "@tanstack/react-router";
import { MoveRightIcon } from "lucide-react";
import { Story } from "@/lib/storage/dexie/dexie-db";

type Library = {
  stories: Story[];
};

export const Library = ({ stories }: Library) => {
  return (
    // TODO: justify-center might not be the best
    <div className="flex p-4 gap-4 flex-wrap justify-center">
      {stories.map(({ title, description, image, id }) => {
        return (
          <Link to="/library/$storyId" params={{ storyId: id }}>
            <Card
              style={{
                background: `url('${image}')`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              className={`w-[275px] h-[225px] group relative`}
            >
              <CardHeader>
                <CardTitle className="bg-gray-50 bg-opacity-75 p-2 rounded-sm">
                  {title}
                </CardTitle>
                <CardDescription className="text-gray-50 overflow-ellipsis overflow-hidden ...">
                  {description}
                </CardDescription>
              </CardHeader>
              <Link to="/library/$storyId" params={{ storyId: id }}>
                <Button
                  className={`absolute opacity-0 transition ease-in-out duration-300 group-hover:opacity-100 bottom-4 right-4`}
                >
                  Play &nbsp;{" "}
                  <MoveRightIcon size="15px" className="animate-bounce" />
                </Button>
              </Link>
            </Card>
          </Link>
        );
      })}
    </div>
  );
};
