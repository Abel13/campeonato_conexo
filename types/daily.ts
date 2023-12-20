export type Answer = "error" | "blue" | "green" | "orange" | "purple";

export type Daily = {
  created_at: Date;
  player_id: string;
  contest_id: string;
  score: number;
  answers: Answer[];
};
