"use client"

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Eye, LogIn } from 'lucide-react';
import { CreateSpellRequest } from '@/types/spell';
import SpellForm from '@/components/forms/spell/SpellForm';
import { useAuthentication } from '@/context/AuthenticationContext';
import { useSpell } from '@/hooks/useQueries';
import { useCreateSpell } from '@/hooks/useMutations';
import Link from 'next/link';

const NewSpellPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { authToken } = useAuthentication();
    const [showPreview, setShowPreview] = useState(false);

    const createSpellMutation = useCreateSpell();

    const cloneIndex = searchParams.get('clone');

    // Use TanStack Query to load spell data for cloning
    const { data: cloneData, isLoading: isLoadingClone } = useSpell(
        cloneIndex || '',
        'srd',
        !!cloneIndex && !!authToken
    );

    // Show login message if not authenticated
    if (!authToken) {
        const title = cloneIndex ? 'Clone Spell' : 'Create New Spell';

        return (
            <div className="container mx-auto p-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">{title}</CardTitle>
                        <CardDescription>
                            You need to be signed in to create custom spells
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="text-center space-y-4">
                            <p className="text-muted-foreground">
                                Please sign in to access the spell creation tools.
                            </p>
                            <div className="flex gap-2 justify-center">
                                <Button asChild>
                                    <Link href="/auth/login">
                                        <LogIn className="mr-2 h-4 w-4" />
                                        Sign In
                                    </Link>
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href="/">
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Back to Home
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Show loading state while cloning
    if (cloneIndex && isLoadingClone) {
        return (
            <div className="container mx-auto p-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Loading Spell...</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const handleSubmit = async (data: Partial<CreateSpellRequest>) => {
        try {
            const spellData = {
                ...data,
                cloned_from: cloneIndex || undefined,
            };

            const newSpell = await createSpellMutation.mutateAsync(spellData);
            router.push(`/spells/${newSpell.id}`);
        } catch (error) {
            console.error('Error creating spell:', error);
            // TODO: Add proper error handling/toast
        }
    };

    return (
        <div className="mx-auto max-w-7xl">
            <Card>
                <CardHeader className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-3xl">
                            <h1>
                                {cloneIndex
                                    ? `Clone Spell: ${cloneData?.name || 'Loading...'}`
                                    : 'Create a Spell'
                                }
                            </h1>
                        </CardTitle>
                        <CardDescription>
                            {cloneIndex
                                ? 'Create a custom spell based on an existing SRD spell'
                                : 'Design your own custom spell from scratch'
                            }
                        </CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setShowPreview(!showPreview)}
                        >
                            <Eye className="mr-2 h-4 w-4" />
                            {showPreview ? 'Edit' : 'Preview'}
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <SpellForm
                        initialData={cloneIndex ? cloneData : undefined}
                        onSubmit={handleSubmit}
                        isSubmitting={createSpellMutation.isPending}
                        showPreview={showPreview}
                        isCloning={!!cloneIndex}
                    />
                </CardContent>
            </Card>
        </div>
    );
};

export default NewSpellPage;
