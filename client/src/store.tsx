import {
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/design-system/primitives";
import { Story } from "@/lib/storage/dexie-db";
import { DownloadIcon } from "lucide-react";

type StoreHomeProps = {
  stories: Story[];
};

export const Store = ({ stories }: StoreHomeProps) => {
  return (
    <div className="flex p-4 gap-4 flex-wrap justify-center">
      {stories.map(({ title, description, image, mongoId }) => {
        return (
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
            <Button
              className={`absolute opacity-0 transition ease-in-out duration-300 group-hover:opacity-100 bottom-4 right-4`}
            >
              Download &nbsp; <DownloadIcon size="15px" />
            </Button>
          </Card>
        );
      })}
    </div>
  );
};
