import { Home } from "@/components/home";
import { createFileRoute } from "@tanstack/react-router";

const Index = () => {
  return (
    <div className="w-full flex items-center justify-center mt-8">
      <Home />
    </div>
  );
};

export const Route = createFileRoute("/")({
  component: Index,
});
