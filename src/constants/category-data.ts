import { NavItem } from '@/types';

// Category type definition following the existing Product pattern
export type Category = {
  id: number;
  name: string;
  description: string;
  color: string; // Hex color for category visualization
  icon: string; // Icon identifier for the category
  is_active: boolean;
  product_count: number; // Number of products in this category
  created_at: string;
  updated_at: string;
};

// Navigation item for categories
export const categoryNavItem: NavItem = {
  title: 'Categories',
  url: '/dashboard/categories',
  icon: 'category',
  shortcut: ['c', 'c'],
  isActive: false,
  items: []
};
