"use client";

import type React from "react";
import { useState } from "react";
import {
  Check,
  Copy,
  Facebook,
  Mail,
  MessageSquare,
  Share2,
  Twitter,
} from "lucide-react";

import { Button } from "@acme/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@acme/ui/dialog";
import { toast } from "@acme/ui/toast";

interface ShareModalProps {
  memoryTitle: string;
  memoryId: number;
  children: React.ReactNode;
}

export function ShareModal({
  memoryTitle,
  memoryId,
  children,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/memory/${memoryId}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      // toast({
      //   title: "Link copied!",
      //   description: "The memory link has been copied to your clipboard.",
      // });
      toast.success("Link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const shareOptions = [
    {
      name: "Copy Link",
      icon: copied ? Check : Copy,
      action: handleCopyLink,
      color: "text-blue-600",
    },
    {
      name: "Facebook",
      icon: Facebook,
      action: () =>
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
          "_blank",
        ),
      color: "text-blue-600",
    },
    {
      name: "Twitter",
      icon: Twitter,
      action: () =>
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`Check out this memory: ${memoryTitle}`)}`,
          "_blank",
        ),
      color: "text-sky-500",
    },
    {
      name: "WhatsApp",
      icon: MessageSquare,
      action: () =>
        window.open(
          `https://wa.me/?text=${encodeURIComponent(`Check out this memory: ${memoryTitle} ${shareUrl}`)}`,
          "_blank",
        ),
      color: "text-green-600",
    },
    {
      name: "Email",
      icon: Mail,
      action: () =>
        window.open(
          `mailto:?subject=${encodeURIComponent(`Check out this memory: ${memoryTitle}`)}&body=${encodeURIComponent(`I thought you'd enjoy this memory: ${shareUrl}`)}`,
          "_blank",
        ),
      color: "text-gray-600",
    },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Share2 className="h-5 w-5" />
            <span>Share Memory</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Share "{memoryTitle}" with others
          </div>

          <div className="grid grid-cols-1 gap-2">
            {shareOptions.map((option) => {
              const Icon = option.icon;
              return (
                <Button
                  key={option.name}
                  variant="outline"
                  className="h-12 justify-start bg-transparent"
                  onClick={option.action}
                >
                  <Icon className={`mr-3 h-4 w-4 ${option.color}`} />
                  {option.name}
                </Button>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
