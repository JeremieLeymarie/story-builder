import { useState } from "react";
import { Button, Input } from "@/design-system/primitives";
import { Eye, EyeOff } from "lucide-react";

/**
 * Reusable component for a password field with visibility toggle
 * Uses all standard Input props
 */
export const PasswordInput = ({
  ...props
}: React.ComponentProps<typeof Input>) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input type={showPassword ? "text" : "password"} {...props} />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
        onClick={() => setShowPassword((prev) => !prev)}
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};
