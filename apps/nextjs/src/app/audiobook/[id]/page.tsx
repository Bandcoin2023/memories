"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Coins,
  Copy,
  Crown,
  ExternalLink,
  Headphones,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Pause,
  Play,
  Share2,
  SkipBack,
  SkipForward,
  TrendingUp,
  Volume2,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@acme/ui/avatar";
import { Badge } from "@acme/ui/badge";
import { Button } from "@acme/ui/button";
import { Card, CardContent, CardHeader } from "@acme/ui/card";
import { Slider } from "@acme/ui/slider";

import { CommentModal } from "../../_components/comment-modal";
import { Header } from "../../_components/header";
import { NFTPurchaseModal } from "../../_components/nft-purchase-modal";
import { ShareModal } from "../../_components/share-modal";

export default function AudiobookPage() {
  const params = useParams();
  const router = useRouter();
  const audiobookId = Number.parseInt(params.id as string);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(75);

  // Mock data - in real app, fetch from API
  const [audiobook] = useState({
    id: audiobookId,
    type: "audiobook",
    user: {
      name: "Mike Chen",
      username: "@mike_c",
      avatar: "/man-profile.png",
    },
    title: "Grandpa's Stories",
    description:
      "Recording of my grandfather sharing his childhood memories and life lessons. These precious stories have been passed down through generations, and I wanted to preserve them for future family members to enjoy and learn from.",
    duration: "12:34",
    totalSeconds: 754,
    likes: 18,
    comments: 5,
    timeAgo: "4 hours ago",
    liked: false,
    tags: ["family", "stories", "heritage", "memories"],
    chapters: [
      { title: "Growing Up in the Village", start: 0, duration: "3:45" },
      { title: "Meeting Grandma", start: 225, duration: "2:30" },
      { title: "War Stories", start: 375, duration: "4:15" },
      { title: "Life Lessons", start: 630, duration: "2:04" },
    ],
    isNFT: true,
    nftPrice: 0.15,
    isOwned: false,
    owner: "Md Zonaid",
    royalty: 15,
    mintDate: "2024-01-10",
    tokenId: "GS9876543210fedcbaF",
    contractAddress: "0xfedcba0987654321",
    blockchain: "BANDCOIN",
    transactionHistory: [
      {
        type: "mint",
        from: null,
        to: "mike_c",
        price: 0.15,
        date: "2024-01-10",
        txHash: "0xmintaudio123456",
      },
    ],
  });

  const handleLike = () => {
    console.log(" Liked audiobook:", audiobookId);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
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
                        src={audiobook.user.avatar || "/placeholder.svg"}
                      />
                      <AvatarFallback>
                        {audiobook.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-lg font-semibold">
                          {audiobook.user.name}
                        </h4>
                        <span className="text-sm text-muted-foreground">
                          {audiobook.user.username}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          <Coins className="mr-1 h-3 w-3" />
                          Digital Collectibles
                        </Badge>
                        {audiobook.isOwned && (
                          <Badge variant="secondary" className="text-xs">
                            <Crown className="mr-1 h-3 w-3" />
                            Owned
                          </Badge>
                        )}
                      </div>
                      <div className="mt-1 flex items-center space-x-2">
                        <Headphones className="h-3 w-3 text-secondary" />
                        <span className="text-xs text-muted-foreground">
                          Audiobook
                        </span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">
                          {audiobook.timeAgo}
                        </span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">
                          {audiobook.duration}
                        </span>
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
                      {audiobook.title}
                    </h1>
                    <p className="leading-relaxed text-muted-foreground">
                      {audiobook.description}
                    </p>
                  </div>

                  {/* Audio Player */}
                  <Card className="bg-muted/50">
                    <CardContent className="p-6">
                      <div className="mb-6 flex items-center justify-center">
                        <div className="flex h-32 w-32 items-center justify-center rounded-full bg-secondary/20">
                          <Headphones className="h-16 w-16 text-secondary" />
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-6 space-y-2">
                        <Slider
                          value={[currentTime]}
                          max={audiobook.totalSeconds}
                          step={1}
                          className="w-full"
                          onValueChange={(value) => setCurrentTime(value[0])}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{formatTime(currentTime)}</span>
                          <span>{audiobook.duration}</span>
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="mb-4 flex items-center justify-center space-x-4">
                        <Button variant="ghost" size="sm">
                          <SkipBack className="h-5 w-5" />
                        </Button>
                        <Button
                          size="lg"
                          className="h-12 w-12 rounded-full"
                          onClick={togglePlay}
                        >
                          {isPlaying ? (
                            <Pause className="h-6 w-6" />
                          ) : (
                            <Play className="h-6 w-6" />
                          )}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <SkipForward className="h-5 w-5" />
                        </Button>
                      </div>

                      {/* Volume */}
                      <div className="flex items-center space-x-2">
                        <Volume2 className="h-4 w-4 text-muted-foreground" />
                        <Slider
                          value={[volume]}
                          max={100}
                          step={1}
                          className="flex-1"
                          onValueChange={(value) => setVolume(value[0])}
                        />
                        <span className="w-8 text-xs text-muted-foreground">
                          {volume}%
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Chapters */}
                  <div>
                    <h3 className="mb-3 font-semibold">Chapters</h3>
                    <div className="space-y-2">
                      {audiobook.chapters.map((chapter, index) => (
                        <Card
                          key={index}
                          className="cursor-pointer transition-colors hover:bg-muted/50"
                        >
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">{chapter.title}</h4>
                                <p className="text-xs text-muted-foreground">
                                  Chapter {index + 1}
                                </p>
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {chapter.duration}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {audiobook.tags && (
                    <div className="flex flex-wrap gap-2">
                      {audiobook.tags.map((tag) => (
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
                        className={`flex items-center space-x-2 transition-colors ${audiobook.liked ? "text-red-500 hover:text-red-600" : "hover:text-red-500"}`}
                        onClick={handleLike}
                      >
                        <Heart
                          className={`h-5 w-5 transition-all ${audiobook.liked ? "scale-110 fill-current" : ""}`}
                        />
                        <span className="font-medium">{audiobook.likes}</span>
                      </Button>
                      <CommentModal
                        memoryId={audiobook.id}
                        initialComments={audiobook.comments}
                      >
                        <Button
                          variant="ghost"
                          size="lg"
                          className="flex items-center space-x-2 hover:text-blue-500"
                        >
                          <MessageCircle className="h-5 w-5" />
                          <span className="font-medium">
                            {audiobook.comments}
                          </span>
                        </Button>
                      </CommentModal>
                    </div>
                    <ShareModal
                      memoryTitle={audiobook.title}
                      memoryId={audiobook.id}
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
                  <span>Digital Collectibles Details</span>
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 p-4 dark:from-purple-950/20 dark:to-pink-950/20">
                  <div className="space-y-2 text-center">
                    <div className="text-2xl font-bold">
                      {audiobook.nftPrice} Bandcoin
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
                      @{audiobook.owner}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Royalty
                    </span>
                    <span className="text-sm font-medium">
                      {audiobook.royalty}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Blockchain
                    </span>
                    <span className="text-sm font-medium">
                      {audiobook.blockchain}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Minted
                    </span>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span className="text-sm">
                        {new Date(audiobook.mintDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {!audiobook.isOwned ? (
                  <NFTPurchaseModal nft={audiobook}>
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                      <Coins className="mr-2 h-4 w-4" />
                      Buy Digital Collectibles
                    </Button>
                  </NFTPurchaseModal>
                ) : (
                  <div className="rounded-lg bg-muted p-3 text-center">
                    <Crown className="mx-auto mb-2 h-6 w-6 text-purple-600" />
                    <p className="text-sm font-medium">
                      You own this Digital Collectibles
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
                      {audiobook.tokenId.slice(0, 10)}...
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(audiobook.tokenId)}
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
                      {audiobook.contractAddress.slice(0, 10)}...
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(audiobook.contractAddress)}
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
                  {audiobook.transactionHistory.map((tx, index) => (
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
