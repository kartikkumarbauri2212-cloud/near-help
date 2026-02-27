import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState } from 'react';
import api from '../services/api';
export default function Auth({ onSuccess }) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [skills, setSkills] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        console.log(`[Frontend] Attempting ${isLogin ? 'Login' : 'Registration'} for: ${email}`);
        try {
            if (isLogin) {
                const { data } = await api.post('/auth/login', { email, password });
                console.log('[Frontend] Login successful, receiving token and user data');
                onSuccess(data.user, data.token);
            }
            else {
                await api.post('/auth/register', { email, password, name, skills });
                console.log('[Frontend] Registration successful');
                setIsLogin(true);
                setError('Registration successful! Please login.');
            }
        }
        catch (err) {
            const errorMessage = err.response?.data?.error || 'Connection failed. Please try again.';
            console.error('[Frontend] Auth error:', errorMessage);
            setError(errorMessage);
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-zinc-950 p-4", children: _jsxs("div", { className: "w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden", children: [_jsx("div", { className: "absolute top-0 left-0 w-full h-1 bg-red-600" }), _jsxs("div", { className: "text-center mb-8", children: [_jsx("h1", { className: "text-4xl font-black text-white tracking-tighter mb-2", children: "NEARHELP" }), _jsx("p", { className: "text-zinc-500 text-sm font-medium uppercase tracking-widest", children: "Emergency Response Network" })] }), error && (_jsx("div", { className: `p-4 rounded-xl mb-6 text-sm font-bold ${error.includes('successful') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`, children: error })), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [!isLogin && (_jsxs(_Fragment, { children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1", children: "Full Name" }), _jsx("input", { type: "text", required: true, value: name, onChange: (e) => setName(e.target.value), className: "w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1", children: "Skills (e.g. CPR, Doctor)" }), _jsx("input", { type: "text", value: skills, onChange: (e) => setSkills(e.target.value), placeholder: "Comma separated", className: "w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600" })] })] })), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1", children: "Email Address" }), _jsx("input", { type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), className: "w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1", children: "Password" }), _jsx("input", { type: "password", required: true, value: password, onChange: (e) => setPassword(e.target.value), className: "w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600" })] }), _jsx("button", { type: "submit", disabled: loading, className: "w-full py-4 bg-red-600 text-white rounded-2xl font-black text-lg hover:bg-red-700 transition-all shadow-xl shadow-red-600/20 disabled:opacity-50 mt-4", children: loading ? 'PROCESSING...' : (isLogin ? 'LOGIN' : 'REGISTER') })] }), _jsx("div", { className: "mt-8 text-center", children: _jsx("button", { onClick: () => setIsLogin(!isLogin), className: "text-zinc-500 hover:text-white text-sm font-bold transition-colors", children: isLogin ? "DON'T HAVE AN ACCOUNT? REGISTER" : "ALREADY HAVE AN ACCOUNT? LOGIN" }) })] }) }));
}
//# sourceMappingURL=Auth.js.map