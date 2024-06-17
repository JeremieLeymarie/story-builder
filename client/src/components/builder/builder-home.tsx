import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/design-system/primitives";
import { CreateStoryForm } from "./create-story-form";

export const BuilderHome = () => {
  // TODO: fetch stories

  return (
    <div className="flex p-4">
      <Card className="border-dashed max-w-[450px] max-h-[400px]">
        <CardHeader>
          <CardTitle>New story</CardTitle>
          <CardDescription>A new adventure awaits</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center">
          <CreateStoryForm />
        </CardContent>
      </Card>
      {/* TODO: display stories  */}
    </div>
  );
};
