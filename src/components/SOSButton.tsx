import React, { useState, useEffect } from 'react';
import { AlertTriangle, X, MapPin, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SOSButtonProps {
  onTrigger: (data: { type: string; radius: number; isAnonymous: boolean }) => void;
  isTriggering: boolean;
  location: { lat: number; lon: number } | null;
}

export default function SOSButton({ onTrigger, isTriggering, location }: SOSButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState('medical');
  const [radius, setRadius] = useState(1000);
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location) return;
    console.log('[SOS Modal] Submitting form with type:', type);
    onTrigger({ type, radius, isAnonymous });
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <button
        onClick={() => setIsOpen(true)}
        className="w-24 h-24 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center shadow-2xl shadow-red-600/50 hover:from-red-600 hover:to-red-800 transition-all active:scale-95 group border-4 border-white/20"
      >
        <div className="flex flex-col items-center">
          <AlertTriangle className="w-8 h-8 text-white mb-1 group-hover:animate-bounce" />
          <span className="text-white font-black text-xs">SOS</span>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-[60] p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl w-full max-w-lg p-6 relative z-10 overflow-hidden animate-scaleIn"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-red-700"></div>
              
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                  <AlertTriangle className="text-red-600 w-6 h-6" />
                  Trigger Emergency SOS
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Emergency Type</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600 appearance-none cursor-pointer"
                    >
                      <option value="medical">Medical Emergency</option>
                      <option value="fire">Fire / Smoke</option>
                      <option value="accident">Accident / Crash</option>
                      <option value="crime">Theft / Assault</option>
                      <option value="gas">Gas Leak</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Broadcast Radius</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[500, 1000, 2000].map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setRadius(r)}
                          className={`py-3 rounded-xl font-bold transition-all text-sm ${
                            radius === r ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                          }`}
                        >
                          {r >= 1000 ? `${r/1000}km` : `${r}m`}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-800/50 border border-zinc-800 rounded-xl p-4 flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Detected Location</p>
                    {location ? (
                      <p className="text-sm text-zinc-300 font-mono">
                        {location.lat.toFixed(6)}, {location.lon.toFixed(6)}
                      </p>
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-amber-500">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Waiting for GPS...
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-zinc-800/30 p-4 rounded-xl border border-zinc-800/50">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      id="anon"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="peer w-6 h-6 rounded-lg bg-zinc-800 border-zinc-700 text-red-600 focus:ring-red-600 cursor-pointer appearance-none checked:bg-red-600 border-2"
                    />
                    <CheckIcon className="absolute w-4 h-4 text-white left-1 pointer-events-none hidden peer-checked:block" />
                  </div>
                  <label htmlFor="anon" className="text-sm text-zinc-300 cursor-pointer select-none">
                    Trigger Anonymously <span className="text-zinc-500 text-xs block">(Hide my personal details from responders)</span>
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 py-4 border border-zinc-700 text-zinc-300 rounded-xl font-bold hover:bg-zinc-800 transition-all order-2 sm:order-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isTriggering || !location}
                    className="flex-1 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-black text-lg hover:from-red-700 hover:to-red-800 transition-all shadow-xl shadow-red-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 order-1 sm:order-2"
                  >
                    {isTriggering ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Broadcasting...
                      </>
                    ) : (
                      'CONFIRM SOS'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={3}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
