import React, { useState, useEffect } from 'react';
import {
  Code,
  Key,
  Shield,
  Send,
  Copy,
  Check,
  Download,
  Terminal,
  Activity,
  Server,
  FileText,
  Lock,
  RefreshCw,
  ExternalLink,
  Plus,
  AlertCircle,
  Database
} from 'lucide-react';
import { fetchEnterpriseAuditLogs, fetchEnterpriseAPIKeys, createEnterpriseAPIKey } from '../services/api';
import { EnterpriseAuditLog, EnterpriseAPIKey, Jurisdiction } from '../types';

interface EnterpriseGatewayProps {
  jurisdiction: Jurisdiction;
}

export const EnterpriseGateway: React.FC<EnterpriseGatewayProps> = ({ jurisdiction }) => {
  const [activeTab, setActiveTab] = useState<'api_explorer' | 'audit_trail' | 'api_keys'>('api_explorer');
  const [codeLanguage, setCodeLanguage] = useState<'python' | 'typescript' | 'curl' | 'go'>('python');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLogFormat, setCopiedLogFormat] = useState(false);
  const [siemFormat, setSiemFormat] = useState<'splunk_cef' | 'datadog_json' | 'sentinel_syslog'>('splunk_cef');

  // API Keys state
  const [apiKeys, setApiKeys] = useState<EnterpriseAPIKey[]>([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyTier, setNewKeyTier] = useState('Institutional Brokerage');
  const [isCreatingKey, setIsCreatingKey] = useState(false);

  // Audit Logs state
  const [auditLogs, setAuditLogs] = useState<EnterpriseAuditLog[]>([]);
  const [certifications, setCertifications] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Webhook test state
  const [webhookUrl, setWebhookUrl] = useState('https://oms.hedgefund-prime.internal/api/v1/sentinel-hook');
  const [webhookStatus, setWebhookStatus] = useState<'idle' | 'testing' | 'success'>('idle');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [logsRes, keysRes] = await Promise.all([
        fetchEnterpriseAuditLogs(),
        fetchEnterpriseAPIKeys()
      ]);
      setAuditLogs(logsRes.logs);
      setCertifications(logsRes.complianceCertifications);
      setApiKeys(keysRes.keys);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    try {
      setIsCreatingKey(true);
      const res = await createEnterpriseAPIKey(newKeyName, newKeyTier);
      setApiKeys([res.key, ...apiKeys]);
      setNewKeyName('');
    } catch (e) {
      console.error(e);
    } finally {
      setIsCreatingKey(false);
    }
  };

  const handleTestWebhook = () => {
    setWebhookStatus('testing');
    setTimeout(() => {
      setWebhookStatus('success');
      setTimeout(() => setWebhookStatus('idle'), 4000);
    }, 900);
  };

  // Sample code snippets for API Explorer
  const getCodeSnippet = () => {
    if (codeLanguage === 'python') {
      return `# Python 3.10+ Production Integration: Sentinel Voice & Order Firewall
import asyncio
import httpx

API_ENDPOINT = "https://api.sentinel-securities.io/v1/forensics/detect"
API_KEY = "sk_live_sec_prod_99120"

async def inspect_incoming_order_call(audio_file_path: str, client_crd: str):
    async with httpx.AsyncClient(timeout=0.6) as client:
        with open(audio_file_path, "rb") as f:
            audio_bytes = f.read()

        payload = {
            "channel": "audio_call",
            "jurisdiction": "${jurisdiction}",
            "clientIdentifier": client_crd,
            "targetAsset": "US_TREASURY_TRANSFER",
            "audioBase64": audio_bytes.hex(),
            "mimeType": "audio/wav"
        }

        response = await client.post(
            API_ENDPOINT,
            json=payload,
            headers={"Authorization": f"Bearer {API_KEY}"}
        )
        data = response.json()
        
        # Immediate Automated Order Execution Gate
        if data["threatLevel"] == "CRITICAL" or data["syntheticRiskScore"] > 85:
            print(f"[ALERT] Halting order: Synthetic voice clone detected (Score: {data['syntheticRiskScore']}%)")
            return {"action": "BLOCK_ORDER_TRIGGER_2FA", "dossier": data}
            
        return {"action": "ALLOW_ORDER", "verified": True}

# Run inspection
# asyncio.run(inspect_incoming_order_call("wire_auth_call_882.wav", "CRD-116797"))`;
    }

    if (codeLanguage === 'typescript') {
      return `// TypeScript / Node.js OMS Order Execution Middleware
import axios from 'axios';

interface SentinelAnalysis {
  syntheticRiskScore: number;
  threatLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'AUTHENTIC';
  primaryVerdict: string;
}

export async function validateCorporatePressRelease(headline: string, bodyText: string): Promise<boolean> {
  const { data } = await axios.post<SentinelAnalysis>(
    'https://api.sentinel-securities.io/v1/forensics/detect',
    {
      channel: 'circular',
      jurisdiction: '${jurisdiction}',
      textContent: headline + '\\n' + bodyText
    },
    {
      headers: {
        'Authorization': 'Bearer ' + process.env.SENTINEL_API_KEY,
        'Content-Type': 'application/json'
      }
    }
  );

  if (data.threatLevel === 'CRITICAL') {
    throw new Error(\`Market Manipulation Alert: Forged Regulatory Disclosure (\${data.primaryVerdict})\`);
  }

  return true;
}`;
    }

    if (codeLanguage === 'curl') {
      return `# Shell cURL: Real-Time Sub-Second Voice Biometric & EDGAR Check
curl -X POST https://api.sentinel-securities.io/v1/forensics/detect \\
  -H "Authorization: Bearer sk_live_sec_prod_99120" \\
  -H "Content-Type: application/json" \\
  -d '{
    "channel": "audio_call",
    "jurisdiction": "${jurisdiction}",
    "textContent": "Authorizing emergency $45,000,000 collateral wire transfer to Zurich",
    "targetUserRole": "broker_compliance",
    "contextData": { "orderValueUSD": 45000000, "traderDesk": "NY_PRIME_01" }
  }'`;
    }

    return `// Go (Golang) High-Throughput Matching Engine Filter
package main

import (
    "bytes"
    "encoding/json"
    "net/http"
    "time"
)

type SentinelCheck struct {
    Channel      string \`json:"channel"\`
    Jurisdiction string \`json:"jurisdiction"\`
    TextContent  string \`json:"textContent"\`
}

func VerifyMarketTip(tipText string) (bool, error) {
    client := &http.Client{Timeout: 300 * time.Millisecond}
    payload, _ := json.Marshal(SentinelCheck{
        Channel:      "social_post",
        Jurisdiction: "${jurisdiction}",
        TextContent:  tipText,
    })

    req, _ := http.NewRequest("POST", "https://api.sentinel-securities.io/v1/forensics/detect", bytes.NewBuffer(payload))
    req.Header.Set("Authorization", "Bearer sk_live_sec_prod_99120")
    req.Header.Set("Content-Type", "application/json")

    resp, err := client.Do(req)
    if err != nil {
        return false, err
    }
    defer resp.Body.Close()
    return resp.StatusCode == http.StatusOK, nil
}`;
  };

  // SIEM Log Generator (Splunk CEF, Datadog JSON, Syslog)
  const formatAuditLogForSiem = (log: EnterpriseAuditLog) => {
    if (siemFormat === 'splunk_cef') {
      return `CEF:0|SecuritiesSentinel|MarketSurveillance|2.5.0|${log.action}|${log.statutoryRegime}|${log.threatLevel === 'CRITICAL' ? 10 : 7}|src=${log.ipAddress} suser=${log.actorId} act=${log.action} cs1Label=Jurisdiction cs1=${log.jurisdiction} cs2Label=TargetAsset cs2=${log.targetAsset} cn1Label=RiskScore cn1=${log.riskScore} msg=Synthetic Manipulation Flagged`;
    }
    if (siemFormat === 'datadog_json') {
      return JSON.stringify({
        timestamp: log.timestamp,
        service: 'securities-sentinel-core',
        ddsource: 'compliance_audit',
        event_id: log.id,
        actor: { id: log.actorId, role: log.actorRole, ip: log.ipAddress },
        market: { jurisdiction: log.jurisdiction, asset: log.targetAsset },
        forensic: { action: log.action, risk_score: log.riskScore, threat_level: log.threatLevel },
        statute_breached: log.statutoryRegime,
        siem_forwarded: true
      }, null, 2);
    }
    // Syslog RFC 5424
    return `<134>1 ${log.timestamp} sentinel-gateway.sec ops 4912 ${log.id} [statute@4381 regime="${log.statutoryRegime}" risk="${log.riskScore}"] Threat ${log.threatLevel} flagged on ${log.targetAsset} by actor ${log.actorId}`;
  };

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(getCodeSnippet());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const copySiemToClipboard = () => {
    const formatted = auditLogs.map(formatAuditLogForSiem).join('\n');
    navigator.clipboard.writeText(formatted);
    setCopiedLogFormat(true);
    setTimeout(() => setCopiedLogFormat(false), 2000);
  };

  return (
    <div id="enterprise-gateway-container" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Server className="w-5 h-5 text-cyan-400" />
              Enterprise Integration Gateway & SIEM Hub
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
              v2.5 SLA &lt;280ms
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Connect Order Management Systems (OMS), Fix/Fast exchange feeds, and corporate email relays with automated deepfake firewalls.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('api_explorer')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
              activeTab === 'api_explorer' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            API & OMS Integration
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('audit_trail')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
              activeTab === 'audit_trail' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            SOC2 / SIEM Audit Trail
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('api_keys')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
              activeTab === 'api_keys' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            API Keys & Tiers
          </button>
        </div>
      </div>

      {/* TAB 1: API EXPLORER & OMS WEBHOOKS */}
      {activeTab === 'api_explorer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Code Generator (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  OMS / EMS Integration SDK Code
                </span>
              </div>

              {/* Language Switcher */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px] font-mono">
                {(['python', 'typescript', 'curl', 'go'] as const).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setCodeLanguage(lang)}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      codeLanguage === lang ? 'bg-slate-800 text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Code Box */}
            <div className="relative rounded-xl bg-slate-950 border border-slate-800 overflow-hidden font-mono text-xs">
              <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border-b border-slate-800 text-slate-400 text-[11px]">
                <span>client_integration.{codeLanguage === 'typescript' ? 'ts' : codeLanguage === 'python' ? 'py' : codeLanguage === 'go' ? 'go' : 'sh'}</span>
                <button
                  type="button"
                  onClick={copyCodeToClipboard}
                  className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <pre className="p-4 text-slate-200 overflow-x-auto leading-relaxed max-h-[380px]">
                {getCodeSnippet()}
              </pre>
            </div>
          </div>

          {/* Right: Webhook Simulator & Endpoint Status (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Live Webhook Dispatch Tester */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  OMS Emergency Webhook Dispatch
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Test real-time event pushing to Bloomberg AIM, Charles River, or trading desk queues when a synthetic threat score exceeds threshold:
              </p>

              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-slate-300">Target Webhook Listener URL</label>
                <input
                  type="text"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                type="button"
                onClick={handleTestWebhook}
                disabled={webhookStatus === 'testing'}
                className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/40"
              >
                {webhookStatus === 'testing' ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Dispatching Test Packet...
                  </>
                ) : webhookStatus === 'success' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    Webhook Delivered (HTTP 200 OK • 14ms)
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    Simulate Threat Interception Callback
                  </>
                )}
              </button>
            </div>

            {/* REST Endpoints Catalog */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                Production Core Endpoints
              </span>

              <div className="space-y-2 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold text-[10px]">POST</span>
                    <span className="text-slate-300">/v1/forensics/detect</span>
                  </div>
                  <span className="text-[10px] text-emerald-400">p99: 290ms</span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold text-[10px]">POST</span>
                    <span className="text-slate-300">/v1/edgar/verify-filing</span>
                  </div>
                  <span className="text-[10px] text-emerald-400">p99: 140ms</span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold text-[10px]">POST</span>
                    <span className="text-slate-300">/v1/c2pa/sign-disclosure</span>
                  </div>
                  <span className="text-[10px] text-emerald-400">p99: 180ms</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AUDIT TRAIL & SIEM EXPORT */}
      {activeTab === 'audit_trail' && (
        <div className="space-y-5">
          {/* Compliance Banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-bold text-white">Compliance Standard Attestations:</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {certifications.map((cert, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-slate-950 text-emerald-300 border border-emerald-900/50"
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>

          {/* SIEM Format Toggle & Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">SIEM / SOAR Forwarding Format:</span>
              <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setSiemFormat('splunk_cef')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    siemFormat === 'splunk_cef' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Splunk CEF
                </button>
                <button
                  type="button"
                  onClick={() => setSiemFormat('datadog_json')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    siemFormat === 'datadog_json' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Datadog JSON
                </button>
                <button
                  type="button"
                  onClick={() => setSiemFormat('sentinel_syslog')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    siemFormat === 'sentinel_syslog' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Sentinel Syslog
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={copySiemToClipboard}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              {copiedLogFormat ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLogFormat ? 'Logs Copied' : 'Export Formatted SIEM Stream'}</span>
            </button>
          </div>

          {/* Audit Log Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] font-mono border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-3">Event ID</th>
                    <th className="py-3 px-3">Timestamp</th>
                    <th className="py-3 px-3">Jurisdiction</th>
                    <th className="py-3 px-3">Actor / IP</th>
                    <th className="py-3 px-3">Action</th>
                    <th className="py-3 px-3">Target Asset</th>
                    <th className="py-3 px-3 text-right">Risk</th>
                    <th className="py-3 px-3">Statutory Regime</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3 font-semibold text-cyan-300">{log.id}</td>
                      <td className="py-3 px-3 text-slate-400 text-[11px]">{new Date(log.timestamp).toLocaleTimeString()}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-white border border-slate-700">
                          {log.jurisdiction === 'IN' ? '🇮🇳 IN' : '🇺🇸 US'}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-sans">
                        <div className="font-semibold text-white">{log.actorId}</div>
                        <div className="text-[10px] font-mono text-slate-500">{log.ipAddress}</div>
                      </td>
                      <td className="py-3 px-3 text-slate-200">{log.action}</td>
                      <td className="py-3 px-3 text-slate-300 font-sans">{log.targetAsset}</td>
                      <td className="py-3 px-3 text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.threatLevel === 'CRITICAL' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {log.riskScore}%
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-400 font-sans text-[11px]">{log.statutoryRegime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: API KEYS & TIERS */}
      {activeTab === 'api_keys' && (
        <div className="space-y-6">
          {/* Create Key Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Plus className="w-4 h-4 text-cyan-400" />
              Provision Enterprise API Client Credential
            </h3>

            <form onSubmit={handleCreateKey} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              <div className="sm:col-span-6 space-y-1">
                <label className="text-xs text-slate-300 font-semibold">Client Name / System Identifier</label>
                <input
                  type="text"
                  placeholder="e.g. Goldman Prime Desk Order Gateway"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="sm:col-span-4 space-y-1">
                <label className="text-xs text-slate-300 font-semibold">Tier & Throughput Quota</label>
                <select
                  value={newKeyTier}
                  onChange={(e) => setNewKeyTier(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Institutional Brokerage">Institutional Brokerage (10k req/min)</option>
                  <option value="MII / Exchange Surveillance">MII / Exchange Surveillance (50k req/min)</option>
                  <option value="Developer Sandbox">Developer Sandbox (1k req/min)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={isCreatingKey || !newKeyName.trim()}
                  className="w-full py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-semibold transition-colors"
                >
                  Generate Key
                </button>
              </div>
            </form>
          </div>

          {/* Active Keys List */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {apiKeys.map((key) => (
              <div key={key.keyId} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white truncate max-w-[180px]">{key.name}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                    {key.status}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 flex items-center justify-between">
                  <span>{key.maskedKey}</span>
                  <Copy className="w-3.5 h-3.5 text-slate-500 hover:text-slate-300 cursor-pointer" />
                </div>

                <div className="text-[11px] space-y-1 text-slate-400">
                  <div className="flex justify-between">
                    <span>Tier:</span>
                    <span className="text-white font-medium">{key.tier}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rate Limit:</span>
                    <span className="text-white font-mono">{key.rateLimitPerMin.toLocaleString()} req/min</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Requests Today:</span>
                    <span className="text-cyan-300 font-mono font-bold">{key.requestsToday.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
