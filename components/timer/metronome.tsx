"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TIME_SIGNATURES = ["2/4", "3/4", "4/4", "6/8", "7/8"] as const;
type TimeSignature = (typeof TIME_SIGNATURES)[number];

const BEATS_PER_SIGNATURE: Record<TimeSignature, number> = {
  "2/4": 2,
  "3/4": 3,
  "4/4": 4,
  "6/8": 6,
  "7/8": 7,
};

export function Metronome() {
  const [bpm, setBpm] = useState(100);
  const [signature, setSignature] = useState<TimeSignature>("4/4");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerIdRef = useRef<number | null>(null);
  const beatRef = useRef(0);

  useEffect(() => {
    return () => {
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function playClick(accent: boolean) {
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = accent ? 1000 : 700;
    gain.gain.value = accent ? 0.6 : 0.35;
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  function tick() {
    const beatsPerBar = BEATS_PER_SIGNATURE[signature];
    const accent = beatRef.current % beatsPerBar === 0;
    playClick(accent);
    setCurrentBeat(beatRef.current % beatsPerBar);
    beatRef.current += 1;
  }

  function start() {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    beatRef.current = 0;
    tick();
    const intervalMs = (60 / bpm) * 1000;
    timerIdRef.current = window.setInterval(tick, intervalMs);
    setIsPlaying(true);
  }

  function stop() {
    if (timerIdRef.current !== null) {
      window.clearInterval(timerIdRef.current);
      timerIdRef.current = null;
    }
    setIsPlaying(false);
    setCurrentBeat(0);
  }

  function toggle() {
    if (isPlaying) {
      stop();
    } else {
      start();
    }
  }

  function changeBpm(next: number) {
    const clamped = Math.min(240, Math.max(40, next));
    setBpm(clamped);
    if (isPlaying) {
      stop();
      window.setTimeout(start, 0);
    }
  }

  const beatsPerBar = BEATS_PER_SIGNATURE[signature];

  return (
    <div className="space-y-4 rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Métronome</span>
        <Select
          value={signature}
          onValueChange={(v) => setSignature(v as TimeSignature)}
        >
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TIME_SIGNATURES.map((sig) => (
              <SelectItem key={sig} value={sig}>
                {sig}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-center gap-1.5">
        {Array.from({ length: beatsPerBar }).map((_, i) => (
          <span
            key={i}
            className={`size-2.5 rounded-full ${
              isPlaying && i === currentBeat
                ? i === 0
                  ? "bg-primary"
                  : "bg-accent-foreground/70"
                : "bg-muted"
            }`}
          />
        ))}
      </div>

      <div className="flex items-center justify-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={() => changeBpm(bpm - 1)}
          aria-label="Diminuer le BPM"
        >
          <Minus className="size-4" />
        </Button>
        <span className="w-20 text-center font-mono text-2xl tabular-nums">
          {bpm}
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => changeBpm(bpm + 1)}
          aria-label="Augmenter le BPM"
        >
          <Plus className="size-4" />
        </Button>
      </div>

      <Slider
        min={40}
        max={240}
        step={1}
        value={[bpm]}
        onValueChange={([v]) => changeBpm(v)}
      />

      <Button onClick={toggle} className="w-full" variant="secondary">
        {isPlaying ? (
          <>
            <Pause className="mr-2 size-4" /> Arrêter
          </>
        ) : (
          <>
            <Play className="mr-2 size-4" /> Démarrer
          </>
        )}
      </Button>
    </div>
  );
}
