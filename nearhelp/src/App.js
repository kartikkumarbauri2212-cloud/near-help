import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { useLocation } from './hooks/useLocation';
import api from './services/api';
import socket from './services/socket';
import Map from './components/Map';
import SOSButton from './components/SOSButton';
import Auth from './components/Auth';
import Chat from './components/Chat';
import { AlertCircle, Shield, Info, CheckCircle, MessageSquare, List } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
export default function App() {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const { location } = useLocation();
    const [activeAlerts, setActiveAlerts] = useState([]);
    const [currentSOS, setCurrentSOS] = useState(null);
    const [isTriggering, setIsTriggering] = useState(false);
    const [showResponders, setShowResponders] = useState(false);
    useEffect(() => {
        const validateSession = async () => {
            if (token) {
                try {
                    // Simple health check or user fetch to verify token
                    await api.get('/sos/active');
                    const savedUser = localStorage.getItem('user');
                    if (savedUser)
                        setUser(JSON.parse(savedUser));
                    socket.connect();
                    console.log('[App] Session validated successfully');
                }
                catch (err) {
                    console.error('[App] Stale session detected, logging out');
                    localStorage.clear();
                    setToken(null);
                    setUser(null);
                }
            }
        };
        validateSession();
    }, [token]);
    useEffect(() => {
        if (user && location) {
            socket.emit('update_location', {
                lat: location.lat,
                lon: location.lon,
                userId: user.id
            });
        }
    }, [user, location]);
    useEffect(() => {
        socket.on('sos_alert', (sos) => {
            setActiveAlerts((prev) => {
                if (prev.find(a => a.id === sos.id))
                    return prev;
                return [...prev, sos];
            });
        });
        socket.on('sos_resolved', (sosId) => {
            setActiveAlerts((prev) => prev.filter(a => a.id !== sosId));
            if (currentSOS?.id === sosId)
                setCurrentSOS(null);
        });
        return () => {
            socket.off('sos_alert');
            socket.off('sos_resolved');
        };
    }, [currentSOS]);
    useEffect(() => {
        if (token) {
            api.get('/sos/active').then(({ data }) => setActiveAlerts(data));
        }
    }, [token]);
    const handleAuthSuccess = (user, token) => {
        setUser(user);
        setToken(token);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        socket.connect();
    };
    const handleTriggerSOS = async (data) => {
        if (!location) {
            console.error('[SOS] Trigger failed: Location not available');
            return alert('Location required to trigger SOS. Please enable GPS.');
        }
        setIsTriggering(true);
        console.log('[SOS] Submitting SOS request to API...', data);
        try {
            const { data: sos } = await api.post('/sos', {
                ...data,
                latitude: location.lat,
                longitude: location.lon
            });
            console.log('[SOS] API Success. SOS ID:', sos.id);
            setCurrentSOS(sos);
            // Ensure socket is connected before emitting
            if (socket.connected) {
                console.log('[SOS] Emitting new_sos event via WebSocket');
                socket.emit('new_sos', sos);
                socket.emit('join_sos', sos.id);
            }
            else {
                console.warn('[SOS] Socket not connected. Attempting reconnect...');
                socket.connect();
                socket.emit('new_sos', sos);
            }
        }
        catch (err) {
            console.error('[SOS] Trigger error:', err.response?.data || err.message);
            alert('Failed to broadcast SOS. Please try again.');
        }
        finally {
            setIsTriggering(false);
        }
    };
    const handleRespond = (sos) => {
        setCurrentSOS(sos);
        socket.emit('respond_sos', { sosId: sos.id, userId: user.id, name: user.name });
        socket.emit('join_sos', sos.id);
    };
    const handleResolve = async () => {
        if (!currentSOS)
            return;
        try {
            await api.post(`/sos/${currentSOS.id}/resolve`);
            socket.emit('resolve_sos', currentSOS.id);
            setCurrentSOS(null);
        }
        catch (err) {
            console.error(err);
        }
    };
    if (!token)
        return _jsx(Auth, { onSuccess: handleAuthSuccess });
    return (_jsxs("div", { className: "h-screen w-screen flex flex-col bg-zinc-950 overflow-hidden", children: [_jsxs("header", { className: "h-16 border-b border-zinc-800 flex items-center justify-between px-6 bg-zinc-900/50 backdrop-blur-xl z-50", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center", children: _jsx(Shield, { className: "w-5 h-5 text-white" }) }), _jsx("h1", { className: "text-xl font-black text-white tracking-tighter", children: "NEARHELP" })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "text-right hidden sm:block", children: [_jsx("p", { className: "text-xs font-bold text-white", children: user?.name }), _jsx("p", { className: "text-[10px] text-zinc-500 uppercase font-black tracking-widest", children: user?.role })] }), _jsx("button", { onClick: () => {
                                    localStorage.clear();
                                    window.location.reload();
                                }, className: "p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 transition-colors", children: _jsx(List, { className: "w-5 h-5" }) })] })] }), _jsxs("main", { className: "flex-1 relative", children: [_jsx(Map, { userLocation: location, activeAlerts: activeAlerts, onRespond: handleRespond }), !currentSOS && (_jsx(SOSButton, { onTrigger: handleTriggerSOS, isTriggering: isTriggering, location: location })), _jsx(AnimatePresence, { children: currentSOS && (_jsxs(motion.div, { initial: { x: '100%' }, animate: { x: 0 }, exit: { x: '100%' }, className: "absolute top-0 right-0 w-full sm:w-96 h-full bg-zinc-900/95 backdrop-blur-2xl border-l border-zinc-800 z-40 flex flex-col shadow-2xl", children: [_jsxs("div", { className: "p-6 border-b border-zinc-800", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(AlertCircle, { className: "w-6 h-6 text-red-600" }), _jsxs("h2", { className: "text-xl font-black text-white uppercase", children: [currentSOS.type, " SOS"] })] }), _jsx("button", { onClick: () => setCurrentSOS(null), className: "text-zinc-500 hover:text-white", children: _jsx(Info, { className: "w-5 h-5" }) })] }), _jsxs("div", { className: "bg-red-600/10 border border-red-600/20 rounded-2xl p-4 mb-6", children: [_jsx("p", { className: "text-xs font-bold text-red-500 uppercase tracking-widest mb-1", children: "Status" }), _jsxs("p", { className: "text-white font-bold flex items-center gap-2", children: [_jsx("span", { className: "w-2 h-2 bg-red-600 rounded-full animate-pulse" }), "ACTIVE EMERGENCY"] })] }), currentSOS.user_id === user.id && (_jsxs("button", { onClick: handleResolve, className: "w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2", children: [_jsx(CheckCircle, { className: "w-5 h-5" }), "MARK AS RESOLVED"] }))] }), _jsxs("div", { className: "flex-1 overflow-y-auto p-6 space-y-6", children: [currentSOS.ai_guidance && (_jsxs("div", { className: "space-y-4", children: [_jsxs("h3", { className: "text-xs font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2", children: [_jsx(Shield, { className: "w-4 h-4 text-blue-500" }), "AI Crisis Guidance"] }), _jsxs("div", { className: "bg-zinc-800/50 rounded-2xl p-4 border border-zinc-700", children: [_jsxs("p", { className: "text-sm text-zinc-300 italic mb-4", children: ["\"", JSON.parse(currentSOS.ai_guidance).summary, "\""] }), _jsx("ul", { className: "space-y-3", children: JSON.parse(currentSOS.ai_guidance).steps.map((step, i) => (_jsxs("li", { className: "flex gap-3 text-sm text-zinc-200", children: [_jsx("span", { className: "w-5 h-5 bg-zinc-700 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0", children: i + 1 }), step] }, i))) })] })] })), _jsxs("div", { className: "space-y-4", children: [_jsxs("h3", { className: "text-xs font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2", children: [_jsx(MessageSquare, { className: "w-4 h-4 text-emerald-500" }), "Responder Chat"] }), _jsx(Chat, { sosId: currentSOS.id, user: user })] })] })] })) }), !currentSOS && activeAlerts.length > 0 && (_jsx("div", { className: "absolute top-4 left-4 z-30 space-y-2 max-w-[280px]", children: activeAlerts.map(alert => (_jsx(motion.div, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, onClick: () => handleRespond(alert), className: "bg-zinc-900/90 backdrop-blur border border-red-600/30 p-3 rounded-xl cursor-pointer hover:bg-zinc-800 transition-all shadow-lg", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 bg-red-600/20 rounded-lg flex items-center justify-center", children: _jsx(AlertCircle, { className: "w-6 h-6 text-red-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-xs font-black text-white uppercase", children: alert.type }), _jsx("p", { className: "text-[10px] text-zinc-500", children: "Nearby Emergency" })] })] }) }, alert.id))) }))] })] }));
}
//# sourceMappingURL=App.js.map