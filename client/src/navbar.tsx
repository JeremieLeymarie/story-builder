import { Link } from "@tanstack/react-router";
import { ModeToggle } from "./mode-toggle";
import { Button } from "@/design-system/primitives";

export const Navbar = () => (
  <div className="h-[50px] flex items-center px-4 py-6 justify-between border-b-4 border-b-primary">
    <div>
      {/* TODO: Implement actual menu */}
      <Button variant="ghost">
        <Link to="/">Home</Link>
      </Button>
    </div>
    <ModeToggle />
  </div>
);