import { useGetIdentity } from "@refinedev/core";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, getInitials } from "@/lib/utils";

type UserHeaderProps = {
  desktopSize: boolean;
};

export function UserHeader({ desktopSize = true }: UserHeaderProps) {
  const { data: user, isLoading: userIsLoading } = useGetIdentity();

  if (userIsLoading || !user) {
    return <Skeleton className={cn("h-10", "w-10", "rounded-full")} />;
  }

  const { name, avatar, role } = user.user;

  return (
    <div className="flex gap-3.5 flex-row md:mr-3">
      <Avatar className={cn("h-10", "w-10")}>
        {avatar && <AvatarImage src={avatar} alt={name} />}
        <AvatarFallback>{getInitials(name)}</AvatarFallback>
      </Avatar>
      {desktopSize && (
        <div>
          <p className="text-sm font-medium">{name}</p>
          <p className="text-xs text-slate-500">{role}</p>
        </div>
      )}
    </div>
  );
}

UserHeader.displayName = "UserHeader";
