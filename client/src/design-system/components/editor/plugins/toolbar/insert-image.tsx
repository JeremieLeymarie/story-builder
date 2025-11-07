import { ImageIcon } from "lucide-react";

import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/design-system/primitives";
import { InsertImageForm } from "../images-plugin/insert-image-form";

export const InsertImage = () => (
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="outline" size="sm">
        <div className="flex items-center gap-1">
          <ImageIcon className="size-4" />
          <span>Image</span>
        </div>
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Insert image</DialogTitle>
      </DialogHeader>
      <InsertImageForm />
    </DialogContent>
  </Dialog>
);
