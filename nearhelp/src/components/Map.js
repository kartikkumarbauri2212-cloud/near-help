import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { AlertCircle, User, ShieldCheck } from 'lucide-react';
// Fix Leaflet icon issue
const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;
const SOSIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `<div class="w-6 h-6 bg-red-600 rounded-full border-2 border-white animate-pulse-red"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
});
const UserIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `<div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
});
function ChangeView({ center }) {
    const map = useMap();
    map.setView(center);
    return null;
}
export default function Map({ userLocation, activeAlerts, onRespond }) {
    const [center, setCenter] = useState([0, 0]);
    useEffect(() => {
        if (userLocation) {
            setCenter([userLocation.lat, userLocation.lon]);
        }
    }, [userLocation]);
    return (_jsx("div", { className: "w-full h-full relative", children: _jsxs(MapContainer, { center: center, zoom: 15, scrollWheelZoom: true, className: "z-0", children: [_jsx(TileLayer, { attribution: '\u00A9 <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors', url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" }), userLocation && (_jsxs(_Fragment, { children: [_jsx(Marker, { position: [userLocation.lat, userLocation.lon], icon: UserIcon, children: _jsx(Popup, { children: "You are here" }) }), _jsx(ChangeView, { center: [userLocation.lat, userLocation.lon] })] })), activeAlerts.map((alert) => (_jsxs(React.Fragment, { children: [_jsx(Marker, { position: [alert.latitude, alert.longitude], icon: SOSIcon, eventHandlers: {
                                click: () => onRespond(alert)
                            }, children: _jsx(Popup, { children: _jsxs("div", { className: "p-2 min-w-[200px]", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx(AlertCircle, { className: "w-5 h-5 text-red-600" }), _jsxs("span", { className: "font-bold uppercase text-red-600", children: [alert.type, " EMERGENCY"] })] }), _jsxs("p", { className: "text-sm text-zinc-600 mb-3", children: [alert.is_anonymous ? 'Anonymous User' : alert.user_name, " is in trouble."] }), _jsx("button", { onClick: () => onRespond(alert), className: "w-full py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors", children: "I'M RESPONDING" })] }) }) }), _jsx(Circle, { center: [alert.latitude, alert.longitude], radius: alert.radius, pathOptions: { fillColor: 'red', color: 'red', fillOpacity: 0.1 } })] }, `alert-${alert.id}-${alert.status}`)))] }) }));
}
//# sourceMappingURL=Map.js.map