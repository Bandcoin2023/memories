"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { signTransaction } from "@acme/auth";
import { Button } from "@acme/ui/button";

import { authClient } from "~/auth/client";
import { useTRPC } from "~/trpc/react";

export function TestTokenCreate({ pubkey }: { pubkey?: string }) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const testTransection = useMutation(trpc.post.create.mutationOptions());

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
function createToken(variables: void): Promise<unknown> {
  throw new Error("Function not implemented.");
}
