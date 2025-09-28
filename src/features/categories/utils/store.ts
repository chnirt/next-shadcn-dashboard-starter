'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Category } from '@/constants/category-data';

// State interface for category management
interface CategoryState {
  categories: Category[];
  selectedCategory: Category | null;
  isLoading: boolean;
  error: string | null;
}

// Actions interface for category operations
interface CategoryActions {
  // Category CRUD operations
  addCategory: (
    category: Omit<
      Category,
      'id' | 'created_at' | 'updated_at' | 'product_count'
    >
  ) => void;
  updateCategory: (id: number, updates: Partial<Category>) => void;
  deleteCategory: (id: number) => void;
  setCategories: (categories: Category[]) => void;

  // Category selection and state management
  selectCategory: (category: Category | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Category filtering and search
  getActiveCategories: () => Category[];
  getCategoryById: (id: number) => Category | undefined;
  searchCategories: (query: string) => Category[];
}

// Combined state and actions type
export type CategoryStore = CategoryState & CategoryActions;

// Initial state
const initialState: CategoryState = {
  categories: [],
  selectedCategory: null,
  isLoading: false,
  error: null
};

// Zustand store with persistence
export const useCategoryStore = create<CategoryStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Add a new category
      addCategory: (categoryData) => {
        const newCategory: Category = {
          ...categoryData,
          id: Date.now(), // Simple ID generation for demo
          product_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        set((state) => ({
          categories: [...state.categories, newCategory]
        }));
      },

      // Update an existing category
      updateCategory: (id, updates) => {
        set((state) => ({
          categories: state.categories.map((category) =>
            category.id === id
              ? {
                  ...category,
                  ...updates,
                  updated_at: new Date().toISOString()
                }
              : category
          )
        }));
      },

      // Delete a category
      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((category) => category.id !== id),
          selectedCategory:
            state.selectedCategory?.id === id ? null : state.selectedCategory
        }));
      },

      // Set categories from API
      setCategories: (categories) => {
        set({ categories });
      },

      // Select a category for editing/viewing
      selectCategory: (category) => {
        set({ selectedCategory: category });
      },

      // Set loading state
      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      // Set error state
      setError: (error) => {
        set({ error });
      },

      // Get only active categories
      getActiveCategories: () => {
        return get().categories.filter((category) => category.is_active);
      },

      // Get category by ID
      getCategoryById: (id) => {
        return get().categories.find((category) => category.id === id);
      },

      // Search categories by name and description
      searchCategories: (query) => {
        const { categories } = get();
        if (!query.trim()) return categories;

        const lowercaseQuery = query.toLowerCase();
        return categories.filter(
          (category) =>
            category.name.toLowerCase().includes(lowercaseQuery) ||
            category.description.toLowerCase().includes(lowercaseQuery)
        );
      }
    }),
    {
      name: 'category-store',
      skipHydration: true, // Prevent hydration issues
      partialize: (state) => ({
        categories: state.categories,
        selectedCategory: state.selectedCategory
      })
    }
  )
);
