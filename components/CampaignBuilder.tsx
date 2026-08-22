'use client';

import { useAuth } from '@/contexts/AuthContext';
import { authenticatedFetch } from '@/lib/api-client';
import type { CampaignLog } from '@/types/talkops';
import { Check, FileSpreadsheet, FileUp, LoaderCircle, MessageSquareText, Rocket, Users } from 'lucide-react';
import { ChangeEvent, useState } from 'react';

export default function CampaignBuilder() {
  const { firebaseUser } = useAuth();
  const [step, setStep] = useState(1);
  const [campaignName, setCampaignName] = useState('Customer follow-up');
  const [campaignText, setCampaignText] = useState('Namaste! We have an update for you. Reply to this message to speak with our team.');
  const [contactCount, setContactCount] = useState(0);
  const [fileName, setFileName] = useState('');
  const [partner, setPartner] = useState<'interakt' | 'aisensy'>('interakt');
  const [loading, setLoading] = useState(false);
  const [launched, setLaunched] = useState<CampaignLog | null>(null);
  const [error, setError] = useState('');

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError('');
    try {
      const XLSX = await import('xlsx');
      const workbook = XLSX.read(await file.arrayBuffer(), { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(firstSheet, { defval: '' });
      setContactCount(rows.filter((row) => Object.values(row).some((value) => String(value).trim())).length);
      setFileName(file.name);
    } catch {
      setError('The contact file could not be parsed. Upload a valid CSV, XLS, or XLSX file.');
      setContactCount(0);
      setFileName('');
    }
  }

  async function redirectToPartner() {
    if (!firebaseUser) return;
    if (!contactCount) {
      setError('Upload a contact file with at least one row.');
      setStep(1);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const result = await authenticatedFetch<{ campaign: CampaignLog; redirectUrl: string }>(firebaseUser, '/api/campaigns/redirect', {
        method: 'POST',
        body: JSON.stringify({ campaignName, campaignText, contactCount, partner }),
      });
      setLaunched(result.campaign);
      window.setTimeout(() => { window.location.href = result.redirectUrl; }, 650);
    } catch (launchError) {
      setError(launchError instanceof Error ? launchError.message : 'Unable to save the campaign.');
    } finally {
      setLoading(false);
    }
  }

  const steps = [{ number: 1, label: 'Audience', icon: Users }, { number: 2, label: 'Message', icon: MessageSquareText }, { number: 3, label: 'Partner', icon: Rocket }];

  return (
    <section id="campaigns" className="scroll-mt-20" aria-labelledby="campaign-title">
      <div className="mb-5"><p className="eyebrow">Campaign workspace</p><h2 id="campaign-title" className="mt-2 text-xl font-semibold">Build campaign</h2></div>
      <div className="glass-panel p-5 lg:p-6">
        <div className="grid grid-cols-3 border border-white/10">{steps.map((item) => { const Icon = item.icon; const done = step > item.number || launched; return <button key={item.number} type="button" onClick={() => !launched && setStep(item.number)} className={`flex h-14 items-center justify-center gap-2 border-r border-white/10 text-xs last:border-r-0 ${step === item.number ? 'bg-white/[0.08] text-white' : 'text-white/35'}`}>{done ? <Check size={15} className="text-acid" /> : <Icon size={15} />}<span className="hidden sm:inline">{item.label}</span></button>; })}</div>
        <div className="min-h-64 py-7">
          {launched ? <div className="flex min-h-52 flex-col items-center justify-center text-center"><span className="flex size-12 items-center justify-center bg-acid text-ink"><Rocket size={21} /></span><h3 className="mt-4 font-semibold">Campaign saved</h3><p className="mt-2 max-w-sm text-sm text-white/40">Redirecting {launched.contactCount.toLocaleString('en-IN')} contacts to {partner === 'interakt' ? 'Interakt' : 'AiSensy'}.</p></div>
          : step === 1 ? <div><label className="block text-xs text-white/45" htmlFor="campaign-name">Campaign name</label><input id="campaign-name" className="field mt-2" value={campaignName} onChange={(event) => setCampaignName(event.target.value)} /><label className="mt-4 flex min-h-28 cursor-pointer flex-col items-center justify-center border border-dashed border-white/15 text-white/35 hover:border-acid/50 hover:text-white/60"><FileUp size={20} /><span className="mt-2 text-xs">Upload CSV or Excel contact list</span><span className="mt-1 text-[10px] text-white/20">Name and phone number recommended</span><input className="sr-only" type="file" accept=".csv,.xls,.xlsx" onChange={handleFile} /></label>{fileName && <div className="mt-3 flex items-center gap-2 border border-acid/20 bg-acid/[0.05] p-3 text-xs"><FileSpreadsheet size={15} className="text-acid" /><span className="min-w-0 flex-1 truncate text-white/60">{fileName}</span><span className="font-semibold text-acid">{contactCount.toLocaleString('en-IN')} contacts</span></div>}</div>
          : step === 2 ? <div><label className="block text-xs text-white/45" htmlFor="campaign-text">WhatsApp or SMS campaign text</label><textarea id="campaign-text" className="field mt-2 min-h-40 resize-none" value={campaignText} onChange={(event) => setCampaignText(event.target.value)} /><p className="mt-2 text-right text-[10px] text-white/25">{campaignText.length.toLocaleString('en-IN')} characters</p></div>
          : <div><p className="text-xs text-white/45">Select your delivery partner</p><div className="mt-3 grid grid-cols-2 gap-3">{(['interakt', 'aisensy'] as const).map((item) => <button key={item} type="button" onClick={() => setPartner(item)} className={`h-16 border text-sm font-semibold capitalize ${partner === item ? 'border-acid bg-acid/10 text-acid' : 'border-white/10 text-white/45 hover:border-white/25'}`}>{item}</button>)}</div><div className="mt-5 divide-y divide-white/10 border-y border-white/10 text-sm"><div className="flex justify-between py-4"><span className="text-white/35">Campaign</span><span>{campaignName}</span></div><div className="flex justify-between py-4"><span className="text-white/35">Audience</span><span>{contactCount.toLocaleString('en-IN')} contacts</span></div><div className="flex justify-between py-4"><span className="text-white/35">Delivery</span><span className="capitalize">{partner}</span></div></div></div>}
        </div>
        {error && <p className="mb-4 border border-rose/20 bg-rose/10 px-3 py-2 text-xs text-rose">{error}</p>}
        {!launched && <div className="flex justify-between border-t border-white/10 pt-5"><button type="button" disabled={step === 1 || loading} onClick={() => setStep((value) => value - 1)} className="h-10 px-4 text-sm text-white/45 disabled:opacity-20">Back</button><button type="button" disabled={loading || !campaignName.trim() || (step === 2 && !campaignText.trim())} onClick={() => step < 3 ? setStep((value) => value + 1) : void redirectToPartner()} className="flex h-10 items-center gap-2 bg-acid px-5 text-sm font-semibold text-ink hover:bg-white disabled:opacity-40">{loading ? <LoaderCircle size={15} className="animate-spin" /> : step === 3 ? <><Rocket size={15} /> Continue to partner</> : 'Continue'}</button></div>}
      </div>
    </section>
  );
}
