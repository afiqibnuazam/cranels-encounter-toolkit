"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  X,
  Plus,
  BadgePlus,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useEncounterState, useEncounter, Combatant } from "@/context/EncounterContext";
import { cn } from "@/lib/utils";
import { QuickAddCombatantDialog } from "./QuickAddCombatantDialog";
import { InitiativeIcon } from "./icons/CombatIcons";
import { FullHitpointIcon } from "./icons/HitpointIcons";
import { ArmorClassIcon } from "./icons/AttributeIcons";
import { BlindedIcon } from "./icons/ConditionIcons";
import { ScrollArea } from "./ui/scroll-area";

interface SortableCombatantRowProps {
  combatant: Combatant;
  index: number;
  isCurrentTurn: boolean;
  isSelected: boolean;
  onCombatantClick: (index: string) => void;
  onRemoveCombatant: (index: string) => () => void;
}

const SortableCombatantRow = ({
  combatant,
  index,
  isCurrentTurn,
  isSelected,
  onCombatantClick,
  onRemoveCombatant,
}: SortableCombatantRowProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: combatant.index,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      key={`${combatant.index}-${index}`}
      className={cn(
        "border-l-4 border-l-transparent",
        !isCurrentTurn && !isSelected && !isDragging && "hover:bg-secondary/20",
        isCurrentTurn && "bg-primary/20 border-l-primary",
        isSelected && "bg-secondary/20 ring-2 ring-inset ring-secondary",
        isDragging && "opacity-50"
      )}
      onClick={() => onCombatantClick(combatant.index)}
    >
      <TableCell className="p-0">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-2 hover:bg-secondary/30 rounded"
        >
          <GripVertical />
        </div>
      </TableCell>
      <TableCell>
        {combatant.initiative}
      </TableCell>
      <TableCell className={cn(isCurrentTurn && "font-bold")}>
        {combatant.name}
      </TableCell>
      <TableCell className="text-center">
        {combatant.current_hit_points} / {combatant.max_hit_points}
      </TableCell>
      <TableCell className="text-center">
        {combatant.armor_class}
      </TableCell>
      <TableCell><BlindedIcon /></TableCell>
      <TableCell onClick={(e) => e.stopPropagation()} className="flex items-center justify-center gap-2">
        <BadgePlus
          className="cursor-pointer hover:text-primary"
        // onClick={handleAddCondition(combatant.id)}
        />
        <X
          className="cursor-pointer hover:text-red-500"
          onClick={onRemoveCombatant(combatant.index)}
        />
      </TableCell>
    </TableRow>
  );
};

// TODO: make this look better
const DragOverlayCombatantRow = ({ combatant }: { combatant: Combatant }) => (
  <div className="bg-card border-2 border-primary rounded-lg shadow-xl p-3 min-w-[600px] opacity-95">
    <div className="flex items-center gap-4">
      <GripVertical className="text-primary" size={20} />
      <div className="w-10 text-center font-medium text-primary bg-primary/10 rounded px-2 py-1">
        {combatant.initiative}
      </div>
      <span className="w-48 font-bold text-foreground">{combatant.name}</span>
      <span className="w-20 text-center text-sm font-medium">
        {combatant.current_hit_points} / {combatant.max_hit_points}
      </span>
      <span className="w-10 text-center font-medium">{combatant.armor_class}</span>
      <div className="flex-1" />
    </div>
  </div>
);

const EncounterTable = () => {
  const { combatants, isRunning, currentTurn, selectedCombatantId } =
    useEncounterState();
  const { removeCombatant, setSelectedCombatant, reorderCombatants, updateCombatant } = useEncounter();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const handleRemoveCombatant = (index: string) => () => {
    removeCombatant(index);
  };

  const handleCombatantClick = (index: string) => {
    setSelectedCombatant(index);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const draggedId = event.active.id as string;
    setActiveId(draggedId);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = combatants.findIndex((c) => c.index === active.id);
    const newIndex = combatants.findIndex((c) => c.index === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const draggedCombatant = combatants[oldIndex];
      const targetCombatant = combatants[newIndex];

      // Check if we need to adjust initiative based on positioning
      let shouldUpdateInitiative = false;
      let newInitiative = draggedCombatant.initiative;

      // Dragging up (to earlier position) and target has higher initiative
      if (oldIndex > newIndex && draggedCombatant.initiative < targetCombatant.initiative) {
        shouldUpdateInitiative = true;
        newInitiative = targetCombatant.initiative;
      }
      // Dragging down (to later position) and target has lower initiative  
      else if (oldIndex < newIndex && draggedCombatant.initiative > targetCombatant.initiative) {
        shouldUpdateInitiative = true;
        newInitiative = targetCombatant.initiative;
      }

      // First reorder the combatants
      reorderCombatants(oldIndex, newIndex);

      // Then update initiative if needed
      if (shouldUpdateInitiative) {
        updateCombatant(draggedCombatant.index, { initiative: newInitiative });
      }
    }
  };

  const activeCombatant = activeId ? combatants.find(c => c.index === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Table>
        <TableHeader className="bg-secondary">
          <TableRow className="border-l-4 border-l-transparent">
            <TableHead className="w-[32px]"></TableHead>
            <TableHead className="w-[40px]">
              <div className="flex items-center">
                <InitiativeIcon size={20} />
              </div>
            </TableHead>
            <TableHead className="w-[248px]">Name</TableHead>
            <TableHead className="w-[80px]">
              <div className="flex items-center justify-center">
                <FullHitpointIcon size={18} />
              </div>
            </TableHead>
            <TableHead className="w-[40px]">
              <div className="flex items-center justify-center">
                <ArmorClassIcon size={18} />
              </div>
            </TableHead>
            <TableHead>Condition</TableHead>
            <TableHead className="w-[80px]">
              <span className="sr-only">Action</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="max-h-[calc(100vh-552px)] overflow-y-auto">
          {/* <ScrollArea> */}
          <SortableContext
            items={combatants.map(c => c.index)}
            strategy={verticalListSortingStrategy}
          >
            {combatants.map((combatant, index) => {
              const isCurrentTurn = isRunning && index === currentTurn;
              const isSelected = selectedCombatantId === combatant.index && !isCurrentTurn;

              return (
                <SortableCombatantRow
                  key={combatant.index}
                  combatant={combatant}
                  index={index}
                  isCurrentTurn={isCurrentTurn}
                  isSelected={isSelected}
                  onCombatantClick={handleCombatantClick}
                  onRemoveCombatant={handleRemoveCombatant}
                />
              );
            })}
          </SortableContext>
          {/* </ScrollArea> */}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={8}>
              <QuickAddCombatantDialog>
                <Button
                  variant="ghost"
                  className="w-full h-8 text-muted-foreground cursor-pointer"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Combatant
                </Button>
              </QuickAddCombatantDialog>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      <DragOverlay>
        {activeCombatant && <DragOverlayCombatantRow combatant={activeCombatant} />}
      </DragOverlay>
    </DndContext>
  );
};

export default EncounterTable;
