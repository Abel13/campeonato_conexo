import { supabase } from "@/config/supabase";
import { Player } from "@/types/player";
import { create } from "zustand";

type ProfileState = {
  player?: Player;
};

type ProfileStore = {
  state: ProfileState;
  actions: {
    loadPlayer: (playerId: string) => void;
  };
};

const initialState: ProfileState = {};

const useProfileStore = create<ProfileStore>((set) => ({
  state: initialState,
  actions: {
    loadPlayer: async (playerId) => {
      const { data: player, error } = await supabase
        .from("players")
        .select("*")
        .eq("id", playerId)
        .single();

      set({ state: { player } });
    },
  },
}));

export { useProfileStore };
