import { Player } from "@/types/player";
import { create } from "zustand";

type ProfileState = {
  player?: Player;
};

type ProfileStore = {
  state: ProfileState;
  actions: {
    setPlayer: (player: Player) => void;
  };
};

const initialState: ProfileState = {};

const useProfileStore = create<ProfileStore>((set) => ({
  state: initialState,
  actions: {
    setPlayer: (player) => set({ state: { player } }),
  },
}));

export { useProfileStore };
