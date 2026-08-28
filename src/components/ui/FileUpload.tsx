"use client";

import { useState, useRef } from 'react';
import { Upload, X, FileText, CheckCircle } from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  status: 'uploading' | 'done' | 'error';
}

interface Props {
  label?: string;
  accept?: string;
  maxFiles?: number;
  onFilesChange?: (files: File[]) => void;
}

export default function FileUpload({ label = 'Upload Documents', accept = '.pdf,.jpg,.jpeg,.png', maxFiles = 5, onFilesChange }: Props) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (rawFiles: FileList) => {
    const newFiles: UploadedFile[] = Array.from(rawFiles).slice(0, maxFiles - files.length).map(f => ({
      id: Math.random().toString(36).slice(2),
      name: f.name,
      size: f.size > 1024 * 1024 ? `${(f.size / 1024 / 1024).toFixed(1)} MB` : `${(f.size / 1024).toFixed(0)} KB`,
      status: 'uploading',
    }));
    setFiles(prev => [...prev, ...newFiles]);
    onFilesChange?.(Array.from(rawFiles));
    setTimeout(() => {
      setFiles(prev => prev.map(f => newFiles.find(nf => nf.id === f.id) ? { ...f, status: 'done' } : f));
    }, 1200);
  };

  const remove = (id: string) => setFiles(prev => prev.filter(f => f.id !== id));

  return (
    <div className="space-y-3">
      {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          dragging ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-400 hover:bg-blue-50/50'
        }`}
      >
        <input ref={inputRef} type="file" className="hidden" accept={accept} multiple onChange={e => e.target.files && handleFiles(e.target.files)} />
        <Upload size={24} className={`mx-auto mb-3 ${dragging ? 'text-blue-500' : 'text-slate-400'}`} />
        <p className="text-sm font-medium text-slate-600">Drop files here or <span className="text-blue-600">browse</span></p>
        <p className="text-xs text-slate-400 mt-1">{accept.split(',').join(', ')} · Max {maxFiles} files</p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map(f => (
            <div key={f.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <FileText size={16} className="text-blue-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700 truncate">{f.name}</p>
                <p className="text-xs text-slate-400">{f.size}</p>
              </div>
              {f.status === 'uploading' ? (
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
              )}
              <button onClick={(e) => { e.stopPropagation(); remove(f.id); }} className="text-slate-400 hover:text-red-500">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
