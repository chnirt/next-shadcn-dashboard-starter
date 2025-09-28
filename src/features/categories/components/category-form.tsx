'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Category } from '@/constants/category-data';
import { useCategoryStore } from '../utils/store';

// Form validation schema using Zod
const categoryFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'Category name must be at least 2 characters.'
    })
    .max(50, {
      message: 'Category name must be less than 50 characters.'
    }),
  description: z
    .string()
    .min(10, {
      message: 'Description must be at least 10 characters.'
    })
    .max(200, {
      message: 'Description must be less than 200 characters.'
    }),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, {
    message: 'Please enter a valid hex color code.'
  }),
  icon: z.string().min(1, {
    message: 'Please select an icon.'
  }),
  is_active: z.boolean()
});

type CategoryFormData = z.infer<typeof categoryFormSchema>;

// Icon options for category selection
const ICON_OPTIONS = [
  { value: 'smartphone', label: 'Smartphone' },
  { value: 'sofa', label: 'Sofa' },
  { value: 'shirt', label: 'Shirt' },
  { value: 'book', label: 'Book' },
  { value: 'sparkles', label: 'Sparkles' },
  { value: 'laptop', label: 'Laptop' },
  { value: 'car', label: 'Car' },
  { value: 'gamepad', label: 'Gamepad' },
  { value: 'music', label: 'Music' },
  { value: 'camera', label: 'Camera' }
];

// Predefined color options for easy selection
const COLOR_OPTIONS = [
  { value: '#3B82F6', label: 'Blue' },
  { value: '#10B981', label: 'Green' },
  { value: '#F59E0B', label: 'Amber' },
  { value: '#8B5CF6', label: 'Purple' },
  { value: '#EC4899', label: 'Pink' },
  { value: '#EF4444', label: 'Red' },
  { value: '#6B7280', label: 'Gray' },
  { value: '#14B8A6', label: 'Teal' }
];

interface CategoryFormProps {
  initialData: Category | null;
  pageTitle: string;
}

export default function CategoryForm({
  initialData,
  pageTitle
}: CategoryFormProps) {
  // Form setup with default values
  const defaultValues: CategoryFormData = {
    name: initialData?.name || '',
    description: initialData?.description || '',
    color: initialData?.color || '#3B82F6',
    icon: initialData?.icon || '',
    is_active: initialData?.is_active ?? true
  };

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues
  });

  const router = useRouter();
  const { addCategory, updateCategory, setLoading, setError } =
    useCategoryStore();

  // Handle form submission
  async function onSubmit(values: CategoryFormData) {
    try {
      setLoading(true);
      setError(null);

      if (initialData) {
        // Update existing category
        updateCategory(initialData.id, values);
      } else {
        // Create new category
        addCategory(values);
      }

      // Navigate back to categories list
      router.push('/dashboard/categories');
    } catch (error) {
      setError('Failed to save category. Please try again.');
      console.error('Category form submission error:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className='mx-auto w-full max-w-2xl'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          {pageTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form form={form} onSubmit={form.handleSubmit(onSubmit)}>
          <div className='space-y-6'>
            {/* Category Name */}
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter category name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Enter category description'
                      className='resize-none'
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Color Selection */}
            <FormField
              control={form.control}
              name='color'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select a color' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {COLOR_OPTIONS.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className='flex items-center gap-2'>
                            <div
                              className='h-4 w-4 rounded-full border'
                              style={{ backgroundColor: color.value }}
                            />
                            {color.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Icon Selection */}
            <FormField
              control={form.control}
              name='icon'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select an icon' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ICON_OPTIONS.map((icon) => (
                        <SelectItem key={icon.value} value={icon.value}>
                          {icon.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Active Status */}
            <FormField
              control={form.control}
              name='is_active'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                  <div className='space-y-0.5'>
                    <FormLabel className='text-base'>Active Status</FormLabel>
                    <div className='text-muted-foreground text-sm'>
                      Enable or disable this category
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Form Actions */}
            <div className='flex justify-end space-x-2 pt-4'>
              <Button
                type='button'
                variant='outline'
                onClick={() => router.push('/dashboard/categories')}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Saving...' : 'Save Category'}
              </Button>
            </div>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
