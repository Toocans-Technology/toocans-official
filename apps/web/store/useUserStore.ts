import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { UserInfo } from '@/services/user/info'

interface UserState {
  user: UserInfo | null
  setUser: (user: UserInfo | null) => void
  clearUser: () => void
}

export const useUserStore = create(
  persist<UserState>(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'user-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
)
