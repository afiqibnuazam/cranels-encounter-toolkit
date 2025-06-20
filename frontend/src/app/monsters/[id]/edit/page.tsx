"use client"

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Eye, LogIn, Trash2 } from 'lucide-react';
import { Monster } from '@/types/monster';
import MonsterForm from '@/components/forms/MonsterForm';
import { useAuthentication } from '@/context/AuthenticationContext';
import Link from 'next/link';
import { useMonster } from '@/hooks/useQueries';
import { useDeleteMonster, useUpdateMonster } from '@/hooks/useMutations';

interface EditMonsterPageProps {
    params: Promise<{
        id: string;
    }>;
}

const EditMonsterPage = ({ params }: EditMonsterPageProps) => {
    const router = useRouter();
    const { authToken } = useAuthentication();
    const [showPreview, setShowPreview] = useState(false);

    // Unwrap the async params
    const { id } = use(params);

    // Use TanStack Query to fetch monster data
    const { data: monster, isLoading, error } = useMonster(
        id,
        'custom',
        !!authToken // Only fetch if authenticated
    );

    // Use mutation hooks for update and delete
    const updateMonsterMutation = useUpdateMonster();
    const deleteMonsterMutation = useDeleteMonster();

    // Show login message if not authenticated
    if (!authToken) {
        return (
            <div className="container mx-auto p-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Edit Monster</CardTitle>
                        <CardDescription>
                            You need to be signed in to edit monsters
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="text-center space-y-4">
                            <p className="text-muted-foreground">
                                Please sign in to access the monster editing tools.
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

    if (isLoading) {
        return (
            <div className="container mx-auto p-6">
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <p className="text-muted-foreground">Loading monster...</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (error || !monster) {
        return (
            <div className="container mx-auto p-6">
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <p className="text-muted-foreground mb-4">Monster not found.</p>
                            <Button onClick={() => router.back()}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Go Back
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const handleSubmit = (monsterData: Partial<Monster>) => {
        updateMonsterMutation.mutate({ id, monsterData }, {
            onSuccess: () => {
                router.push('/'); // Redirect back to main page
            },
            onError: (error) => {
                console.error('Error updating monster:', error);
                // TODO: Add toast notification for error
            },
        });
    };

    const handleDelete = () => {
        if (!confirm('Are you sure you want to delete this monster? This action cannot be undone.')) {
            return;
        }

        deleteMonsterMutation.mutate(id, {
            onSuccess: () => {
                router.push('/'); // Redirect back to main page
            },
            onError: (error) => {
                console.error('Error deleting monster:', error);
                // TODO: Add toast notification for error
            },
        });
    };

    return (
        <div className="container mx-auto p-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl">Edit Monster: {monster.name}</CardTitle>
                            <CardDescription>
                                Edit your custom monster
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
                            <Button
                                variant="destructive"
                                onClick={handleDelete}
                                disabled={deleteMonsterMutation.isPending}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                {deleteMonsterMutation.isPending ? 'Deleting...' : 'Delete'}
                            </Button>
                            <Button variant="outline" onClick={() => router.back()}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <MonsterForm
                        initialData={monster}
                        onSubmit={handleSubmit}
                        isSubmitting={updateMonsterMutation.isPending}
                        showPreview={showPreview}
                        isEditing={true}
                    />
                </CardContent>
            </Card>
        </div>
    );
};

export default EditMonsterPage;
