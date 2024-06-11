import { createFileRoute } from "@tanstack/react-router";

const Index = () => {
  return (
    <p>
      Yo-yo-yo-yo-yo-yo-yo
      <br />
      Je suis le rat qui fait du rap
      <br />
      Yo-yo-yo-yo-yo-yo-yo
      <br />
      Wahou ! À fond les bananes !
      <br />
      Yo-yo-yo-yo-yo-yo-yo
    </p>
  );
};

export const Route = createFileRoute("/")({
  component: Index,
});
