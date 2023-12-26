"use client";
import NavLink from "@/components/NavLink";
import { supabase } from "@/config/supabase";
import { useProfileStore } from "@/hooks/profile";
import { Contest } from "@/types/contest";
import { Player } from "@/types/player";
import { format } from "date-fns";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();

  const {
    actions: { loadPlayer },
  } = useProfileStore((store) => store);

  const [contest, setContest] = useState<Contest>();
  const [contests, setContests] = useState<Contest[]>();
  const [hide, setHide] = useState<boolean>(true);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loadingScoreboard, setLoadingScoreboard] = useState<boolean>(false);

  const {
    state: { player },
  } = useProfileStore((store) => store);

  const fetchScoreboard = useCallback(async (contest: Contest) => {
    setLoadingScoreboard(true);
    setContest(contest);
    setHide(true);

    const { data: scoreboard } = await supabase.rpc("scoreboard", {
      _start_date: contest.start_date,
      _end_date: contest.end_date,
      _contest_id: contest.id,
    });

    if (scoreboard) setPlayers(scoreboard);
    setLoadingScoreboard(false);
  }, []);

  const fetchData = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      loadPlayer(user.id);

      const { data: subscriptions } = await supabase
        .from("subscriptions")
        .select("*, contest:contest_id (id, name, start_date, end_date, open)")
        .filter("contest.open", "eq", true)
        .eq("player_id", user.id);

      if (subscriptions && subscriptions?.length > 0) {
        const contests = subscriptions.map((s) => s.contest).filter((c) => c);

        if (contests.length > 0) {
          setContests(contests);
          fetchScoreboard(contests[0]);
          return;
        }
      }

      router.replace("/contests");
    } else {
      router.replace("/auth");
    }
  }, [fetchScoreboard, loadPlayer, router]);

  const getMedal = (position: number) => {
    switch (position) {
      case 0:
        return <span className="text-xl mr-4">🥇</span>;
      case 1:
        return <span className="text-xl mr-4">🥈</span>;
      case 2:
        return <span className="text-xl mr-4">🥉</span>;
      default:
        return <div className="mr-10" />;
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!player)
    return (
      <div className="flex min-h-screen items-center justify-center">
        Carregando...
      </div>
    );

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="max-w-5xl w-full items-center justify-between font-mono text-sm flex border-gray-300 dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 backdrop-blur-2xl   lg:dark:bg-zinc-800/30 bg-gradient-to-b from-zinc-200 pb-6 pt-8 border-b p-2">
        <p className="flex flex-1" />
        <p className="flex w-fit">🏆 CLASSIFICAÇÃO 🏆</p>
        <div className="flex flex-1 justify-end">
          <NavLink href={`profile/${player.id}`}>
            <Image
              className={`rounded-full border-2`}
              src={`https://api.dicebear.com/7.x/fun-emoji/png?seed=${player.name}`}
              alt="Icon"
              width={50}
              height={50}
            />
          </NavLink>
        </div>
      </div>
      {contest ? (
        <div
          className="rounded bg-yellow-600 p-2 m-2 text-xs"
          // onClick={() => router.push("contests")}
          // inclusão das datas de inicio e de fim a baixo do nome do torneio
        >
          <div
            className="p-1 text-center font-semibold"
            onClick={() => setHide(!hide)}
          >
            {`${contest.name}`}
            {
              <div className="font-normal text-slate-200">
                {`${format(contest.start_date, "dd/MM/yyyy")} - ${format(
                  contest.start_date,
                  "dd/MM/yyyy"
                )}`}
              </div>
            }
          </div>

          {!hide && (
            <div className="grid gap-0 mt-2">
              {contests &&
                contests.map((c) => {
                  return (
                    <div
                      className={`p-2 ${
                        c.id === contest.id && "bg-yellow-700"
                      }`}
                      key={c.id}
                      onClick={() => {
                        fetchScoreboard(c);
                      }}
                    >
                      {c.name}
                    </div>
                  );
                })}
              <div className="border-t my-2" />
              <p
                className="text-xs text-center mb-1"
                onClick={() => router.push("contests")}
              >
                Buscar campeonato
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded bg-yellow-600 p-2 m-2 text-xs">
          Carregando...
        </div>
      )}

      {!player && (
        <div className="rounded bg-red-900 p-2 m-2 text-xs">
          Clique na foto de perfil para acessar seus dados.
        </div>
      )}

      {loadingScoreboard ? (
        <div className="flex-1 w-full p-2 text-center">Carregando...</div>
      ) : (
        <div className="flex-1 w-full p-2">
          {players.map((player, index) => (
            <div
              key={player.id}
              className="flex items-center justify-between w-full max-w-5xl p-4 my-2 bg-white rounded-xl shadow-md dark:bg-zinc-800"
              onClick={() => router.push(`profile/${player.id}`)}
            >
              <div className="flex items-center">
                {getMedal(index)}
                <div className="flex-shrink-0">
                  <Image
                    className="rounded-full"
                    src={`https://api.dicebear.com/7.x/fun-emoji/png?seed=${player.name}`}
                    alt="Icon"
                    width={50}
                    height={50}
                  />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {player.name}
                  </p>
                  <div className="flex space-x-1 text-sm text-gray-600">
                    <p>{player.trophies > 0 && `${player.trophies} 🏆`}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center flex-col">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {player.score}
                </p>
                <p className="text-xs font-medium text-gray-600">
                  {`em ${player.dailies} dias`}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
