'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthentication } from '@/context/AuthenticationContext';
import { useSpell } from '@/hooks/useQueries';
import SpellForm from '@/components/forms/spell/SpellForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Spell, CreateSpellRequest } from '@/types/spell';
import { useCreateSpell, useUpdateSpell } from '@/hooks/useMutations';

export default function EditSpellPage() {
  const params = useParams();
  const router = useRouter();
  const { authToken, isLoading: authLoading } = useAuthentication();
  const spellId = params.id as string;
  
  const { data: spell, isLoading, error } = useSpell(spellId);
  const [isCloning, setIsCloning] = useState(false);
  const [clonedData, setClonedData] = useState<Spell | null>(null);
  
  const createSpellMutation = useCreateSpell();
  const updateSpellMutation = useUpdateSpell();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !authToken) {
      router.push('/login?redirect=/spells');
    }
  }, [authToken, authLoading, router]);

  // Handle cloning SRD spells
  useEffect(() => {
    if (spell && spell.source === 'SRD' && !isCloning) {
      setIsCloning(true);
      // Clone the SRD spell data for editing as a custom spell  
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...clonedSpell } = spell;
      const clonedData = {
        ...clonedSpell,
        source: 'Custom',
        name: `${spell.name} (Custom)`, // Indicate it's a custom version
      };
      setClonedData(clonedData as Spell);
    }
  }, [spell, isCloning]);

  const handleSpellSubmit = async (data: Partial<CreateSpellRequest>) => {
    try {
      if (isCloning) {
        // Create new spell (clone)
        const newSpell = await createSpellMutation.mutateAsync(data);
        router.push(`/spells/${newSpell.id}`);
      } else {
        // Update existing spell
        await updateSpellMutation.mutateAsync({
          id: spellId,
          spellData: data,
        });
        router.push('/spells');
      }
    } catch (error) {
      console.error('Failed to save spell:', error);
      // TODO: Add proper error handling/toast
    }
  };

  if (authLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!authToken) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              You must be logged in to edit spells.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/login?redirect=/spells')}>
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-8 w-64" />
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">Edit Spell</h1>
          </div>
          <Alert variant="destructive">
            <AlertDescription>
              Failed to load spell: {error.message}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (!spell) {
    return (
      <div className="container mx-auto p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">Edit Spell</h1>
          </div>
          <Alert>
            <AlertDescription>
              Spell not found.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const spellData = clonedData || spell;
  const pageTitle = isCloning 
    ? `Clone "${spell.name}" as Custom Spell`
    : `Edit "${spell.name}"`;

  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{pageTitle}</h1>
            {isCloning && (
              <p className="text-muted-foreground text-sm">
                You&apos;re creating a custom version of this SRD spell that you can modify.
              </p>
            )}
          </div>
        </div>

        {isCloning && (
          <Alert>
            <AlertDescription>
              Since this is an SRD spell, we&apos;ll create a custom copy that you can edit. 
              The original SRD spell will remain unchanged.
            </AlertDescription>
          </Alert>
        )}

        <SpellForm
          initialData={spellData}
          onSubmit={handleSpellSubmit}
          isSubmitting={createSpellMutation.isPending || updateSpellMutation.isPending}
          isEditing={!isCloning}
          isCloning={isCloning}
        />
      </div>
    </div>
  );
}
