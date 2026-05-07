import { Card, CardDescription, CardHeader, CardTitle } from "../primitives";
import { CSSProperties, ReactNode } from "react";

export const BaseCard = ({
  button,
  title,
  description,
  onClick,
  backgroundURL,
}: {
  backgroundURL: string;
  title: string;
  description: string;
  button?: ReactNode;
  onClick?: () => void;
}) => {
  return (
    <Card
      style={{
        backgroundColor: "black",
        background: `url('${backgroundURL}')`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="group relative h-56.25 w-68.75 shadow-md"
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle className="w-max max-w-56.25 overflow-hidden rounded-lg bg-black/50 p-2 text-ellipsis whitespace-nowrap text-white">
          {title}
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
          {description}
        </CardDescription>
      </CardHeader>
      {button ?? null}
    </Card>
  );
};
