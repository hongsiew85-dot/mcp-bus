import React, { useState, useEffect } from 'react';
import { checkApiHealth, fetchLiveBusArrival, ApiHealthResponse } from '../services/ltaApi';
import { X, CheckCircle2, AlertCircle, RefreshCw, Key, ExternalLink, Code2, Copy, Check } from 'lucide-react';

interface ApiDiagnosticsModalProps {
  onClose: () => void;
}

export const ApiDiagnosticsModal: React.FC<ApiDiagnosticsModalProps> = ({ onClose }) => {
  const [healthData, setHealthData] = useState<ApiHealthResponse | null>(null);
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const runDiagnostics = async () => {
    setLoading(true);
    try {
      const health = await checkApiHealth();
      setHealthData(health);

      const testArrival = await fetchLiveBusArrival('04121');
      setTestResult(testArrival);
    } catch (e: any) {
      console.error(e);
      setTestResult({ error: e.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const copyUrl = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border border-[#E5E5EB] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#520059] to-[#6E1D74] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Code2 size={22} className="text-[#FFD6FA]" />
            <div>
              <h2 className="font-display font-bold text-base sm:text-lg">
                API Diagnostics & LTA Integration
              </h2>
              <p className="text-xs text-[#FFD6FA]/80">
                LTA Datamall v3 Proxy & Health Monitor
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">
          {/* Status Overview Card */}
          <div className="p-4 rounded-xl border border-[#E5E5EB] bg-[#FAFBFD] space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#171C24] text-sm flex items-center gap-2">
                {healthData ? (
                  <>
                    <CheckCircle2 size={18} className="text-[#00875A]" />
                    <span>API Server Status: {healthData.status.toUpperCase()}</span>
                  </>
                ) : (
                  <>
                    <AlertCircle size={18} className="text-[#D97706]" />
                    <span>Checking API Server...</span>
                  </>
                )}
              </span>

              <button
                onClick={runDiagnostics}
                disabled={loading}
                className="px-2.5 py-1 rounded-md border border-[#E5E5EB] bg-white text-[#520059] hover:bg-[#F0EEF2] flex items-center gap-1 font-semibold"
              >
                <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
                <span>Re-test</span>
              </button>
            </div>

            {healthData && (
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#F0F0F5] text-[11px] text-[#50434E]">
                <div>
                  <span className="text-[#82737F]">LTA Key Status:</span>{' '}
                  <span
                    className={`font-semibold ${
                      healthData.ltaIntegration.accountKeyConfigured
                        ? 'text-[#00875A]'
                        : 'text-[#D97706]'
                    }`}
                  >
                    {healthData.ltaIntegration.accountKeyConfigured
                      ? 'Configured (Live Production)'
                      : 'Not set yet (Simulation Mode)'}
                  </span>
                </div>
                <div>
                  <span className="text-[#82737F]">Endpoint:</span>{' '}
                  <span className="font-service">/api/bus-arrival</span>
                </div>
              </div>
            )}
          </div>

          {/* Setup Instructions for Vercel */}
          <div className="p-4 rounded-xl bg-[#FFF9F5] border border-[#FFDBCF] space-y-2">
            <div className="flex items-center gap-2 font-bold text-[#AB3600]">
              <Key size={16} />
              <span>How to configure LTA_ACCOUNT_KEY in Vercel:</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-[#50434E] leading-relaxed">
              <li>Open your project on <strong>Vercel Dashboard</strong>.</li>
              <li>Navigate to <strong>Settings</strong> → <strong>Environment Variables</strong>.</li>
              <li>
                Add Key: <code className="bg-[#FAF0FA] px-1 py-0.5 rounded text-[#520059] font-mono">LTA_ACCOUNT_KEY</code>
              </li>
              <li>
                Value: Your LTA Datamall API Key (from{' '}
                <a
                  href="https://datamall.lta.gov.sg/content/datamall/en/request-for-api.html"
                  target="_blank"
                  rel="noreferrer"
                  className="underline text-[#AB3600] inline-flex items-center gap-0.5"
                >
                  LTA Datamall <ExternalLink size={10} />
                </a>
                )
              </li>
              <li>Redeploy or push to apply the environment variable.</li>
            </ol>
          </div>

          {/* Test Live Query */}
          <div className="space-y-2">
            <div className="flex items-center justify-between font-bold text-[#171C24]">
              <span>Sample Endpoint: GET /api/bus-arrival?BusStopCode=04121</span>
              <button
                onClick={() => copyUrl(`${window.location.origin}/api/bus-arrival?BusStopCode=04121`)}
                className="flex items-center gap-1 text-[#6E1D74] hover:underline"
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                <span>{copied ? 'Copied' : 'Copy URL'}</span>
              </button>
            </div>

            <div className="bg-[#171C24] text-[#EDF0FD] p-3 rounded-lg font-mono text-[11px] overflow-x-auto max-h-48">
              {loading ? (
                <div className="text-gray-400 py-2">Executing query...</div>
              ) : testResult ? (
                <pre>{JSON.stringify(testResult.raw || testResult, null, 2)}</pre>
              ) : (
                <div className="text-red-400">Failed to query endpoint</div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#FAFBFD] border-t border-[#E5E5EB] flex items-center justify-between">
          <span className="text-[11px] text-[#82737F]">
            LTA Datamall v3 spec refreshes every 20 seconds
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#520059] text-white font-semibold rounded-lg hover:bg-[#6E1D74] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
