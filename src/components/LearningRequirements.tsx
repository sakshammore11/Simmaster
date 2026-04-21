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
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoConfirmed, setVideoConfirmed] = useState(false);

  const handleVideoConfirmation = () => {
    if (videoConfirmed) {
      onVideoWatched();
      setShowVideoModal(false);
      setVideoConfirmed(false);
    } else {
      setVideoConfirmed(true);
    }
  };

  const requirements = [
    {
      id: "video",
      label: "Watch YouTube Video",
      completed: isVideoWatched,
      icon: <Play className="w-5 h-5" />,
      action: () => setShowVideoModal(true),
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
            onClick={() => !isVideoWatched && setShowVideoModal(true)}
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
                    {isVideoWatched ? "Video watched" : "Click to watch video"}
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

      {/* Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="font-semibold">YouTube Video</h3>
              <button
                onClick={() => {
                  setShowVideoModal(false);
                  setVideoConfirmed(false);
                }}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="aspect-video w-full rounded-lg overflow-hidden mb-4">
                <iframe
                  src={youtubeUrl?.replace("watch?v=", "embed/")}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              {!isVideoWatched && (
                <div className="bg-orange/20 border border-orange/30 rounded-xl p-4">
                  <p className="text-sm font-semibold mb-2">Confirm you've watched this video:</p>
                  <button
                    onClick={handleVideoConfirmation}
                    className={`w-full py-2 rounded-lg font-semibold transition-all ${
                      videoConfirmed
                        ? "bg-gradient-to-r from-green to-emerald text-white"
                        : "bg-white/10 text-white/70 hover:bg-white/20"
                    }`}
                  >
                    {videoConfirmed ? "Yes, I confirm I've watched this video" : "I have watched this video"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
