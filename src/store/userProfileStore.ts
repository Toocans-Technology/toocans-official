import { create } from 'zustand';
import { LoginUser } from '@/app/api/user/types'; // Adjust the import path if necessary

interface UserProfileState {
  userProfile: LoginUser | null;
  setUserProfile: (userProfile: LoginUser | null) => void;
  clearUserProfile: () => void;
}

// export const useUserProfileStore = create<UserProfileState>((set) => ({
//   userProfile: null,
//   setUserProfile: (userProfile) => set({ userProfile }),
//   clearUserProfile: () => set({ userProfile: null }),
// }));

// Optional: Persist store to localStorage
import { persist, createJSONStorage } from 'zustand/middleware';
export const useUserProfileStore = create(
  persist<UserProfileState>(
    (set) => ({
      userProfile: null,
      setUserProfile: (userProfile) => set({ userProfile }),
      clearUserProfile: () => set({ userProfile: null }),
    }),
    {
      name: 'user-profile-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
