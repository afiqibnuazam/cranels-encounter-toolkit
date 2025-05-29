"use client"

import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const useFetchData = <T>(endpoint: string) => {
    const [data, setData] = useState<T[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${API_URL}${endpoint}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch data from ${endpoint}`);
                }
                const data = await response.json();
                setData(data || []);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message); // Access the error message safely
                } else {
                    setError("An unknown error occurred"); // Fallback for non-Error types
                }
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [endpoint]);

    return { data, loading, error };
};