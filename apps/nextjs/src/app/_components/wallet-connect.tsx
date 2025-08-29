"use client";

import { useState } from "react";
import { AuthModal } from "auth-client";

import "auth-client/styles";

import { authClient } from "~/auth/client";

export function ConnectWallet() {
  const [open, setOpen] = useState(false);
  const { data: session } = authClient.useSession();

  return (
    <>
      <button onClick={() => setOpen(true)}>Connect</button>
      <div>
        {session?.user.name}
        <button onClick={() => authClient.signOut()}>SignOut</button>
      </div>
      <AuthModal
        open={open}
        onClose={() => setOpen(false)}
        // @ts-expect-error maybe typeerror
        client={authClient}
      />
    </>
  );
}
