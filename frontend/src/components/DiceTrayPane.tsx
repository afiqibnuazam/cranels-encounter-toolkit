import React from 'react'
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet'
import { Button } from './ui/button'

type Props = {}

const DiceTrayPane = (props: Props) => {
  return (
    <Sheet>
        <SheetTrigger asChild>
            <Button>
                D20
            </Button>
        </SheetTrigger>
        <SheetContent side='bottom'>
            <SheetHeader>
                <SheetTitle>Roll Dice</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-4">
                <div>d4</div>
                <div>d6</div>
                <div>d8</div>
                <div>d10</div>
                <div>d20</div>
                <div>d100</div>
            </div>
            <SheetFooter>
                Roll Dice
            </SheetFooter>
        </SheetContent>
    </Sheet>
  )
}

export default DiceTrayPane