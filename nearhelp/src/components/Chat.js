import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect, useRef } from 'react';
import { Send, User, ShieldCheck } from 'lucide-react';
import socket from '../services/socket';
export default function Chat({ sosId, user }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const scrollRef = useRef(null);
    useEffect(() => {
        socket.on('new_message', (msg) => {
            setMessages((prev) => [...prev, msg]);
        });
        return () => {
            socket.off('new_message');
        };
    }, []);
    useEffect(() => {
        scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
    }, [messages]);
    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim())
            return;
        socket.emit('send_message', {
            sosId,
            userId: user.id,
            name: user.name,
            message: input,
        });
        setInput('');
    };
    return (_jsxs("div", { className: "flex flex-col h-[400px] bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden", children: [_jsxs("div", { className: "p-4 border-bottom border-zinc-800 bg-zinc-800/50 flex items-center justify-between", children: [_jsx("h3", { className: "font-bold text-sm uppercase tracking-widest text-zinc-400", children: "Emergency Chat" }), _jsx("span", { className: "text-[10px] bg-red-600/20 text-red-500 px-2 py-1 rounded-full font-bold", children: "LIVE" })] }), _jsx("div", { ref: scrollRef, className: "flex-1 overflow-y-auto p-4 space-y-4", children: messages.map((msg, i) => (_jsxs("div", { className: `flex flex-col ${msg.userId === user.id ? 'items-end' : 'items-start'}`, children: [_jsxs("div", { className: "flex items-center gap-1 mb-1", children: [_jsx("span", { className: "text-[10px] font-bold text-zinc-500", children: msg.name }), msg.userId === user.id && _jsx(ShieldCheck, { className: "w-3 h-3 text-blue-500" })] }), _jsx("div", { className: `px-4 py-2 rounded-2xl text-sm max-w-[80%] ${msg.userId === user.id
                                ? 'bg-blue-600 text-white rounded-tr-none'
                                : 'bg-zinc-800 text-zinc-200 rounded-tl-none'}`, children: msg.message })] }, i))) }), _jsxs("form", { onSubmit: handleSend, className: "p-4 border-t border-zinc-800 flex gap-2", children: [_jsx("input", { type: "text", value: input, onChange: (e) => setInput(e.target.value), placeholder: "Type a message...", className: "flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600" }), _jsx("button", { type: "submit", className: "p-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors", children: _jsx(Send, { className: "w-5 h-5" }) })] })] }));
}
//# sourceMappingURL=Chat.js.map