import { useGetIdentity } from "@refinedev/core";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type User = {
  id: number;
  fullName: string;
  role: string;
  email: string;
  avatar?: string;
};

type UserAvatarProps = {
  desktopSize: boolean;
};

export function UserAvatar({ desktopSize = true }: UserAvatarProps) {
  // const { data: user, isLoading: userIsLoading } = useGetIdentity<User>();
  const { isLoading: userIsLoading } = useGetIdentity<User>();

  const user = {
    id: 1,
    fullName: "Sarah Tanujaya",
    role: "Super Admin",
    avatar: null,
  };

  if (userIsLoading || !user) {
    return <Skeleton className={cn("h-10", "w-10", "rounded-full")} />;
  }

  const { fullName, avatar, role } = user;

  return (
    <div className="flex gap-3.5 flex-row">
      <Avatar className={cn("h-10", "w-10")}>
        {avatar && <AvatarImage src={avatar} alt={fullName} />}
        <AvatarFallback>{getInitials(fullName)}</AvatarFallback>
      </Avatar>
      {desktopSize && (
        <div>
          <p className="text-sm font-medium">{fullName}</p>
          <p className="text-xs text-slate-500">{role}</p>
        </div>
      )}
    </div>
  );
}

const getInitials = (name = "") => {
  const names = name.split(" ");
  let initials = names[0].substring(0, 1).toUpperCase();

  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
};

UserAvatar.displayName = "UserAvatar";
