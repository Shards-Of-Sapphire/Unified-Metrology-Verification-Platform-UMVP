"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, ArrowRight, ArrowLeft } from 'lucide-react';
import AppShell from '../layout/AppShell';
import FileUpload from '../ui/FileUpload';
import { useAuth } from '../../contexts/AuthContext';

const INSTRUMENT_TYPES = [
  'Electronic Weighing Scale', 'Platform Scale', 'Fuel Dispenser', 'Petrol Pump Meter',
  'Water Meter', 'Energy Meter', 'Electronic Balance', 'Crane Scale',
  'Pressure Gauge', 'Flow Meter', 'Thermometer', 'Other',
];

const STEPS = ['Instrument Details', 'Usage & Location', 'Documents', 'Review & Submit'];

const inputClass = "w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";
const selectClass = inputClass + " appearance-none";

export default function NewApplicationPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    instrumentType: '', make: '', model: '', serialNumber: '', yearOfManufacture: '',
    location: '', state: '', pinCode: '', purposeOfUse: '', quantity: '1', notes: '', phone: '', latitude: '', longitude: '',
  });

  const update = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async () => {
    const response = await fetch('/api/applications', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ legalName: user?.name, contactName: user?.name, email: user?.email, phone: form.phone, address: form.location, serialNumber: form.serialNumber, category: form.instrumentType, serviceType: form.purposeOfUse, latitude: Number(form.latitude), longitude: Number(form.longitude) }) });
    if (response.ok) router.push('/user/applications');
  };

  return (
    <AppShell
      title="New Application"
      breadcrumbs={[{ label: 'Applications', href: '/user/applications' }, { label: 'New Application' }]}
      requiredRoutePrefix="/user"
    >
      <div className="max-w-2xl mx-auto">
        {/* Step indicator */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-6">
          <div className="flex items-center gap-3">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-3 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${i < step ? 'bg-green-500 text-white' : i === step ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                  {i < step ? <Check size={13} /> : i + 1}
                </div>
                <div className="hidden md:block">
                  <p className={`text-xs font-semibold ${i === step ? 'text-slate-800' : 'text-slate-400'}`}>{s}</p>
                </div>
                {i < STEPS.length - 1 && <div className="flex-1 h-px bg-slate-200 hidden md:block" />}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="font-bold text-slate-800 font-display text-lg mb-1">{STEPS[step]}</h2>
          <p className="text-slate-500 text-sm mb-6">
            {['Provide details about the instrument to be verified.', 'Where and how is this instrument used?', 'Upload supporting documents.', 'Review your application before submitting.'][step]}
          </p>

          {step === 0 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1.5">Instrument Type *</label>
                <select className={selectClass} value={form.instrumentType} onChange={e => update('instrumentType', e.target.value)}>
                  <option value="">Select instrument type</option>
                  {INSTRUMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1.5">Make / Manufacturer *</label>
                  <input className={inputClass} placeholder="e.g. Avery Weigh-Tronix" value={form.make} onChange={e => update('make', e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1.5">Model *</label>
                  <input className={inputClass} placeholder="e.g. ZM303" value={form.model} onChange={e => update('model', e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1.5">Serial Number *</label>
                  <input className={inputClass} placeholder="Manufacturer serial number" value={form.serialNumber} onChange={e => update('serialNumber', e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1.5">Year of Manufacture</label>
                  <input className={inputClass} placeholder="e.g. 2023" value={form.yearOfManufacture} onChange={e => update('yearOfManufacture', e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1.5">Installation Address *</label>
                <textarea className={inputClass + ' resize-none'} rows={2} placeholder="Shop/factory address where instrument is installed" value={form.location} onChange={e => update('location', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1.5">State *</label>
                  <select className={selectClass} value={form.state} onChange={e => update('state', e.target.value)}>
                    <option value="">Select state</option>
                    {['Delhi', 'Tamil Nadu', 'Maharashtra', 'Gujarat', 'Rajasthan', 'Karnataka', 'West Bengal', 'Bihar', 'Haryana', 'Punjab'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1.5">PIN Code *</label>
                  <input className={inputClass} placeholder="6-digit PIN code" maxLength={6} value={form.pinCode} onChange={e => update('pinCode', e.target.value)} />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1.5">Purpose of Use *</label>
                <input className={inputClass} placeholder="e.g. Commercial trade in grain market" value={form.purposeOfUse} onChange={e => update('purposeOfUse', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-semibold text-slate-600 block mb-1.5">Contact Phone *</label><input className={inputClass} value={form.phone} onChange={e => update('phone', e.target.value)} required /></div>
                <div><label className="text-xs font-semibold text-slate-600 block mb-1.5">Latitude *</label><input type="number" step="any" className={inputClass} value={form.latitude} onChange={e => update('latitude', e.target.value)} required /></div>
                <div><label className="text-xs font-semibold text-slate-600 block mb-1.5">Longitude *</label><input type="number" step="any" className={inputClass} value={form.longitude} onChange={e => update('longitude', e.target.value)} required /></div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1.5">Quantity of Similar Instruments</label>
                <input type="number" min="1" className={inputClass} value={form.quantity} onChange={e => update('quantity', e.target.value)} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <FileUpload label="Purchase Invoice / Bill *" accept=".pdf,.jpg,.png" maxFiles={2} />
              <FileUpload label="Previous Verification Certificate (if any)" accept=".pdf" maxFiles={1} />
              <FileUpload label="Type Approval Certificate (if applicable)" accept=".pdf" maxFiles={1} />
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1.5">Additional Notes</label>
                <textarea className={inputClass + ' resize-none'} rows={3} placeholder="Any additional information for the LMO..." value={form.notes} onChange={e => update('notes', e.target.value)} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-xl p-4 space-y-2.5">
                <h3 className="font-semibold text-slate-700 text-sm mb-3">Application Summary</h3>
                {[
                  ['Instrument Type', form.instrumentType || '—'],
                  ['Make / Model', form.make && form.model ? `${form.make} · ${form.model}` : '—'],
                  ['Serial Number', form.serialNumber || '—'],
                  ['Installation Address', form.location || '—'],
                  ['State', form.state || '—'],
                  ['Purpose of Use', form.purposeOfUse || '—'],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm border-b border-slate-100 pb-2">
                    <span className="text-slate-500">{k}</span>
                    <span className="text-slate-800 font-medium text-right max-w-[55%]">{v}</span>
                  </div>
                ))}
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-blue-700 text-sm">
                <p className="font-semibold mb-1">Declaration</p>
                <p className="text-xs text-blue-600">I declare that the information provided is accurate and complete. I understand that any false information may lead to rejection or legal action.</p>
                <label className="flex items-center gap-2 mt-2 cursor-pointer">
                  <input type="checkbox" className="rounded" defaultChecked />
                  <span className="text-xs font-medium">I agree to the above declaration</span>
                </label>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-5 border-t border-slate-100">
            {step > 0 ? (
              <button onClick={() => setStep(s => s - 1)} className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50">
                <ArrowLeft size={15} /> Back
              </button>
            ) : <div />}
            {step < STEPS.length - 1 ? (
              <button onClick={() => setStep(s => s + 1)} className="flex items-center gap-2 px-5 py-2 bg-gradient-royal text-white text-sm font-semibold rounded-xl hover:opacity-90">
                Next <ArrowRight size={15} />
              </button>
            ) : (
              <button onClick={handleSubmit} className="flex items-center gap-2 px-5 py-2 bg-gradient-teal text-white text-sm font-semibold rounded-xl hover:opacity-90">
                <Check size={15} /> Submit Application
              </button>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
