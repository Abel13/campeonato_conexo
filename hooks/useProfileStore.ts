import { supabase } from "@/config/supabase";
import { Player } from "@/types/player";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type ProfileStore = {
  player?: Player;
  loadPlayer: (playerId: string) => void;
};

const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      player: undefined,
      loadPlayer: async (playerId) => {
        const { data: player, error } = await supabase
          .from("players")
          .select("*")
          .eq("id", playerId)
          .single();

        set({ player });
      },
    }),
    {
      name: "profile-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export { useProfileStore };
