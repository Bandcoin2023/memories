"use client";

import { useState } from "react";
import { Home, Plus, User } from "lucide-react";

import { Header } from "./_components/header";
import { LeftSidebar } from "./_components/left-sidebar";
import { MainFeed } from "./_components/main-feed";
import { MobileBottomNav } from "./_components/mobile-bottom-nav";
import { MobileHeader } from "./_components/mobile-header";
import { RightSidebar } from "./_components/right-sidebar";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");

  const handleMobileSearch = () => {
    // Toggle search functionality for mobile
    console.log(" Mobile search triggered");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="supports-[backdrop-filter]:bg-card/600 sticky top-0 z-50 hidden w-full border-b bg-card/95 backdrop-blur md:block">
        <Header
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onSearch={setSearchQuery}
        />
      </div>

      <MobileHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
      />

      <div className="relative">
        <div className="hidden md:block">
          <LeftSidebar />
        </div>

        <div className="pb-20 md:ml-80 md:mr-80 md:pb-0">
          <MainFeed activeTab={activeTab} searchQuery={searchQuery} />
        </div>

        <div className="hidden md:block">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
}
