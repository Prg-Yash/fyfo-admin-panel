"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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

export default function GymImages() {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);
  const { addToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const imagesRef = ref(storage, "images");
      const result = await listAll(imagesRef);

      const imageUrls = await Promise.all(
        result.items.map(async (imageRef) => {
          const url = await getDownloadURL(imageRef);
          return {
            url,
            name: imageRef.name,
            fullPath: imageRef.fullPath,
          };
        })
      );

      setImages(imageUrls);
    } catch (error) {
      console.error("Error fetching images:", error);
      addToast("Failed to load images", "error");
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.includes("image/")) {
      addToast("Please select an image file", "error");
      return;
    }

    setUploading(true);

    try {
      const timestamp = Date.now();
      const storageRef = ref(storage, `images/${timestamp}_${file.name}`);

      await uploadBytes(storageRef, file);
      addToast("Image uploaded successfully", "success");

      // Refresh the images list
      await fetchImages();
    } catch (error) {
      console.error("Error uploading image:", error);
      addToast("Failed to upload image", "error");
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleDeleteImage = async () => {
    if (!selectedImage) return;

    try {
      const imageRef = ref(storage, selectedImage.fullPath);
      await deleteObject(imageRef);

      setSelectedImage(null);
      addToast("Image deleted successfully", "success");

      // Refresh the images list
      await fetchImages();
    } catch (error) {
      console.error("Error deleting image:", error);
      addToast("Failed to delete image", "error");
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Gym Images</h1>
            <div className="flex space-x-4">
              <Button variant="outline" onClick={() => router.push("/")}>
                Back to Dashboard
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Upload Image"}
              </Button>
            </div>
          </div>

          {selectedImage && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-auto p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Image Preview</h2>
                  <div className="space-x-2">
                    <Button variant="danger" onClick={handleDeleteImage}>
                      Delete
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedImage(null)}
                    >
                      Close
                    </Button>
                  </div>
                </div>
                <div className="relative w-full h-[500px]">
                  <Image
                    src={selectedImage.url}
                    alt="Selected image"
                    className="object-contain"
                    fill
                  />
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.length > 0 ? (
              images.map((image, index) => (
                <Card
                  key={index}
                  className="cursor-pointer hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div
                    className="relative h-48 w-full"
                    onClick={() => handleImageClick(image)}
                  >
                    <Image
                      src={image.url}
                      alt={`Gym image ${index}`}
                      className="object-cover"
                      fill
                    />
                  </div>
                  <div className="p-3 text-center text-sm text-gray-500 truncate">
                    {image.name}
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">
                  No images found. Upload your first image!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
