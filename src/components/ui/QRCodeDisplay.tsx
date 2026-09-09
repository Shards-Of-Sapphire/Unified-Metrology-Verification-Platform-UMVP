import { QRCodeSVG } from 'qrcode.react';

interface Props {
  value: string;
  size?: number;
  certificateNumber?: string;
}

export default function QRCodeDisplay({ value, size = 160, certificateNumber }: Props) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="p-4 bg-white rounded-xl border-2 border-slate-200 shadow-inner">
        <QRCodeSVG
          value={value}
          size={size}
          level="H"
          fgColor="#0d1b3e"
          bgColor="#ffffff"
          imageSettings={{
            src: '',
            excavate: false,
            width: 0,
            height: 0,
          }}
        />
      </div>
      {certificateNumber && (
        <p className="text-xs font-mono text-slate-500 text-center">{certificateNumber}</p>
      )}
      <p className="text-[10px] text-slate-400 text-center">Scan to verify authenticity</p>
    </div>
  );
}
