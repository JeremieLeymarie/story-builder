import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/design-system/primitives";
import { Story } from "../lib/storage/dexie/dexie-db";
import { ModalValidator } from "./store-modal-validator";

type StoreHomeProps = {
  stories: Story[];
};

export const Store = ({ stories }: StoreHomeProps) => {
  return (
    <div className="flex p-4 gap-4 flex-wrap justify-center">
      {stories.map(({ title, description, image, remoteId }) => {
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
            <ModalValidator remoteId={remoteId} />
          </Card>
        );
      })}
    </div>
  );
};
