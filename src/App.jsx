import { useMemo, useState } from 'react'
import { Bear, Bow, Cake, Flower, useTypewriter } from './components.jsx'

// ✏️ Edit these
const NAME = 'Raaji'
const FROM = 'Chandu'
const LINES = [
   ' Arey sorry ra Raaji assalu ninnu hurt cheyyali ani assal anukoledhu ra Nuvvu ala ignore chesi seen lo pedithe last ki vunna okka manchi friend kuda ila naa hurt aina ra',
  'Aaa hurt aina kopam lo neeku msg chesa and ala moham meedha matladina ra even I regret of saying such harsh ra',
  'Em chestham manchiga mana ane friend kuda avasaram ledu annappudu hand istaru and nuvvu kuda ala ignore kodithe naa nachale. Next time kalsinappudu nannu kottali antey kottu.',
  'Please ra alugaku cute ga manchiga matladu kadha. Indaka kuda nuvvu matladale and aameki ichinav akkade ardham ayyindhi aligav ani.Sorrryyyyyy madam kshaminchandi mee fans assocition president ni'
]
const FLOWERS = [
  { color: '#ff6aa2', label: 'Sorry' },
  { color: '#ff9fc4', label: 'Accept cheyu kadha' },
  { color: '#e48bff', label: '😭😭' },
]

const EMOJI = ['🌸', '🎀', '✨', '🌷', '🧸', '🍰']
const COLORS = ['#ff4f8f', '#ff9fc4', '#ffd1e3', '#ffffff', '#ffb703', '#d62a6b']
const STEPS = 5

function Message({ text }) {
  const [shown, rest] = useTypewriter(text)
  return (
    <p>
      <span>{shown}</span>
      <span style={{ visibility: 'hidden' }}>{rest}</span>
    </p>
  )
}

