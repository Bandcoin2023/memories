"use client";

import Link from "next/link";
import { Camera, Crown, Headphones, Heart, User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@acme/ui/avatar";
import { Button } from "@acme/ui/button";
import { Card, CardContent } from "@acme/ui/card";

import { AuthModal } from "./auth-modal";
import { CreateContentModal } from "./create-content-modal";

export function LeftSidebar() {
  return (
    <aside className="bg-sidebar fixed left-0 top-16 z-10 h-[calc(100vh-64px)] w-80 space-y-6 overflow-y-auto border-r p-4">
      <Card className="p-3">
        <CardContent className="px-2">
          <div className="mb-4 flex items-center space-x-4">
            <Avatar className="h-16 w-16 rounded-2xl ring-2 ring-primary/20">
              <AvatarImage src="/user-profile-illustration.png" />
              <AvatarFallback className="text-lg font-semibold">
                JD
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-sidebar-foreground text-lg font-bold">
                John Doe
              </h3>
              <p className="mb-2 text-sm text-muted-foreground">@johndoe</p>
              <p className="text-xs text-muted-foreground">
                Memory keeper since 2024
              </p>
            </div>
          </div>

          {/* Integrated stats grid */}
          <div className="grid grid-cols-3 gap-3 border-t pt-4">
            <div className="text-center">
              <div className="text-lg font-bold text-primary">24</div>
              <div className="text-xs text-muted-foreground">Memories</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-secondary">8</div>
              <div className="text-xs text-muted-foreground">Photobooks</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-accent">3</div>
              <div className="text-xs text-muted-foreground">Audiobooks</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h3 className="text-sidebar-foreground font-semibold">
          My Collectibles
        </h3>

        <Link href="/collection">
          <Button
            className="h-12 w-full justify-start space-x-3 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 dark:from-purple-950/20 dark:to-pink-950/20 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30"
            variant="outline"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-pink-600">
              <Crown className="h-4 w-4 text-white" />
            </div>
            <span className="font-medium text-purple-700 dark:text-purple-300">
              View Collection
            </span>
          </Button>
        </Link>
      </div>

      {/* Create Content */}
      <div className="space-y-3">
        <h3 className="text-sidebar-foreground font-semibold">Create</h3>

        <CreateContentModal type="photobook">
          <Button
            className="h-12 w-full justify-start space-x-3 bg-transparent"
            variant="outline"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Camera className="h-4 w-4 text-primary" />
            </div>
            <span>Create Photobook</span>
          </Button>
        </CreateContentModal>

        <CreateContentModal type="audiobook">
          <Button
            className="h-12 w-full justify-start space-x-3 bg-transparent"
            variant="outline"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/10">
              <Headphones className="h-4 w-4 text-secondary" />
            </div>
            <span>Create Audiobook</span>
          </Button>
        </CreateContentModal>

        <CreateContentModal type="memory">
          <Button
            className="h-12 w-full justify-start space-x-3 bg-transparent"
            variant="outline"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
              <Heart className="h-4 w-4 text-accent" />
            </div>
            <span>Create Memory</span>
          </Button>
        </CreateContentModal>
        <AuthModal>
          <Button
            className="h-12 w-full justify-start space-x-3"
            variant="destructive"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
              <User className="h-4 w-4" />
            </div>
            <span>Login</span>
          </Button>
        </AuthModal>
      </div>
    </aside>
  );
}
