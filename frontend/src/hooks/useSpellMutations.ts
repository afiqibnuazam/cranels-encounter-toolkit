import { useMutation, useQueryClient } from '@tanstack/react-query';
import { spellsApi } from '@/lib/api';
import { CreateSpellRequest, Spell } from '@/types/spell';
import { useAuthentication } from '@/context/AuthenticationContext';
import { toast } from 'sonner';

export function useCreateSpell() {
  const { authToken } = useAuthentication();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (spellData: Partial<CreateSpellRequest>) => {
      if (!authToken) {
        throw new Error('Authentication required');
      }
      return spellsApi.createSpell(spellData, authToken);
    },
    onSuccess: (data) => {
      // Invalidate spells queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['spells'] });
      queryClient.invalidateQueries({ queryKey: ['custom-spells'] });
      toast.success('Spell created successfully!');
    },
    onError: (error: Error) => {
      console.error('Failed to create spell:', error);
      toast.error(`Failed to create spell: ${error.message}`);
    },
  });
}

export function useUpdateSpell() {
  const { authToken } = useAuthentication();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, spellData }: { id: string; spellData: Partial<CreateSpellRequest> }) => {
      if (!authToken) {
        throw new Error('Authentication required');
      }
      return spellsApi.updateSpell(id, spellData, authToken);
    },
    onSuccess: (data, variables) => {
      // Invalidate spells queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['spells'] });
      queryClient.invalidateQueries({ queryKey: ['custom-spells'] });
      queryClient.invalidateQueries({ queryKey: ['spell-detail', variables.id] });
      toast.success('Spell updated successfully!');
    },
    onError: (error: Error) => {
      console.error('Failed to update spell:', error);
      toast.error(`Failed to update spell: ${error.message}`);
    },
  });
}

export function useDeleteSpell() {
  const { authToken } = useAuthentication();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      if (!authToken) {
        throw new Error('Authentication required');
      }
      return spellsApi.deleteSpell(id, authToken);
    },
    onSuccess: () => {
      // Invalidate spells queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['spells'] });
      queryClient.invalidateQueries({ queryKey: ['custom-spells'] });
      toast.success('Spell deleted successfully!');
    },
    onError: (error: Error) => {
      console.error('Failed to delete spell:', error);
      toast.error(`Failed to delete spell: ${error.message}`);
    },
  });
}
