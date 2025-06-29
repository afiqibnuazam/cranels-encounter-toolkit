import { cn } from "@/lib/utils";

interface HealthBarProps {
    currentHealth: number;
    maxHealth: number;
    tempHealth: number;
}

export default function HealthBar({ currentHealth, maxHealth, tempHealth }: HealthBarProps) {

    const currentHealthPercentage = (currentHealth * 100) / maxHealth;

    const computeHealthBarColor = (): string => {
        if (currentHealthPercentage >= 80) {
            return "bg-green-500";
        } else if (currentHealthPercentage >= 60) {
            return "bg-green-400";
        } else if (currentHealthPercentage >= 40) {
            return "bg-yellow-500";
        } else if (currentHealthPercentage >= 20) {
            return "bg-orange-500";
        } else {
            return "bg-red-500";
        }
    }

    return (
        <div className="relative w-full h-full bg-muted-foreground rounded-sm">
            <div
                className={cn(
                    "absolute h-full rounded-sm",
                    computeHealthBarColor()
                )}
                style={{ width: `${currentHealthPercentage}%` }}
            >
            </div>
            <div className="absolute w-full h-full flex justify-center items-center">
                {currentHealth} / {maxHealth}
            </div>
        </div>
    )
}
