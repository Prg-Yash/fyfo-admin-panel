"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  deleteObject,
} from "firebase/storage";
import { storage } from "../../firebase/config";
import { useToast } from "../../components/ui/toast-context";
import ProtectedRoute from "../../components/auth/protected-route";
import Button from "../../components/ui/button";
import Card from "../../components/ui/card";

export default function GymVideos() {
  const [videos, setVideos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const fileInputRef = useRef(null);
  const { addToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const videosRef = ref(storage, "videos");
      const result = await listAll(videosRef);

      const videoUrls = await Promise.all(
        result.items.map(async (videoRef) => {
          const url = await getDownloadURL(videoRef);
          return {
            url,
            name: videoRef.name,
            fullPath: videoRef.fullPath,
          };
        })
      );

      setVideos(videoUrls);
    } catch (error) {
      console.error("Error fetching videos:", error);
      addToast("Failed to load videos", "error");
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check if file is a video
    if (!file.type.includes("video/")) {
      addToast("Please select a video file", "error");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const timestamp = Date.now();
      const storageRef = ref(storage, `videos/${timestamp}_${file.name}`);

      await uploadBytes(storageRef, file);
      addToast("Video uploaded successfully", "success");

      // Refresh the videos list
      await fetchVideos();
    } catch (error) {
      console.error("Error uploading video:", error);
      addToast("Failed to upload video", "error");
    } finally {
      setUploading(false);
      setUploadProgress(0);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
  };

  const handleDeleteVideo = async () => {
    if (!selectedVideo) return;

    try {
      const videoRef = ref(storage, selectedVideo.fullPath);
      await deleteObject(videoRef);

      setSelectedVideo(null);
      addToast("Video deleted successfully", "success");

      // Refresh the videos list
      await fetchVideos();
    } catch (error) {
      console.error("Error deleting video:", error);
      addToast("Failed to delete video", "error");
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Gym Videos</h1>
            <div className="flex space-x-4">
              <Button variant="outline" onClick={() => router.push("/")}>
                Back to Dashboard
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                accept="video/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? `Uploading (${uploadProgress}%)` : "Upload Video"}
              </Button>
            </div>
          </div>

          {selectedVideo && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-auto p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Video Preview</h2>
                  <div className="space-x-2">
                    <Button variant="danger" onClick={handleDeleteVideo}>
                      Delete
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedVideo(null)}
                    >
                      Close
                    </Button>
                  </div>
                </div>
                <div className="w-full aspect-video">
                  <video
                    src={selectedVideo.url}
                    controls
                    className="w-full h-full"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {videos.length > 0 ? (
              videos.map((video, index) => (
                <Card
                  key={index}
                  className="cursor-pointer hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div
                    className="relative aspect-video w-full bg-gray-200 flex items-center justify-center"
                    onClick={() => handleVideoClick(video)}
                  >
                    <video
                      className="w-full h-full"
                      src={video.url}
                      preload="metadata"
                    >
                      Your browser does not support the video tag.
                    </video>
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 hover:bg-opacity-40 transition-opacity">
                      <div className="w-16 h-16 rounded-full bg-white bg-opacity-80 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-blue-600"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 text-center text-sm text-gray-500 truncate">
                    {video.name}
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">
                  No videos found. Upload your first video!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
