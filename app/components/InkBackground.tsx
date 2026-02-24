/**
 * InkBackground — 米白宣纸底纹 + 灰色水墨晕染背景层（静态版，性能优化）
 *
 * 层级（从下到上）：
 * 1. 底色层          极浅米白 #F4F1EE
 * 2. 纸纤维颗粒层    fractalNoise，宣纸颗粒质感（降低 numOctaves 至 2）
 * 3. 灰色水墨晕染层  6个椭圆，仅保留一次性入场动画 inkSpread，移除无限 inkDrift
 *    滤镜简化：移除 feDisplacementMap，只保留 feGaussianBlur，减少 GPU 计算量
 */
export default function InkBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {/* ── 1. 底色层 ── */}
      <div className="absolute inset-0" style={{ background: "#F4F1EE" }} />

      {/* ── 2. 纸纤维颗粒噪点层（numOctaves 降至 2，减少计算量） ── */}
      <svg
        width="100%"
        height="100%"
        className="absolute inset-0"
        style={{ opacity: 0.25 }}
      >
        <filter id="paper-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="2"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
          <feBlend in="SourceGraphic" mode="multiply" />
        </filter>
        <rect width="100%" height="100%" filter="url(#paper-grain)" fill="#c8c4be" />
      </svg>

      {/* ── 3. 灰色水墨晕染层（简化滤镜：移除 feDisplacementMap，仅用 feGaussianBlur；移除 inkDrift 无限动画） ── */}
      <svg
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        width="100%"
        height="100%"
        className="absolute inset-0"
      >
        <defs>
          <filter id="ink-gray-1" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="55" />
          </filter>
          <filter id="ink-gray-2" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="50" />
          </filter>
          <filter id="ink-gray-3" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="52" />
          </filter>
          <filter id="ink-gray-4" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="48" />
          </filter>
          <filter id="ink-gray-5" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="58" />
          </filter>
          <filter id="ink-gray-6" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="50" />
          </filter>
        </defs>

        <ellipse cx="80" cy="450" rx="420" ry="340" fill="rgba(100,104,106,0.22)" filter="url(#ink-gray-1)"
          style={{ animation: "inkSpread 4s ease-out forwards", transformOrigin: "80px 450px" }} />
        <ellipse cx="200" cy="150" rx="380" ry="280" fill="rgba(142,145,147,0.20)" filter="url(#ink-gray-2)"
          style={{ animation: "inkSpread 4.5s ease-out 0.8s forwards", transformOrigin: "200px 150px" }} />
        <ellipse cx="1300" cy="200" rx="360" ry="270" fill="rgba(178,180,180,0.18)" filter="url(#ink-gray-3)"
          style={{ animation: "inkSpread 5s ease-out 1.2s forwards", transformOrigin: "1300px 200px" }} />
        <ellipse cx="1380" cy="500" rx="340" ry="300" fill="rgba(142,145,147,0.19)" filter="url(#ink-gray-4)"
          style={{ animation: "inkSpread 5.5s ease-out 1.8s forwards", transformOrigin: "1380px 500px" }} />
        <ellipse cx="720" cy="880" rx="500" ry="260" fill="rgba(178,180,180,0.16)" filter="url(#ink-gray-5)"
          style={{ animation: "inkSpread 6s ease-out 2.4s forwards", transformOrigin: "720px 880px" }} />
        <ellipse cx="180" cy="800" rx="360" ry="260" fill="rgba(110,113,115,0.18)" filter="url(#ink-gray-6)"
          style={{ animation: "inkSpread 5s ease-out 2s forwards", transformOrigin: "180px 800px" }} />
      </svg>
    </div>
  );
}
