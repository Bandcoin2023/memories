"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Coins,
  Copy,
  Crown,
  ExternalLink,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Share2,
  TrendingUp,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@acme/ui/avatar";
import { Badge } from "@acme/ui/badge";
import { Button } from "@acme/ui/button";
import { Card, CardContent, CardHeader } from "@acme/ui/card";

import { CommentModal } from "../../_components/comment-modal";
import { Header } from "../../_components/header";
import { NFTPurchaseModal } from "../../_components/nft-purchase-modal";
import PhotoFlipBook from "../../_components/photo-flip-book";
import { ShareModal } from "../../_components/share-modal";

export default function PhotobookPage() {
  const params = useParams();
  const router = useRouter();
  const photobookId = Number.parseInt(params.id as string);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Mock data - in real app, fetch from API
  const [photobook] = useState({
    id: photobookId,
    type: "photobook",
    user: {
      name: "Sarah Johnson",
      username: "@sarah_j",
      avatar: "/woman-profile.png",
    },
    title: "Summer Vacation 2024",
    description:
      "Amazing memories from our trip to the mountains. We spent two weeks exploring the beautiful landscapes, hiking through scenic trails, and creating unforgettable memories with family and friends.",
    images: [
      "/majestic-mountain-vista.png",
      "/vibrant-college-campus.png",
      "/casual-man.png",
      "/woman-profile.png",
      "/diverse-woman-smiling.png",
    ],
    likes: 24,
    comments: 8,
    timeAgo: "2 hours ago",
    liked: false,
    tags: ["vacation", "mountains", "family", "adventure"],
    location: "Rocky Mountains, Colorado",
    isNFT: true,
    nftPrice: 0.25,
    isOwned: false,
    owner: "sarah_j",
    royalty: 10,
    mintDate: "2024-01-12",
    tokenId: "0xabcdef1234567890",
    contractAddress: "0x1234567890abcdef",
    blockchain: "BANDCOIN",
    transactionHistory: [
      {
        type: "mint",
        from: null,
        to: "sarah_j",
        price: 0.25,
        date: "2024-01-12",
        txHash: "0xmint987654321",
      },
    ],
  });

  const handleLike = () => {
    console.log(" Liked photobook:", photobookId);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % photobook.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + photobook.images.length) % photobook.images.length,
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="supports-[backdrop-filter]:bg-card/600 sticky top-0 z-50 hidden w-full border-b bg-card/95 backdrop-blur md:block">
        <Header />
      </div>
      <main className="mx-auto max-w-6xl space-y-6 p-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={photobook.user.avatar || "/placeholder.svg"}
                      />
                      <AvatarFallback>
                        {photobook.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-lg font-semibold">
                          {photobook.user.name}
                        </h4>
                        <span className="text-sm text-muted-foreground">
                          {photobook.user.username}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          <Coins className="mr-1 h-3 w-3" />
                          Memory
                        </Badge>
                        {photobook.isOwned && (
                          <Badge variant="secondary" className="text-xs">
                            <Crown className="mr-1 h-3 w-3" />
                            Owned
                          </Badge>
                        )}
                      </div>
                      <div className="mt-1 flex items-center space-x-2">
                        <BookOpen className="h-3 w-3 text-primary" />
                        <span className="text-xs text-muted-foreground">
                          Photobook
                        </span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">
                          {photobook.timeAgo}
                        </span>
                        {photobook.location && (
                          <>
                            <span className="text-xs text-muted-foreground">
                              •
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {photobook.location}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-6">
                  <div>
                    <h1 className="mb-3 text-2xl font-bold">
                      {photobook.title}
                    </h1>
                    <p className="leading-relaxed text-muted-foreground">
                      {photobook.description}
                    </p>
                  </div>

                  {/* Image Gallery */}
                  <div className=" ">
                    <PhotoFlipBook
                      images={photobook.images}
                      title={photobook.title}
                      subtitle={`${photobook.user.name}'s Photo Album`}
                      coverImage="/images/baby-walking.png"
                    />
                  </div>

                  {photobook.tags && (
                    <div className="flex flex-wrap gap-2">
                      {photobook.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between border-t pt-4">
                    <div className="flex space-x-6">
                      <Button
                        variant="ghost"
                        size="lg"
                        className={`flex items-center space-x-2 transition-colors ${photobook.liked ? "text-red-500 hover:text-red-600" : "hover:text-red-500"}`}
                        onClick={handleLike}
                      >
                        <Heart
                          className={`h-5 w-5 transition-all ${photobook.liked ? "scale-110 fill-current" : ""}`}
                        />
                        <span className="font-medium">{photobook.likes}</span>
                      </Button>
                      <CommentModal
                        memoryId={photobook.id}
                        initialComments={photobook.comments}
                      >
                        <Button
                          variant="ghost"
                          size="lg"
                          className="flex items-center space-x-2 hover:text-blue-500"
                        >
                          <MessageCircle className="h-5 w-5" />
                          <span className="font-medium">
                            {photobook.comments}
                          </span>
                        </Button>
                      </CommentModal>
                    </div>
                    <ShareModal
                      memoryTitle={photobook.title}
                      memoryId={photobook.id}
                    >
                      <Button
                        variant="ghost"
                        size="lg"
                        className="hover:text-green-500"
                      >
                        <Share2 className="h-5 w-5" />
                      </Button>
                    </ShareModal>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h3 className="flex items-center space-x-2 font-semibold">
                  <Coins className="h-5 w-5 text-purple-600" />
                  <span>Memory Details</span>
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 p-4 dark:from-purple-950/20 dark:to-pink-950/20">
                  <div className="space-y-2 text-center">
                    <div className="text-2xl font-bold">
                      {photobook.nftPrice} Bandcoin
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Current Price
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Owner</span>
                    <span className="text-sm font-medium">
                      @{photobook.owner}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Royalty
                    </span>
                    <span className="text-sm font-medium">
                      {photobook.royalty}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Blockchain
                    </span>
                    <span className="text-sm font-medium">
                      {photobook.blockchain}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Minted
                    </span>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span className="text-sm">
                        {new Date(photobook.mintDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {!photobook.isOwned ? (
                  <NFTPurchaseModal nft={photobook}>
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                      <Coins className="mr-2 h-4 w-4" />
                      Buy Digital Collectibles
                    </Button>
                  </NFTPurchaseModal>
                ) : (
                  <div className="rounded-lg bg-muted p-3 text-center">
                    <Crown className="mx-auto mb-2 h-6 w-6 text-purple-600" />
                    <p className="text-sm font-medium">
                      You own this collectible
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="font-semibold">Blockchain Details</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="mb-1 text-sm text-muted-foreground">
                    Token ID
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm">
                      {photobook.tokenId.slice(0, 10)}...
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(photobook.tokenId)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div>
                  <div className="mb-1 text-sm text-muted-foreground">
                    Contract Address
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm">
                      {photobook.contractAddress.slice(0, 10)}...
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(photobook.contractAddress)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="font-semibold">Transaction History</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {photobook.transactionHistory.map((tx, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg bg-muted p-3"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                          {tx.type === "mint" ? (
                            <Coins className="h-4 w-4 text-primary" />
                          ) : (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium capitalize">
                            {tx.type}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {tx.type === "mint"
                              ? `Minted by @${tx.to}`
                              : `@${tx.from} → @${tx.to}`}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {tx.price} Bandcoin
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(tx.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
