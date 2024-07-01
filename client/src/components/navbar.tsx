import { Link } from "@tanstack/react-router";
import { ModeToggle } from "./mode-toggle";
import { Button } from "@/design-system/primitives";

export const Navbar = () => (
  <div className="h-[50px] flex items-center p-4 justify-between">
    <div>
      {/* TODO: Implement actual menu */}
      <Button variant="ghost">
        <Link to="/">Home</Link>
      </Button>
    </div>
    <ModeToggle />
  </div>
);
