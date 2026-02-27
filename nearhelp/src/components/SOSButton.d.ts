interface SOSButtonProps {
    onTrigger: (data: {
        type: string;
        radius: number;
        isAnonymous: boolean;
    }) => void;
    isTriggering: boolean;
    location: {
        lat: number;
        lon: number;
    } | null;
}
export default function SOSButton({ onTrigger, isTriggering, location }: SOSButtonProps): any;
export {};
//# sourceMappingURL=SOSButton.d.ts.map