import React, { useEffect, useRef, useState } from 'react';
import { VerificationCertificate } from '../types';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Shield, Award, CheckCircle2, QrCode, Download, Printer, Lock, X } from 'lucide-react';

interface CertificateViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: VerificationCertificate | null;
  authToken: string;
}

export const CertificateViewModal: React.FC<CertificateViewModalProps> = ({
  isOpen,
  onClose,
  certificate,
}) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [serverBaseUrl, setServerBaseUrl] = useState<string>(window.location.origin);
  const certificatePaperRef = useRef<HTMLDivElement>(null);

  // Fetch the machine's real LAN IP so QR codes work when scanned by phones
  useEffect(() => {
    fetch('/api/server-info')
      .then((r) => r.json())
      .then((info: { baseUrl: string }) => {
        if (info?.baseUrl) setServerBaseUrl(info.baseUrl);
      })
      .catch(() => { /* keep window.location.origin as fallback */ });
  }, []);

  const getCertificatePdfUrl = (currentCertificate: VerificationCertificate) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/certificates/${encodeURIComponent(currentCertificate.id)}/download.pdf?sig=${encodeURIComponent(currentCertificate.hmacSignature)}`;
  };

  const getCertificateVerifyUrl = (currentCertificate: VerificationCertificate) => {
    // Use the LAN IP-based URL so QR codes are scannable from mobile devices
    return `${serverBaseUrl}/?verify=${encodeURIComponent(currentCertificate.certificateNumber)}`;
  };

  const createQrCodeDataUrl = (currentCertificate: VerificationCertificate, baseUrl: string) =>
    QRCode.toDataURL(`${baseUrl}/?verify=${encodeURIComponent(currentCertificate.certificateNumber)}`, {
      width: 240,
      margin: 2,
      errorCorrectionLevel: 'H',
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    });

  useEffect(() => {
    if (certificate) {
      createQrCodeDataUrl(certificate, serverBaseUrl)
        .then((url) => setQrCodeDataUrl(url))
        .catch((err) => console.error(err));
    }
  }, [certificate, serverBaseUrl]);

  if (!isOpen || !certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    if (!certificate) return;
    setIsDownloading(true);
    try {
      if (!certificatePaperRef.current) throw new Error('Certificate paper is not ready.');
      const paperClone = certificatePaperRef.current.cloneNode(true) as HTMLDivElement;
      paperClone.classList.remove('overflow-y-auto');
      paperClone.classList.add('certificate-export-paper');
      paperClone.style.position = 'fixed';
      paperClone.style.left = '-10000px';
      paperClone.style.top = '0';
      paperClone.style.width = '794px';
      paperClone.style.height = 'auto';
      paperClone.style.maxHeight = 'none';
      paperClone.style.overflow = 'visible';
      paperClone.style.maxWidth = 'none';
      // Build the QR code data URL first – use LAN IP so PDF QR is scannable from phones
      const qrUrl = await createQrCodeDataUrl(certificate, serverBaseUrl);

      // ── Build a fully inline-styled certificate node ──────────────────────
      const wrap = document.createElement('div');
      wrap.style.cssText = `
        position:fixed;left:-9999px;top:0;
        width:794px;background:#fdfcf7;
        font-family:Georgia,serif;color:#0f172a;
        padding:48px 56px;box-sizing:border-box;
        border:6px double rgba(120,53,15,0.18);
      `;

      wrap.innerHTML = `
        <!-- EMBLEM -->
        <div style="text-align:center;margin-bottom:20px;">
          <div style="
            display:inline-flex;align-items:center;justify-content:center;
            width:72px;height:72px;border-radius:50%;
            background:linear-gradient(180deg,#fef3c7 0%,#fde68a 100%);
            border:2.5px solid #d97706;
            box-shadow:0 0 0 5px rgba(217,119,6,0.10);
            font-family:serif;font-size:12px;font-weight:700;
            color:#78350f;line-height:1.25;text-align:center;
            margin-bottom:14px;
          ">सत्यमेव</div>

          <div style="font-family:'Segoe UI',sans-serif;font-size:11px;font-weight:800;
            letter-spacing:0.18em;text-transform:uppercase;color:#1e293b;margin-top:4px;">
            Government of India &nbsp;•&nbsp; Ministry of Consumer Affairs
          </div>
          <div style="font-family:'Segoe UI',sans-serif;font-size:11px;font-weight:600;
            color:#475569;letter-spacing:0.04em;margin-top:3px;">
            Department of Legal Metrology &nbsp;•&nbsp; Weights and Measures Directorate
          </div>

          <h1 style="font-family:Georgia,serif;font-size:22px;font-weight:800;
            color:#0f172a;letter-spacing:0.04em;margin:14px 0 6px;line-height:1.3;">
            CERTIFICATE OF VERIFICATION OF WEIGHTS &amp; MEASURES
          </h1>
          <p style="font-family:Georgia,serif;font-size:11px;font-style:italic;
            color:#64748b;margin:0;">
            [Issued under Rule 14 of the Legal Metrology (General) Rules, 2011]
          </p>
        </div>

        <!-- CERT NO / SEAL BANNER -->
        <div style="
          display:grid;grid-template-columns:1fr 1fr;gap:16px;
          border-top:2px solid #1e293b;border-bottom:2px solid #1e293b;
          padding:12px 0;margin-bottom:20px;
          font-family:'Courier New',monospace;font-size:12px;
        ">
          <div>
            <div style="color:#64748b;font-size:11px;margin-bottom:3px;">Certificate No:</div>
            <div style="font-weight:700;color:#0f172a;word-break:break-all;line-height:1.4;">
              ${certificate.certificateNumber}
            </div>
          </div>
          <div>
            <div style="color:#64748b;font-size:11px;margin-bottom:3px;">Official Seal Punch:</div>
            <div>
              <span style="
                display:inline-block;font-weight:700;word-break:break-all;
                padding:2px 8px;border-radius:4px;line-height:1.5;
                color:#92400e;background:#fef3c7;border:1px solid #f59e0b;
              ">${certificate.sealNumber}</span>
            </div>
          </div>
        </div>

        <!-- LEGAL BODY -->
        <p style="font-family:'Segoe UI',sans-serif;font-size:13px;line-height:1.7;
          color:#1e293b;margin:0 0 20px;">
          I hereby certify that I have this day examined and verified the commercial
          weighing/measuring instrument described hereunder belonging to
          <strong style="text-decoration:underline;text-underline-offset:2px;">
            ${certificate.businessName}
          </strong>
          (${certificate.ownerName}), situated at
          <strong>${certificate.installationAddress}</strong>,
          and found it to strictly conform to the standards and permissible error
          limits prescribed by the Legal Metrology Act, 2009.
        </p>

        <!-- TECHNICAL TABLE -->
        <table style="width:100%;border-collapse:collapse;font-size:12px;
          font-family:'Segoe UI',sans-serif;border:1px solid #cbd5e1;
          border-radius:8px;overflow:hidden;margin-bottom:24px;">
          <thead>
            <tr style="background:#f1f5f9;">
              <th style="text-align:left;padding:10px 16px;font-weight:600;
                color:#475569;border-bottom:1px solid #cbd5e1;width:50%;">
                Technical Attribute
              </th>
              <th style="text-align:left;padding:10px 16px;font-weight:600;
                color:#475569;border-bottom:1px solid #cbd5e1;">
                Verified Metrological Record
              </th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom:1px solid #e2e8f0;">
              <td style="padding:9px 16px;color:#64748b;">Instrument Category:</td>
              <td style="padding:9px 16px;font-weight:700;color:#0f172a;
                text-transform:uppercase;letter-spacing:0.04em;">
                ${certificate.instrumentCategory.replace(/_/g, ' ')}
              </td>
            </tr>
            <tr style="border-bottom:1px solid #e2e8f0;">
              <td style="padding:9px 16px;color:#64748b;">Model Specification:</td>
              <td style="padding:9px 16px;font-family:'Courier New',monospace;color:#0f172a;">
                ${certificate.modelNumber}
              </td>
            </tr>
            <tr style="border-bottom:1px solid #e2e8f0;">
              <td style="padding:9px 16px;color:#64748b;">Manufacturer Serial No:</td>
              <td style="padding:9px 16px;font-family:'Courier New',monospace;
                font-weight:700;color:#1e3a5f;">
                ${certificate.serialNumber}
              </td>
            </tr>
            <tr>
              <td style="padding:9px 16px;color:#64748b;">Issuing Enforcement Officer:</td>
              <td style="padding:9px 16px;font-weight:500;color:#0f172a;">
                ${certificate.issuingLmoName} (${certificate.issuingLmoBadge})
              </td>
            </tr>
          </tbody>
        </table>

        <!-- QR CODE SECTION -->
        <div style="text-align:center;margin:20px 0;padding:16px 0;border-top:1px dashed #cbd5e1;border-bottom:1px dashed #cbd5e1;">
          <div style="display:inline-flex;flex-direction:column;align-items:center;
            padding:16px 20px;background:#fff;
            border:2px solid #0f172a;border-radius:12px;
            box-shadow:0 2px 8px rgba(0,0,0,0.10);">
            <div style="font-family:'Segoe UI',sans-serif;font-size:10px;font-weight:700;
              color:#475569;text-transform:uppercase;letter-spacing:0.12em;margin-bottom:10px;">
              ▶ Scan QR to Verify Certificate Authenticity
            </div>
            <img src="${qrUrl}" alt="Certificate QR"
              style="width:150px;height:150px;display:block;" />
            <div style="font-family:'Courier New',monospace;font-size:8px;
              color:#64748b;margin-top:8px;word-break:break-all;max-width:200px;">
              ${getCertificateVerifyUrl(certificate)}
            </div>
          </div>
        </div>

        <!-- DATES ROW -->
        <div style="font-family:'Segoe UI',sans-serif;font-size:12px;line-height:1.9;margin-bottom:16px;">
          <div>
            <span style="color:#64748b;">Date of Verification:&nbsp;</span>
            <span style="font-weight:600;color:#1e293b;">
              ${new Date(certificate.issuedAt).toLocaleDateString('en-IN', { dateStyle: 'long' })}
            </span>
          </div>
          <div>
            <span style="color:#64748b;">Next Re-Verification Due:&nbsp;</span>
            <span style="font-weight:700;color:#065f46;background:#d1fae5;
              padding:1px 8px;border-radius:4px;">
              ${new Date(certificate.validUntil).toLocaleDateString('en-IN', { dateStyle: 'long' })}
            </span>
          </div>
          <div style="font-size:10px;color:#94a3b8;margin-top:4px;">
            Jurisdiction: ${certificate.jurisdiction}
          </div>
        </div>

        <!-- HMAC FOOTER -->
        <div style="border-top:1px solid #e2e8f0;padding-top:14px;
          font-family:'Courier New',monospace;">
          <div style="display:flex;justify-content:space-between;align-items:center;
            margin-bottom:6px;">
            <span style="font-size:11px;font-weight:700;color:#334155;">
              🔒 Tamper-Proof HMAC-SHA256 Signature
            </span>
            <span style="font-size:11px;font-weight:700;color:#059669;">
              STATUS: VALID &amp; SEALED
            </span>
          </div>
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:4px;
            padding:8px 10px;font-size:9px;word-break:break-all;color:#64748b;">
            ${certificate.hmacSignature}
          </div>
        </div>
      `;

      document.body.appendChild(wrap);

      // Wait for QR image to fully load inside the node
      const qrImg = wrap.querySelector('img[alt="Certificate QR"]') as HTMLImageElement | null;
      if (qrImg && !qrImg.complete) {
        await new Promise<void>((resolve, reject) => {
          qrImg.addEventListener('load', () => resolve(), { once: true });
          qrImg.addEventListener('error', () => reject(new Error('QR image failed to load')), { once: true });
        });
      }

      if (document.fonts?.ready) await document.fonts.ready;

      let canvas: HTMLCanvasElement;
      try {
        canvas = await html2canvas(wrap, {
          backgroundColor: '#fdfcf7',
          scale: 2,
          useCORS: true,
          logging: false,
          width: 794,
        });
      } finally {
        wrap.remove();
      }

      const pdf = new jsPDF({ unit: 'pt', format: 'a4', orientation: 'portrait' });
      const margin = 20;
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const maxW = pageW - margin * 2;
      const maxH = pageH - margin * 2;
      const ratio = Math.min(maxW / canvas.width, maxH / canvas.height);
      const imgW = canvas.width * ratio;
      const imgH = canvas.height * ratio;
      pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        (pageW - imgW) / 2,
        margin,
        imgW,
        imgH,
        undefined,
        'FAST',
      );
      pdf.save(`${certificate.certificateNumber}.pdf`);
    } catch (error) {
      console.error('Certificate PDF download failed:', error);
      const response = await fetch(getCertificatePdfUrl(certificate));
      if (!response.ok) throw error;
      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${certificate.certificateNumber}.pdf`;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="certificate-modal fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="certificate-modal-shell bg-white text-slate-900 border border-slate-300 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">

        {/* ── Top Control Bar ── */}
        <div className="certificate-toolbar bg-slate-900 text-white px-5 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold truncate">
            <Award className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="truncate">Digital Certificate of Verification (Section 24)</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow"
            >
              <Download className="w-3.5 h-3.5" />
              {isDownloading ? 'Preparing PDF…' : 'Download PDF'}
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Certificate
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-700 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Certificate Paper ── */}
        <div
          ref={certificatePaperRef}
          className="certificate-paper flex-1 overflow-y-auto bg-[#fdfcf7] px-10 py-8 space-y-5"
          style={{ borderTop: '6px double rgba(120,53,15,0.18)' }}
        >

          {/* Emblem & Header */}
          <div className="text-center space-y-2">
            {/* Satyamev emblem circle */}
            <div
              className="mx-auto flex items-center justify-center rounded-full border-2 border-amber-500 bg-gradient-to-b from-amber-100 to-amber-200 text-amber-900 font-bold"
              style={{ width: 72, height: 72, fontSize: 13, fontFamily: 'serif', lineHeight: 1.2, boxShadow: '0 0 0 4px rgba(217,119,6,0.12)' }}
            >
              सत्यमेव
            </div>

            <div className="text-[11px] uppercase font-extrabold tracking-[0.18em] text-slate-800 mt-2">
              Government of India &nbsp;•&nbsp; Ministry of Consumer Affairs
            </div>
            <div className="text-[11px] font-semibold text-slate-600 tracking-wide">
              Department of Legal Metrology &nbsp;•&nbsp; Weights and Measures Directorate
            </div>

            <h1
              className="text-xl font-extrabold text-slate-900 pt-1 leading-snug"
              style={{ fontFamily: 'Georgia, serif', letterSpacing: '0.04em' }}
            >
              CERTIFICATE OF VERIFICATION OF WEIGHTS &amp; MEASURES
            </h1>
            <p className="text-[11px] text-slate-500 italic">
              [Issued under Rule 14 of the Legal Metrology (General) Rules, 2011]
            </p>
          </div>

          {/* ── Certificate No & Seal Banner ── */}
          <div
            className="grid grid-cols-2 gap-4 py-3 text-[12px] font-mono"
            style={{ borderTop: '2px solid #1e293b', borderBottom: '2px solid #1e293b' }}
          >
            <div>
              <span className="text-slate-500 text-[11px]">Certificate No:</span>
              <div className="font-bold text-slate-900 mt-0.5 leading-tight break-all">
                {certificate.certificateNumber}
              </div>
            </div>
            <div>
              <span className="text-slate-500 text-[11px]">Official Seal Punch:</span>
              <div className="mt-0.5">
                <span
                  className="inline-block font-bold break-all leading-snug px-2 py-0.5 rounded"
                  style={{
                    color: '#92400e',
                    background: '#fef3c7',
                    border: '1px solid #f59e0b',
                  }}
                >
                  {certificate.sealNumber}
                </span>
              </div>
            </div>
          </div>

          {/* ── Legal Body ── */}
          <p className="text-[13px] leading-relaxed text-slate-800">
            I hereby certify that I have this day examined and verified the commercial weighing/measuring
            instrument described hereunder belonging to{' '}
            <strong className="text-slate-950 underline underline-offset-2">
              {certificate.businessName}
            </strong>{' '}
            ({certificate.ownerName}), situated at{' '}
            <strong className="text-slate-900">{certificate.installationAddress}</strong>, and found it to
            strictly conform to the standards and permissible error limits prescribed by the Legal Metrology
            Act, 2009.
          </p>

          {/* ── Technical Specification Table ── */}
          <div className="rounded-lg overflow-hidden border border-slate-300 text-[12px]">
            {/* Table header */}
            <div className="grid grid-cols-2 bg-slate-100 border-b border-slate-300 px-4 py-2 font-semibold text-slate-700">
              <span>Technical Attribute</span>
              <span>Verified Metrological Record</span>
            </div>
            {[
              { label: 'Instrument Category:', value: certificate.instrumentCategory.replace(/_/g, ' '), className: 'font-bold text-slate-900 uppercase tracking-wide' },
              { label: 'Model Specification:', value: certificate.modelNumber, className: 'font-mono text-slate-900' },
              { label: 'Manufacturer Serial No:', value: certificate.serialNumber, className: 'font-mono font-bold text-blue-900' },
              { label: 'Issuing Enforcement Officer:', value: `${certificate.issuingLmoName} (${certificate.issuingLmoBadge})`, className: 'font-medium text-slate-900' },
            ].map((row, i, arr) => (
              <div
                key={row.label}
                className={`grid grid-cols-2 px-4 py-2 ${i < arr.length - 1 ? 'border-b border-slate-200' : ''}`}
              >
                <span className="text-slate-500">{row.label}</span>
                <span className={row.className}>{row.value}</span>
              </div>
            ))}
          </div>

          {/* ── QR Code ─ Prominent centered section ── */}
          <div className="border-t border-b border-dashed border-slate-300 py-5 my-2">
            <div className="flex justify-center">
              {qrCodeDataUrl ? (
                <div className="inline-flex flex-col items-center gap-3 p-4 bg-white border-2 border-slate-900 rounded-xl shadow-md">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    ▶ Scan QR to Verify Certificate Authenticity
                  </div>
                  <img src={qrCodeDataUrl} alt="Certificate QR" className="w-40 h-40" />
                  <span className="text-[8px] font-mono text-slate-400 max-w-[200px] text-center break-all">
                    {getCertificateVerifyUrl(certificate)}
                  </span>
                </div>
              ) : (
                <div className="w-40 h-40 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center">
                  <QrCode className="w-10 h-10 text-slate-400" />
                </div>
              )}
            </div>
          </div>

          {/* ── Dates ── */}
          <div className="space-y-1.5 text-[12px]">
            <div>
              <span className="text-slate-500">Date of Verification:&nbsp;</span>
              <span className="font-semibold text-slate-800">
                {new Date(certificate.issuedAt).toLocaleDateString('en-IN', { dateStyle: 'long' })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Next Re-Verification Due:&nbsp;</span>
              <span
                className="font-bold px-2 py-0.5 rounded text-emerald-800"
                style={{ background: '#d1fae5' }}
              >
                {new Date(certificate.validUntil).toLocaleDateString('en-IN', { dateStyle: 'long' })}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 pt-1">
              Jurisdiction: {certificate.jurisdiction}
            </div>
          </div>

          {/* ── HMAC Footer ── */}
          <div className="pt-4 border-t border-slate-200 text-[10px] font-mono text-slate-500 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-slate-700 font-bold text-[11px]">
                <Lock className="w-3 h-3 text-emerald-600" />
                Tamper-Proof HMAC-SHA256 Signature
              </span>
              <span className="text-emerald-700 font-bold text-[11px]">STATUS: VALID &amp; SEALED</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded px-2 py-1.5 break-all text-[9px]">
              {certificate.hmacSignature}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
