"use client";

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";

interface VoiceSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  voice: SpeechSynthesisVoice | null;
  setVoice: (voice: SpeechSynthesisVoice) => void;
  rate: number;
  setRate: (rate: number) => void;
  pitch: number;
  setPitch: (pitch: number) => void;
}

export function VoiceSettingsDialog({
  voice,
  setVoice,
  rate,
  setRate,
  pitch,
  setPitch,
}: VoiceSettingsDialogProps) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const availableVoices = window.speechSynthesis.getVoices();
    if (availableVoices.length > 0) {
      setVoices(availableVoices.filter(v => v.lang.startsWith("zh")));
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices.filter(v => v.lang.startsWith("zh")));
      };
    }
  }, []);

  const handleVoiceChange = (value: string) => {
    const selectedVoice = voices.find((v) => v.name === value);
    if (selectedVoice) {
      setVoice(selectedVoice);
    }
  };

  const handleTestVoice = () => {
    if (voice) {
      const utterance = new SpeechSynthesisUtterance("你好，这是语音测试。");
      utterance.voice = voice;
      utterance.rate = rate;
      utterance.pitch = pitch;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-6 p-4">
      <div className="space-y-2">
        <Label htmlFor="voice-select">声音选择</Label>
        <Select onValueChange={handleVoiceChange} value={voice?.name}>
          <SelectTrigger id="voice-select">
            <SelectValue placeholder="选择一个声音" />
          </SelectTrigger>
          <SelectContent>
            {voices.map((v) => (
              <SelectItem key={v.name} value={v.name}>
                {`${v.name} (${v.lang})`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="rate-slider">语速: {rate.toFixed(1)}</Label>
        <Slider
          id="rate-slider"
          min={0.5}
          max={2}
          step={0.1}
          value={[rate]}
          onValueChange={(value) => setRate(value[0])}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="pitch-slider">音调: {pitch.toFixed(1)}</Label>
        <Slider
          id="pitch-slider"
          min={0}
          max={2}
          step={0.1}
          value={[pitch]}
          onValueChange={(value) => setPitch(value[0])}
        />
      </div>
      <Button onClick={handleTestVoice} className="w-full">测试声音</Button>
    </div>
  );
}
