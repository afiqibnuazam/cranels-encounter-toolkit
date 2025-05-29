
import { Table, TableBody, TableCell, TableRow } from "../../ui/table";
import { SquarePen, Search, DiamondPlus, ImageOff } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../../ui/hover-card";
import { ScrollArea } from "../../ui/scroll-area";
import { useFetchData } from "@/hooks/useFetchData";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { columns } from "./monsters-columns";
import { MonstersDataTable } from "./monsters-data-table";
import { useAuthentication } from "@/context/AuthenticationContext";
import { useEffect } from "react";

interface Monster {
    id: string;
    index: string;
    name: string;
    image_url: string;
}

const MonstersTable = () => {

    const { authToken } = useAuthentication();
    const endpoint = authToken ? '/reference/monsters' : '/srd-monsters';
    const { data: monsters, loading, error } = useFetchData<Monster>(endpoint);

    // const iconSize = 18;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[600px]">
                Loading monsters...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-[600px] text-red-500">
                {error}
            </div>
        );
    }

    if (monsters?.length === 0) {
        return (
            <div className="flex items-center justify-center h-[600px]">
                No monsters available or failed to load.
            </div>
        );
    }

    // return (
    //     <Table>
    //         <TableBody>
    //             {monsters?.map((monster) => (
    //                 <TableRow key={monster.index} className="h-16">
    //                     {/* IMAGE */}
    //                     <TableCell>
    //                         {/* <div className="size-[30px] rounded-full relative overflow-hidden bg-gray-200"> */}
    //                             {/* <Image
    //                                 src={'https://www.dnd5eapi.co/api/images/monsters/' + monster.index + '.png'}
    //                                 alt="Picture of the monster"
    //                                 fill
    //                                 className="object-cover"
    //                             /> */}
    //                         {/* </div> */}
    //                         <Avatar className="size-8">
    //                             <AvatarImage src={'https://www.dnd5eapi.co/api/images/monsters/' + monster.index + '.png'} />
    //                             <AvatarFallback><ImageOff size={12} /></AvatarFallback>
    //                         </Avatar>
    //                     </TableCell>
    //                     {/* MONSTER NAME */}
    //                     <TableCell className="font-medium">{monster.name}</TableCell>
    //                     {/* EDIT */}
    //                     <TableCell>
    //                         <SquarePen size={iconSize} />
    //                     </TableCell>
    //                     {/* INFO */}
    //                     <TableCell>
    //                         <HoverCard>
    //                             <HoverCardTrigger asChild>
    //                                 <Search size={iconSize} />
    //                             </HoverCardTrigger>
    //                             <HoverCardContent className="max-h-[300px] w-[365px]">
    //                                 <ScrollArea className="h-[300px]">
    //                                     <div>
    //                                         <h1 className="text-lg font-bold">Monster Name</h1>
    //                                     </div>
    //                                     {/* Size and Type, Alignment */}

    //                                     {/* AC, HP, Speed */}

    //                                     {/* Stats */}
    //                                     <div className='flex items-center gap-2'>
    //                                         <div className="flex flex-col">
    //                                             <span>STR</span>
    //                                             <span>21(+5)</span>
    //                                         </div>
    //                                         <div className="flex flex-col">
    //                                             <span>STR</span>
    //                                             <span>21(+5)</span>
    //                                         </div>
    //                                         <div className="flex flex-col">
    //                                             <span>STR</span>
    //                                             <span>21(+5)</span>
    //                                         </div>
    //                                         <div className="flex flex-col">
    //                                             <span>STR</span>
    //                                             <span>21(+5)</span>
    //                                         </div>
    //                                         <div className="flex flex-col">
    //                                             <span>STR</span>
    //                                             <span>21(+5)</span>
    //                                         </div>
    //                                         <div className="flex flex-col">
    //                                             <span>STR</span>
    //                                             <span>21(+5)</span>
    //                                         </div>
    //                                     </div>

    //                                     {/* Saving throws, Skills, Senses, Languages, Challenge rating, Proficiency bonus */}

    //                                     {/* Traits */}

    //                                     {/* Actions */}

    //                                     {/* Legendary Actions */}
    //                                 </ScrollArea>
    //                             </HoverCardContent>
    //                         </HoverCard>
    //                     </TableCell>
    //                     {/* ADD TO ENCOUNTER */}
    //                     <TableCell><DiamondPlus size={iconSize} /></TableCell>
    //                 </TableRow>
    //             ))}
    //         </TableBody>
    //     </Table>
    // )

    return <MonstersDataTable columns={columns} data={monsters || []} />
}

export default MonstersTable;