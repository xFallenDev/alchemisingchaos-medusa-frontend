export default function CelestialMark({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 240 240" fill="none" aria-hidden="true" focusable="false">
      <g stroke="currentColor" strokeWidth=".75">
        <circle cx="120" cy="120" r="99" />
        <circle cx="120" cy="120" r="85" strokeDasharray="2 5" />
        <circle cx="120" cy="120" r="66" />
        <circle cx="120" cy="120" r="43" />
        <path d="M120 8v224M8 120h224M41 41l158 158M199 41 41 199" />
        <path d="m120 40 69 120H51L120 40Zm0 160L51 80h138l-69 120Z" />
        <path d="m120 75 45 45-45 45-45-45 45-45Z" />
      </g>
      <g fill="currentColor">
        <circle cx="120" cy="120" r="5" />
        <circle cx="120" cy="21" r="2.5" />
        <circle cx="219" cy="120" r="2.5" />
        <circle cx="120" cy="219" r="2.5" />
        <circle cx="21" cy="120" r="2.5" />
        <path d="m120 94 3 20 20 6-20 6-3 20-3-20-20-6 20-6 3-20Z" />
      </g>
    </svg>
  )
}
