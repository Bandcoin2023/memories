"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Camera,
  Coins,
  Crown,
  Headphones,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Plus,
  Send,
  Share2,
  ShoppingCart,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@acme/ui/avatar";
import { Badge } from "@acme/ui/badge";
import { Button } from "@acme/ui/button";
import { Card, CardContent, CardHeader } from "@acme/ui/card";
import { Textarea } from "@acme/ui/textarea";

import { CreateContentModal } from "./create-content-modal";
import { FeedSkeleton, PostSkeleton } from "./loading-skeleton";
import { NFTPurchaseModal } from "./nft-purchase-modal";
import { ShareModal } from "./share-modal";

interface MainFeedProps {
  activeTab?: string;
  searchQuery?: string;
}

const mockComments = {
  1: [
    {
      id: 1,
      user: "Alex",
      avatar: "/man-profile.png",
      text: "Amazing photos! The mountains look incredible.",
      timeAgo: "1h",
    },
    {
      id: 2,
      user: "Lisa",
      avatar: "/woman-profile.png",
      text: "I wish I was there with you!",
      timeAgo: "45m",
    },
    {
      id: 3,
      user: "Tom",
      avatar: "/man-profile.png",
      text: "Great composition in these shots",
      timeAgo: "30m",
    },
    {
      id: 4,
      user: "Maria",
      avatar: "/woman-profile.png",
      text: "This makes me want to plan a trip",
      timeAgo: "20m",
    },
    {
      id: 5,
      user: "Jake",
      avatar: "/man-profile.png",
      text: "Beautiful memories captured!",
      timeAgo: "15m",
    },
    {
      id: 6,
      user: "Sophie",
      avatar: "/woman-profile.png",
      text: "The sunset in the third photo is stunning",
      timeAgo: "10m",
    },
    {
      id: 7,
      user: "Chris",
      avatar: "/man-profile.png",
      text: "Thanks for sharing these amazing moments",
      timeAgo: "5m",
    },
  ],
  2: [
    {
      id: 1,
      user: "Emma",
      avatar: "/woman-profile.png",
      text: "Such precious memories! Your grandfather sounds wonderful.",
      timeAgo: "2h",
    },
    {
      id: 2,
      user: "David",
      avatar: "/man-profile.png",
      text: "These family stories are so important to preserve",
      timeAgo: "1h",
    },
    {
      id: 3,
      user: "Anna",
      avatar: "/woman-profile.png",
      text: "I'm getting emotional just thinking about this",
      timeAgo: "45m",
    },
    {
      id: 4,
      user: "Mark",
      avatar: "/man-profile.png",
      text: "What a beautiful way to honor his memory",
      timeAgo: "30m",
    },
    {
      id: 5,
      user: "Sarah",
      avatar: "/woman-profile.png",
      text: "This is exactly why I love this platform",
      timeAgo: "15m",
    },
  ],
  3: [
    {
      id: 1,
      user: "Ryan",
      avatar: "/man-profile.png",
      text: "Congratulations on starting college! You've got this!",
      timeAgo: "3h",
    },
    {
      id: 2,
      user: "Mia",
      avatar: "/woman-profile.png",
      text: "College is going to be amazing! Enjoy every moment",
      timeAgo: "2h",
    },
    {
      id: 3,
      user: "Ben",
      avatar: "/man-profile.png",
      text: "The campus looks beautiful! What are you studying?",
      timeAgo: "1h",
    },
  ],
};

