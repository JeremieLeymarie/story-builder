import { Button } from "@/design-system/primitives";
import { Story } from "@/lib/storage/dexie/dexie-db";
import { Link } from "@tanstack/react-router";
import { MoveRightIcon } from "lucide-react";

export const LastGameSection = ({ lastGame }: { lastGame: Story }) => {
  return (
    <div
      className={`
        h-[60vh] w-full flex gap-32 justify-center items-center select-none px-8 flex-wrap
        max-lg:gap-12 max-md:gap-12 max-md:h-[55vh]`}
      style={{
        background: `url('${lastGame.image}')`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="space-y-4 ">
        <p className="text-lg bg-primary font-bold uppercase w-max px-2 max-md:text-md break-words">
          Pick up where you left off:
        </p>
        <p className="w-max bg-gray-50 bg-opacity-75 p-2 rounded-sm text-3xl font-semibold leading-none tracking-tight max-md:text-xl">
          {lastGame.title}
        </p>
        <p className="text-primary font-bold uppercase">Story by: TODO</p>
        <p className="text-white text-lg max-md:text-md">
          {lastGame.description}
        </p>
      </div>

      <div className="w-max h-max flex flex-col justify-center items-center">
        <Link to="/library/$storyId" params={{ storyId: lastGame.id }}>
          <Button className="text-xl max-md:text-lg shadow-3xl shadow-primary/50">
            Resume game &nbsp;
            <MoveRightIcon />
          </Button>
        </Link>
      </div>
    </div>
  );
};
