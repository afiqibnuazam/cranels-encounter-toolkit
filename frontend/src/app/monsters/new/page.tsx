"use client"

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Eye, LogIn } from 'lucide-react';
import { Monster } from '@/types/monster';
import MonsterForm from '@/components/forms/MonsterForm';
import { useAuthentication } from '@/context/AuthenticationContext';
import { useMonster } from '@/hooks/useQueries';
import Link from 'next/link';
import { useCreateMonster } from '@/hooks/useMutations';

const NewMonsterPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { authToken } = useAuthentication();
    const [showPreview, setShowPreview] = useState(false);

    const cloneIndex = searchParams.get('clone');


    // Use TanStack Query to load monster data for cloning
    const { data: cloneData, isLoading: isLoadingClone } = useMonster(
        cloneIndex || '',
        'srd',
        !!cloneIndex && !!authToken
    );

    // Use mutation hook for creating monsters
    const createMonsterMutation = useCreateMonster();

    // Show login message if not authenticated
    if (!authToken) {
        const title = cloneIndex ? 'Clone Monster' : 'Create New Monster';

        return (
            <div className="container mx-auto p-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">{title}</CardTitle>
                        <CardDescription>
                            You need to be signed in to create custom monsters
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="text-center space-y-4">
                            <p className="text-muted-foreground">
                                Please sign in to access the monster creation tools.
                            </p>
                            <div className="flex gap-2 justify-center">
                                <Button asChild>
                                    <Link href="/auth">
                                        <LogIn className="mr-2 h-4 w-4" />
                                        Sign In
                                    </Link>
                                </Button>
                                <Button variant="outline" onClick={() => router.back()}>
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Go Back
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (isLoadingClone) {
        return (
            <div className="container mx-auto p-6">
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <p className="text-muted-foreground">Loading monster data for cloning...</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const handleSubmit = (monsterData: Partial<Monster>) => {
        createMonsterMutation.mutate(monsterData, {
            onSuccess: () => {
                router.push('/'); // Redirect back to main page
            },
            onError: (error) => {
                console.error('Error creating monster:', error);
                // TODO: Add toast notification for error
            },
        });
    };


    return (
        <div className="mx-60">
            <Card>
                <CardHeader className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-3xl">
                            <h1>
                                {cloneData
                                    ? `Clone Monster: ${cloneData.name.replace(' (Clone)', '')}`
                                    : 'Create New Monster'
                                }
                            </h1>
                        </CardTitle>
                        <CardDescription>
                            {cloneData
                                ? 'Clone an SRD monster as a custom monster'
                                : 'Create a custom monster for your encounters'
                            }
                        </CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setShowPreview(!showPreview)}
                        >
                            <Eye className="mr-2 h-4 w-4" />
                            {showPreview ? 'Hide Preview' : 'Show Preview'}
                        </Button>
                        <Button variant="outline" onClick={() => router.back()}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <MonsterForm
                        initialData={cloneData || undefined}
                        onSubmit={handleSubmit}
                        isSubmitting={createMonsterMutation.isPending}
                        showPreview={showPreview}
                        isCloning={!!cloneData}
                    />
                </CardContent>
            </Card>
        </div>
    );
};

export default NewMonsterPage;