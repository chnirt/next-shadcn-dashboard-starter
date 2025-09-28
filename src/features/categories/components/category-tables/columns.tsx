'use client';

import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Category } from '@/constants/category-data';
import { Column, ColumnDef } from '@tanstack/react-table';
import { CheckCircle2, XCircle, Text } from 'lucide-react';
import { CellAction } from './cell-action';

export const columns: ColumnDef<Category>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }: { column: Column<Category, unknown> }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => {
      const category = row.original;
      return (
        <div className='flex items-center gap-3'>
          {/* Color indicator */}
          <div
            className='h-3 w-3 rounded-full border'
            style={{ backgroundColor: category.color }}
          />
          <span className='font-medium'>{category.name}</span>
        </div>
      );
    },
    meta: {
      label: 'Name',
      placeholder: 'Search categories...',
      variant: 'text',
      icon: Text
    },
    enableColumnFilter: true
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ cell }) => {
      const description = cell.getValue<string>();
      return (
        <div className='text-muted-foreground max-w-[200px] truncate text-sm'>
          {description}
        </div>
      );
    }
  },
  {
    accessorKey: 'icon',
    header: 'Icon',
    cell: ({ cell }) => {
      const icon = cell.getValue<string>();
      return (
        <div className='flex items-center gap-2'>
          <span className='text-lg'>📱</span>{' '}
          {/* Placeholder for icon display */}
          <span className='text-sm capitalize'>{icon}</span>
        </div>
      );
    }
  },
  {
    accessorKey: 'product_count',
    header: ({ column }: { column: Column<Category, unknown> }) => (
      <DataTableColumnHeader column={column} title='Products' />
    ),
    cell: ({ cell }) => {
      const count = cell.getValue<number>();
      return (
        <Badge variant='secondary' className='font-mono'>
          {count} items
        </Badge>
      );
    }
  },
  {
    accessorKey: 'is_active',
    header: 'Status',
    cell: ({ cell }) => {
      const isActive = cell.getValue<boolean>();
      const Icon = isActive ? CheckCircle2 : XCircle;

      return (
        <Badge variant={isActive ? 'default' : 'destructive'}>
          <Icon className='mr-1 h-3 w-3' />
          {isActive ? 'Active' : 'Inactive'}
        </Badge>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: 'Status',
      variant: 'select',
      options: [
        { value: 'true', label: 'Active' },
        { value: 'false', label: 'Inactive' }
      ]
    }
  },
  {
    accessorKey: 'created_at',
    header: ({ column }: { column: Column<Category, unknown> }) => (
      <DataTableColumnHeader column={column} title='Created' />
    ),
    cell: ({ cell }) => {
      const date = new Date(cell.getValue<string>());
      return (
        <div className='text-muted-foreground text-sm'>
          {date.toLocaleDateString()}
        </div>
      );
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
