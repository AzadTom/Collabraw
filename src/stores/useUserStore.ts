import { create } from "zustand";
import { persist } from "zustand/middleware";
import {v4 as uuidv4} from "uuid";

interface UserState {
  userId: string;
  username: string;
  status: boolean;
  saveInfo: (username: string) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userId: "",
      username: "",
      status: false,
      saveInfo: (username) =>
        set({
          userId: uuidv4(),
          username,
          status: true,
        }),
      logout: () =>
        set({
          userId: "",
          username: "",
          status: false,
        }),
    }),
    {
      name: "user-storage",
    }
  )
);