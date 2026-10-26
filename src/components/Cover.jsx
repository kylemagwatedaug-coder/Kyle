// Generated cover art used until a real screenshot is provided.
export default function Cover({ hue = 160, image, label }) {
  if (image) return <img src={image} alt={label || ""} draggable="false" />;
  const a = `hsl(${hue} 45% 32%)`;
  const b = `hsl(${(hue + 40) % 360} 55% 14%)`;
  const c = `hsl(${(hue + 20) % 360} 60% 62%)`;
  const id = `g${hue}`;
  return (
    <svg viewBox="0 0 540 360" preserveAspectRatio="xMidYMid slice" role="img" aria-label={label || "Project cover"}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={a} />
          <stop offset="1" stopColor={b} />
        </linearGradient>
      </defs>
      <rect width="540" height="360" fill={`url(#${id})`} />
      <circle cx="400" cy="90" r="46" fill={c} opacity=".85" />
      <path d="M0 300 L120 190 L210 260 L330 140 L540 290 L540 360 L0 360Z" fill={b} opacity=".75" />
      <path d="M0 330 L160 250 L280 310 L400 230 L540 320 L540 360 L0 360Z" fill="#000" opacity=".25" />
    </svg>
  );
}
