import { useState } from "react";
import { useEncounter } from "@/context/EncounterContext";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "./ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useFolderNames } from "@/hooks/useQueries";
import { toast } from "sonner";

interface SaveEncounterDialogProps {
    children: React.ReactNode;
}

interface SaveEncounterFormData {
    name: string;
    notes: string;
    folderName: string;
    customFolder: string;
    useCustomFolder: boolean;
}

const initialFormData: SaveEncounterFormData = {
    name: "",
    notes: "",
    folderName: "",
    customFolder: "",
    useCustomFolder: false,
};

export function SaveEncounterDialog({ children }: SaveEncounterDialogProps) {
    const { needsAuth, saveEncounter } = useEncounter();
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<SaveEncounterFormData>(initialFormData);
    const [isSaving, setIsSaving] = useState(false);

    // Fetch user's folder names
    const { data: folderNames = [] } = useFolderNames();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.name.trim()) return;

        setIsSaving(true);
        try {
            const saveData = {
                name: formData.name.trim(),
                notes: formData.notes.trim() || undefined,
                folder_name: formData.useCustomFolder 
                    ? formData.customFolder.trim() || undefined 
                    : formData.folderName || undefined,
            };

            await saveEncounter(saveData);
            
            // Show success toast
            toast.success("Encounter saved successfully!");
            
            // Reset form and close dialog
            setFormData(initialFormData);
            setOpen(false);
        } catch (error) {
            console.error("Failed to save encounter:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setFormData(initialFormData);
        setOpen(false);
    };

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (!newOpen) {
            setFormData(initialFormData);
        }
    };

    const handleUnauthenticatedClick = () => {
        toast.error("Please log in to save encounters");
    };

    if (needsAuth) {
        return (
            <Tooltip>
                <TooltipTrigger asChild>
                    <div onClick={handleUnauthenticatedClick}>
                        {children}
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    Login to Save
                </TooltipContent>
            </Tooltip>
        );
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                        {children}
                    </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>
                    Save Encounter
                </TooltipContent>
            </Tooltip>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Save Encounter</DialogTitle>
                    <DialogDescription>
                        Save your encounter to your account for future use.
                    </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="mt-2 space-y-4">
                    {/* Encounter Name */}
                    <div className="space-y-2">
                        <Label htmlFor="encounter-name">
                            Encounter Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="encounter-name"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Enter encounter name..."
                            required
                        />
                    </div>

                    {/* Folder Selection */}
                    <div className="space-y-2">
                        <Label>Folder (optional)</Label>
                        
                        {/* Toggle between existing folders and custom folder */}
                        <div className="flex items-center gap-2 mb-2">
                            <Button
                                type="button"
                                variant={!formData.useCustomFolder ? "default" : "outline"}
                                size="sm"
                                onClick={() => setFormData(prev => ({ ...prev, useCustomFolder: false }))}
                            >
                                Existing
                            </Button>
                            <Button
                                type="button"
                                variant={formData.useCustomFolder ? "default" : "outline"}
                                size="sm"
                                onClick={() => setFormData(prev => ({ ...prev, useCustomFolder: true }))}
                            >
                                New Folder
                            </Button>
                        </div>

                        {!formData.useCustomFolder ? (
                            <Select 
                                value={formData.folderName} 
                                onValueChange={(value) => setFormData(prev => ({ ...prev, folderName: value }))}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select existing folder..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {folderNames.length === 0 ? (
                                        <SelectItem value="no-folders" disabled>
                                            No folders found
                                        </SelectItem>
                                    ) : (
                                        folderNames.map((folder) => (
                                            <SelectItem key={folder} value={folder}>
                                                {folder}
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        ) : (
                            <Input
                                value={formData.customFolder}
                                onChange={(e) => setFormData(prev => ({ ...prev, customFolder: e.target.value }))}
                                placeholder="Enter new folder name..."
                            />
                        )}
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <Label htmlFor="encounter-notes">Notes (optional)</Label>
                        <Textarea
                            id="encounter-notes"
                            value={formData.notes}
                            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                            placeholder="Add any notes about this encounter..."
                            className="min-h-[80px] resize-none"
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                            className="cursor-pointer"
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit"
                            disabled={!formData.name.trim() || isSaving}
                            className="cursor-pointer"
                        >
                            {isSaving ? "Saving..." : "Save Encounter"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}