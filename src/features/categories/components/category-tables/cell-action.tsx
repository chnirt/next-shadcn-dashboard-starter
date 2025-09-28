'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { AlertModal } from '@/components/modal/alert-modal';
import { Category } from '@/constants/category-data';
import { useCategoryStore } from '../../utils/store';
import { IconDotsVertical, IconEdit, IconTrash } from '@tabler/icons-react';

interface CellActionProps {
  data: Category;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const {
    deleteCategory,
    setLoading: setStoreLoading,
    setError
  } = useCategoryStore();

  // Handle category deletion
  const onConfirm = async () => {
    try {
      setLoading(true);
      setStoreLoading(true);
      setError(null);

      // Delete category from store
      deleteCategory(data.id);

      // In a real app, you would also call the API here
      // await fakeCategories.deleteCategory(data.id);

      setOpen(false);
    } catch (error) {
      setError('Failed to delete category. Please try again.');
      console.error('Category deletion error:', error);
    } finally {
      setLoading(false);
      setStoreLoading(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
        title='Delete Category'
        description={`Are you sure you want to delete "${data.name}"? This action cannot be undone.`}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>Open menu</span>
            <IconDotsVertical className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => router.push(`/dashboard/categories/${data.id}`)}
          >
            <IconEdit className='mr-2 h-4 w-4' />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setOpen(true)}
            className='text-destructive'
          >
            <IconTrash className='mr-2 h-4 w-4' />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
