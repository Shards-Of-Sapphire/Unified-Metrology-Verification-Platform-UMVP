import React, { useEffect, useState } from 'react';
import { VerificationCertificate } from '../types';
import QRCode from 'qrcode';
import { Shield, Award, CheckCircle2, QrCode, Download, Printer, Lock, X } from 'lucide-react';

interface CertificateViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: VerificationCertificate | null;
}

export const CertificateViewModal: React.FC<CertificateViewModalProps> = ({
  isOpen,
  onClose,
  certificate,
}) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  useEffect(() => {
    if (certificate?.qrPayload) {
      QRCode.toDataURL(certificate.qrPayload, {
        width: 180,
        margin: 1,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      })
        .then((url) => setQrCodeDataUrl(url))
        .catch((err) => console.error(err));
    }
  }, [certificate]);

  if (!isOpen || !certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white text-slate-900 border border-slate-300 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Top Control Bar */}
        <div className="bg-slate-900 text-white px-6 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Digital Certificate of Verification (Section 24)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" /> Print Certificate
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Paper Canvas */}
        <div className="p-8 overflow-y-auto bg-amber-50/20 border-8 border-double border-amber-900/20 space-y-6">
          {/* Emblem & Header */}
          <div className="text-center space-y-1">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 border-2 border-amber-600/60 mb-1 text-amber-800 font-serif font-bold text-lg">
              सत्यमेव
            </div>
            <div className="text-xs uppercase font-bold tracking-widest text-slate-700">
              GOVERNMENT OF INDIA • MINISTRY OF CONSUMER AFFAIRS
            </div>
            <div className="text-xs font-semibold text-slate-600">
              Department of Legal Metrology • Weights and Measures Directorate
            </div>
            <h1 className="text-lg font-extrabold text-slate-900 pt-2 tracking-wide font-serif">
              CERTIFICATE OF VERIFICATION OF WEIGHTS & MEASURES
            </h1>
            <p className="text-[11px] text-slate-600 italic">
              [Issued under Rule 14 of the Legal Metrology (General) Rules, 2011]
            </p>
          </div>

          {/* Certificate Number & Seal Banner */}
          <div className="flex items-center justify-between border-y-2 border-slate-900/80 py-2 text-xs font-mono">
            <div>
              <span className="text-slate-500">Certificate No: </span>
              <span className="font-bold text-slate-900">{certificate.certificateNumber}</span>
            </div>
            <div>
              <span className="text-slate-500">Official Seal Punch: </span>
              <span className="font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                {certificate.sealNumber}
              </span>
            </div>
          </div>

          {/* Main Legal Body */}
          <div className="text-xs leading-relaxed text-slate-800 space-y-3">
            <p>
              I hereby certify that I have this day examined and verified the commercial weighing/measuring instrument described hereunder belonging to{' '}
              <strong className="text-slate-950 underline">{certificate.businessName}</strong> ({certificate.ownerName}), situated at{' '}
              <span className="font-medium">{certificate.installationAddress}</span>, and found it to strictly conform to the standards and permissible error limits prescribed by the Legal Metrology Act, 2009.
            </p>

            {/* Technical Specification Table */}
            <div className="border border-slate-300 rounded-lg overflow-hidden bg-white text-xs">
              <div className="grid grid-cols-2 bg-slate-100 font-semibold p-2 border-b border-slate-300 text-slate-700">
                <span>Technical Attribute</span>
                <span>Verified Metrological Record</span>
              </div>
              <div className="grid grid-cols-2 p-2 border-b border-slate-200">
                <span className="text-slate-600">Instrument Category:</span>
                <span className="font-semibold text-slate-900">{certificate.instrumentCategory.replace(/_/g, ' ')}</span>
              </div>
              <div className="grid grid-cols-2 p-2 border-b border-slate-200">
                <span className="text-slate-600">Model Specification:</span>
                <span className="font-mono text-slate-900">{certificate.modelNumber}</span>
              </div>
              <div className="grid grid-cols-2 p-2 border-b border-slate-200">
                <span className="text-slate-600">Manufacturer Serial No:</span>
                <span className="font-mono font-bold text-blue-900">{certificate.serialNumber}</span>
              </div>
              <div className="grid grid-cols-2 p-2">
                <span className="text-slate-600">Issuing Enforcement Officer:</span>
                <span className="text-slate-900 font-medium">{certificate.issuingLmoName} ({certificate.issuingLmoBadge})</span>
              </div>
            </div>
          </div>

          {/* Verification Period & Stamp */}
          <div className="flex items-center justify-between pt-2">
            <div className="space-y-1 text-xs">
              <div>
                <span className="text-slate-500">Date of Verification: </span>
                <span className="font-semibold">{new Date(certificate.issuedAt).toLocaleDateString('en-IN', { dateStyle: 'long' })}</span>
              </div>
              <div>
                <span className="text-slate-500">Next Re-Verification Due: </span>
                <span className="font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                  {new Date(certificate.validUntil).toLocaleDateString('en-IN', { dateStyle: 'long' })}
                </span>
              </div>
              <div className="text-[10px] text-slate-500 pt-1">
                Jurisdiction: {certificate.jurisdiction}
              </div>
            </div>

            {/* Scannable QR & Digital Seal */}
            <div className="text-center">
              {qrCodeDataUrl ? (
                <div className="p-2 bg-white border border-slate-300 rounded-xl shadow-sm inline-block">
                  <img src={qrCodeDataUrl} alt="Certificate QR" className="w-24 h-24" />
                  <span className="block text-[9px] font-mono text-slate-600 mt-1">Scan to Verify Authenticity</span>
                </div>
              ) : (
                <div className="w-24 h-24 bg-slate-100 border border-slate-300 flex items-center justify-center text-xs">
                  <QrCode className="w-6 h-6 text-slate-400" />
                </div>
              )}
            </div>
          </div>

          {/* Cryptographic Signature Footer */}
          <div className="pt-4 border-t border-slate-300 text-[10px] font-mono text-slate-600 space-y-1">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-slate-800 font-bold">
                <Lock className="w-3 h-3 text-emerald-600" /> Tamper-Proof HMAC-SHA256 Signature
              </span>
              <span className="text-emerald-700 font-bold">STATUS: VALID & SEALED</span>
            </div>
            <div className="bg-slate-100 p-1.5 rounded border border-slate-300 text-[9px] break-all">
              {certificate.hmacSignature}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
