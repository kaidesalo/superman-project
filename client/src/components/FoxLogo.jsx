function FoxLogo({ className = 'h-8 w-8' }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <polygon points="4,3 13,9 6,15" fill="#f97316" />
      <polygon points="28,3 19,9 26,15" fill="#f97316" />
      <polygon points="5,6 10,9 6.5,12" fill="#7c2d12" />
      <polygon points="27,6 22,9 25.5,12" fill="#7c2d12" />
      <path d="M4 12 L10 8 H22 L28 12 L16 29 Z" fill="#f97316" />
      <path d="M4 12 L11 15 L16 29 Z" fill="#fff" />
      <path d="M28 12 L21 15 L16 29 Z" fill="#fff" />
      <circle cx="12" cy="15" r="1.3" fill="#1e293b" />
      <circle cx="20" cy="15" r="1.3" fill="#1e293b" />
      <circle cx="16" cy="27" r="1.6" fill="#1e293b" />
    </svg>
  )
}

export default FoxLogo
