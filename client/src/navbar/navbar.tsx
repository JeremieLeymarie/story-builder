import { Link } from "@tanstack/react-router";
import { Button } from "@/design-system/primitives";
import { SynchronizationState } from "./hooks/use-synchronization-old";
import { SynchronizationStateDisplay } from "./synchronization-state";
import { UserDisplay } from "./user-display";
import { User } from "@/lib/storage/domain";

export const Navbar = ({
  syncState,
  user,
  synchronize,
}: {
  syncState: SynchronizationState;
  user?: User | null;
  synchronize: () => void;
}) => {
  return (
    <div className="flex h-[50px] items-center justify-between border-b-4 border-b-primary px-4 py-6">
      <div className="flex gap-2">
        {/* TODO: Implement actual menu */}
        <Link to="/" className="block">
          <Button variant="ghost">Home</Button>
        </Link>
        <Link to="/library" className="block">
          <Button variant="ghost">Your games</Button>
        </Link>
        <Link to="/store" className="block">
          <Button variant="ghost">Store</Button>
        </Link>
        <Link to="/builder/stories" className="block">
          <Button variant="ghost">Builder</Button>
        </Link>
      </div>
      <div className="flex items-center gap-6">
        {/* <SynchronizationStateDisplay
          syncState={syncState}
          synchronize={synchronize}
        /> */}
        <UserDisplay user={user} />
        {/* <ModeToggle /> */}
      </div>
    </div>
  );
};
