import React, { useState } from 'react';
import { InstrumentCategory, UserSession } from '../types';
import { Sparkles, FileText, CheckCircle2, Shield, AlertTriangle, X, RefreshCw } from 'lucide-react';

interface NewApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSession: UserSession;
  onApplicationCreated: () => void;
}

export const NewApplicationModal: React.FC<NewApplicationModalProps> = ({
  isOpen,
  onClose,
  currentSession,
  onApplicationCreated,
}) => {
  const [instrumentCategory, setInstrumentCategory] = useState<InstrumentCategory>('ELECTRONIC_WEIGHING_SCALE');
  const [manufacturer, setManufacturer] = useState('Essae-Teraoka Pvt Ltd');
  const [modelNumber, setModelNumber] = useState('DS-215N');
  const [serialNumber, setSerialNumber] = useState(`SN-EWS-${Math.floor(1000 + Math.random() * 9000)}-2026`);
  const [capacityOrRange, setCapacityOrRange] = useState('50 kg (Accuracy Class III, e=5g)');
  const [businessName, setBusinessName] = useState(currentSession.businessName || 'Apex Logistics & Retail Hub');
  const [installationAddress, setInstallationAddress] = useState(currentSession.address || 'Plot 88, Okhla Industrial Area Phase-III');
  const [city, setCity] = useState(currentSession.city || 'New Delhi');
  const [state, setState] = useState(currentSession.state || 'Delhi NCT');
  const [pincode, setPincode] = useState(currentSession.pincode || '110020');
  const [gdprConsent, setGdprConsent] = useState(true);

  React.useEffect(() => {
    if (isOpen) {
      if (currentSession.businessName) setBusinessName(currentSession.businessName);
      if (currentSession.address) setInstallationAddress(currentSession.address);
      if (currentSession.city) setCity(currentSession.city);
      if (currentSession.state) setState(currentSession.state);
      if (currentSession.pincode) setPincode(currentSession.pincode);
    }
  }, [isOpen, currentSession]);

  const [ocrInputText, setOcrInputText] = useState('');
  const [isOcrLoading, setIsOcrLoading] = useState(false);
  const [ocrSuccessMsg, setOcrSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleRunOcr = async (sampleText?: string) => {
    setIsOcrLoading(true);
    setOcrSuccessMsg('');
    setErrorMsg('');

    const textToProcess = sampleText || ocrInputText || 'INVOICE: Delivery to Apex Logistics. Equipment: Dover Fueling Solutions Quantium 510 Multi-Nozzle Fuel Dispenser, Serial No: SN-FD-7712-2026, Flow Rate 40 L/min Petrol/Diesel. Installed at GT Karnal Road Highway Outlet, New Delhi 110036.';

    try {
      const res = await fetch('/api/gemini/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentText: textToProcess }),
      });
      const data = await res.json();
      if (res.ok && data.extractedData) {
        const ext = data.extractedData;
        if (ext.instrumentCategory) setInstrumentCategory(ext.instrumentCategory);
        if (ext.manufacturer) setManufacturer(ext.manufacturer);
        if (ext.modelNumber) setModelNumber(ext.modelNumber);
        if (ext.serialNumber) setSerialNumber(ext.serialNumber);
        if (ext.capacityOrRange) setCapacityOrRange(ext.capacityOrRange);
        if (ext.installationAddress) setInstallationAddress(ext.installationAddress);
        if (ext.city) setCity(ext.city);
        if (ext.pincode) setPincode(ext.pincode);

        setOcrSuccessMsg('AI OCR successfully parsed invoice and auto-filled instrument attributes!');
      }
    } catch {
      setErrorMsg('AI OCR service failed to extract document. Please complete manually.');
    } finally {
      setIsOcrLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gdprConsent) {
      setErrorMsg('Mandatory GDPR / DPDP consent must be acknowledged before submitting personal data.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentSession.token}`,
        },
        body: JSON.stringify({
          instrumentCategory,
          manufacturer,
          modelNumber,
          serialNumber,
          capacityOrRange,
          businessName,
          installationAddress,
          city,
          state,
          pincode,
          contactEmail: currentSession.email,
          contactPhone: currentSession.phone || undefined,
          maskedAadhaarOrGstin: currentSession.gstin || undefined,
        }),
      });

      if (res.ok) {
        onApplicationCreated();
        onClose();
      } else {
        const data = await res.json();
        setErrorMsg(data.error || 'Failed to submit application.');
      }
    } catch {
      setErrorMsg('Network error while recording application in cryptographic ledger.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden text-slate-100 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">
                NEW VERIFICATION APPLICATION
              </h2>
              <p className="text-xs text-slate-400">
                Rule 11 Legal Metrology Act, 2009 Digital Application
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* AI OCR Auto-Fill Box */}
          <div className="p-4 bg-gradient-to-r from-blue-950/40 to-indigo-950/40 border border-blue-600/40 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-300 flex items-center gap-1.5 text-xs">
                <Sparkles className="w-4 h-4 text-blue-400" />
                AI OCR Invoice & Spec Auto-Fill (Gemini Powered)
              </span>
              <span className="text-[10px] font-mono text-blue-300/80">Phase 1 AI Feature</span>
            </div>
            <p className="text-slate-300 text-[11px]">
              Extract instrument model, capacity, and serial number automatically from equipment invoices or manufacturer calibration certificates.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleRunOcr('Invoice No 8812. Client: Apex Logistics. Equipment: Avery Weigh-Tronix Heavy Duty Weighbridge 60MT (e=10kg), Model E1205, Serial SN-WB-8819-2026. Delivery: Narela Grain Complex Warehouse 12, North Delhi 110040.')}
                disabled={isOcrLoading}
                className="px-3 py-1.5 bg-blue-600/60 hover:bg-blue-600 text-white rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
              >
                {isOcrLoading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                Sample 1: Weighbridge Invoice OCR
              </button>
              <button
                type="button"
                onClick={() => handleRunOcr('Invoice DF-994. Tokheim Quantium 510 Fuel Dispenser Dual Nozzle 40 L/min, Serial SN-FD-5512-2026. GT Karnal Highway Petrol Station, New Delhi 110036.')}
                disabled={isOcrLoading}
                className="px-3 py-1.5 bg-indigo-600/60 hover:bg-indigo-600 text-white rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
              >
                {isOcrLoading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                Sample 2: Fuel Dispenser Invoice OCR
              </button>
            </div>
            {ocrSuccessMsg && (
              <div className="p-2 bg-emerald-950/60 border border-emerald-800 text-emerald-300 rounded text-[11px] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                {ocrSuccessMsg}
              </div>
            )}
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Instrument Category</label>
              <select
                value={instrumentCategory}
                onChange={(e) => setInstrumentCategory(e.target.value as InstrumentCategory)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400"
              >
                <option value="ELECTRONIC_WEIGHING_SCALE">Electronic Weighing Scale (Counter/Platform)</option>
                <option value="FUEL_DISPENSER_PETROL_DIESEL">Fuel Dispenser (Petrol/Diesel Multi-Nozzle)</option>
                <option value="WEIGHBRIDGE_HEAVY_DUTY">Weighbridge (Heavy Duty 40MT-100MT)</option>
                <option value="PRESSURE_GAUGE_INDUSTRIAL">Pressure Gauge (Industrial Class)</option>
                <option value="FLOW_METER_CNG_LPG">Flow Meter (CNG/LPG Cryogenic)</option>
                <option value="STORAGE_TANK_CALIBRATION">Storage Tank / Dip-Tape Calibration</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Manufacturer</label>
              <input
                type="text"
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Model Number</label>
              <input
                type="text"
                value={modelNumber}
                onChange={(e) => setModelNumber(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Serial Number (Punch / Plate)</label>
              <input
                type="text"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400 font-mono text-amber-300"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Verification Capacity / Range</label>
              <input
                type="text"
                value={capacityOrRange}
                onChange={(e) => setCapacityOrRange(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Business / Premise Name</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Installation Site Address</label>
            <input
              type="text"
              value={installationAddress}
              onChange={(e) => setInstallationAddress(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">City / District</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">State / UT</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Pincode</label>
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>
          </div>

          {/* GDPR / DPDP Consent Confirmation */}
          <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={gdprConsent}
                onChange={(e) => setGdprConsent(e.target.checked)}
                className="mt-0.5 rounded border-slate-700 text-blue-600 focus:ring-0 w-4 h-4"
              />
              <span className="text-slate-300 text-[11px] leading-relaxed">
                <strong>Mandatory Statutory Consent:</strong> I hereby declare that the instrument details provided above are true and correct. I consent to the processing of installation geotags and business identity under Section 24 of the Legal Metrology Act, 2009 and the Digital Personal Data Protection Act, 2023.
              </span>
            </label>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-950/60 border border-rose-800 text-rose-300 rounded-xl flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Appending Application to Immutable Ledger...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Submit Verification Application & Record in Ledger
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
