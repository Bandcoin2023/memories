"use client";

import type React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Headphones, Home, Search, User, X } from "lucide-react";

import { Button } from "@acme/ui/button";
import { Input } from "@acme/ui/input";

import { AuthModal } from "./auth-modal";

interface HeaderProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onSearch?: (query: string) => void;
}

export function Header({
  activeTab = "home",
  onTabChange,
  onSearch,
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch?.(searchQuery);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, onSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  const clearSearch = () => {
    setSearchQuery("");
    onSearch?.("");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="grid h-16 grid-cols-3 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-bold text-primary-foreground">B</span>
          </div>
          <span className="text-xl font-bold text-foreground">Memories</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center justify-around">
          <Button
            variant={activeTab === "home" ? "default" : "ghost"}
            onClick={() => onTabChange?.("home")}
            className="flex items-center space-x-2 transition-colors"
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Button>
          <div className="border-1 h-8" />
          <Button
            variant={activeTab === "photobook" ? "default" : "ghost"}
            onClick={() => onTabChange?.("photobook")}
            className="flex items-center space-x-2 transition-colors"
          >
            <BookOpen className="h-4 w-4" />
            <span>Photobook</span>
          </Button>
          <div className="border-1 h-8" />
          <Button
            variant={activeTab === "audiobook" ? "default" : "ghost"}
            onClick={() => onTabChange?.("audiobook")}
            className="flex items-center space-x-2 transition-colors"
          >
            <Headphones className="h-4 w-4" />
            <span>Audiobook</span>
          </Button>
        </nav>

        {/* Search and Profile */}
        <div className="flex w-full items-end justify-end space-x-4">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search memories..."
              className="w-64 pl-10 pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 p-0 hover:bg-muted"
                onClick={clearSearch}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </form>
        </div>
      </div>
    </header>
  );
}
