import { Story, StoryProgress } from "@/lib/storage/dexie/dexie-db";

type Props = {
  story: Story;
  progress: StoryProgress | null;
};

export const LibraryGameDetail = ({ story, progress }: Props) => {
  return (
    <div
      className="w-full h-full p-16 flex"
      style={{
        background: `url('${story.image}')`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* TODO: Add last played info */}
      <div className="space-y-8">
        <p className="w-max bg-gray-50 bg-opacity-75 p-2 rounded-sm text-3xl font-semibold leading-none tracking-tight max-md:text-xl">
          {story.title}
        </p>
        <p className="text-white text-lg max-md:text-md">{story.description}</p>
      </div>
      {/* <hr className="w-8" /> */}
      <div></div>
    </div>
  );
};
