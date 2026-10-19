import { memo, type ComponentProps } from "react";
import { Avatar } from "./avatar";

export interface AvatarGroupItem {
  name: string;
  src?: string;
}

interface AvatarGroupProps extends Omit<ComponentProps<"ul">, "children"> {
  avatars?: AvatarGroupItem[];
  max?: number;
  size?: number;
}

export const AvatarGroup = memo(function AvatarGroup({
  avatars = [
    { name: "Alex Morgan" },
    { name: "Sam Rivera" },
    { name: "Jordan Lee" },
    { name: "Taylor Kim" },
    { name: "Casey Park" },
  ],
  max = 4,
  size = 40,
  className = "",
  ...props
}: AvatarGroupProps) {
  const visibleAvatars = avatars.slice(0, Math.max(0, max));
  const overflow = Math.max(0, avatars.length - visibleAvatars.length);

  return (
    <ul
      aria-label={`${avatars.length} people`}
      className={`m-0 flex list-none items-center -space-x-3 p-0 ${className}`}
      {...props}
    >
      {visibleAvatars.map((avatar, index) => (
        <li key={`${avatar.name}-${index}`} className="p-0">
          <Avatar
            name={avatar.name}
            src={avatar.src}
            size={size}
            className="rounded-full border-2 border-background"
          />
        </li>
      ))}
      {overflow > 0 && (
        <li className="p-0">
          <span
            aria-label={`${overflow} more ${overflow === 1 ? "person" : "people"}`}
            className="inline-flex shrink-0 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-semibold text-muted-foreground"
            style={{ width: size, height: size }}
          >
            +{overflow}
          </span>
        </li>
      )}
    </ul>
  );
});
