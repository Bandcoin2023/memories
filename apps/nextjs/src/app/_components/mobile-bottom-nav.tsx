"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Camera, Home, Plus, Search, User } from "lucide-react";

import { Button } from "@acme/ui/button";

import { CreateContentModal } from "./create-content-modal";

const navItems = [
  {
    icon: Home,
    label: "Home",
    active: true,
    href: "/",
  },
  {
    icon: Search,
    label: "Search",
    href: "/search",
  },
  { icon: Plus, label: "Create", href: "/create" },

  { icon: User, label: "Profile", href: "/profile" },
];

export function MobileBottomNav() {
  const [showCreateOptions, setShowCreateOptions] = useState(false);
  const path = usePathname();
  return (
    <>
      {showCreateOptions && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setShowCreateOptions(false)}
        >
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 transform rounded-lg border bg-background p-4 shadow-lg">
            <div className="flex space-x-4">
              <CreateContentModal type="memory">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCreateOptions(false)}
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Quick Memory
                </Button>
              </CreateContentModal>
              <Link href="/create">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCreateOptions(false)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Full Create
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      <nav className="pb-safe fixed bottom-0 left-0 right-0 z-50 p-4 md:hidden">
        <div className="glass glow-card mx-auto max-w-md rounded-2xl p-2">
          <div className="flex items-center justify-between">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link
                  href={item.href}
                  key={item.label}
                  className={`flex flex-col items-center justify-center px-4 py-0 ${
                    item.href === path
                      ? "glow-primary rounded-2xl bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted/20 hover:text-foreground"
                  }`}
                >
                  <button
                    key={item.label}
                    className={`} relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300`}
                  >
                    <Icon className="h-6 w-6" />

                    {/* Active indicator */}
                    {item.href === path && (
                      <div className="bg-gradient-primary pulse-glow absolute -right-1 -top-1 h-3 w-3 rounded-full" />
                    )}

                    {/* Ripple effect */}
                    <div className="absolute inset-0 rounded-xl bg-current opacity-0 transition-opacity duration-200 hover:opacity-10" />
                  </button>
                  <span
                    className={`text-xs ${item.href === path ? "font-semibold text-primary" : "text-muted-foreground"}`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}
