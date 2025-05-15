import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  sidebarExpanded: boolean;
}

interface Actions {
  toggleSidebar: () => void;
}

export const useSidebarStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      sidebarExpanded: false,
      toggleSidebar: () => set({ sidebarExpanded: !get().sidebarExpanded }),
    }),
    {
      name: "sidebar-store",
      skipHydration: true,
    }
  )
);
