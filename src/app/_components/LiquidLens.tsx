// Edge refraction for `.glass-lens`. A displacement map leaves the middle of
// the pane alone (neutral grey) and bends what's behind it toward the edges,
// which is what makes glass look thick rather than frosted. Only Chromium can
// use an SVG filter in backdrop-filter, so the inline theme script sets
// `data-lens` there. Other browsers keep the plain blur from `.glass`.

const MAP = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" preserveAspectRatio="none"><defs><linearGradient id="x"><stop offset="0" stop-color="#f08000"/><stop offset=".16" stop-color="#808000"/><stop offset=".84" stop-color="#808000"/><stop offset="1" stop-color="#100000"/></linearGradient><linearGradient id="y" x2="0" y2="1"><stop offset="0" stop-color="#0000f0"/><stop offset=".22" stop-color="#000080"/><stop offset=".78" stop-color="#000080"/><stop offset="1" stop-color="#000010"/></linearGradient></defs><rect width="100" height="100" fill="url(#x)"/><rect width="100" height="100" fill="url(#y)" style="mix-blend-mode:screen"/></svg>`;

export default function LiquidLens() {
  return (
    <svg aria-hidden width="0" height="0" className="absolute">
      <filter id="liquid-lens" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
        <feImage href={`data:image/svg+xml,${encodeURIComponent(MAP)}`} x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="map" />
        <feDisplacementMap in="SourceGraphic" in2="map" scale="26" xChannelSelector="R" yChannelSelector="B" />
      </filter>
    </svg>
  );
}
