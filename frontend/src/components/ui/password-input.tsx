import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "../../lib/utils";
import { Input } from "./input";

type PasswordInputProps = Omit<React.ComponentProps<typeof Input>, "type">;

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, disabled, ...props }, ref) => {
    const [isVisible, setIsVisible] = React.useState(false);
    const Icon = isVisible ? EyeOff : Eye;

    return (
      <div className="relative">
        <Input
          ref={ref}
          type={isVisible ? "text" : "password"}
          className={cn("pr-12", className)}
          disabled={disabled}
          {...props}
        />
        <button
          type="button"
          className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-accent/10 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          onClick={() => setIsVisible((visible) => !visible)}
          disabled={disabled}
          aria-label={isVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
          aria-pressed={isVisible}
        >
          <Icon className="h-4 w-4" />
        </button>
      </div>
    );
  },
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
