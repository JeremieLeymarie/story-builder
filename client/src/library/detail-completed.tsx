import { Title } from "@/design-system/components";
import { timeFrom } from "@/lib/date";
import { StoryProgress } from "@/lib/storage/domain";

export const DetailCompleted = ({ progress }: { progress: StoryProgress }) => (
  <div className="flex flex-col items-end space-y-6 max-lg:space-y-2">
    <div className="mt-16 space-y-2 rounded-[--radius] bg-white bg-opacity-75 p-8">
      <Title variant="section">Your progress:</Title>
      <p className="text-sm text-muted-foreground">
        Story completed {timeFrom(progress.lastPlayedAt)}.
      </p>
    </div>
    {/* TODO: Add stats about game */}
  </div>
);
