// src/store/slices/createUISlice.ts
import { StateCreator } from 'zustand';
import { ModuleId } from '@/src/core/module-system';
import { AllSlices } from '../app-store';

export interface UISlice {
  activeModule: ModuleId;
  setActiveModule: (moduleId: ModuleId) => void;
}

export const createUISlice: StateCreator<AllSlices, [], [], UISlice> = (set) => ({
  activeModule: ModuleId.AUDIT,
  setActiveModule: (moduleId) => set({ activeModule: moduleId }),
});