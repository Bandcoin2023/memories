"use client";

import type React from "react";
import { useState } from "react";
import { Heart, MessageCircle, Send } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@acme/ui/avatar";
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

interface Comment {
  id: number;
  user: { name: string; username: string; avatar: string };
  text: string;
  timeAgo: string;
  likes: number;
  liked: boolean;
}

interface CommentModalProps {
  memoryId: number;
  initialComments: number;
  children: React.ReactNode;
}

export function CommentModal({
  memoryId,
  initialComments,
  children,
}: CommentModalProps) {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      user: {
        name: "Alice Cooper",
        username: "@alice_c",
        avatar: "/woman-profile.png",
      },
      text: "This looks amazing! Such beautiful memories.",
      timeAgo: "2h",
      likes: 3,
      liked: false,
    },
    {
      id: 2,
      user: {
        name: "Bob Wilson",
        username: "@bob_w",
        avatar: "/man-profile.png",
      },
      text: "Love this! Brings back so many memories of my own trips.",
      timeAgo: "1h",
      likes: 1,
      liked: true,
    },
  ]);
  const [newComment, setNewComment] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    setIsPosting(true);
    // Simulate API call
    setTimeout(() => {
      const comment: Comment = {
        id: comments.length + 1,
        user: {
          name: "John Doe",
          username: "@johndoe",
          avatar: "/user-profile-illustration.png",
        },
        text: newComment,
        timeAgo: "now",
        likes: 0,
        liked: false,
      };
      setComments((prev) => [...prev, comment]);
      setNewComment("");
      setIsPosting(false);
    }, 500);
  };

  const handleLikeComment = (commentId: number) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              liked: !comment.liked,
              likes: comment.liked ? comment.likes - 1 : comment.likes + 1,
            }
          : comment,
      ),
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex max-h-[80vh] flex-col overflow-hidden sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <span>Comments ({comments.length})</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 space-y-4 overflow-y-auto pr-2">
          {comments.map((comment) => (
            <Card key={comment.id}>
              <CardContent className="p-4">
                <div className="flex space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={comment.user.avatar || "/placeholder.svg"}
                    />
                    <AvatarFallback>
                      {comment.user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="mb-1 flex items-center space-x-2">
                      <span className="text-sm font-semibold">
                        {comment.user.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {comment.user.username}
                      </span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">
                        {comment.timeAgo}
                      </span>
                    </div>
                    <p className="mb-2 text-sm">{comment.text}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`h-6 px-2 ${comment.liked ? "text-red-500" : ""}`}
                      onClick={() => handleLikeComment(comment.id)}
                    >
                      <Heart
                        className={`mr-1 h-3 w-3 ${comment.liked ? "fill-current" : ""}`}
                      />
                      <span className="text-xs">{comment.likes}</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex space-x-2 border-t pt-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/user-profile-illustration.png" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="flex flex-1 space-x-2">
            <Input
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddComment()}
            />
            <Button
              size="sm"
              onClick={handleAddComment}
              disabled={!newComment.trim() || isPosting}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
