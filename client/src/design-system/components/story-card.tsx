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
      className="group relative h-[225px] w-[275px] shadow-md"
    >
      <CardHeader>
        <CardTitle className="rounded-sm bg-gray-50 bg-opacity-75 p-2">
          {title}
        </CardTitle>
        <CardDescription className="... overflow-hidden overflow-ellipsis text-gray-50">
          {description}
        </CardDescription>
      </CardHeader>
      {button ?? null}
    </Card>
  );
};