export function MainFeed({
  activeTab = "home",
  searchQuery = "",
}: MainFeedProps) {
  const [postText, setPostText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const [expandedComments, setExpandedComments] = useState<
    Record<number, boolean>
  >({});
  const [newCommentText, setNewCommentText] = useState<Record<number, string>>(
    {},
  );
  const [memories, setMemories] = useState([
    {
      id: 1,
      type: "photobook",
      user: {
        name: "Sarah Johnson",
        username: "@sarah_j",
        avatar: "/woman-profile.png",
      },
      title: "Summer Vacation 2024",
      description: "Amazing memories from our trip to the mountains",
      image: "/majestic-mountain-vista.png",
      likes: 24,
      comments: 7,
      timeAgo: "2 hours ago",
      liked: false,
      isNFT: true,
      nftPrice: 0.25,
      isOwned: false,
      owner: "sarah_j",
      royalty: 10,
    },
    {
      id: 2,
      type: "audiobook",
      user: {
        name: "Mike Chen",
        username: "@mike_c",
        avatar: "/man-profile.png",
      },
      title: "Grandpa's Stories",
      description: "Recording of my grandfather sharing his childhood memories",
      duration: "12:34",
      likes: 18,
      comments: 5,
      timeAgo: "4 hours ago",
      liked: false,
      isNFT: true,
      nftPrice: 0.15,
      isOwned: false,
      owner: "mike_c",
      royalty: 15,
    },
    {
      id: 3,
      type: "memory",
      user: {
        name: "Emma Wilson",
        username: "@emma_w",
        avatar: "/diverse-woman-smiling.png",
      },
      title: "First Day at College",
      description: "Nervous but excited for this new chapter!",
      image: "/vibrant-college-campus.png",
      likes: 42,
      comments: 3,
      timeAgo: "6 hours ago",
      liked: true,
      isNFT: true,
      nftPrice: 0.08,
      isOwned: true,
      owner: "johndoe",
      royalty: 12,
    },
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const filteredMemories = memories.filter((memory) => {
    const matchesTab = activeTab === "home" || memory.type === activeTab;
    const matchesSearch =
      searchQuery === "" ||
      memory.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      memory.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      memory.user.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleLike = (memoryId: number) => {
    setMemories((prev) =>
      prev.map((memory) =>
        memory.id === memoryId
          ? {
              ...memory,
              liked: !memory.liked,
              likes: memory.liked ? memory.likes - 1 : memory.likes + 1,
            }
          : memory,
      ),
    );
  };

  const handlePurchaseNFT = (memoryId: number) => {
    console.log(" Opening purchase modal for NFT:", memoryId);
  };

  const handleShareMemory = async () => {
    if (!postText.trim()) return;

    setIsPosting(true);
    setTimeout(() => {
      const newMemory = {
        id: memories.length + 1,
        type: "memory" as const,
        user: {
          name: "John Doe",
          username: "@johndoe",
          avatar: "/user-profile-illustration.png",
        },
        title: "Quick Memory",
        description: postText,
        image: null,
        likes: 0,
        comments: 0,
        timeAgo: "Just now",
        liked: false,
        isNFT: true,
        nftPrice: 0.05,
        isOwned: true,
        owner: "johndoe",
        royalty: 10,
      };
      setMemories((prev) => [newMemory, ...prev]);
      setPostText("");
      setIsPosting(false);
      console.log(" Posted memory:", newMemory);
    }, 1000);
  };

  const toggleComments = (memoryId: number) => {
    setExpandedComments((prev) => ({
      ...prev,
      [memoryId]: !prev[memoryId],
    }));
  };

  const handleAddComment = (memoryId: number) => {
    const commentText = newCommentText[memoryId]?.trim();
    if (!commentText) return;

    // Update comment count
    setMemories((prev) =>
      prev.map((memory) =>
        memory.id === memoryId
          ? { ...memory, comments: memory.comments + 1 }
          : memory,
      ),
    );

    // Clear comment text
    setNewCommentText((prev) => ({
      ...prev,
      [memoryId]: "",
    }));

    console.log(" Added comment to memory:", memoryId, commentText);
  };

  const getCommentsToShow = (memoryId: number) => {
    const comments = mockComments[memoryId as keyof typeof mockComments] || [];
    const isExpanded = expandedComments[memoryId];

    if (isExpanded) {
      return comments.slice(0, 5);
    } else {
      return comments.slice(0, 1);
    }
  };

  const getMemoryRoute = (memory: any) => {
    switch (memory.type) {
      case "photobook":
        return `/photobook/${memory.id}`;
      case "audiobook":
        return `/audiobook/${memory.id}`;
      case "memory":
        return `/memory/${memory.id}`;
      default:
        return `/memory/${memory.id}`;
    }
  };

  if (isLoading) {
    return (
      <main className="mx-auto max-w-2xl flex-1 space-y-4 p-2 md:space-y-6 md:p-4">
        <PostSkeleton />
        <FeedSkeleton />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl flex-1 space-y-4 p-2 md:space-y-6 md:p-4">
      <div className="fixed bottom-20 right-4 z-20 md:hidden">
        <CreateContentModal type="memory">
          <Button
            size="lg"
            className="h-14 w-14 rounded-full bg-gradient-to-r from-red-500 to-amber-500 shadow-lg hover:from-red-600 hover:to-amber-600"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </CreateContentModal>
      </div>

      {/* What's on your mind - Desktop only */}
      <div className="hidden md:block">
        <Card className="p-2">
          <CardContent className="p-4">
            <div className="flex space-x-3">
              <Avatar>
                <AvatarImage src="/user-profile-illustration.png" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-3">
                <Textarea
                  placeholder="What's on your mind? Share a memory..."
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  className="min-h-[80px] resize-none"
                />
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <CreateContentModal type="memory">
                      <Button variant="outline" size="sm">
                        <Camera className="mr-2 h-4 w-4" />
                        Photo
                      </Button>
                    </CreateContentModal>
                    <CreateContentModal type="photobook">
                      <Button variant="outline" size="sm">
                        <BookOpen className="mr-2 h-4 w-4" />
                        Photobook
                      </Button>
                    </CreateContentModal>
                    <CreateContentModal type="audiobook">
                      <Button variant="outline" size="sm">
                        <Headphones className="mr-2 h-4 w-4" />
                        Audio
                      </Button>
                    </CreateContentModal>
                  </div>
                  <Button
                    disabled={!postText.trim() || isPosting}
                    onClick={handleShareMemory}
                  >
                    {isPosting ? "Minting..." : "Mint & Share"}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feed */}
      <div className="space-y-3 md:space-y-4">
        {filteredMemories.length === 0 ? (
          <Card className="p-2">
            <CardContent className="p-6 text-center md:p-8">
              <p className="text-muted-foreground">
                {searchQuery
                  ? `No memories found for "${searchQuery}"`
                  : `No ${activeTab} memories found`}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredMemories.map((memory) => (
            <Card key={memory.id} className="overflow-hidden p-2">
              <CardHeader className="p-3 pb-3 md:p-6 md:pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <Avatar className="h-8 w-8 md:h-10 md:w-10">
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
                      <div className="flex items-center space-x-1 md:space-x-2">
                        <h4 className="text-sm font-semibold md:text-base">
                          {memory.user.name}
                        </h4>
                        <span className="hidden text-xs text-muted-foreground sm:inline md:text-sm">
                          {memory.user.username}
                        </span>
                        <span className="hidden text-xs text-muted-foreground sm:inline md:text-sm">
                          •
                        </span>
                        <span className="text-xs text-muted-foreground md:text-sm">
                          {memory.timeAgo}
                        </span>
                        {memory.isOwned && (
                          <Badge variant="secondary" className="text-xs">
                            <Crown className="mr-1 h-3 w-3" />
                            <span className="hidden sm:inline">Owned</span>
                          </Badge>
                        )}
                      </div>
                      <div className="mt-1 flex items-center space-x-1">
                        {memory.type === "photobook" && (
                          <BookOpen className="h-3 w-3 text-primary" />
                        )}
                        {memory.type === "audiobook" && (
                          <Headphones className="h-3 w-3 text-secondary" />
                        )}
                        {memory.type === "memory" && (
                          <Camera className="h-3 w-3 text-accent" />
                        )}
                        <span className="text-xs capitalize text-muted-foreground">
                          {memory.type}
                        </span>
                        <Badge variant="outline" className="ml-2 text-xs">
                          <Coins className="mr-1 h-3 w-3" />
                          NFT
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
                <div className="space-y-3">
                  <Link
                    href={getMemoryRoute(memory)}
                    className="block cursor-pointer transition-opacity hover:opacity-95"
                  >
                    <div>
                      <h3 className="text-base font-semibold md:text-lg">
                        {memory.title}
                      </h3>
                      <p className="text-sm text-muted-foreground md:text-base">
                        {memory.description}
                      </p>
                    </div>

                    {memory.image && (
                      <div className="mt-3 overflow-hidden rounded-lg">
                        <img
                          src={memory.image || "/placeholder.svg"}
                          alt={memory.title}
                          className="h-48 w-full object-cover md:h-64"
                        />
                      </div>
                    )}

                    {memory.type === "audiobook" && (
                      <div className="mt-3 flex items-center space-x-3 rounded-lg bg-muted p-3 md:p-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/20 md:h-12 md:w-12">
                          <Headphones className="h-5 w-5 text-secondary md:h-6 md:w-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium md:text-base">
                              Audio Recording
                            </span>
                            <span className="text-xs text-muted-foreground md:text-sm">
                              {memory.duration}
                            </span>
                          </div>
                          <div className="mt-2 h-2 w-full rounded-full bg-border">
                            <div className="h-2 w-1/3 rounded-full bg-secondary"></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </Link>

                  <div className="rounded-lg border bg-gradient-to-r from-purple-50 to-pink-50 p-3 dark:from-purple-950/20 dark:to-pink-950/20 md:p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 md:space-x-3">
                        <div className="flex items-center space-x-2">
                          <Coins className="h-4 w-4 text-purple-600 md:h-5 md:w-5" />
                          <div>
                            <div className="text-base font-semibold md:text-lg">
                              {memory.nftPrice} Bandcoin
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {memory.royalty}% royalty •{" "}
                              <span className="hidden sm:inline">
                                Owner: @{memory.owner}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {!memory.isOwned ? (
                        <NFTPurchaseModal nft={memory}>
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                          >
                            <ShoppingCart className="mr-1 h-4 w-4 md:mr-2" />
                            <span className="hidden sm:inline">Buy Memory</span>
                            <span className="sm:hidden">Buy</span>
                          </Button>
                        </NFTPurchaseModal>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="px-2 py-1 md:px-3"
                        >
                          <Crown className="mr-1 h-3 w-3" />
                          <span className="hidden sm:inline">You own this</span>
                          <span className="sm:hidden">Owned</span>
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t pt-3 md:mt-4 md:pt-4">
                    <div className="flex space-x-3 md:space-x-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`flex items-center space-x-1 transition-colors md:space-x-2 ${memory.liked ? "text-red-500 hover:text-red-600" : "hover:text-red-500"}`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleLike(memory.id);
                        }}
                      >
                        <Heart
                          className={`h-4 w-4 transition-all ${memory.liked ? "scale-110 fill-current" : ""}`}
                        />
                        <span className="text-sm">{memory.likes}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center space-x-1 hover:text-blue-500 md:space-x-2"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleComments(memory.id);
                        }}
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span className="text-sm">{memory.comments}</span>
                      </Button>
                    </div>
                    <ShareModal memoryTitle={memory.title} memoryId={memory.id}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:text-green-500"
                        onClick={(e) => e.preventDefault()}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </ShareModal>
                  </div>

                  <div className="mt-3 space-y-3 md:mt-4">
                    {getCommentsToShow(memory.id).map((comment) => (
                      <div
                        key={comment.id}
                        className="flex space-x-2 md:space-x-3"
                      >
                        <Avatar className="h-7 w-7 md:h-8 md:w-8">
                          <AvatarImage
                            src={comment.avatar || "/placeholder.svg"}
                          />
                          <AvatarFallback>{comment.user[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="rounded-lg bg-muted px-2 py-2 md:px-3">
                            <div className="mb-1 flex items-center space-x-2">
                              <span className="text-xs font-medium md:text-sm">
                                {comment.user}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {comment.timeAgo}
                              </span>
                            </div>
                            <p className="text-xs md:text-sm">{comment.text}</p>
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="flex items-center space-x-2 text-sm">
                      {!expandedComments[memory.id] &&
                        (mockComments[memory.id as keyof typeof mockComments]
                          ?.length || 0) > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 text-xs text-blue-500 hover:text-blue-600 md:text-sm"
                            onClick={() => toggleComments(memory.id)}
                          >
                            View{" "}
                            {Math.min(
                              4,
                              (mockComments[
                                memory.id as keyof typeof mockComments
                              ]?.length || 0) - 1,
                            )}{" "}
                            more comments
                          </Button>
                        )}

                      {expandedComments[memory.id] &&
                        (mockComments[memory.id as keyof typeof mockComments]
                          ?.length || 0) > 5 && (
                          <Link
                            href={getMemoryRoute(memory)}
                            className="text-xs text-blue-500 hover:text-blue-600 md:text-sm"
                          >
                            View all{" "}
                            {
                              mockComments[
                                memory.id as keyof typeof mockComments
                              ]?.length
                            }{" "}
                            comments
                          </Link>
                        )}
                    </div>

                    <div className="flex space-x-2 md:space-x-3">
                      <Avatar className="h-7 w-7 md:h-8 md:w-8">
                        <AvatarImage src="/user-profile-illustration.png" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-1 space-x-2">
                        <Textarea
                          placeholder="Write a comment..."
                          value={newCommentText[memory.id] || ""}
                          onChange={(e) =>
                            setNewCommentText((prev) => ({
                              ...prev,
                              [memory.id]: e.target.value,
                            }))
                          }
                          className="min-h-[36px] resize-none text-sm md:min-h-[40px]"
                        />
                        <Button
                          size="sm"
                          disabled={!newCommentText[memory.id]?.trim()}
                          onClick={() => handleAddComment(memory.id)}
                        >
                          <Send className="h-3 w-3 md:h-4 md:w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </main>
  );
}
