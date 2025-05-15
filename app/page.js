"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../components/auth/auth-context";
import ProtectedRoute from "../components/auth/protected-route";
import Card from "../components/ui/card";
import Button from "../components/ui/button";

export default function Home() {
  const router = useRouter();
  const { signOut } = useAuth();

  const handleNavigate = (path) => {
    router.push(path);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              FYFO Admin Panel
            </h1>
            <Button variant="ghost" onClick={signOut}>
              Sign Out
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card
              title="Manage Images"
              className="hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col space-y-4">
                <p className="text-gray-600">
                  Upload, view, and manage gym images.
                </p>
                <div className="flex-grow" />
                <Button
                  className="w-full"
                  onClick={() => handleNavigate("/gym-images")}
                >
                  Manage Images
                </Button>
              </div>
            </Card>

            <Card
              title="Manage Videos"
              className="hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col space-y-4">
                <p className="text-gray-600">
                  Upload, view, and manage gym videos.
                </p>
                <div className="flex-grow" />
                <Button
                  className="w-full"
                  onClick={() => handleNavigate("/gym-videos")}
                >
                  Manage Videos
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
