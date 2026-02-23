"use client";

/**
 * InkBackground — 宣纸水墨晕染动态背景层
 * pointer-events-none，fixed inset-0，z-0
 *
 * 效果：
 * 1. 3 个慢速漂移的水墨晕染色块（feTurbulence + feDisplacementMap 模拟水墨边缘）
 * 2. 2 条极细毛笔线条从角落缓慢延伸，再渐隐循环
 */
export default function InkBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {/* ── 宣纸底纹噪点层 ── */}
      <svg
        width="100%"
        height="100%"
        className="absolute inset-0"
        style={{ opacity: 0.18 }}
      >
        <filter id="paper-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.72"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
          <feBlend in="SourceGraphic" mode="multiply" />
        </filter>
        <rect width="100%" height="100%" filter="url(#paper-noise)" fill="#c8b99a" />
      </svg>

      {/* ── 水墨晕染主 SVG ── */}
      <svg
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        width="100%"
        height="100%"
        className="absolute inset-0"
      >
        <defs>
          {/* 水墨边缘置换滤镜 */}
          <filter id="ink-blur-1" x="-30%" y="-30%" width="160%" height="160%">
            <feTurbulence
              type="turbulence"
              baseFrequency="0.012 0.016"
              numOctaves="3"
              seed="2"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="38"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
            <feGaussianBlur in="displaced" stdDeviation="22" />
          </filter>
          <filter id="ink-blur-2" x="-30%" y="-30%" width="160%" height="160%">
            <feTurbulence
              type="turbulence"
              baseFrequency="0.014 0.01"
              numOctaves="3"
              seed="7"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="44"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
            <feGaussianBlur in="displaced" stdDeviation="28" />
          </filter>
          <filter id="ink-blur-3" x="-30%" y="-30%" width="160%" height="160%">
            <feTurbulence
              type="turbulence"
              baseFrequency="0.01 0.018"
              numOctaves="3"
              seed="13"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="52"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
            <feGaussianBlur in="displaced" stdDeviation="32" />
          </filter>
        </defs>

        {/* 色块 1 — 粉灰，左上偏中，最先出现 */}
        <ellipse
          cx="320"
          cy="280"
          rx="280"
          ry="200"
          fill="rgba(188,170,158,0.22)"
          filter="url(#ink-blur-1)"
          style={{
            animation: "inkSpread 3s ease-out forwards, inkDrift 22s ease-in-out 3s infinite",
            transformOrigin: "320px 280px",
          }}
        />

        {/* 色块 2 — 淡赭黄，右中，稍晚出现 */}
        <ellipse
          cx="1100"
          cy="420"
          rx="340"
          ry="240"
          fill="rgba(200,185,155,0.18)"
          filter="url(#ink-blur-2)"
          style={{
            animation: "inkSpread 3.5s ease-out 0.8s forwards, inkDrift 28s ease-in-out 4.5s infinite",
            transformOrigin: "1100px 420px",
          }}
        />

        {/* 色块 3 — 浅青灰，右下角，最晚出现 */}
        <ellipse
          cx="900"
          cy="700"
          rx="260"
          ry="180"
          fill="rgba(158,172,165,0.14)"
          filter="url(#ink-blur-3)"
          style={{
            animation: "inkSpread 4s ease-out 1.8s forwards, inkDrift 32s ease-in-out 6s infinite",
            transformOrigin: "900px 700px",
          }}
        />

        {/* ── 毛笔线条 1 — 左上到右下对角淡墨细线 ── */}
        <path
          d="M -20,60 Q 180,200 420,320 T 820,580"
          fill="none"
          stroke="rgba(100,80,60,0.28)"
          strokeWidth="0.8"
          strokeLinecap="round"
          style={{
            strokeDasharray: 900,
            animation: "brushStroke 8s cubic-bezier(0.4,0,0.2,1) 2s forwards, brushFade 8s ease-in-out 2s infinite",
            ["--stroke-len" as string]: "900",
          }}
        />

        {/* ── 毛笔线条 2 — 右下角短弧线，笔意飘逸 ── */}
        <path
          d="M 1460,820 Q 1260,700 1080,610 T 780,480"
          fill="none"
          stroke="rgba(100,80,60,0.2)"
          strokeWidth="0.6"
          strokeLinecap="round"
          style={{
            strokeDasharray: 700,
            animation: "brushStroke 9s cubic-bezier(0.4,0,0.2,1) 4s forwards, brushFade 9s ease-in-out 4s infinite",
            ["--stroke-len" as string]: "700",
          }}
        />
      </svg>
    </div>
  );
}
