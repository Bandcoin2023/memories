"use client";

import { TrendingUp, Users } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@acme/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@acme/ui/card";

export function RightSidebar() {
  const topMemories = [
    {
      id: 1,
      title: "Wedding Day Bliss",
      user: "Alice Cooper",
      likes: 156,
      image: "/romantic-outdoor-wedding.png",
    },
    {
      id: 2,
      title: "Baby's First Steps",
      user: "Tom Wilson",
      likes: 134,
      image: "/baby-walking.png",
    },
    {
      id: 3,
      title: "Graduation Ceremony",
      user: "Lisa Park",
      likes: 98,
      image: "/graduation-cap.png",
    },
  ];

  const activeUsers = [
    {
      name: "Sarah Johnson",
      username: "@sarah_j",
      avatar: "/woman-profile.png",
      status: "online",
    },
    {
      name: "Mike Chen",
      username: "@mike_c",
      avatar: "/man-profile.png",
      status: "online",
    },
    {
      name: "Emma Wilson",
      username: "@emma_w",
      avatar: "/diverse-woman-smiling.png",
      status: "away",
    },
    {
      name: "David Brown",
      username: "@david_b",
      avatar: "/casual-man.png",
      status: "online",
    },
  ];

  return (
    <aside className="fixed right-0 top-16 z-10 h-[calc(100vh-64px)] w-80 space-y-6 overflow-y-auto p-4">
      {/* Top Memories */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span>Top Memories</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {topMemories.map((memory) => (
            <div
              key={memory.id}
              className="flex cursor-pointer items-center space-x-3 rounded-lg p-2 hover:bg-muted/50"
            >
              <img
                src={memory.image || "/placeholder.svg"}
                alt={memory.title}
                className="h-12 w-12 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <h4 className="truncate text-sm font-medium">{memory.title}</h4>
                <p className="text-xs text-muted-foreground">
                  by {memory.user}
                </p>
                <p className="text-xs text-muted-foreground">
                  {memory.likes} likes
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Active Users */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Users className="h-5 w-5 text-secondary" />
            <span>Active Now</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {activeUsers.map((user, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="relative">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background ${
                    user.status === "online" ? "bg-green-500" : "bg-yellow-500"
                  }`}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.username}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </aside>
  );
}
