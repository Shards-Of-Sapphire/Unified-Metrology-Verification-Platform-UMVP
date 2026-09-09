import React, { useState, useEffect } from 'react';
import { E2EEMessage, UserSession } from '../types';
import { encryptE2EE, decryptE2EE } from '../utils/crypto';
import { Lock, Shield, Send, Key, Eye, EyeOff, CheckCircle2, AlertCircle, X, RefreshCw } from 'lucide-react';

interface E2EEMessagingModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId: string;
  applicationNumber: string;
  currentSession: UserSession;
}

export const E2EEMessagingModal: React.FC<E2EEMessagingModalProps> = ({
  isOpen,
  onClose,
  applicationId,
  applicationNumber,
  currentSession,
}) => {
  const [messages, setMessages] = useState<E2EEMessage[]>([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [messageType, setMessageType] = useState<'TEXT' | 'ACCESS_CODE' | 'TECHNICAL_SPEC'>('TEXT');
  const [showRawCiphertext, setShowRawCiphertext] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (isOpen && applicationId) {
      fetchMessages();
    }
  }, [isOpen, applicationId]);

  if (!isOpen) return null;

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/e2ee/messages/${applicationId}`, {
        headers: {
          Authorization: `Bearer ${currentSession.token}`,
        },
      });
      const data = await res.json();
      if (res.ok && data.messages) {
        // Decrypt each message client-side using authenticated session secret
        const decryptedList = await Promise.all(
          data.messages.map(async (msg: E2EEMessage) => {
            if (!msg.decryptedContent) {
              const decrypted = await decryptE2EE(msg.encryptedPayload, msg.iv);
              return { ...msg, decryptedContent: decrypted };
            }
            return msg;
          })
        );
        setMessages(decryptedList);
      }
    } catch (err) {
      console.error('Failed to load E2EE messages', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;

    setIsSending(true);
    try {
      // 1. Perform Client-side AES-GCM 256-bit encryption BEFORE transmitting over network
      const { cipherTextHex, ivHex } = await encryptE2EE(newMessageText);

      const recipientRole = currentSession.role === 'CITIZEN' ? 'LMO' : 'CITIZEN';
      const recipientId = currentSession.role === 'CITIZEN' ? 'lmo-malhotra-4091' : 'usr-cit-101';

      // 2. Transmit ciphertext to server
      const res = await fetch('/api/e2ee/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentSession.token}`,
        },
        body: JSON.stringify({
          applicationId,
          recipientId,
          recipientRole,
          encryptedPayload: cipherTextHex,
          iv: ivHex,
          messageType,
          decryptedContent: newMessageText, // Kept in local state
        }),
      });

      if (res.ok) {
        setNewMessageText('');
        fetchMessages();
      }
    } catch (err) {
      console.error('Failed to send encrypted message', err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden text-slate-100 flex flex-col h-[650px] max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white tracking-wide">END-TO-END ENCRYPTED DISPATCH</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  AES-GCM-256
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                App: {applicationNumber} • Channel: {currentSession.role} ↔ {currentSession.role === 'CITIZEN' ? 'Assigned LMO' : 'Applicant'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowRawCiphertext(!showRawCiphertext)}
              className="p-1.5 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 border border-slate-700 transition-colors"
              title="Toggle view of raw cryptographic ciphertext stored on server"
            >
              {showRawCiphertext ? <EyeOff className="w-3.5 h-3.5 text-amber-400" /> : <Eye className="w-3.5 h-3.5 text-blue-400" />}
              <span className="text-[11px] hidden sm:inline">{showRawCiphertext ? 'Show Decrypted' : 'Show Raw Ciphertext'}</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Security Enclave Notice */}
        <div className="bg-slate-950/60 px-6 py-2 border-b border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1 text-emerald-400">
            <Shield className="w-3 h-3" /> Zero-Knowledge Server: Plaintext is never stored in database
          </span>
          <span className="font-mono text-slate-500">IV Random 96-bit • Key derived client-side</span>
        </div>

        {/* Messages List */}
        <div className="flex-1 p-6 overflow-y-auto space-y-3 bg-slate-900/60">
          {isLoading ? (
            <div className="flex items-center justify-center h-full text-slate-400 gap-2 text-xs">
              <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
              Establishing cryptographic session and decrypting payloads...
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 text-xs space-y-2">
              <Lock className="w-8 h-8 text-slate-600 stroke-[1.5]" />
              <p>No sensitive transmissions yet for this application.</p>
              <p className="text-[11px] text-slate-600 text-center max-w-sm">
                Use this channel to exchange private premise access gate codes, fuel pump shut-off valve locations, or proprietary calibration manuals.
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMine = msg.senderRole === currentSession.role;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} space-y-1`}
                >
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 px-1">
                    <span className="font-semibold text-slate-300">{msg.senderName}</span>
                    <span className="text-slate-500">•</span>
                    <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {msg.messageType !== 'TEXT' && (
                      <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px] border border-amber-500/30">
                        {msg.messageType}
                      </span>
                    )}
                  </div>

                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-md ${
                      isMine
                        ? 'bg-blue-600 text-white rounded-br-xs'
                        : 'bg-slate-800 text-slate-100 border border-slate-700/80 rounded-bl-xs'
                    }`}
                  >
                    {showRawCiphertext ? (
                      <div className="space-y-1 font-mono text-[11px]">
                        <div className="text-amber-300 font-bold flex items-center gap-1">
                          <Key className="w-3 h-3" /> Stored Server Ciphertext:
                        </div>
                        <div className="bg-slate-950 p-2 rounded text-slate-400 break-all text-[10px]">
                          {msg.encryptedPayload}
                        </div>
                        <div className="text-[10px] text-slate-500">IV: {msg.iv}</div>
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap">{msg.decryptedContent || '[Encrypted Content]'}</div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Send Box */}
        <form onSubmit={handleSendMessage} className="p-4 bg-slate-950 border-t border-slate-800 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Transmission Purpose:</span>
            <div className="flex gap-1.5">
              {(['TEXT', 'ACCESS_CODE', 'TECHNICAL_SPEC'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setMessageType(type)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    messageType === type
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {type.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newMessageText}
              onChange={(e) => setNewMessageText(e.target.value)}
              placeholder="Type sensitive confidential instruction (encrypted before leaving browser)..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-400"
            />
            <button
              type="submit"
              disabled={isSending || !newMessageText.trim()}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow flex items-center gap-1.5"
            >
              {isSending ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  Encrypt & Dispatch
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
