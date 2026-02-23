"use client";

/**
 * InkBackground — 米白宣纸底纹 + 灰色水墨晕染背景层
 *
 * 层级（从下到上）：
 * 1. 底色层          极浅米白 #F4F1EE
 * 2. 纸纤维颗粒层    中等频率 fractalNoise，宣纸颗粒质感
 * 3. 纤维短线层      横向拉伸 fractalNoise，散落纤维丝
 * 4. 灰色水墨晕染层  6个椭圆，从四角/边缘向中心漫散，中心大面积留白
 *    — 三个灰度层次：浅灰/中灰/深灰，无任何彩色
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

      {/* ── 2. 纸纤维颗粒噪点层 ── */}
      <svg
        width="100%"
        height="100%"
        className="absolute inset-0"
        style={{ opacity: 0.3 }}
      >
        <filter id="paper-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
          <feBlend in="SourceGraphic" mode="multiply" />
        </filter>
        <rect width="100%" height="100%" filter="url(#paper-grain)" fill="#c8c4be" />
      </svg>

      {/* ── 3. 纤维短线层（散落纤维丝） ── */}
      <svg
        width="100%"
        height="100%"
        className="absolute inset-0"
        style={{ opacity: 0.11 }}
      >
        <filter id="fiber-lines">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.10 0.82"
            numOctaves="2"
            seed="7"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="discrete" tableValues="0 0 0 0 0 0 1 1" />
          </feComponentTransfer>
          <feBlend in="SourceGraphic" mode="multiply" />
        </filter>
        <rect width="100%" height="100%" filter="url(#fiber-lines)" fill="#a8a49e" />
      </svg>

      {/* ── 4. 灰色水墨晕染层（纯灰无彩色，从边缘向中心漫散，中心留白） ── */}
      <svg
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        width="100%"
        height="100%"
        className="absolute inset-0"
      >
        <defs>
          {/* 左侧深灰墨团 */}
          <filter id="ink-gray-1" x="-60%" y="-60%" width="220%" height="220%">
            <feTurbulence type="turbulence" baseFrequency="0.007 0.010" numOctaves="4" seed="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="140" xChannelSelector="R" yChannelSelector="G" result="displaced" />
            <feGaussianBlur in="displaced" stdDeviation="78" />
          </filter>

          {/* 左上中灰漫散 */}
          <filter id="ink-gray-2" x="-60%" y="-60%" width="220%" height="220%">
            <feTurbulence type="turbulence" baseFrequency="0.009 0.007" numOctaves="3" seed="11" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="120" xChannelSelector="R" yChannelSelector="G" result="displaced" />
            <feGaussianBlur in="displaced" stdDeviation="68" />
          </filter>

          {/* 右上浅灰淡墨 */}
          <filter id="ink-gray-3" x="-60%" y="-60%" width="220%" height="220%">
            <feTurbulence type="turbulence" baseFrequency="0.008 0.012" numOctaves="3" seed="17" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="110" xChannelSelector="R" yChannelSelector="G" result="displaced" />
            <feGaussianBlur in="displaced" stdDeviation="72" />
          </filter>

          {/* 右侧中段中灰 */}
          <filter id="ink-gray-4" x="-60%" y="-60%" width="220%" height="220%">
            <feTurbulence type="turbulence" baseFrequency="0.011 0.008" numOctaves="3" seed="23" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="125" xChannelSelector="R" yChannelSelector="G" result="displaced" />
            <feGaussianBlur in="displaced" stdDeviation="65" />
          </filter>

          {/* 下方浅灰漫散 */}
          <filter id="ink-gray-5" x="-60%" y="-60%" width="220%" height="220%">
            <feTurbulence type="turbulence" baseFrequency="0.006 0.013" numOctaves="4" seed="29" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="100" xChannelSelector="R" yChannelSelector="G" result="displaced" />
            <feGaussianBlur in="displaced" stdDeviation="82" />
          </filter>

          {/* 左下深灰聚集 */}
          <filter id="ink-gray-6" x="-60%" y="-60%" width="220%" height="220%">
            <feTurbulence type="turbulence" baseFrequency="0.010 0.006" numOctaves="4" seed="37" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="130" xChannelSelector="R" yChannelSelector="G" result="displaced" />
            <feGaussianBlur in="displaced" stdDeviation="70" />
          </filter>
        </defs>

        <ellipse cx="80" cy="450" rx="420" ry="340" fill="rgba(100,104,106,0.22)" filter="url(#ink-gray-1)"
          style={{ animation: "inkSpread 4s ease-out forwards, inkDrift 32s ease-in-out 4s infinite", transformOrigin: "80px 450px" }} />
        <ellipse cx="200" cy="150" rx="380" ry="280" fill="rgba(142,145,147,0.20)" filter="url(#ink-gray-2)"
          style={{ animation: "inkSpread 4.5s ease-out 0.8s forwards, inkDrift 28s ease-in-out 5s infinite", transformOrigin: "200px 150px" }} />
        <ellipse cx="1300" cy="200" rx="360" ry="270" fill="rgba(178,180,180,0.18)" filter="url(#ink-gray-3)"
          style={{ animation: "inkSpread 5s ease-out 1.2s forwards, inkDrift 36s ease-in-out 6s infinite", transformOrigin: "1300px 200px" }} />
        <ellipse cx="1380" cy="500" rx="340" ry="300" fill="rgba(142,145,147,0.19)" filter="url(#ink-gray-4)"
          style={{ animation: "inkSpread 5.5s ease-out 1.8s forwards, inkDrift 30s ease-in-out 7s infinite", transformOrigin: "1380px 500px" }} />
        <ellipse cx="720" cy="880" rx="500" ry="260" fill="rgba(178,180,180,0.16)" filter="url(#ink-gray-5)"
          style={{ animation: "inkSpread 6s ease-out 2.4s forwards, inkDrift 38s ease-in-out 8s infinite", transformOrigin: "720px 880px" }} />
        <ellipse cx="180" cy="800" rx="360" ry="260" fill="rgba(110,113,115,0.18)" filter="url(#ink-gray-6)"
          style={{ animation: "inkSpread 5s ease-out 2s forwards, inkDrift 34s ease-in-out 7s infinite", transformOrigin: "180px 800px" }} />
      </svg>
    </div>
  );
}
