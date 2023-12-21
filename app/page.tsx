"use client";
import NavLink from "@/components/NavLink";
import { supabase } from "@/config/supabase";
import { useProfileStore } from "@/hooks/profile";
import { Contest } from "@/types/contest";
import { Player } from "@/types/player";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();

  const {
    actions: { loadPlayer },
  } = useProfileStore((store) => store);
  const [contest, setContest] = useState<Contest>();
  const {
    state: { player },
  } = useProfileStore((store) => store);

  const [players, setPlayers] = useState<Player[]>([]);

  const fetchData = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      loadPlayer(user.id);

      const { data: subscriptions } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("player_id", user.id);

      if (subscriptions && subscriptions?.length > 0) {
        const { data: contest } = await supabase
          .from("contests")
          .select("*")
          .eq("id", subscriptions[0].contest_id)
          .eq("open", true)
          .single();

        if (contest) {
          setContest(contest);
          const { data: scoreboard, error } = await supabase.rpc("scoreboard", {
            _contest: contest.id,
          });

          setPlayers(scoreboard);
          return;
        }
      }

      router.replace("/contests");
    } else {
      router.replace("/auth");
    }
  }, [loadPlayer, router]);

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
          onClick={() => router.push("contests")}
        >{`${contest.name}`}</div>
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

      <div className="flex-1 w-full p-2 ">
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
    </main>
  );
}
