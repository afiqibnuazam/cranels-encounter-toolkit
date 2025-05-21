import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import Cookies from "js-cookie";

interface AppProviderType {
    isLoading: boolean;
    authToken: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (displayName: string, email: string, password: string, password_confirmation: string) => Promise<void>;
    logout: () => void;
}

const AuthenticationContext = createContext<AppProviderType | undefined>(undefined);

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

export const AuthenticationProvider = ({ children }: { children: React.ReactNode; }) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [authToken, setAuthToken] = useState<string | null>(null);
    const router = useRouter();

    useEffect( () => {
        
        const token = Cookies.get("authToken");

        if (token) {
            setAuthToken(token);
        }

        setIsLoading(false);
    }, [])

    const login = async (email: string, password: string) => {
        setIsLoading(true);

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });
           
            const data = await response.json();

            if (data.status) {
                Cookies.set("authToken", data.token, {
                    expires: 7,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                });
                setAuthToken(data.token);

                toast.success("Login successful");
                router.push("/");
            } else {
                toast.error("Login failed");
            }

        } catch (error) {
            console.log("Error during login:", error);
            toast.error("Login failed");
        } finally {
            setIsLoading(false);
        }
    }

    const register = async (displayName: string, email: string, password: string, password_confirmation: string) => {
        setIsLoading(true);

        try {
            const response = await fetch(`${API_URL}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: displayName,
                    email,
                    password,
                    password_confirmation,
                }),
            });
            
            const data = await response.json();

            if (data.status) {
                toast.success("Registration successful");
            } else {
                toast.error("Registration failed");
            }

        } catch (error) {
            console.log("Error during registration:", error);
            toast.error("Registration failed");
        } finally {
            setIsLoading(false);
        }
    }

    const logout = () => {
        setAuthToken(null);
        Cookies.remove("authToken");
        setIsLoading(false);
        toast.success("Logout successful");
    }

    return (
        <AuthenticationContext.Provider value={{ isLoading, authToken, login, register, logout }}>
            {children}
        </AuthenticationContext.Provider>
    )
}

// export default AppProvider

export const useAuthentication = () => {
    const context = useContext(AuthenticationContext);
    if (context === undefined) {
        throw new Error("Context must be used within an AppProvider");
    }
    return context;
}