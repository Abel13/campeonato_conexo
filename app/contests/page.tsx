"use client";
import { supabase } from "@/config/supabase";
import { Contest } from "@/types/contest";
import { useCallback, useEffect, useState } from "react";
import { compareDesc, format } from "date-fns";
import { useProfileStore } from "@/hooks/profile";
import { useRouter } from "next/navigation";
import TextField from "@/components/Fields";

export default function Contests() {
  const [openContests, setOpenContests] = useState<Contest[]>([]);
  const [closedContests, setClosedContests] = useState<Contest[]>([]);
  const [secureContest, setSecureContest] = useState<Contest>();
  const [password, setPassword] = useState<string>("");

  const router = useRouter();

  const {
    state: { player },
  } = useProfileStore((store) => store);

  const handleParticipate = useCallback(
    async (contest: Contest) => {
      if (contest.ask_password) {
        const { error: fail } = await supabase
          .from("contests")
          .select("*")
          .filter("password", "eq", password)
          .single();

        if (fail) {
          alert("Senha incorreta!");
          return;
        }
      }

      const { error } = await supabase.from("subscriptions").insert({
        player_id: player?.id,
        contest_id: contest.id,
      });

      if (error) {
        if (error.code === "42501" || error.code === "23505") {
          alert("Você já está cadastrado neste campeonato");
        } else
          alert(error.message || "Ocorreu um erro ao participar do campeonato");
      } else {
        router.replace(`/`);
      }
    },
    [password, player?.id, router]
  );

  const fetchData = useCallback(async () => {
    const { data: contests, error } = await supabase
      .from("contests")
      .select(
        "id, name, ask_password, allow_subscription, open, created_at, start_date, end_date, allow_subscription"
      )
      .order("created_at", { ascending: false });

    if (contests) {
      setOpenContests(contests.filter((contest) => contest.open === true));
      setClosedContests(contests.filter((contest) => contest.open === false));
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="max-w-5xl w-full items-center justify-between font-mono text-sm flex border-gray-300 dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 backdrop-blur-2xl   lg:dark:bg-zinc-800/30 bg-gradient-to-b from-zinc-200 pb-6 pt-8 border-b p-2">
        <div
          className="flex flex-1 px-2 text-blue-500"
          onClick={() => router.replace("/")}
        >
          voltar
        </div>
        <p className="flex w-fit">🏁 CAMPEONATOS 🏁</p>
        <div className="flex flex-1"></div>
      </div>
      <div className="flex w-full justify-end p-2">
        <button
          disabled
          className="w-fit p-2 bg-blue-600 rounded px-4 text-white font-semibold text-xs disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Criar campeonato
        </button>
      </div>
      <div className="flex w-full flex-col">
        <p className="text-sm bg-slate-900 p-1 pl-2 text-slate-300">Abertos</p>
        <div className="flex flex-col w-full gap-1">
          {secureContest && (
            <div className="absolute h-fit w-full">
              <div className="py-4 px-2 rounded bg-slate-800 m-2 flex flex-col items-end">
                <TextField
                  id="password"
                  placeholder="Senha"
                  type="password"
                  className="w-full"
                  onChange={(e) => {
                    setPassword(e.target.value ? e.target.value : "");
                  }}
                />
                <div className="flex">
                  <button
                    className="w-fit p-2 mt-2 bg-red-600 rounded px-4 text-white font-semibold text-xs disabled:bg-gray-400 disabled:cursor-not-allowed mr-2"
                    onClick={() => setSecureContest(undefined)}
                  >
                    Cancelar
                  </button>
                  <button
                    className="w-fit p-2 mt-2 bg-blue-600 rounded px-4 text-white font-semibold text-xs disabled:bg-gray-400 disabled:cursor-not-allowed"
                    onClick={() => handleParticipate(secureContest)}
                  >
                    Entrar
                  </button>
                </div>
              </div>
            </div>
          )}
          {openContests &&
            openContests.map((contest) => {
              return (
                <div
                  key={contest.id}
                  className="flex w-full justify-between items-center p-2"
                >
                  <p className="flex flex-1">{contest.name}</p>
                  <button
                    disabled={
                      compareDesc(
                        format(new Date(), "yyyy-MM-dd"),
                        contest.allow_subscription
                      ) === -1
                    }
                    className="w-fit p-2 bg-blue-600 rounded px-4 text-white font-semibold text-xs disabled:bg-gray-400 disabled:cursor-not-allowed"
                    onClick={() => {
                      if (contest.ask_password) {
                        setSecureContest(contest);
                        return;
                      }
                      handleParticipate(contest);
                    }}
                  >
                    Participar
                  </button>
                </div>
              );
            })}
        </div>
      </div>
      <div className="flex w-full flex-col">
        <p className="text-sm bg-slate-900 p-1 pl-2 text-slate-300">
          Encerrados
        </p>
        <div className="flex flex-col w-full gap-1">
          {closedContests &&
            closedContests.map((contest) => {
              return (
                <div
                  key={contest.id}
                  className="flex w-full justify-between items-center p-2"
                >
                  <p className="flex flex-1">{contest.name}</p>
                  <button
                    disabled
                    className="w-fit p-2 bg-blue-600 rounded px-4 text-white font-semibold text-xs disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Ver resultados
                  </button>
                </div>
              );
            })}
        </div>
      </div>
    </main>
  );
}
