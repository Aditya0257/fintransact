"use client";

import { Appbar, UserSessionType } from "@repo/ui/appbar";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function AppbarClient() {
  const session = useSession();
  const router = useRouter();

  const user = session.data?.user as UserSessionType | undefined;

  return (
    <div>
      <Appbar
        user={user}
        onSignin={signIn}
        onSignout={async () => {
          await signOut();
          router.push("/api/auth/signin");
        }}
      />
    </div>
  );
}
