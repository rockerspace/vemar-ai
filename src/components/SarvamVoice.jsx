import { useState, useRef } from 'react'

const LANGS = [
  { code: 'hi-IN', label: 'Hindi' },
  { code: 'en-IN', label: 'English (IN)' },
  { code: 'ta-IN', label: 'Tamil' },
  { code: 'te-IN', label: 'Telugu' },
  { code: 'kn-IN', label: 'Kannada' },
  { code: 'ml-IN', label: 'Malayalam' },
  { code: 'mr-IN', label: 'Marathi' },
  { code: 'bn-IN', label: 'Bengali' },
]

const SPEAKERS = ['shubh', 'anushka', 'abhilash', 'manisha', 'vidya', 'arjun']

export default function SarvamVoice({
  onTranscript,      // (text, langCode) => void  — called when STT completes
  textToSpeak,       // string | null              — set to speak a response
  onSpeakDone,       // () => void                 — called when TTS audio ends
  compact = false,   // hides language/speaker controls when true
}) {
  const [recording, setRecording] = useState(false)
  const [loading, setLoading] = useState(false)
  const [transcript, setTranscript] = useState(null)
  const [error, setError] = useState(null)
  const [lang, setLang] = useState('hi-IN')
  const [speaker, setSpeaker] = useState('shubh')
  const [speaking, setSpeaking] = useState(false)
  const mediaRef = useRef(null)
  const chunksRef = useRef([])
  const audioRef = useRef(null)

  /* ── STT ─────────────────────────────────────────── */
  async function startRec() {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mr = new MediaRecorder(stream, { mimeType: 'audio/webm' })
      chunksRef.current = []
      mr.ondataavailable = e => chunksRef.current.push(e.data)
      mr.onstop = () => sendAudio(stream)
      mediaRef.current = mr
      mr.start()
      setRecording(true)
    } catch {
      setError('Microphone access denied.')
    }
  }

  function stopRec() {
    mediaRef.current?.stop()
    setRecording(false)
    setLoading(true)
  }

  async function sendAudio(stream) {
    stream.getTracks().forEach(t => t.stop())
    try {
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
      const fd = new FormData()
      fd.append('file', blob, 'rec.webm')
      fd.append('language_code', lang)
      fd.append('model', 'saaras:v3')
      const res = await fetch('/api/stt', { method: 'POST', body: fd })
      const data = await res.json()
      const text = data.transcript || data.text || ''
      if (!text) throw new Error('No transcript returned')
      setTranscript({ text, lang })
      onTranscript?.(text, lang)
    } catch (e) {
      setError(e.message || 'Transcription failed.')
    } finally {
      setLoading(false)
    }
  }

  /* ── TTS ─────────────────────────────────────────── */
  async function speak(text) {
    if (!text || speaking) return
    setSpeaking(true)
    setError(null)
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, language_code: lang, speaker }),
      })
      const data = await res.json()
      // Sarvam returns { audios: [base64] }
      const b64 = data.audios?.[0] || data.audio
      if (!b64) throw new Error('No audio returned')
      const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0))
      const blob = new Blob([bytes], { type: 'audio/wav' })
      const url = URL.createObjectURL(blob)
      const a = new Audio(url)
      audioRef.current = a
      a.onended = () => { setSpeaking(false); onSpeakDone?.(); URL.revokeObjectURL(url) }
      a.play()
    } catch (e) {
      setError(e.message || 'TTS failed.')
      setSpeaking(false)
    }
  }

  function stopSpeak() {
    audioRef.current?.pause()
    setSpeaking(false)
    onSpeakDone?.()
  }

  // Auto-speak when parent passes textToSpeak
  const prevText = useRef(null)
  if (textToSpeak && textToSpeak !== prevText.current) {
    prevText.current = textToSpeak
    speak(textToSpeak)
  }

  return (
    <div className="sv-root">
      {!compact && (
        <div className="sv-controls">
          <select
            className="sv-select"
            value={lang}
            onChange={e => setLang(e.target.value)}
            aria-label="Language"
          >
            {LANGS.map(l => (
              <option key={l.code} value={l.code}>{l.label}</option>
            ))}
          </select>
          <select
            className="sv-select"
            value={speaker}
            onChange={e => setSpeaker(e.target.value)}
            aria-label="Speaker voice"
          >
            {SPEAKERS.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      )}

      <div className="sv-btn-row">
        {/* Record / Stop */}
        {!recording ? (
          <button
            className={`sv-btn ${loading ? 'sv-btn--loading' : ''}`}
            onClick={startRec}
            disabled={loading || speaking}
            aria-label="Start recording"
          >
            <span className="sv-btn-icon">🎙</span>
            {loading ? 'Transcribing…' : 'Speak'}
          </button>
        ) : (
          <button
            className="sv-btn sv-btn--rec"
            onClick={stopRec}
            aria-label="Stop recording"
          >
            <span className="sv-btn-icon">⏹</span>
            Stop
          </button>
        )}

        {/* TTS: only shown when parent passes text */}
        {textToSpeak && (
          <button
            className={`sv-btn ${speaking ? 'sv-btn--rec' : ''}`}
            onClick={() => speaking ? stopSpeak() : speak(textToSpeak)}
            disabled={recording || loading}
            aria-label={speaking ? 'Stop speaking' : 'Listen to response'}
          >
            <span className="sv-btn-icon">{speaking ? '⏹' : '🔊'}</span>
            {speaking ? 'Stop' : 'Listen'}
          </button>
        )}
      </div>

      {transcript && (
        <div className="sv-transcript">
          <div className="sv-transcript-label">
            Transcript
            <span className="sv-lang-badge">{transcript.lang}</span>
          </div>
          <div className="sv-transcript-text">{transcript.text}</div>
          {onTranscript && (
            <button
              className="sv-use-btn"
              onClick={() => onTranscript(transcript.text, transcript.lang)}
            >
              Use this ↑
            </button>
          )}
        </div>
      )}

      {error && <div className="sv-error">{error}</div>}
    </div>
  )
}