export default function App() {
  const [step, setStep] = useState(0)
  const [line, setLine] = useState(0)
  const [bloomed, setBloomed] = useState([false, false, false])
  const [lit, setLit] = useState([true, true, true])
  const [answer, setAnswer] = useState(null)
  const [hugging, setHugging] = useState(false)
  const [taps, setTaps] = useState([])
  const [conf, setConf] = useState([])

  const floaters = useMemo(
    () => Array.from({ length: 16 }, (_, i) => ({
      id: i, left: Math.random() * 100, size: 18 + Math.random() * 26,
      dur: 9 + Math.random() * 9, delay: -Math.random() * 14, e: EMOJI[i % EMOJI.length],
    })), [])

  const burst = (n) => {
    const items = Array.from({ length: n }, (_, i) => ({
      id: Math.random(), left: Math.random() * 100, dur: 2.4 + Math.random() * 2.4,
      c: COLORS[i % COLORS.length], delay: Math.random() * 0.6,
    }))
    setConf((c) => c.concat(items))
    setTimeout(() => setConf((c) => c.filter((x) => !items.includes(x))), 6000)
  }
  const spawn = (x, y) => {
    const t = { id: Math.random(), x, y, e: EMOJI[Math.floor(Math.random() * 4)] }
    setTaps((a) => a.concat(t))
    setTimeout(() => setTaps((a) => a.filter((z) => z !== t)), 1000)
  }
  const hug = () => { setHugging(true); setTimeout(() => setHugging(false), 700) }

  const bloom = (i) => {
    if (bloomed[i]) return
    const next = bloomed.map((b, j) => (j === i ? true : b))
    setBloomed(next)
    if (next.every(Boolean)) burst(30)
  }
  const blow = (i) => {
    if (!lit[i]) return
    const next = lit.map((b, j) => (j === i ? false : b))
    setLit(next)
    if (next.every((b) => !b)) burst(40)
  }
  const reply = (a) => { setAnswer(a); hug(); if (a === 'yes') burst(90) }

  const allBloomed = bloomed.every(Boolean)
  const allOut = lit.every((b) => !b)

  let body
  if (step === 0) {
    body = (
      <div className="stage" key="s0">
        <Bear onStar={() => { burst(24); setStep(1) }} onHug={hug} hugging={hugging} />
        <h1>{NAME}, I’m sorry</h1>
        <p>This little bear has something to tell you. Give him a hug, or tap the star to open it.</p>
      </div>
    )
  } else if (step === 1) {
    body = (
      <div className="stage" key="s1">
        <h1>From me to you</h1>
        <div className="msg"><Message key={line} text={LINES[line]} /></div>
        <div className="dots">{LINES.map((_, i) => <i key={i} className={i === line ? 'on' : ''} />)}</div>
        {line > 0 && <button className="btn ghost" onClick={() => setLine(line - 1)}>Back</button>}
        <button className="btn" onClick={() => (line < LINES.length - 1 ? setLine(line + 1) : setStep(2))}>
          {line < LINES.length - 1 ? 'Keep reading' : 'One more thing'}
        </button>
      </div>
    )
  } else if (step === 2) {
    body = (
      <div className="stage" key="s2">
        <h1>A small bouquet</h1>
        <p className="small">Tap each flower. Every one is something I’m sorry for.</p>
        <div className="flowers">
          {FLOWERS.map((f, i) => <Flower key={f.label} {...f} bloomed={bloomed[i]} onBloom={() => bloom(i)} />)}
        </div>
        {allBloomed && (
          <div className="fade">
            <p>Picked for a good friend.</p>
            <button className="btn" onClick={() => setStep(3)}>Continue</button>
          </div>
        )}
      </div>
    )
  } else if (step === 3) {
    body = (
      <div className="stage" key="s3">
        <h1>{allOut ? 'Wish made' : 'Make a wish'}</h1>
        <Cake lit={lit} onBlow={blow} />
        <p><p>{allOut ? 'My wish: inka eppudu ninnu ala hurt chesey maatalu maatladanu 🤞' : 'Cute ga candles oodhu'}</p></p>
        {allOut && <button className="btn fade" onClick={() => setStep(4)}>Continue</button>}
      </div>
    )
  } else {
    body = (
      <div className="stage" key="s4">
        <Bear onHug={hug} hugging={hugging || answer === 'yes'} sad={answer !== 'yes'} />
        {answer === null && (
          <div>
            <h1>Can we talk?</h1>
            <p>Whatever you choose is okay. There’s no wrong answer here.</p>
            <button className="btn" onClick={() => reply('yes')}>I accept your sorry 🌸</button>
            <button className="btn ghost" onClick={() => reply('time')}>Em chedham antav madam gari alaka teerali antey</button>
          </div>
        )}
        {answer === 'yes' && (
          <div>
            <h1>Thank you, {NAME}</h1>
            <p>Chaalu 😭😭 ra accept chesinandhuku  </p>
            <div className="sig">– {FROM}</div>
          </div>
        )}
        {answer === 'time' && (
          <div>
            <h1>Of course</h1>
            <p>Cute ga daily sorry chebutha neek nachinappudu msg chey ledha chocolate order chesyana</p>
            <div className="sig">– {FROM}</div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="app" onPointerDown={(e) => spawn(e.clientX, e.clientY)}>
      <Bow side="l" /><Bow side="r" />
      <div className="floaters" aria-hidden="true">
        {floaters.map((f) => (
          <span key={f.id} style={{ left: `${f.left}%`, fontSize: f.size, animationDuration: `${f.dur}s`, animationDelay: `${f.delay}s` }}>{f.e}</span>
        ))}
      </div>
      {body}
      <div className="progress" aria-hidden="true">
        {Array.from({ length: STEPS }, (_, i) => <i key={i} className={i <= step ? 'on' : ''} />)}
      </div>
      {conf.map((c) => (
        <i key={c.id} className="conf" style={{ left: `${c.left}%`, background: c.c, animationDuration: `${c.dur}s`, animationDelay: `${c.delay}s` }} />
      ))}
      {taps.map((t) => <span key={t.id} className="tap" style={{ left: t.x, top: t.y }}>{t.e}</span>)}
    </div>
  )
}
