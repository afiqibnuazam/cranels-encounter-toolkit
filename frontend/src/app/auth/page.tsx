"use client"

import React, { useEffect, useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useAuthentication } from "@/context/AuthenticationContext"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"

const loginSchema = z.object({
    email: z.string().email({
        message: "Invalid email address"
    }),
    password: z.string().min(1, {
        message: "Password is required"
    }),
});

const registerSchema = z.object({
    displayName: z.string().min(1, {
        message: "Display name is required"
    }),
    email: z.string().email({
        message: "Invalid email address"
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters long"
    }),
    password_confirmation: z.string().min(6, {
        message: "Confirm password is required"
    }),
}).superRefine((values, ctx) => {
    if (values.password !== values.password_confirmation) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["password_confirmation"],
            message: "Passwords do not match",
        });
    }
});

type AuthForm = {
    email: string;
    password: string;
    displayName?: string;
    password_confirmation?: string;
};

const Auth = () => {
    const [isLogin, setIsLogin] = useState<boolean>(true)
    // const [formData, setFormData] = useState<formData>({
    //     displayName: "",
    //     email: "",
    //     password: "",
    //     password_confirmation: "",
    // })

    const form = useForm<AuthForm>({
        resolver: zodResolver(isLogin ? loginSchema : registerSchema),
        defaultValues: isLogin
            ? { email: "", password: "" }
            : { displayName: "", email: "", password: "", password_confirmation: "" },
    })

    const router = useRouter();

    const { isLoading, authToken, login, register } = useAuthentication();

    // const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    //     event?.preventDefault();

    //     if (isLogin) {
    //         try {
    //             await login(form.getValues("email"), form.getValues("password"));
    //         } catch (error) {
    //             console.error("Login failed:", error);
    //             alert("Login failed. Please try again.");
    //         }

    //     } else {
    //         try {
    //             await register(
    //                 form.getValues("displayName")!,
    //                 form.getValues("email"),
    //                 form.getValues("password"),
    //                 form.getValues("password_confirmation")!
    //             );
    //         } catch (error) {
    //             console.error("Registration failed:", error);
    //             alert("Registration failed. Please try again.");
    //         }
    //     }
    // }

    // const handleOnChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     setFormData({
    //         ...form,
    //         [event.target.name]: event.target.value,
    //     })
    // }

    useEffect(() => {
        if (authToken) {
            router.push("/");
            return;
        }
    }, [authToken, router]);

    function onSubmit(values: AuthForm) {
        console.log("Form submitted with values:", values)

        if (isLogin) {
            login(
                values.email,
                values.password
            ).catch(error => {
                console.error("Login failed:", error);
                alert("Login failed. Please try again.");
            });

        } else {
            register(
                values.displayName!,
                values.email,
                values.password,
                values.password_confirmation!,
            ).then(() => {
                form.reset();
                setIsLogin(true);
            }).catch(error => {
                console.error("Registration failed:", error);
                alert("Registration failed. Please try again.");
            });
        }
    }

    return (
        <Card className="w-full max-w-sm mx-auto mt-10">
            <CardHeader>
                <CardTitle className="text-center">
                    <h3 className="text-2xl font-bold">{isLogin ? "Login" : "Register"}</h3>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {
                            !isLogin && (
                                <FormField
                                    control={form.control}
                                    name="displayName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Display Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="John Doe" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )
                        }
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {
                            !isLogin && (
                                <FormField
                                    control={form.control}
                                    name="password_confirmation"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="Confirm Password" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )
                        }
                        <Button type="submit" className="w-full mt-4 cursor-pointer" disabled={isLoading}>
                            {isLogin ? "Login" : "Register"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
            <CardFooter className="flex justify-center">
                <p>
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <span onClick={() => setIsLogin(!isLogin)}>
                        <strong className="cursor-pointer text-blue-500 hover:text-blue-700">
                            {isLogin ? "Register" : "Login"}
                        </strong>
                    </span>
                </p>
            </CardFooter>


        </Card>
    )
}

export default Auth
