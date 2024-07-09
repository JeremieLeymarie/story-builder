import { Card, CardDescription, CardHeader, CardTitle } from "../primitives";

export const StoryCard = ({
  title,
  image,
  description,
  button,
}: {
  title: string;
  image: string;
  description: string;
  button?: JSX.Element;
}) => {
  return (
    <Card
      style={{
        background: `url('${image}')`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="w-[275px] h-[225px] group relative shadow-md"
    >
      <CardHeader>
        <CardTitle className="bg-gray-50 bg-opacity-75 p-2 rounded-sm">
          {title}
        </CardTitle>
        <CardDescription className="text-gray-50 overflow-ellipsis overflow-hidden ...">
          {description}
        </CardDescription>
      </CardHeader>
      {button ?? null}
    </Card>
  );
};
