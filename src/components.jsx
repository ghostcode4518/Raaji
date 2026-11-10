import { useEffect, useRef, useState } from 'react'

export const Bow = ({ side }) => (
  <svg className={`bow ${side}`} viewBox="0 0 100 100" aria-hidden="true">
    <path d="M50 50 L8 24 Q0 50 8 76Z" fill="#ff6aa2" />
    <path d="M50 50 L92 24 Q100 50 92 76Z" fill="#ff6aa2" />
    <path d="M50 50 L20 36 L20 64Z" fill="#ff3d85" />
    <path d="M50 50 L80 36 L80 64Z" fill="#ff3d85" />
    <path d="M42 56 L30 98 L44 88 L50 98Z" fill="#ff9fc4" />
    <path d="M58 56 L70 98 L56 88 L50 98Z" fill="#ff9fc4" />
    <circle cx="50" cy="50" r="11" fill="#d62a6b" />
  </svg>
)

const STAR = 'M50 6 L61 38 L95 38 L67 58 L78 92 L50 71 L22 92 L33 58 L5 38 L39 38Z'

// The bear's eyes follow the pointer. Click the bear for a hug, click the star to continue.
export function Bear({ onStar, onHug, hugging, sad = true }) {
  const ref = useRef(null)
  const [look, setLook] = useState([0, 0])

  useEffect(() => {
    const move = (e) => {
      const r = ref.current?.getBoundingClientRect()
      if (!r) return
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height * 0.4)
      const d = Math.hypot(dx, dy) || 1
      const k = Math.min(1, d / 200) * 3.5
      setLook([(dx / d) * k, (dy / d) * k])
    }
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [])

  return (
    <svg ref={ref} className={`bear${hugging ? ' hug' : ''}`} viewBox="0 0 200 230" role="img"
         aria-label="A teddy bear holding a star" onClick={onHug}>
      <circle cx="52" cy="48" r="22" fill="var(--bear)" /><circle cx="52" cy="48" r="11" fill="#f2a9b8" />
      <circle cx="148" cy="48" r="22" fill="var(--bear)" /><circle cx="148" cy="48" r="11" fill="#f2a9b8" />
      <ellipse cx="100" cy="178" rx="52" ry="48" fill="var(--bear)" />
      <ellipse cx="100" cy="190" rx="30" ry="30" fill="var(--bearlt)" />
      <circle cx="62" cy="214" r="17" fill="var(--bear)" /><circle cx="138" cy="214" r="17" fill="var(--bear)" />
      <circle cx="100" cy="88" r="52" fill="var(--bear)" />
      <ellipse cx="100" cy="104" rx="22" ry="17" fill="var(--bearlt)" />
      <ellipse cx="100" cy="97" rx="7" ry="5" fill="#5a2a2a" />
      <path d="M100 102 v6" stroke="#5a2a2a" strokeWidth="2.4" strokeLinecap="round" />
      <path d={hugging ? 'M90 110 q10 8 20 0' : 'M92 111 q8 6 16 0'} stroke="#5a2a2a" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <circle cx="80" cy="82" r="8" fill="#fff" /><circle cx="120" cy="82" r="8" fill="#fff" />
      <g style={{ transform: `translate(${look[0]}px, ${look[1]}px)`, transition: 'transform .12s' }}>
        <circle cx="80" cy="82" r="4.5" fill="#3b1a1a" /><circle cx="120" cy="82" r="4.5" fill="#3b1a1a" />
        <circle cx="81.5" cy="80.5" r="1.5" fill="#fff" /><circle cx="121.5" cy="80.5" r="1.5" fill="#fff" />
      </g>
      <path d="M70 68 q10 -6 18 -1 M130 68 q-10 -6 -18 -1" stroke="#5a2a2a" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      {sad && !hugging && <ellipse className="tear" cx="74" cy="94" rx="3" ry="5" fill="#8fd3ff" />}
      <circle cx="68" cy="102" r="7" fill="#ff9fc4" opacity={hugging ? 0.9 : 0.6} /><circle cx="132" cy="102" r="7" fill="#ff9fc4" opacity={hugging ? 0.9 : 0.6} />
      <path d="M100 140 L72 128 Q64 140 72 152Z M100 140 L128 128 Q136 140 128 152Z" fill="#ff4f8f" />
      <circle cx="100" cy="140" r="8" fill="#d62a6b" />
      <ellipse cx="62" cy="168" rx="14" ry="22" transform="rotate(25 62 168)" fill="var(--bear)" />
      <ellipse cx="138" cy="168" rx="14" ry="22" transform="rotate(-25 138 168)" fill="var(--bear)" />
      {onStar && (
        <g className="star" tabIndex="0" role="button" aria-label="Tap the star"
           onClick={(e) => { e.stopPropagation(); onStar() }}
           onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onStar() } }}>
          <path transform="translate(60 142) scale(.8)" d={STAR} fill="#ffb703" stroke="#fff" strokeWidth="4" strokeLinejoin="round" />
        </g>
      )}
    </svg>
  )
}

