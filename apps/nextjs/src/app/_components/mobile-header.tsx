"use client";

import { useState } from "react";
import { Filter, Search, X } from "lucide-react";

import { Button } from "@acme/ui/button";
import { Input } from "@acme/ui/input";

interface MobileHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  searchQuery: string;
  onSearch: (query: string) => void;
}

export function MobileHeader({
  activeTab,
  onTabChange,
  searchQuery,
  onSearch,
}: MobileHeaderProps) {
  const [showSearch, setShowSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const tabs = [
    { id: "home", label: "All" },
    { id: "photobook", label: "Photos" },
    { id: "audiobook", label: "Audio" },
    { id: "memory", label: "Memories" },
  ];

  return (
    <div className="md:hidden">
      <div className="border-b bg-background px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="bg-gradient-to-r from-red-500 to-amber-500 bg-clip-text text-xl font-bold text-transparent">
            Memories
          </h1>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSearch(!showSearch)}
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {showSearch && (
          <div className="mt-3 flex items-center space-x-2">
            <Input
              placeholder="Search memories..."
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="flex-1"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSearch(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {showFilters && (
          <div className="mt-3 flex space-x-2 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "outline"}
                size="sm"
                onClick={() => onTabChange(tab.id)}
                className="whitespace-nowrap"
              >
                {tab.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
