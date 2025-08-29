"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Camera,
  Coins,
  Headphones,
  Upload,
  X,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@acme/ui/avatar";
import { Badge } from "@acme/ui/badge";
import { Button } from "@acme/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@acme/ui/card";
import { Input } from "@acme/ui/input";
import { Label } from "@acme/ui/label";
import { Switch } from "@acme/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@acme/ui/tabs";
import { Textarea } from "@acme/ui/textarea";

export default function CreatePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("memory");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [nftPrice, setNftPrice] = useState("");
  const [royalty, setRoyalty] = useState("10");
  const [isNFT, setIsNFT] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (uploadedFiles.length + files.length > 5) {
      alert("You can only upload up to 5 files");
      return;
    }
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreate = async () => {
    if (!title.trim() || !description.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    setIsCreating(true);

    // Simulate creation process
    setTimeout(() => {
      setIsCreating(false);
      router.push("/");
    }, 2000);
  };

  const getGridCols = (count: number) => {
    if (count === 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-2";
    if (count === 3) return "grid-cols-3";
    if (count === 4) return "grid-cols-2";
    return "grid-cols-3";
  };

  const getFilePreview = (file: File) => {
    if (file.type.startsWith("image/")) {
      return URL.createObjectURL(file);
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
            <h1 className="bg-gradient-to-r from-red-500 to-amber-500 bg-clip-text text-2xl font-bold text-transparent">
              Create Memory
            </h1>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl p-4 pb-20 md:pb-4">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>Choose Content Type</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger
                    value="memory"
                    className="flex items-center space-x-2"
                  >
                    <Camera className="h-4 w-4" />
                    <span>Memory</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="photobook"
                    className="flex items-center space-x-2"
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>Photobook</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="audiobook"
                    className="flex items-center space-x-2"
                  >
                    <Headphones className="h-4 w-4" />
                    <span>Audiobook</span>
                  </TabsTrigger>
                </TabsList>

                <div className="mt-6">
                  <TabsContent value="memory" className="space-y-4">
                    <div className="rounded-lg bg-muted/50 p-4 text-center">
                      <Camera className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Share a single moment - photo, video, or audio recording
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="photobook" className="space-y-4">
                    <div className="rounded-lg bg-muted/50 p-4 text-center">
                      <BookOpen className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Create a collection of photos and videos with a story
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="audiobook" className="space-y-4">
                    <div className="rounded-lg bg-muted/50 p-4 text-center">
                      <Headphones className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Record and share audio stories, conversations, or music
                      </p>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder={`Enter your ${activeTab} title...`}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Tell the story behind this memory..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Upload Files</span>
                <Badge variant="secondary">{uploadedFiles.length}/5</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Upload area */}
              <div className="rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 text-center">
                <input
                  type="file"
                  multiple
                  accept={
                    activeTab === "audiobook" ? "audio/*" : "image/*,video/*"
                  }
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  disabled={uploadedFiles.length >= 5}
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="mb-1 text-sm text-muted-foreground">
                    {activeTab === "audiobook"
                      ? "Click to upload audio files"
                      : "Click to upload photos and videos"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Maximum 5 files •{" "}
                    {activeTab === "audiobook"
                      ? "MP3, WAV, M4A"
                      : "JPG, PNG, MP4, MOV"}
                  </p>
                </label>
              </div>

              {/* File preview grid */}
              {uploadedFiles.length > 0 && (
                <div
                  className={`grid gap-4 ${getGridCols(uploadedFiles.length)}`}
                >
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="group relative">
                      <div className="aspect-square overflow-hidden rounded-lg bg-muted">
                        {getFilePreview(file) ? (
                          <img
                            src={getFilePreview(file)! || "/placeholder.svg"}
                            alt={file.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            {activeTab === "audiobook" ? (
                              <Headphones className="h-8 w-8 text-muted-foreground" />
                            ) : (
                              <Camera className="h-8 w-8 text-muted-foreground" />
                            )}
                          </div>
                        )}
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {file.name}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Coins className="h-5 w-5 text-purple-600" />
                <span>Digital Collectibles Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="nft-toggle">
                    Mint as Digital Collectible
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Create this as a tradeable Digital Collectible on the
                    blockchain
                  </p>
                </div>
                <Switch
                  id="nft-toggle"
                  checked={isNFT}
                  onCheckedChange={setIsNFT}
                />
              </div>

              {isNFT && (
                <div className="space-y-4 border-t pt-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="nft-price">Price (Bandcoin)</Label>
                      <Input
                        id="nft-price"
                        type="number"
                        step="0.001"
                        placeholder="0.05"
                        value={nftPrice}
                        onChange={(e) => setNftPrice(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="royalty">Royalty (%)</Label>
                      <Input
                        id="royalty"
                        type="number"
                        min="0"
                        max="50"
                        placeholder="10"
                        value={royalty}
                        onChange={(e) => setRoyalty(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="rounded-lg border bg-gradient-to-r from-purple-50 to-pink-50 p-4 dark:from-purple-950/20 dark:to-pink-950/20">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src="/user-profile-illustration.png" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">John Doe</p>
                        <p className="text-sm text-muted-foreground">
                          {nftPrice ? `${nftPrice} Bandcoin` : "0.05 Bandcoin"}{" "}
                          • {royalty}% royalty
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Link href="/">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button
              onClick={handleCreate}
              disabled={!title.trim() || !description.trim() || isCreating}
              className="bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600"
            >
              {isCreating
                ? "Creating..."
                : isNFT
                  ? "Mint & Share"
                  : "Share Memory"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
