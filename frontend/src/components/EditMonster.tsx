"use client"

import { useForm } from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from "./ui/sheet"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "./ui/input"
import { Button } from "./ui/button"


const formSchema = z.object({
    name: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    image: z.string().url({
        message: "Image must be a valid URL.",
    }),
    source: z.string().min(2, {
        message: "Source must be at least 2 characters.",
    }),
    size: z.enum([
        "tiny",
        "small",
        "medium",
        "large",
        "huge",
        "gargantuan"
    ]),
    type: z.string().min(2, {
        message: "Type must be at least 2 characters.",
    }),
    alignment: z.enum([
        "lawful-good",
        "neutral-good",
        "chaotic-good",
        "lawful-neutral",
        "neutral",
        "chaotic-neutral",
        "lawful-evil",
        "neutral-evil",
        "chaotic-evil",
    ]),
    armor_class: z.object({
        value: z.number().min(0, {
            message: "Armor class must be a positive number.",
        }),
        type: z.enum([
            "natural",
            "light",
            "medium",
            "heavy",
            "shield",
            "none",
            "other",
        ]),
    }),
    hit_points: z.number().min(0, {
        message: "Hit points must be a positive number.",
    }),
    hit_dice: z.string().min(2, {
        message: "Hit dice must be at least 2 characters.",
    }),
    speed: z.object({
        walk: z.number().min(0, {
            message: "Walk speed must be a positive number.",
        }),
        fly: z.number().min(0, {
            message: "Fly speed must be a positive number.",
        }),
        swim: z.number().min(0, {
            message: "Swim speed must be a positive number.",
        }),
    }),
    strength: z.number().min(0, {
        message: "Strength must be a positive number.",
    }),
    dexterity: z.number().min(0, {
        message: "Dexterity must be a positive number.",
    }),
    constitution: z.number().min(0, {
        message: "Constitution must be a positive number.",
    }),
    intelligence: z.number().min(0, {
        message: "Intelligence must be a positive number.",
    }),
    wisdom: z.number().min(0, {
        message: "Wisdom must be a positive number.",
    }),
    charisma: z.number().min(0, {
        message: "Charisma must be a positive number.",
    }),

})

const EditMonster = () => {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    })

    return (
        <SheetContent>
            <SheetHeader>
                <SheetTitle className="mb-4">Edit Monster</SheetTitle>
                <SheetDescription asChild>
                    <Form {...form}>
                        <form className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel></FormLabel>
                                        <FormControl>
                                            <Input {...field}></Input>
                                        </FormControl>
                                        <FormDescription></FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Separate by Card */}
                        </form>
                        <Button type="submit" className="mt-4">
                            Save
                        </Button>
                    </Form>
                </SheetDescription>
            </SheetHeader>
        </SheetContent>
    )
}

export default EditMonster