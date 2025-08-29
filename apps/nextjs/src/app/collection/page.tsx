"use client";

import { useState } from "react";
import {
  BookOpen,
  Calendar,
  Camera,
  Coins,
  Crown,
  ExternalLink,
  Headphones,
  Search,
  Share2,
  TrendingUp,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@acme/ui/avatar";
import { Badge } from "@acme/ui/badge";
import { Button } from "@acme/ui/button";
import { Card, CardContent } from "@acme/ui/card";
import { Input } from "@acme/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@acme/ui/tabs";

import { Header } from "../_components/header";

interface NFTItem {
  id: number;
  type: "photobook" | "audiobook" | "memory";
  title: string;
  description: string;
  image?: string;
  nftPrice: number;
  purchasePrice: number;
  currentValue: number;
  purchaseDate: string;
  creator: {
    name: string;
    username: string;
    avatar: string;
  };
  royalty: number;
}

export default function CollectionPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const ownedNFTs: NFTItem[] = [
    {
      id: 3,
      type: "memory",
      title: "First Day at College",
      description: "Nervous but excited for this new chapter!",
      image: "/vibrant-college-campus.png",
      nftPrice: 0.08,
      purchasePrice: 0.08,
      currentValue: 0.12,
      purchaseDate: "2024-01-15",
      creator: {
        name: "Emma Wilson",
        username: "@emma_w",
        avatar: "/diverse-woman-smiling.png",
      },
      royalty: 12,
    },
    {
      id: 4,
      type: "photobook",
      title: "Wedding Memories",
      description: "Beautiful moments from our special day",
      image: "/joyful-wedding-celebration.png",
      nftPrice: 0.35,
      purchasePrice: 0.35,
      currentValue: 0.42,
      purchaseDate: "2024-01-10",
      creator: {
        name: "Alex Rivera",
        username: "@alex_r",
        avatar: "/man-profile.png",
      },
      royalty: 8,
    },
    {
      id: 5,
      type: "audiobook",
      title: "Childhood Stories",
      description: "Tales from my grandmother's childhood",
      nftPrice: 0.18,
      purchasePrice: 0.18,
      currentValue: 0.15,
      purchaseDate: "2024-01-08",
      creator: {
        name: "Maria Santos",
        username: "@maria_s",
        avatar: "/woman-profile.png",
      },
      royalty: 20,
    },
  ];

  const createdNFTs: NFTItem[] = [
    {
      id: 6,
      type: "memory",
      title: "Quick Memory",
      description: "Just shared this moment",
      nftPrice: 0.05,
      purchasePrice: 0.05,
      currentValue: 0.05,
      purchaseDate: "2024-01-20",
      creator: {
        name: "John Doe",
        username: "@johndoe",
        avatar: "/user-profile-illustration.png",
      },
      royalty: 10,
    },
  ];

  const filteredOwnedNFTs = ownedNFTs.filter((nft) => {
    const matchesSearch =
      searchQuery === "" ||
      nft.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nft.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nft.creator.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "all" || nft.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const filteredCreatedNFTs = createdNFTs.filter((nft) => {
    const matchesSearch =
      searchQuery === "" ||
      nft.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nft.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "all" || nft.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "photobook":
        return <BookOpen className="h-4 w-4 text-primary" />;
      case "audiobook":
        return <Headphones className="h-4 w-4 text-secondary" />;
      case "memory":
        return <Camera className="h-4 w-4 text-accent" />;
    }
  };

  const calculateProfitLoss = (purchasePrice: number, currentValue: number) => {
    const difference = currentValue - purchasePrice;
    const percentage = ((difference / purchasePrice) * 100).toFixed(1);
    return { difference, percentage };
  };

  const renderNFTCard = (nft: NFTItem, isCreated = false) => {
    const { difference, percentage } = calculateProfitLoss(
      nft.purchasePrice,
      nft.currentValue,
    );
    const isProfit = difference >= 0;

    return (
      <Card
        key={nft.id}
        className="flex flex-col justify-between overflow-hidden p-0 transition-shadow hover:shadow-lg"
      >
        <div className="relative h-[30vh] overflow-hidden bg-muted">
          {nft.image ? (
            <img
              src={nft.image || "/placeholder.svg"}
              alt={nft.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              {getTypeIcon(nft.type)}
            </div>
          )}
          <div className="absolute left-2 top-2">
            <Badge variant="secondary" className="text-xs">
              <Coins className="mr-1 h-3 w-3" />
              NFT
            </Badge>
          </div>
          <div className="absolute right-2 top-2">
            <Badge variant="outline" className="bg-white/90 text-xs">
              {getTypeIcon(nft.type)}
              <span className="ml-1 capitalize">{nft.type}</span>
            </Badge>
          </div>
        </div>

        <CardContent className="p-4">
          <div className="space-y-3">
            <div>
              <h3 className="line-clamp-1 font-semibold">{nft.title}</h3>
              <p className="line-clamp-2 text-sm text-muted-foreground">
                {nft.description}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={nft.creator.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-xs">
                  {nft.creator.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">
                {isCreated ? "Created by you" : `by ${nft.creator.name}`}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Current Value
                </span>
                <span className="font-semibold">
                  {nft.currentValue} Bandcoin
                </span>
              </div>

              {!isCreated && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Purchase Price
                    </span>
                    <span className="text-sm">
                      {nft.purchasePrice} Bandcoin
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">P&L</span>
                    <div className="flex items-center space-x-1">
                      <TrendingUp
                        className={`h-3 w-3 ${isProfit ? "text-green-600" : "text-red-600"} ${!isProfit ? "rotate-180" : ""}`}
                      />
                      <span
                        className={`text-sm font-medium ${isProfit ? "text-green-600" : "text-red-600"}`}
                      >
                        {isProfit ? "+" : ""}
                        {difference.toFixed(4)} Bandcoin ({percentage}%)
                      </span>
                    </div>
                  </div>
                </>
              )}

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {isCreated ? "Created" : "Purchased"}
                </span>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <span className="text-sm">
                    {new Date(nft.purchaseDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex space-x-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 bg-transparent"
              >
                <ExternalLink className="mr-1 h-3 w-3" />
                View
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 bg-transparent"
              >
                <Share2 className="mr-1 h-3 w-3" />
                Share
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const totalValue = [...ownedNFTs, ...createdNFTs].reduce(
    (sum, nft) => sum + nft.currentValue,
    0,
  );
  const totalInvested = ownedNFTs.reduce(
    (sum, nft) => sum + nft.purchasePrice,
    0,
  );
  const totalProfit = totalValue - totalInvested;

  return (
    <div className="min-h-screen bg-background">
      <div className="supports-[backdrop-filter]:bg-card/600 sticky top-0 z-50 hidden w-full border-b bg-card/95 backdrop-blur md:block">
        <Header />
      </div>

      {/* Header */}
      <div className="border-b bg-card">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600">
                <Crown className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">My Digital Collection</h1>
                <p className="text-muted-foreground">
                  Manage and track your digital memories
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                {totalValue.toFixed(3)} Bandcoin
              </div>
              <div className="text-sm text-muted-foreground">
                Total Memory Value
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">
                {ownedNFTs.length + createdNFTs.length}
              </div>
              <div className="text-sm text-muted-foreground">
                Total Collectibles
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{ownedNFTs.length}</div>
              <div className="text-sm text-muted-foreground">Owned</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{createdNFTs.length}</div>
              <div className="text-sm text-muted-foreground">Created</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div
                className={`text-2xl font-bold ${totalProfit >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {totalProfit >= 0 ? "+" : ""}
                {totalProfit.toFixed(3)} Bandcoin
              </div>
              <div className="text-sm text-muted-foreground">Total P&L</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
            <Input
              placeholder="Search your Collectible..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex space-x-2">
            <Button
              variant={activeFilter === "all" ? "primary" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("all")}
            >
              All
            </Button>
            <Button
              variant={activeFilter === "photobook" ? "primary" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("photobook")}
            >
              <BookOpen className="mr-1 h-4 w-4" />
              Photobooks
            </Button>
            <Button
              variant={activeFilter === "audiobook" ? "primary" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("audiobook")}
            >
              <Headphones className="mr-1 h-4 w-4" />
              Audiobooks
            </Button>
            <Button
              variant={activeFilter === "memory" ? "primary" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("memory")}
            >
              <Camera className="mr-1 h-4 w-4" />
              Memories
            </Button>
          </div>
        </div>

        {/* NFT Tabs */}
        <Tabs defaultValue="owned" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="owned">
              Owned Collectibles ({filteredOwnedNFTs.length})
            </TabsTrigger>
            <TabsTrigger value="created">
              Created Collectibles ({filteredCreatedNFTs.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="owned">
            {filteredOwnedNFTs.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Crown className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-semibold">
                    You haven't collected anything yet. Keep looking 😊
                  </h3>
                  <p className="text-muted-foreground">
                    {searchQuery
                      ? `No owned collectible matching "${searchQuery}"`
                      : "You don't own this collectible yet"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                {filteredOwnedNFTs.map((nft) => renderNFTCard(nft, false))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="created">
            {filteredCreatedNFTs.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Camera className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-semibold">
                    No Created Collectible Found
                  </h3>
                  <p className="text-muted-foreground">
                    {searchQuery
                      ? `No owned collectible matching "${searchQuery}"`
                      : "You don't own this collectible yet"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                {filteredCreatedNFTs.map((nft) => renderNFTCard(nft, true))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
