"use client";

import { useUserInteraction } from "./use-user-interaction";

export const useSound = () => {
  const { isUserInteracted } = useUserInteraction();

  const playNotificationSound = () => {
    // if (isUserInteracted) {
    //   try {
    //     const audio = new Audio("/sounds/notification.mp3");
    //     audio.play();
    //   } catch (error) {
    //     console.log(error);
    //   }
    // }
  };

  return {
    playNotificationSound,
  };
};
