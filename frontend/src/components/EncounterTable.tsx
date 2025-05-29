"use client"

import { Heart, ShieldHalf, Trash } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useEncounterState, useEncounterDispatch } from "@/context/EncounterContext"

const EncounterTable = () => {
  const { combatants } = useEncounterState();
  const dispatch = useEncounterDispatch();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[24px]">
            {/* index column for drag row */}
          </TableHead>
          <TableHead className="w-[24px]">
            {/* Initiative */}
          </TableHead>
          <TableHead className="min-w-[12rem] max-w-[16rem]">Name</TableHead>
          <TableHead className="w-[80px] text-center"><Heart color="white" fill="white" /></TableHead>
          <TableHead className="w-[24px] text-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="half-fill" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="50%" stopColor="white" /> {/* Half-filled color */}
                  <stop offset="50%" stopColor="transparent" /> {/* Transparent for the other half */}
                </linearGradient>
              </defs>
              <ShieldHalf color="white" fill="url(#half-fill)" />
            </svg>
          </TableHead>
          <TableHead>Condition</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {combatants.map((combatant, index) => (
          <TableRow key={`${combatant.index}-${index}`}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>10</TableCell>
            <TableCell>{combatant.name}</TableCell>
            <TableCell className="text-center">{combatant.hit_points}</TableCell>
            <TableCell className="text-center">{combatant.armor_class[0].value}</TableCell>
            <TableCell>None</TableCell>
            <TableCell>
              <Trash 
                className="cursor-pointer hover:text-red-500" 
                onClick={() => dispatch({ type: 'REMOVE_COMBATANT', payload: index })}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default EncounterTable
