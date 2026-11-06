"use client";

import React, { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OnboardingGuide } from "./OnboardingGuide";

export function VirtualGuideModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs backdrop-blur-sm shadow-sm"
      >
        <Sparkles className="w-3.5 h-3.5 mr-1.5 text-red-400" />
        <span>Guide Virtuel Khadamni</span>
      </Button>

      {isOpen && (
        <OnboardingGuide forceOpen={true} onClose={() => setIsOpen(false)} />
      )}
    </>
  );
}

export default VirtualGuideModal;