export function Flower({ color, label, bloomed, onBloom }) {
  return (
    <button className={`flower${bloomed ? ' bloomed' : ''}`} onClick={onBloom} aria-pressed={bloomed}>
      <svg viewBox="0 0 100 130" aria-hidden="true">
        <path d="M50 70 Q46 100 50 128" stroke="#4a9a54" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M50 105 q-22 -2 -26 -18 q20 0 26 18Z" fill="#6cc17a" />
        <g className="petals">
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <ellipse key={a} cx="50" cy="36" rx="12" ry="22" fill={color} transform={`rotate(${a} 50 52)`} />
          ))}
          <circle cx="50" cy="52" r="13" fill="#ffd54a" />
        </g>
        <circle className="bud" cx="50" cy="62" r="10" fill={color} />
      </svg>
      <span>{label}</span>
    </button>
  )
}

export function Cake({ lit, onBlow }) {
  const xs = [78, 110, 142]
  return (
    <svg className="cake" viewBox="0 0 220 200" role="group" aria-label="Cake with three candles">
      <ellipse cx="110" cy="182" rx="100" ry="12" fill="#ffd1e3" />
      <rect x="30" y="118" width="160" height="56" rx="14" fill="#7a3b2a" />
      <path d="M30 128 q12 22 24 0 q12 22 24 0 q12 22 24 0 q12 22 24 0 q12 22 24 0 q12 22 24 0 q12 22 24 0 L190 118 L30 118Z" fill="#ff9fc4" />
      <rect x="52" y="76" width="116" height="46" rx="12" fill="#ffe3ee" />
      <path d="M52 88 q10 20 20 0 q10 20 20 0 q10 20 20 0 q10 20 20 0 q10 20 20 0 q8 16 16 0 L168 76 L52 76Z" fill="#ff6aa2" />
      <circle cx="110" cy="70" r="9" fill="#d62a6b" />
      {xs.map((x, i) => (
        <g key={x} className="candle" tabIndex="0" role="button"
           aria-label={lit[i] ? `Blow out candle ${i + 1}` : `Candle ${i + 1} is out`}
           onClick={() => onBlow(i)}
           onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onBlow(i) } }}>
          <rect x={x - 12} y="14" width="24" height="60" fill="transparent" />
          <rect x={x - 5} y="44" width="10" height="28" rx="3" fill={i === 1 ? '#fff' : '#ffd1e3'} stroke="#ff4f8f" strokeWidth="2" />
          {lit[i] ? (
            <ellipse className="flame" style={{ animationDelay: `${i * 0.1}s` }} cx={x} cy="34" rx="6" ry="10" fill="#ffb703" />
          ) : (
            <path className="smoke" d={`M${x} 40 q-5 -8 0 -14 q5 -6 0 -12`} stroke="#aaa" strokeWidth="3" fill="none" strokeLinecap="round" />
          )}
        </g>
      ))}
    </svg>
  )
}

export function useTypewriter(text, speed = 26) {
  const [n, setN] = useState(0)
  useEffect(() => {
    setN(0)
    const id = setInterval(() => {
      setN((v) => { if (v >= text.length) { clearInterval(id); return v } return v + 1 })
    }, speed)
    return () => clearInterval(id)
  }, [text, speed])
  return [text.slice(0, n), text.slice(n)]
}
