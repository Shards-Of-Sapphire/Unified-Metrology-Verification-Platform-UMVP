import Link from "next/link";
import { Scale } from "lucide-react";

export default function PublicUnavailablePage({ title, description }: { title: string; description: string }) {
  return <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4"><section className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm p-8"><Link href="/" className="flex items-center gap-2 mb-10"><div className="w-8 h-8 rounded-lg bg-gradient-royal flex items-center justify-center"><Scale size={14} className="text-white" /></div><span className="font-bold text-slate-800 font-display">UMVP</span></Link><p className="eyebrow">BACKEND CAPABILITY REQUIRED</p><h1 className="text-2xl font-bold text-slate-800 font-display">{title}</h1><p className="text-slate-500 text-sm leading-relaxed mt-3">{description}</p><Link href="/login" className="inline-flex mt-6 bg-gradient-royal text-white font-semibold px-4 py-2.5 rounded-xl text-sm">Return to Sign In</Link></section></main>;
}
