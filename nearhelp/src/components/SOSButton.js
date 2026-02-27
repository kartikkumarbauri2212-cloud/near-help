import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { AlertTriangle, X, MapPin, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
export default function SOSButton({ onTrigger, isTriggering, location }) {
    const [isOpen, setIsOpen] = useState(false);
    const [type, setType] = useState('medical');
    const [radius, setRadius] = useState(1000);
    const [isAnonymous, setIsAnonymous] = useState(false);
    // Prevent background scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }
        else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);
    // Handle Escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape')
                setIsOpen(false);
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!location)
            return;
        console.log('[SOS Modal] Submitting form with type:', type);
        onTrigger({ type, radius, isAnonymous });
        setIsOpen(false);
    };
    return (_jsxs("div", { className: "fixed bottom-8 left-1/2 -translate-x-1/2 z-50", children: [_jsx("button", { onClick: () => setIsOpen(true), className: "w-24 h-24 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center shadow-2xl shadow-red-600/50 hover:from-red-600 hover:to-red-800 transition-all active:scale-95 group border-4 border-white/20", children: _jsxs("div", { className: "flex flex-col items-center", children: [_jsx(AlertTriangle, { className: "w-8 h-8 text-white mb-1 group-hover:animate-bounce" }), _jsx("span", { className: "text-white font-black text-xs", children: "SOS" })] }) }), _jsx(AnimatePresence, { children: isOpen && (_jsxs("div", { className: "fixed inset-0 flex items-center justify-center z-[60] p-4", children: [_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, onClick: () => setIsOpen(false), className: "absolute inset-0 bg-black/60 backdrop-blur-sm" }), _jsxs(motion.div, { initial: { opacity: 0, scale: 0.95, y: 10 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.95, y: 10 }, className: "bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl w-full max-w-lg p-6 relative z-10 overflow-hidden animate-scaleIn", children: [_jsx("div", { className: "absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-red-700" }), _jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("h2", { className: "text-2xl font-black text-white flex items-center gap-2", children: [_jsx(AlertTriangle, { className: "text-red-600 w-6 h-6" }), "Trigger Emergency SOS"] }), _jsx("button", { onClick: () => setIsOpen(false), className: "p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-colors", children: _jsx(X, { className: "w-6 h-6" }) })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2", children: "Emergency Type" }), _jsxs("select", { value: type, onChange: (e) => setType(e.target.value), className: "w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600 appearance-none cursor-pointer", children: [_jsx("option", { value: "medical", children: "Medical Emergency" }), _jsx("option", { value: "fire", children: "Fire / Smoke" }), _jsx("option", { value: "accident", children: "Accident / Crash" }), _jsx("option", { value: "crime", children: "Theft / Assault" }), _jsx("option", { value: "gas", children: "Gas Leak" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2", children: "Broadcast Radius" }), _jsx("div", { className: "grid grid-cols-3 gap-2", children: [500, 1000, 2000].map((r) => (_jsx("button", { type: "button", onClick: () => setRadius(r), className: `py-3 rounded-xl font-bold transition-all text-sm ${radius === r ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`, children: r >= 1000 ? `${r / 1000}km` : `${r}m` }, r))) })] })] }), _jsxs("div", { className: "bg-zinc-800/50 border border-zinc-800 rounded-xl p-4 flex items-start gap-3", children: [_jsx(MapPin, { className: "w-5 h-5 text-red-500 shrink-0 mt-0.5" }), _jsxs("div", { children: [_jsx("p", { className: "text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1", children: "Detected Location" }), location ? (_jsxs("p", { className: "text-sm text-zinc-300 font-mono", children: [location.lat.toFixed(6), ", ", location.lon.toFixed(6)] })) : (_jsxs("div", { className: "flex items-center gap-2 text-sm text-amber-500", children: [_jsx(Loader2, { className: "w-3 h-3 animate-spin" }), "Waiting for GPS..."] }))] })] }), _jsxs("div", { className: "flex items-center gap-3 bg-zinc-800/30 p-4 rounded-xl border border-zinc-800/50", children: [_jsxs("div", { className: "relative flex items-center", children: [_jsx("input", { type: "checkbox", id: "anon", checked: isAnonymous, onChange: (e) => setIsAnonymous(e.target.checked), className: "peer w-6 h-6 rounded-lg bg-zinc-800 border-zinc-700 text-red-600 focus:ring-red-600 cursor-pointer appearance-none checked:bg-red-600 border-2" }), _jsx(CheckIcon, { className: "absolute w-4 h-4 text-white left-1 pointer-events-none hidden peer-checked:block" })] }), _jsxs("label", { htmlFor: "anon", className: "text-sm text-zinc-300 cursor-pointer select-none", children: ["Trigger Anonymously ", _jsx("span", { className: "text-zinc-500 text-xs block", children: "(Hide my personal details from responders)" })] })] }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-3 pt-2", children: [_jsx("button", { type: "button", onClick: () => setIsOpen(false), className: "flex-1 py-4 border border-zinc-700 text-zinc-300 rounded-xl font-bold hover:bg-zinc-800 transition-all order-2 sm:order-1", children: "Cancel" }), _jsx("button", { type: "submit", disabled: isTriggering || !location, className: "flex-1 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-black text-lg hover:from-red-700 hover:to-red-800 transition-all shadow-xl shadow-red-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 order-1 sm:order-2", children: isTriggering ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "w-5 h-5 animate-spin" }), "Broadcasting..."] })) : ('CONFIRM SOS') })] })] })] })] })) })] }));
}
function CheckIcon(props) {
    return (_jsx("svg", { ...props, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 3, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M5 13l4 4L19 7" }) }));
}
//# sourceMappingURL=SOSButton.js.map