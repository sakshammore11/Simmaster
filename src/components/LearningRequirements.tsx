"use client";

import { useState } from "react";
import { Upload, X, Check, Lock, Unlock, PlayCircle, Play } from "lucide-react";
import PhotoUpload from "./PhotoUpload";

interface LearningRequirementsProps {
  itemId: string;
  youtubeUrl?: string;
  onPhotoUploaded: (photo: string) => void;
  onPhotoRemoved: (photoIndex: number) => void;
  photos: string[];
  isVideoWatched: boolean;
  onVideoWatched: () => void;
  requirementsMet: boolean;
  onProceed?: () => void;
}

export default function LearningRequirements({
  itemId,
  youtubeUrl,
  onPhotoUploaded,
  onPhotoRemoved,
  photos,
  isVideoWatched,
  onVideoWatched,
  requirementsMet,
  onProceed,
}: LearningRequirementsProps) {
  const handleVideoClick = () => {
    if (youtubeUrl && !isVideoWatched) {
      window.open(youtubeUrl, '_blank');
      onVideoWatched();
    }
  };

  const requirements = [
    {
      id: "video",
      label: "Watch YouTube Video",
      completed: isVideoWatched,
      icon: <Play className="w-5 h-5" />,
      action: handleVideoClick,
    },
    {
      id: "notes",
      label: "Upload Handwritten Notes",
      completed: photos.length > 0,
      icon: <Upload className="w-5 h-5" />,
      action: () => {}, // Photo upload is handled by PhotoUpload component
    },
  ];

  const allCompleted = requirements.every((r) => r.completed);

  return (
    <div className="mt-6">
      {/* Requirements Header */}
      <div className="glass rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            {allCompleted ? (
              <div className="w-10 h-10 rounded-full bg-green/20 flex items-center justify-center">
                <Unlock className="w-5 h-5 text-green-500" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-red/20 flex items-center justify-center">
                <Lock className="w-5 h-5 text-red-500" />
              </div>
            )}
            <div>
              <h3 className="font-semibold">Learning Requirements</h3>
              <p className="text-xs opacity-70">
                {allCompleted
                  ? "All requirements met - you can proceed"
                  : "Complete all requirements to unlock content"}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">
              {requirements.filter((r) => r.completed).length}/{requirements.length}
            </div>
            <div className="text-xs opacity-70">Completed</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/10 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              allCompleted ? "bg-green-500" : "bg-orange"
            }`}
            style={{ width: `${(requirements.filter((r) => r.completed).length / requirements.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Requirements List */}
      <div className="space-y-3 mb-4">
        {youtubeUrl && (
          <div
            className={`glass rounded-xl p-4 cursor-pointer transition-all ${
              isVideoWatched ? "border-green-500/50" : "border-white/20"
            }`}
            onClick={handleVideoClick}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isVideoWatched ? "bg-green/20" : "bg-white/10"
                  }`}
                >
                  {isVideoWatched ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : (
                    <PlayCircle className="w-5 h-5 opacity-70" />
                  )}
                </div>
                <div>
                  <p className="font-medium">Watch YouTube Video</p>
                  <p className="text-xs opacity-70">
                    {isVideoWatched ? "Video watched" : "Click to watch on YouTube"}
                  </p>
                </div>
              </div>
              {!isVideoWatched && <Play className="w-5 h-5 text-red-500" />}
            </div>
          </div>
        )}

        {/* Photo Upload */}
        <PhotoUpload
          itemId={itemId}
          onPhotoUploaded={onPhotoUploaded}
          onPhotoRemoved={onPhotoRemoved}
          photos={photos}
        />
      </div>

      {/* Proceed Button (if provided) */}
      {onProceed && (
        <button
          onClick={onProceed}
          disabled={!requirementsMet}
          className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
            requirementsMet
              ? "bg-gradient-to-r from-green to-emerald text-white hover:opacity-90"
              : "bg-white/10 text-white/50 cursor-not-allowed"
          }`}
        >
          {requirementsMet ? (
            <>
              <Unlock className="w-5 h-5" />
              Proceed to Next Topic
            </>
          ) : (
            <>
              <Lock className="w-5 h-5" />
              Complete Requirements to Proceed
            </>
          )}
        </button>
      )}
    </div>
  );
}
