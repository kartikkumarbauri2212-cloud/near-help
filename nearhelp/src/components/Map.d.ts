interface MapProps {
    userLocation: {
        lat: number;
        lon: number;
    } | null;
    activeAlerts: any[];
    onRespond: (sos: any) => void;
}
export default function Map({ userLocation, activeAlerts, onRespond }: MapProps): any;
export {};
//# sourceMappingURL=Map.d.ts.map