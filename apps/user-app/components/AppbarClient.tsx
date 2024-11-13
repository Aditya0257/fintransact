"use client";

import { Appbar, UserSessionType } from "@repo/ui/appbar";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function AppbarClient({visible}: {visible: boolean}) {
  const session = useSession();
  const router = useRouter();

  const user = session.data?.user as UserSessionType | undefined;

  return (
    <div>
      <Appbar
        visible={visible}
        user={user}
        onSignin={signIn}
        onSignout={async () => {
          await signOut({ redirect: false });
          router.push("/signin");
        }}
      />
    </div>
  );
}
