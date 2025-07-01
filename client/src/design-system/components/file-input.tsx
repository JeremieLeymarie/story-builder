import { cn } from "@/lib/style";
import { FileIcon } from "lucide-react";
import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";

const useFileUpload = ({
  onReadFile,
}: {
  onReadFile: (content: string) => void;
}) => {
  const reader = useRef(new FileReader());

  useEffect(() => {
    reader.current.addEventListener(
      "load",
      () => {
        if (typeof reader.current.result !== "string")
          throw new Error(`Error when reading file: ${reader.current.result}`);

        onReadFile(reader.current.result);
      },
      false,
    );
  }, [onReadFile]);

  const readFile = (file: File) => {
    reader.current.readAsText(file);
  };

  return { readFile };
};

type FileInputProps = {
  accept?: string;
  onUploadFile: (content: string) => void;
};

export const FileDropInput = ({ onUploadFile, accept }: FileInputProps) => {
  const { readFile } = useFileUpload({ onReadFile: onUploadFile });
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleDrop = (e: DragEvent) => {
    e.stopPropagation();
    e.preventDefault();

    const dataTransfer = e.dataTransfer;
    if (!dataTransfer) return;

    const { files } = dataTransfer;

    if (!files?.[0]) return;

    readFile(files[0]);
  };

  const handleInputChange = (event: ChangeEvent) => {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (!file) return;
    readFile(file);
  };

  const handleDropzoneClick = () => {
    inputRef.current?.click();
  };

  return (
    <>
      <div
        onDragEnter={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDraggingOver(true);
        }}
        onDragEnd={() => {
          setIsDraggingOver(false);
        }}
        onDragLeave={() => {
          setIsDraggingOver(false);
        }}
        onDrop={handleDrop}
        className={cn(
          "text-muted-foreground flex min-h-40 items-center justify-center rounded border border-dashed p-2 text-sm",
          isDraggingOver && "border-primary border-2",
        )}
        onClick={handleDropzoneClick}
      >
        <p className="flex items-center gap-2">
          <FileIcon size="16px" /> Drop your file here or click to browse your
          files
        </p>
      </div>
      <input
        type="file"
        className="hidden"
        onChange={handleInputChange}
        accept={accept}
        ref={inputRef}
      />
    </>
  );
};
