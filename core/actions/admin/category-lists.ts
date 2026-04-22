import { fetchGeneral } from '../api/generalActions';

export interface CategoryModifier {
  id: string;
  name: string;
  required: boolean;
  multiple: boolean;
  options: ModifierOption[];
}

export interface ModifierOption {
  id: string;
  name: string;
  priceExtra: number;
  stock: number;
}

export interface CategoryWithModifiers {
  id: string;
  name: string;
  productsCount: number;
  enabled: boolean;
  modifiers: CategoryModifier[];
}

export interface CreateModifierInput {
  name: string;
  required: boolean;
  multiple: boolean;
}

export interface UpdateModifierInput {
  name?: string;
  required?: boolean;
  multiple?: boolean;
}

export interface CreateModifierOptionInput {
  name: string;
  priceExtra: number;
  stock?: number;
}

export const categoryListsApi = {
  getByCategory: (categoryId: string) =>
    fetchGeneral<CategoryWithModifiers>(`admin/categories/${categoryId}/lists`, 'GET'),

  createModifier: (categoryId: string, data: CreateModifierInput) =>
    fetchGeneral<CategoryModifier>(`admin/categories/${categoryId}/lists`, 'POST', data),

  updateModifier: (categoryId: string, modifierId: string, data: UpdateModifierInput) =>
    fetchGeneral<CategoryModifier>(`admin/categories/${categoryId}/lists/${modifierId}`, 'PUT', data),

  deleteModifier: (categoryId: string, modifierId: string) =>
    fetchGeneral<CategoryModifier>(`admin/categories/${categoryId}/lists/${modifierId}`, 'DELETE'),

  addModifierOption: (categoryId: string, modifierId: string, data: CreateModifierOptionInput) =>
    fetchGeneral<ModifierOption>(`admin/categories/${categoryId}/lists/${modifierId}/options`, 'POST', data),

  restockModifierOption: (categoryId: string, modifierId: string, optionId: string, quantity: number) =>
    fetchGeneral<ModifierOption>(`admin/categories/${categoryId}/lists/${modifierId}/options/${optionId}/restock`, 'PUT', { quantity }),

  deleteModifierOption: (categoryId: string, modifierId: string, optionId: string) =>
    fetchGeneral<ModifierOption>(`admin/categories/${categoryId}/lists/${modifierId}/options/${optionId}`, 'DELETE'),
};