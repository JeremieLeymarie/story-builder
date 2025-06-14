import { Story } from "@/lib/storage/domain";
import { Card, CardDescription, CardHeader, CardTitle } from "../primitives";
import { CSSProperties, type JSX } from "react";

export const StoryCard = ({
  story,
  button,
  onClick,
}: {
  story: Story;
  button?: JSX.Element;
  onClick?: () => void;
}) => {
  return (
    <Card
      style={{
        backgroundColor: "black",
        background: `url('${story.image}')`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="group relative h-[225px] w-[275px] shadow-md"
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle className="max-w-[275px] overflow-hidden rounded-sm bg-gray-50/75 p-2 text-ellipsis whitespace-nowrap">
          {story.title}
        </CardTitle>
        <CardDescription
          className="overflow-hidden text-ellipsis text-gray-50"
          style={
            {
              display: "-webkit-box",
              WebkitLineClamp: "4",
              WebkitBoxOrient: "vertical",
            } as CSSProperties
          }
        >
          {story.description}
        </CardDescription>
      </CardHeader>
      {button ?? null}
    </Card>
  );
};
