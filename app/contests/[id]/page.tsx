"use client";
import { supabase } from "@/config/supabase";
import { Contest } from "@/types/contest";
import { Player } from "@/types/player";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function Result({ params: { id } }: { params: { id: string } }) {
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [contest, setContest] = useState<Contest>();

  const fetchScoreboard = useCallback(async (contest_id: string) => {
    setLoading(true);
    const { data: contest } = await supabase
      .from("contests")
      .select("*")
      .eq("id", contest_id)
      .single();

    if (contest) {
      setContest(contest);
      const { data: scoreboard } = await supabase.rpc("scoreboard", {
        _start_date: contest.start_date,
        _end_date: contest.end_date,
        _contest_id: contest.id,
      });

      if (scoreboard) setPlayers(scoreboard);
    } else {
      alert("Campeonato não encontrado");
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    if (id) fetchScoreboard(id);
  }, []);

  if (loading) return <main>Carregando...</main>;
  return (
    <main className="p-2">
      <div
        className="flex flex-1 px-2 text-blue-500"
        onClick={() => router.replace("/")}
      >
        voltar
      </div>
      <span className="my-2 text-lg">{`Resultados: ${contest?.name}`}</span>
      <table className="grid">
        <thead className="">
          <tr className="">
            <th className="flex w-20 border border-stone-500 px-2">Posição</th>
            <th className="border border-stone-500 px-2 w-full text-start">
              Nome
            </th>
            <th className="flex justify-center border border-stone-500 w-28">
              Tentativas
            </th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, index) => (
            <tr key={player.id}>
              <td className="flex w-20 border border-stone-500 px-2">
                {index + 1}
              </td>
              <td className="border border-stone-500 px-2 w-full text-start">
                {player.name}
              </td>
              <td className="flex w-28 border border-stone-500 px-2">
                {player.score}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
