"use client";

import type React from "react";
import { useState } from "react";
import {
  Camera,
  Coins,
  Headphones,
  Heart,
  ImageIcon,
  Music,
  Upload,
  Video,
  X,
} from "lucide-react";

import { Button } from "@acme/ui/button";
import { Card, CardContent } from "@acme/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@acme/ui/dialog";
import { Input } from "@acme/ui/input";
import { Label } from "@acme/ui/label";
import { Switch } from "@acme/ui/switch";
import { Textarea } from "@acme/ui/textarea";

interface CreateContentModalProps {
  type: "photobook" | "audiobook" | "memory";
  children: React.ReactNode;
}

interface MediaItem {
  id: string;
  type: "image" | "video" | "audio";
  name: string;
  url: string;
}

export function CreateContentModal({
  type,
  children,
}: CreateContentModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isNFT, setIsNFT] = useState(true); // Default to NFT since all content is NFT
  const [nftPrice, setNftPrice] = useState("");
  const [royaltyPercentage, setRoyaltyPercentage] = useState("10");
  const [isLoading, setIsLoading] = useState(false);

  const getTypeConfig = () => {
    switch (type) {
      case "photobook":
        return {
          title: "Create Photobook",
          icon: Camera,
          color: "text-primary",
          bgColor: "bg-primary/10",
          acceptedTypes: "image/*,video/*",
          placeholder: "Give your photobook a title...",
          description: "Share your visual memories",
        };
      case "audiobook":
        return {
          title: "Create Audiobook",
          icon: Headphones,
          color: "text-secondary",
          bgColor: "bg-secondary/10",
          acceptedTypes: "audio/*",
          placeholder: "Give your audiobook a title...",
          description: "Share your audio memories",
        };
      case "memory":
        return {
          title: "Create Memory",
          icon: Heart,
          color: "text-accent",
          bgColor: "bg-accent/10",
          acceptedTypes: "image/*,video/*,audio/*",
          placeholder: "What's this memory about?...",
          description: "Share a special moment",
        };
    }
  };

  const config = getTypeConfig();
  const Icon = config.icon;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (mediaItems.length + files.length > 5) {
      alert("You can only add up to 5 items");
      return;
    }

    files.forEach((file) => {
      const url = URL.createObjectURL(file);
      const mediaType = file.type.startsWith("image/")
        ? "image"
        : file.type.startsWith("video/")
          ? "video"
          : "audio";

      const newItem: MediaItem = {
        id: Math.random().toString(36).substr(2, 9),
        type: mediaType,
        name: file.name,
        url,
      };

      setMediaItems((prev) => [...prev, newItem]);
    });
  };

  const removeMediaItem = (id: string) => {
    setMediaItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || mediaItems.length === 0 || (isNFT && !nftPrice.trim()))
      return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log(" Creating NFT content:", {
        type,
        title,
        description,
        mediaItems,
        isNFT,
        nftPrice: Number.parseFloat(nftPrice),
      });
      setIsLoading(false);
      // Reset form
      setTitle("");
      setDescription("");
      setMediaItems([]);
      setNftPrice("");
      // In real app, close modal and refresh feed
    }, 1000);
  };

  const getMediaIcon = (mediaType: string) => {
    switch (mediaType) {
      case "image":
        return <ImageIcon className="h-4 w-4" />;
      case "video":
        return <Video className="h-4 w-4" />;
      case "audio":
        return <Music className="h-4 w-4" />;
      default:
        return <Upload className="h-4 w-4" />;
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[95vh] w-[95vw] overflow-y-auto p-4 sm:w-full sm:max-w-2xl sm:p-6">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center space-x-2 text-lg sm:text-xl">
            <div
              className={`h-8 w-8 rounded-lg ${config.bgColor} flex items-center justify-center`}
            >
              <Icon className={`h-4 w-4 ${config.color}`} />
            </div>
            <span>{config.title}</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Title
            </Label>
            <Input
              id="title"
              placeholder={config.placeholder}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="text-base" // Better mobile input sizing
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder={config.description}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[60px] resize-none text-base sm:min-h-[80px]" // Mobile-optimized textarea
            />
          </div>

          <div className="space-y-3 rounded-lg border bg-gradient-to-r from-purple-50 to-pink-50 p-3 dark:from-purple-950/20 dark:to-pink-950/20 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Coins className="h-4 w-4 text-purple-600 sm:h-5 sm:w-5" />
                <Label htmlFor="nft-toggle" className="text-sm font-medium">
                  Mint a new memory
                </Label>
              </div>
              <Switch
                id="nft-toggle"
                checked={isNFT}
                onCheckedChange={setIsNFT}
              />
            </div>

            {isNFT && (
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nft-price" className="text-sm">
                      Price (Bandcoin)
                    </Label>
                    <Input
                      id="nft-price"
                      type="number"
                      step="0.001"
                      min="0"
                      placeholder="0.1"
                      value={nftPrice}
                      onChange={(e) => setNftPrice(e.target.value)}
                      required={isNFT}
                      className="text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="royalty" className="text-sm">
                      Royalty (%)
                    </Label>
                    <Input
                      id="royalty"
                      type="number"
                      min="0"
                      max="50"
                      placeholder="10"
                      value={royaltyPercentage}
                      onChange={(e) => setRoyaltyPercentage(e.target.value)}
                      className="text-base"
                    />
                  </div>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Set your memory price and royalty percentage for future sales.
                </p>
              </div>
            )}
          </div>

          {/* File Upload */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">
                Media ({mediaItems.length}/5)
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={mediaItems.length >= 5}
                onClick={() => document.getElementById("file-upload")?.click()}
                className="text-xs sm:text-sm"
              >
                <Upload className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                Add Media
              </Button>
            </div>

            <input
              id="file-upload"
              type="file"
              multiple
              accept={config.acceptedTypes}
              onChange={handleFileUpload}
              className="hidden"
            />

            {mediaItems.length > 0 && (
              <div
                className={`grid gap-2 sm:gap-3 ${
                  mediaItems.length === 1
                    ? "grid-cols-1"
                    : mediaItems.length === 2
                      ? "grid-cols-2"
                      : "grid-cols-2 sm:grid-cols-3"
                }`}
              >
                {mediaItems.map((item) => (
                  <Card key={item.id} className="group relative">
                    <CardContent className="p-2 sm:p-3">
                      <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-muted">
                        {item.type === "image" ? (
                          <img
                            src={item.url || "/placeholder.svg"}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        ) : item.type === "video" ? (
                          <video
                            src={item.url}
                            className="h-full w-full object-cover"
                            muted
                          />
                        ) : (
                          <div className="flex flex-col items-center space-y-1 p-2 sm:space-y-2">
                            <Music className="h-6 w-6 text-muted-foreground sm:h-8 sm:w-8" />
                            <span className="w-full truncate text-center text-xs">
                              {item.name}
                            </span>
                          </div>
                        )}

                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute right-1 top-1 h-6 w-6 p-0 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100"
                          onClick={() => removeMediaItem(item.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="mt-2 hidden items-center space-x-1 sm:flex">
                        {getMediaIcon(item.type)}
                        <span className="truncate text-xs">{item.name}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {mediaItems.length === 0 && (
              <div
                className="cursor-pointer rounded-lg border-2 border-dashed border-muted-foreground/25 p-6 text-center transition-colors hover:border-muted-foreground/50 sm:p-8"
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                <Upload className="mx-auto mb-2 h-6 w-6 text-muted-foreground sm:h-8 sm:w-8" />
                <p className="text-sm text-muted-foreground">
                  Tap to upload media
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {type === "photobook"
                    ? "Images and videos"
                    : type === "audiobook"
                      ? "Audio files"
                      : "Images, videos, and audio"}{" "}
                  (Max 5 files)
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-end space-y-2 border-t pt-4 sm:flex-row sm:space-x-3 sm:space-y-0">
            <Button
              type="button"
              variant="outline"
              className="w-full bg-transparent sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                !title.trim() ||
                mediaItems.length === 0 ||
                (isNFT && !nftPrice.trim()) ||
                isLoading
              }
              className="w-full sm:w-auto"
            >
              {isLoading
                ? "Minting..."
                : `Mint ${type.charAt(0).toUpperCase() + type.slice(1)} NFT`}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
