"use client";

import { useState } from "react";

import { AuthModal } from "@acme/auth";

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
        client={authClient}
      />
    </>
  );
}
