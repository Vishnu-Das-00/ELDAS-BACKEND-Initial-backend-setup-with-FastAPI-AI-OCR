import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { AuthResponse, User } from "@/types/auth";

interface AuthState {
  token: string | null;
  role: AuthResponse["role"] | null;
  user: User | null;
  linkedStudentId: number | null;
  hydrated: boolean;
  setSession: (payload: AuthResponse) => void;
  logout: () => void;
  setLinkedStudentId: (studentId: number | null) => void;
  markHydrated: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      role: null,
      user: null,
      linkedStudentId: null,
      hydrated: false,
      setSession: (payload) =>
        set({
          token: payload.access_token,
          role: payload.role,
          user: payload.user,
        }),
      logout: () =>
        set({
          token: null,
          role: null,
          user: null,
          linkedStudentId: null,
        }),
      setLinkedStudentId: (studentId) => set({ linkedStudentId: studentId }),
      markHydrated: (value) => set({ hydrated: value }),
    }),
    {
      name: "eldas-auth",
      partialize: (state) => ({
        token: state.token,
        role: state.role,
        user: state.user,
        linkedStudentId: state.linkedStudentId,
      }),
      onRehydrateStorage: () => (state) => {
        state?.markHydrated(true);
      },
    },
  ),
);
