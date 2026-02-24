"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Volume2, VolumeX } from "lucide-react";

const PLAYLIST = ["/bgm1.mp3", "/bgm2.mp3"];

export default function BgmPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // 用户意图：true = 希望播放，false = 希望静音
  const [wantsPlay, setWantsPlay] = useState(true);
  // 实际是否正在播放（受浏览器策略影响，可能与 wantsPlay 不同）
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  // 是否已等待首次用户交互
  const hasInteractedRef = useRef(false);

  const handleEnded = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % PLAYLIST.length);
  }, []);

  // 尝试播放，成功后更新 isPlaying 状态
  const tryPlay = useCallback((audio: HTMLAudioElement) => {
    audio.play().then(() => {
      setIsPlaying(true);
    }).catch(() => {
      setIsPlaying(false);
    });
  }, []);

  // 初始化 audio 元素
  useEffect(() => {
    const audio = new Audio(PLAYLIST[0]);
    audio.preload = "none";
    audio.addEventListener("ended", handleEnded);
    audioRef.current = audio;

    // 监听首次用户交互，自动开始播放（绕过浏览器 autoplay 策略）
    const handleFirstInteraction = () => {
      if (hasInteractedRef.current) return;
      hasInteractedRef.current = true;

      // 仅在用户意图为"播放"时触发
      if (wantsPlay) {
        tryPlay(audio);
      }

      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("keydown", handleFirstInteraction);
      document.removeEventListener("touchstart", handleFirstInteraction);
    };

    document.addEventListener("click", handleFirstInteraction);
    document.addEventListener("keydown", handleFirstInteraction);
    document.addEventListener("touchstart", handleFirstInteraction);

    return () => {
      audio.pause();
      audio.removeEventListener("ended", handleEnded);
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("keydown", handleFirstInteraction);
      document.removeEventListener("touchstart", handleFirstInteraction);
      audioRef.current = null;
    };
  }, [handleEnded, tryPlay]); // eslint-disable-line react-hooks/exhaustive-deps

  // 当曲目索引变化时切换音源
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.src = PLAYLIST[currentIndex];
    audio.load();

    if (wantsPlay && hasInteractedRef.current) {
      tryPlay(audio);
    }
  }, [currentIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  // 响应用户点击静音/播放切换
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (wantsPlay) {
      tryPlay(audio);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, [wantsPlay, tryPlay]);

  const handleToggle = () => {
    setWantsPlay((prev) => !prev);
  };

  // 图标显示：以实际播放状态为准
  const showMuted = !isPlaying;

  const iconColor = isHovered
    ? "rgba(139,115,85,1)"
    : "rgba(139,115,85,0.75)";

  const borderColor = isHovered
    ? "rgba(139,115,85,0.65)"
    : "rgba(139,115,85,0.4)";

  return (
    <button
      onClick={handleToggle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={showMuted ? "开启背景音乐" : "静音背景音乐"}
      style={{
        position: "fixed",
        top: "1rem",
        right: "1rem",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "2.5rem",
        height: "2.5rem",
        borderRadius: "50%",
        border: `1px solid ${borderColor}`,
        background: "rgba(245,240,232,0.82)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        cursor: "pointer",
        color: iconColor,
        transition: "color 500ms ease, border-color 500ms ease, box-shadow 500ms ease",
        boxShadow: isHovered
          ? "0 2px 16px rgba(139,115,85,0.2), 0 1px 4px rgba(0,0,0,0.1)"
          : "0 2px 12px rgba(0,0,0,0.12), 0 1px 0 rgba(255,255,255,0.8) inset",
      }}
    >
      {showMuted ? (
        <VolumeX size={16} strokeWidth={1.5} />
      ) : (
        <Volume2 size={16} strokeWidth={1.5} />
      )}
    </button>
  );
}
