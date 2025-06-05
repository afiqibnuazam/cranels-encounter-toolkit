import { useState, useCallback, useMemo } from "react";
import { GroupState, ReferencePaneTab, ButtonConfig } from "../types";
import { BUTTON_CONFIGS, GROUP_CYCLES } from "../utils/constants";


const isValidGroupState = (state: string, validStates: readonly string[]): state is GroupState => {
    return validStates.includes(state);
};

export const useGroupingButton = (tab: ReferencePaneTab) => {
    const [groupState, setGroupState] = useState<GroupState>("none");

    const cycleGroupState = useCallback(() => {
        const tabKey = tab.toUpperCase() as keyof typeof GROUP_CYCLES;
        const currentStates = GROUP_CYCLES[tabKey] || GROUP_CYCLES.MONSTERS;
        
        const currentIndex = currentStates.findIndex(state => state === groupState);
        const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % currentStates.length;
        const nextState = currentStates[nextIndex];

        // setGroupState(currentStates[nextIndex] as GroupState);
        if (isValidGroupState(nextState, currentStates)) {
            setGroupState(nextState);
        } else {
            setGroupState("none"); // fallback
        }
    }, [tab, groupState]);

    const buttonProps = useMemo((): ButtonConfig => {
        const tabKey = tab.toUpperCase() as keyof typeof BUTTON_CONFIGS;
        const tabConfigs = BUTTON_CONFIGS[tabKey] || BUTTON_CONFIGS.MONSTERS;
        return tabConfigs[groupState] || tabConfigs.none;
    }, [tab, groupState]);

    return {
        groupState,
        setGroupState,
        cycleGroupState,
        buttonProps,
    };
};