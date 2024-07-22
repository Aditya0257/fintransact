"use client";

import { Avatar } from "./Avatar";
import { Button } from "./button";

export const Appbar = () => {
  return (
    <div className="flex justify-between border-b border-slate-300 px-4">
      <div className="flex flex-col justify-center text-lg">Wallet App</div>
      <div className="gap-x-4 pt-2 flex">
        <Button onClick={() => {}}>Login</Button>
        <Avatar user={""} />
      </div>
    </div>
  );
};
