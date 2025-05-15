import { useEffect } from "react";
import { UseBoundStore } from "zustand";

export const useHydration = (useStore: UseBoundStore<any>) => {
  useEffect(() => {
    useStore.persist.rehydrate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
