import { Story } from "@/lib/storage/domain";
import { BaseCard } from "./base-card";
import { ReactNode } from "react";

export const StoryCard = ({
  story,
  button,
  onClick,
}: {
  story: Story;
  button?: ReactNode;
  onClick?: () => void;
}) => {
  return (
    <BaseCard
      backgroundURL={story.image}
      title={story.title}
      description={story.description}
      button={button}
      onClick={onClick}
    />
  );
};
