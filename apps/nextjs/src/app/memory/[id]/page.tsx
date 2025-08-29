"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Camera,
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
import { ShareModal } from "../../_components/share-modal";

export default function MemoryPage() {
  const params = useParams();
  const router = useRouter();
  const memoryId = Number.parseInt(params.id as string);

  // Mock data - in real app, fetch from API
  const [memory] = useState({
    id: memoryId,
    type: "memory",
    user: {
      name: "Emma Wilson",
      username: "@emma_w",
      avatar: "/diverse-woman-smiling.png",
    },
    title: "First Day at College",
    description:
      "Nervous but excited for this new chapter! This was such an important moment in my life. I remember waking up early, choosing the perfect outfit, and feeling a mix of excitement and anxiety. The campus looked so beautiful in the morning light, and I knew this was the beginning of something amazing.",
    image: "/vibrant-college-campus.png",
    likes: 42,
    comments: 12,
    timeAgo: "6 hours ago",
    liked: true,
    tags: ["college", "milestone", "education", "newbeginnings"],
    location: "Stanford University",
    isNFT: true,
    nftPrice: 0.08,
    isOwned: true,
    owner: "johndoe",
    royalty: 12,
    mintDate: "2024-01-15",
    tokenId: "0x1234567890abcdef",
    contractAddress: "0xabcdef1234567890",
    blockchain: "BANDCOIN",
    transactionHistory: [
      {
        type: "mint",
        from: null,
        to: "emma_w",
        price: 0.08,
        date: "2024-01-15",
        txHash: "0xmint123456789",
      },
      {
        type: "sale",
        from: "emma_w",
        to: "johndoe",
        price: 0.08,
        date: "2024-01-16",
        txHash: "0xsale123456789",
      },
    ],
  });

  const handleLike = () => {
    console.log(" Liked memory:", memoryId);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="supports-[backdrop-filter]:bg-card/600 sticky top-0 z-50 hidden w-full border-b bg-card/95 backdrop-blur md:block">
        <Header />
      </div>
      <main className="mx-auto max-w-4xl space-y-6 p-4">
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
                        src={memory.user.avatar || "/placeholder.svg"}
                      />
                      <AvatarFallback>
                        {memory.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-lg font-semibold">
                          {memory.user.name}
                        </h4>
                        <span className="text-sm text-muted-foreground">
                          {memory.user.username}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          <Coins className="mr-1 h-3 w-3" />
                          Collectible
                        </Badge>
                        {memory.isOwned && (
                          <Badge variant="secondary" className="text-xs">
                            <Crown className="mr-1 h-3 w-3" />
                            Owned
                          </Badge>
                        )}
                      </div>
                      <div className="mt-1 flex items-center space-x-2">
                        <Camera className="h-3 w-3 text-accent" />
                        <span className="text-xs text-muted-foreground">
                          Memory
                        </span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">
                          {memory.timeAgo}
                        </span>
                        {memory.location && (
                          <>
                            <span className="text-xs text-muted-foreground">
                              •
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {memory.location}
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
                    <h1 className="mb-3 text-2xl font-bold">{memory.title}</h1>
                    <p className="leading-relaxed text-muted-foreground">
                      {memory.description}
                    </p>
                  </div>

                  {memory.image && (
                    <div className="overflow-hidden rounded-lg">
                      <img
                        src={memory.image || "/placeholder.svg"}
                        alt={memory.title}
                        className="h-96 w-full object-cover"
                      />
                    </div>
                  )}

                  {memory.tags && (
                    <div className="flex flex-wrap gap-2">
                      {memory.tags.map((tag) => (
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
                        className={`flex items-center space-x-2 transition-colors ${memory.liked ? "text-red-500 hover:text-red-600" : "hover:text-red-500"}`}
                        onClick={handleLike}
                      >
                        <Heart
                          className={`h-5 w-5 transition-all ${memory.liked ? "scale-110 fill-current" : ""}`}
                        />
                        <span className="font-medium">{memory.likes}</span>
                      </Button>
                      <CommentModal
                        memoryId={memory.id}
                        initialComments={memory.comments}
                      >
                        <Button
                          variant="ghost"
                          size="lg"
                          className="flex items-center space-x-2 hover:text-blue-500"
                        >
                          <MessageCircle className="h-5 w-5" />
                          <span className="font-medium">{memory.comments}</span>
                        </Button>
                      </CommentModal>
                    </div>
                    <ShareModal memoryTitle={memory.title} memoryId={memory.id}>
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

          {/* NFT Details Sidebar */}
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
                      {memory.nftPrice} Bandcoin
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Current Price
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Owner</span>
                    <span className="text-sm font-medium">@{memory.owner}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Royalty
                    </span>
                    <span className="text-sm font-medium">
                      {memory.royalty}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Blockchain
                    </span>
                    <span className="text-sm font-medium">
                      {memory.blockchain}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Minted
                    </span>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span className="text-sm">
                        {new Date(memory.mintDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {!memory.isOwned ? (
                  <NFTPurchaseModal nft={memory}>
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                      <Coins className="mr-2 h-4 w-4" />
                      Buy Memory
                    </Button>
                  </NFTPurchaseModal>
                ) : (
                  <div className="rounded-lg bg-muted p-3 text-center">
                    <Crown className="mx-auto mb-2 h-6 w-6 text-purple-600" />
                    <p className="text-sm font-medium">
                      You own this collectble
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
                      {memory.tokenId.slice(0, 10)}...
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(memory.tokenId)}
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
                      {memory.contractAddress.slice(0, 10)}...
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(memory.contractAddress)}
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
                  {memory.transactionHistory.map((tx, index) => (
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
