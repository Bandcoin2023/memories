"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { signTransaction } from "@acme/auth";
import { Button } from "@acme/ui/button";

import { authClient } from "~/auth/client";
import { honoClient } from "~/trpc/hc";
import { useTRPC } from "~/trpc/react";

export function TestTokenCreate({ pubkey }: { pubkey?: string }) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const testTransaction = useMutation(
    trpc.trx.getXdr.mutationOptions({
      onSuccess: (xdr) => {
        console.log("XDR:", xdr);
        if (xdr) {
          signTransaction({ xdr, authClient })
            .then((signedXdr) => {
              console.log("Signed XDR:", signedXdr);
              honoClient.trxs.$post({
                form: {
                  signedXdr: signedXdr ?? "",
                },
              });

              queryClient.invalidateQueries({ queryKey: ["auth.getSession"] });
            })
            .catch((error) => {
              console.error("Error signing transaction:", error);
            });
        }
      },
    }),
  );

  return (
    <div>
      <Button onClick={() => testTransaction.mutate()}>
        {testTransaction.isPending && (
          <Loader2 className="animate animate-spin" />
        )}
        Test
      </Button>
    </div>
  );
}
function createToken(variables: void): Promise<unknown> {
  throw new Error("Function not implemented.");
}
