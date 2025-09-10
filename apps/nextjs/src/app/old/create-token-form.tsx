"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { signTransaction } from "@acme/auth";
import { Button } from "@acme/ui/button";

import { authClient } from "~/auth/client";
import { createToken } from "~/lib/stellar/create-token";
import { useTRPC } from "~/trpc/react";

export function TestTokenCreate({ pubkey }: { pubkey?: string }) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const testTransection = useMutation({
    mutationFn: createToken,

    onSuccess: (data) => {
      if (pubkey && data) {
        const signedXdr = signTransaction({
          // address: pubkey,
          // networkPassphrase: "testnet",
          // walletId: "albedo",
          authClient: authClient,
          xdr: data,
        });
      }
      console.log("here", data);
    },
    onError: (error) => {
      console.error("Error creating token:", error.message);
    },
  });

  const signCustodial = async () => {
    const data = await createToken();
    const res = await fetch("/api/auth/stellar/sign-custodial", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ xdr: data }),
    });

    const dataM = await res.bytes();
    console.log("vong", dataM);
  };

  return (
    <div>
      <Button onClick={() => testTransection.mutate()}>
        {testTransection.isPending && (
          <Loader2 className="animate animate-spin" />
        )}
        Test
      </Button>
    </div>
  );
}
