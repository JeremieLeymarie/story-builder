import { Story } from "@/lib/storage/domain";
import { Card, CardDescription, CardHeader, CardTitle } from "../primitives";
import { CSSProperties } from "react";

export const StoryCard = ({
  title,
  image,
  description,
  button,
}: Omit<Story, "key"> & {
  button?: JSX.Element;
  storyKey: string;
}) => {
  return (
    <Card
      style={{
        backgroundColor: "black",
        background: `url('${image}')`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="group relative h-[225px] w-[275px] shadow-md"
    >
      <CardHeader>
        <CardTitle className="rounded-sm bg-gray-50 bg-opacity-75 p-2">
          {title}
        </CardTitle>
        <CardDescription
          className="overflow-hidden overflow-ellipsis text-gray-50"
          style={
            {
              display: "-webkit-box",
              WebkitLineClamp: "4",
              WebkitBoxOrient: "vertical",
            } as CSSProperties
          }
        >
          {description}
        </CardDescription>
      </CardHeader>
      {button ?? null}
    </Card>
  );
};
