import { Avatar } from "./Avatar";
import { Button } from "./button";

export interface UserSessionType {
  email?: string | null;
  id: string;
  name?: string | null;
  image?: string | null;
}

interface AppbarProps {
  user?: UserSessionType;
  onSignin: () => void;
  onSignout: () => Promise<void>;
}

export const Appbar = ({ user, onSignin, onSignout }: AppbarProps) => {
  return (
    <div className="sticky top-0 z-50 flex justify-between items-center border-b border-slate-300 px-4 ">
      <div className="flex flex-col justify-center text-lg">Wallet App</div>
      <div className="gap-x-4 pt-2 flex">
        <Button onClick={user ? onSignout : onSignin}>
          {user ? "Logout" : "Login"}
        </Button>
        <Avatar user={user} />
      </div>
    </div>
  );
};
