"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { Button } from "@acme/ui/button";

import { useTRPC } from "~/trpc/react";

export function TestTokenCreate({ pubkey }: { pubkey?: string }) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const testTransaction = useMutation(trpc.post.create.mutationOptions());

  return (
    <div>
      <Button
        onClick={() =>
          testTransaction.mutate({
            title: "Test Post",
            content: "This is a test post.",
            // Sign the transaction with the auth client
            createdAt: new Date(),
            updatedAt: new Date(),
          })
        }
      >
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
