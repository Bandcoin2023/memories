"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Camera,
  Coins,
  Crown,
  Edit,
  Headphones,
  Heart,
  MessageCircle,
  Save,
  Settings,
  TrendingUp,
  Users,
  X,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@acme/ui/avatar";
import { Badge } from "@acme/ui/badge";
import { Button } from "@acme/ui/button";
import { Card, CardContent, CardHeader } from "@acme/ui/card";
import { Input } from "@acme/ui/input";
import { Label } from "@acme/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@acme/ui/tabs";
import { Textarea } from "@acme/ui/textarea";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("collection");
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    username: "@johndoe",
    bio: "Securing memories since 2024. Sharing life's precious moments through digital collectibles.",
    location: "San Francisco, CA",
    website: "johndoe.com",
    joinDate: "January 2024",
  });

  const stats = {
    memories: 12,
    followers: 1247,
    following: 892,
    totalEarnings: 2.45,
    totalLikes: 3421,
  };

  const ownedNFTs = [
    {
      id: 1,
      type: "photobook",
      title: "Summer Vacation 2024",
      image: "/majestic-mountain-vista.png",
      price: 0.25,
      likes: 24,
      comments: 8,
      isOwned: true,
    },
    {
      id: 3,
      type: "memory",
      title: "First Day at College",
      image: "/vibrant-college-campus.png",
      price: 0.08,
      likes: 42,
      comments: 12,
      isOwned: true,
    },
    {
      id: 4,
      type: "audiobook",
      title: "Childhood Stories",
      duration: "8:45",
      price: 0.12,
      likes: 18,
      comments: 6,
      isOwned: true,
    },
  ];

  const createdNFTs = [
    {
      id: 5,
      type: "memory",
      title: "Quick Memory",
      description: "Just shared this moment",
      price: 0.05,
      likes: 3,
      comments: 1,
      timeAgo: "2 hours ago",
    },
    {
      id: 6,
      type: "photobook",
      title: "Weekend Adventures",
      image: "/joyful-wedding-celebration.png",
      price: 0.18,
      likes: 15,
      comments: 4,
      timeAgo: "1 day ago",
    },
  ];

  const handleSaveProfile = () => {
    setIsEditing(false);
    console.log(" Profile updated:", profileData);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "photobook":
        return <BookOpen className="h-4 w-4" />;
      case "audiobook":
        return <Headphones className="h-4 w-4" />;
      case "memory":
        return <Camera className="h-4 w-4" />;
      default:
        return <Camera className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              </Link>
              <h1 className="text-2xl font-bold">Profile</h1>
            </div>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl p-4 pb-20 md:pb-4">
        <div className="space-y-6">
          {/* Profile Header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-start space-y-4 md:flex-row md:items-center md:space-x-6 md:space-y-0">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="/user-profile-illustration.png" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex-1 space-y-4">
                  {!isEditing ? (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <h2 className="text-2xl font-bold">
                          {profileData.name}
                        </h2>
                        <Badge variant="secondary" className="text-xs">
                          <Crown className="mr-1 h-3 w-3" />
                          Creator
                        </Badge>
                      </div>
                      <p className="text-muted-foreground">
                        {profileData.username}
                      </p>
                      <p className="text-sm">{profileData.bio}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span>📍 {profileData.location}</span>
                        <span>🌐 {profileData.website}</span>
                        <span>📅 Joined {profileData.joinDate}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            value={profileData.name}
                            onChange={(e) =>
                              setProfileData((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="username">Username</Label>
                          <Input
                            id="username"
                            value={profileData.username}
                            onChange={(e) =>
                              setProfileData((prev) => ({
                                ...prev,
                                username: e.target.value,
                              }))
                            }
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={profileData.bio}
                          onChange={(e) =>
                            setProfileData((prev) => ({
                              ...prev,
                              bio: e.target.value,
                            }))
                          }
                          className="min-h-[80px]"
                        />
                      </div>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={profileData.location}
                            onChange={(e) =>
                              setProfileData((prev) => ({
                                ...prev,
                                location: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="website">Website</Label>
                          <Input
                            id="website"
                            value={profileData.website}
                            onChange={(e) =>
                              setProfileData((prev) => ({
                                ...prev,
                                website: e.target.value,
                              }))
                            }
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex space-x-6">
                      <div className="text-center">
                        <div className="text-lg font-bold">
                          {stats.memories}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Memories
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold">
                          {stats.followers}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Followers
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold">
                          {stats.following}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Following
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold">
                          {stats.totalEarnings} Bandcoin
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Earned
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      {!isEditing ? (
                        <Button
                          onClick={() => setIsEditing(true)}
                          variant="outline"
                          size="sm"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                      ) : (
                        <>
                          <Button onClick={handleSaveProfile} size="sm">
                            <Save className="mr-2 h-4 w-4" />
                            Save
                          </Button>
                          <Button
                            onClick={() => setIsEditing(false)}
                            variant="outline"
                            size="sm"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="mb-2 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
                <div className="text-lg font-bold">
                  {stats.totalEarnings} Bandcoin
                </div>
                <div className="text-xs text-muted-foreground">
                  Total Earnings
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="mb-2 flex items-center justify-center">
                  <Heart className="h-5 w-5 text-red-500" />
                </div>
                <div className="text-lg font-bold">{stats.totalLikes}</div>
                <div className="text-xs text-muted-foreground">Total Likes</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="mb-2 flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-500" />
                </div>
                <div className="text-lg font-bold">{stats.followers}</div>
                <div className="text-xs text-muted-foreground">Followers</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="mb-2 flex items-center justify-center">
                  <Coins className="h-5 w-5 text-purple-500" />
                </div>
                <div className="text-lg font-bold">
                  {ownedNFTs.length + createdNFTs.length}
                </div>
                <div className="text-xs text-muted-foreground">Memories</div>
              </CardContent>
            </Card>
          </div>

          {/* Content Tabs */}
          <Card>
            <CardHeader>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="collection">My Collection</TabsTrigger>
                  <TabsTrigger value="created">Created</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsContent value="collection" className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {ownedNFTs.map((nft) => (
                      <Card key={nft.id} className="overflow-hidden">
                        <div className="relative aspect-square bg-muted">
                          {nft.image ? (
                            <img
                              src={nft.image || "/placeholder.svg"}
                              alt={nft.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              {nft.type === "audiobook" ? (
                                <div className="text-center">
                                  <Headphones className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                                  <p className="text-sm text-muted-foreground">
                                    {nft.duration}
                                  </p>
                                </div>
                              ) : (
                                <Camera className="h-8 w-8 text-muted-foreground" />
                              )}
                            </div>
                          )}
                          <Badge
                            variant="secondary"
                            className="absolute left-2 top-2 text-xs"
                          >
                            <Crown className="mr-1 h-3 w-3" />
                            Owned
                          </Badge>
                        </div>
                        <CardContent className="p-4">
                          <div className="mb-2 flex items-center space-x-2">
                            {getTypeIcon(nft.type)}
                            <span className="text-xs capitalize text-muted-foreground">
                              {nft.type}
                            </span>
                          </div>
                          <h3 className="mb-2 font-semibold">{nft.title}</h3>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-2 text-purple-600">
                              <Coins className="h-4 w-4" />
                              <span className="font-medium">
                                {nft.price} Bandcoin
                              </span>
                            </div>
                            <div className="flex items-center space-x-3 text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <Heart className="h-3 w-3" />
                                <span>{nft.likes}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MessageCircle className="h-3 w-3" />
                                <span>{nft.comments}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="created" className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {createdNFTs.map((nft) => (
                      <Card key={nft.id} className="overflow-hidden">
                        <div className="relative aspect-square bg-muted">
                          {nft.image ? (
                            <img
                              src={nft.image || "/placeholder.svg"}
                              alt={nft.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <Camera className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                          <Badge
                            variant="outline"
                            className="absolute left-2 top-2 text-xs"
                          >
                            Creator
                          </Badge>
                        </div>
                        <CardContent className="p-4">
                          <div className="mb-2 flex items-center space-x-2">
                            {getTypeIcon(nft.type)}
                            <span className="text-xs capitalize text-muted-foreground">
                              {nft.type}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              • {nft.timeAgo}
                            </span>
                          </div>
                          <h3 className="mb-2 font-semibold">{nft.title}</h3>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-2 text-purple-600">
                              <Coins className="h-4 w-4" />
                              <span className="font-medium">
                                {nft.price} Bandcoin
                              </span>
                            </div>
                            <div className="flex items-center space-x-3 text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <Heart className="h-3 w-3" />
                                <span>{nft.likes}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MessageCircle className="h-3 w-3" />
                                <span>{nft.comments}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
