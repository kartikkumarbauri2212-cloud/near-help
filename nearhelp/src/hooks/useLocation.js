import { useState, useEffect } from 'react';
export const useLocation = () => {
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);
    useEffect(() => {
        if (!navigator.geolocation) {
            setError('Geolocation not supported');
            return;
        }
        const watchId = navigator.geolocation.watchPosition((pos) => {
            setLocation({
                lat: pos.coords.latitude,
                lon: pos.coords.longitude,
            });
        }, (err) => {
            setError(err.message);
        }, { enableHighAccuracy: true });
        return () => navigator.geolocation.clearWatch(watchId);
    }, []);
    return { location, error };
};
//# sourceMappingURL=useLocation.js.map