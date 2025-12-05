import { cn } from "@/lib/style";
import { cva, VariantProps } from "class-variance-authority";
import { FileIcon } from "lucide-react";
import {
  ChangeEvent,
  DragEvent,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from "react";

const useFileUpload = ({
  onReadFile,
  readAs,
}: {
  onReadFile: (content: string) => void;
  readAs: ReadAs;
}) => {
  const reader = useRef(new FileReader());
  const onReadFileHandler = useEffectEvent(() => {
    if (typeof reader.current.result !== "string")
      throw new Error(`Error when reading file: ${reader.current.result}`);

    onReadFile(reader.current.result);
  });

  useEffect(() => {
    reader.current.addEventListener("load", onReadFileHandler, false);
  }, []);

  const readFile = (file: File) => {
    if (readAs === "text") reader.current.readAsText(file);
    else reader.current.readAsDataURL(file);

    return { name: file.name };
  };

  return { readFile };
};

type ReadAs = "text" | "dataURL";

type Accept = "image" | "json";

const variants = cva(
  "text-muted-foreground flex items-center justify-center rounded border border-dashed p-2 text-sm transition-all",
  {
    variants: {
      size: {
        sm: "min-h-10 text-xs",
        md: "min-h-40",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

type FileInputProps = {
  accept: Accept;
  onUploadFile: (content: string | null) => void;
  readAs: ReadAs;
  size?: VariantProps<typeof variants>["size"];
};

const fileTypeMapping: Record<Accept, string> = {
  image: ".apng,.png,.avif,.gif,.jpg,.jpeg,.jfif,.pjpeg,.pjp,.svg,.webp", // https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Image_types
  json: ".json",
};

export const FileDropInput = ({
  onUploadFile,
  accept,
  readAs,
  size,
}: FileInputProps) => {
  const { readFile } = useFileUpload({
    onReadFile: onUploadFile,
    readAs,
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [fileName, setFileName] = useState<string>();

  const handleDrop = (e: DragEvent) => {
    e.stopPropagation();
    e.preventDefault();

    const dataTransfer = e.dataTransfer;
    if (!dataTransfer) return;

    const { files } = dataTransfer;

    if (!files?.[0]) return;

    const { name } = readFile(files[0]);
    setFileName(name);
  };

  const handleInputChange = (event: ChangeEvent) => {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (!file) return;
    const { name } = readFile(file);
    setFileName(name);
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
          variants({ size }),
          isDraggingOver && "border-primary border-2",
        )}
        onClick={handleDropzoneClick}
      >
        {fileName ? (
          <p>
            <span className="font-semibold">Uploaded:</span> {fileName}
          </p>
        ) : (
          <div className="flex items-center gap-2">
            <FileIcon size="16px" />
            <p>Drop your file here or click to browse your files</p>
          </div>
        )}
      </div>
      <input
        type="file"
        className="hidden"
        onChange={handleInputChange}
        accept={fileTypeMapping[accept]}
        ref={inputRef}
      />
    </>
  );
};
