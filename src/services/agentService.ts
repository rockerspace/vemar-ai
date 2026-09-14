import { AgentId, AgentChatMessage, MorningBriefingReport, BetaReadinessCheckItem, Jurisdiction } from '../types';

export interface ChatResponse {
  success: boolean;
  agentId: AgentId;
  text: string;
  metadata?: any;
  timestamp: string;
}

export interface BetaDiagnosticsResponse {
  success: boolean;
  readinessScore: number;
  status: string;
  totalExecutionTimeMs: number;
  timestamp: string;
  checks: BetaReadinessCheckItem[];
}

export async function sendAgentMessage(
  agentId: AgentId,
  message: string,
  history: AgentChatMessage[],
  jurisdiction: Jurisdiction = 'GLOBAL'
): Promise<ChatResponse> {
  const res = await fetch('/api/agents/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      agentId,
      message,
      history: history.map(h => ({ sender: h.sender, text: h.text })),
      jurisdiction,
      preMarketTime: '06:00 AM'
    })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Network error' }));
    throw new Error(err.error || 'Failed to send message to agent');
  }

  return res.json();
}

export async function fetchMorningBriefing(jurisdiction: Jurisdiction = 'GLOBAL'): Promise<MorningBriefingReport> {
  const res = await fetch('/api/agents/morning-briefing', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jurisdiction })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Network error' }));
    throw new Error(err.error || 'Failed to generate morning briefing');
  }

  const data = await res.json();
  return data.report;
}

export async function runBetaDiagnostics(): Promise<BetaDiagnosticsResponse> {
  const res = await fetch('/api/beta/run-diagnostics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Network error' }));
    throw new Error(err.error || 'Failed to run beta diagnostics');
  }

  return res.json();
}

// ============================================================================
// VOICE SYNTHESIS (TEXT-TO-SPEECH) HELPER
// ============================================================================

export function speakAgentResponse(
  text: string,
  pitch: number = 1.0,
  rate: number = 1.0,
  onEnd?: () => void
): { stop: () => void } {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return { stop: () => {} };
  }

  window.speechSynthesis.cancel();

  // Clean markdown tags and code snippets from spoken text
  const cleanSpeechText = text
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/[*_#>-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleanSpeechText) {
    if (onEnd) onEnd();
    return { stop: () => {} };
  }

  const utterance = new SpeechSynthesisUtterance(cleanSpeechText);
  utterance.pitch = pitch;
  utterance.rate = rate;

  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel')));
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  utterance.onend = () => {
    if (onEnd) onEnd();
  };

  utterance.onerror = () => {
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);

  return {
    stop: () => {
      window.speechSynthesis.cancel();
      if (onEnd) onEnd();
    }
  };
}

// ============================================================================
// 06:00 AM DAILY ALARM & BROWSER NOTIFICATION HELPER
// ============================================================================

export function getMillisecondsUntilNext6AM(targetHour: number = 6, targetMinute: number = 0): number {
  const now = new Date();
  const next6AM = new Date();
  next6AM.setHours(targetHour, targetMinute, 0, 0);

  if (now.getTime() >= next6AM.getTime()) {
    next6AM.setDate(next6AM.getDate() + 1);
  }

  return next6AM.getTime() - now.getTime();
}

export function formatTimeUntilNextBriefing(targetHour: number = 6, targetMinute: number = 0): string {
  const ms = getMillisecondsUntilNext6AM(targetHour, targetMinute);
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
}
