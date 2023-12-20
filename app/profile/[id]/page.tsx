"use client";
import Image from "next/image";
import TextField from "@/components/Fields";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/config/supabase";
import { useRouter } from "next/navigation";
import { useProfileStore } from "@/hooks/profile";
import { Daily } from "@/types/daily";
import { Player } from "@/types/player";

export default function Page({ params: { id } }: { params: { id: string } }) {
  const router = useRouter();

  const [answer, setAnswer] = useState("");
  const [success, setSuccess] = useState(false);
  const [history, setHistory] = useState<Daily[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player>();
  const [allowSendResult, setAllowSendResult] = useState(false);
  const {
    state: { player },
  } = useProfileStore((store) => store);

  const fetchData = useCallback(async () => {
    const { data: selectedPlayer } = await supabase
      .from("players")
      .select("*")
      .eq("id", id)
      .single();

    if (selectedPlayer) {
      setSelectedPlayer(selectedPlayer);
      if (player?.id === selectedPlayer.id) setAllowSendResult(true);

      const { data: history, error } = await supabase
        .from("daily")
        .select("*")
        .order("created_at", { ascending: false })
        .eq("player_id", id);

      if (history) setHistory(history);
    }
  }, [id, player?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function extractData(str: string): {
    date: string;
    matrix: string[];
    attempts: number;
  } {
    try {
      // Expressão regular para extrair a data
      const dateRegex = /\d{2}\/\d{2}\/\d{4}/;
      const matchDate = str.match(dateRegex);

      // Expressão regular para extrair o número de tentativas
      const attemptsRegex = /(\d+) tentativas/;
      const matchAttempts = str.match(attemptsRegex);

      if (!matchDate || !matchAttempts) {
        throw new Error("Formato inválido");
      }

      const date = matchDate[0]; // Extrai a data encontrada na string
      const attempts = parseInt(matchAttempts[1], 10);
      const matrix = str
        .substring(str.indexOf("  "))
        .replaceAll("❌", ",error")
        .replaceAll("🟩", ",green")
        .replaceAll("🟧", ",orange")
        .replaceAll("🟪", ",purple")
        .replaceAll("🟦", ",blue")
        .replaceAll(" ", "")
        .split(",");

      return { date, matrix: matrix.filter((char) => char), attempts };
    } catch (error) {
      throw error;
    }
  }

  const handleSend = useCallback(async () => {
    const { data: contest } = await supabase
      .from("contests")
      .select("*")
      .eq("open", true)
      .single();

    try {
      const {
        date,
        matrix,
        attempts,
      }: {
        date: string;
        matrix: string[];
        attempts: number;
      } = extractData(answer);

      if (!date || !matrix || !attempts) {
        throw new Error("Formato inválido");
      }

      const { data, error } = await supabase.from("daily").insert([
        {
          player_id: id,
          contest_id: contest.id,
          created_at:
            date.substring(6, 10) + date.substring(3, 5) + date.substring(0, 2),
          score: attempts,
          answers: matrix,
        },
      ]);

      if (error) {
        if (error.code === "23505")
          alert(`Você já enviou o resultado de ${date}`);
        else alert(error.message);
      } else {
        setSuccess(true);
      }
    } catch (error) {
      alert(error);
    }
  }, [answer, id]);

  if (!selectedPlayer)
    return (
      <div className="flex min-h-screen items-center justify-center">
        Carregando...
      </div>
    );

  return (
    <div className="flex w-full pt-5 flex-col items-center">
      <div className="flex w-full px-2 text-blue-500" onClick={router.back}>
        voltar
      </div>
      <Image
        className={`rounded-full border-2`}
        src={`https://api.dicebear.com/7.x/fun-emoji/png?seed=${selectedPlayer.name}`}
        alt="Icon"
        width={80}
        height={80}
      />
      <span className="text-2xl mt-2">{selectedPlayer.name}</span>

      {allowSendResult && (
        <>
          <div className="flex flex-col p-2 w-full mt-5">
            <span className="text-sm mb-1 text-gray-400 mt-4">
              Informe seu resultado de hoje:
            </span>
            <TextField
              id="token"
              className="flex-1"
              placeholder="Joguei conexo.ws dd/mm/yyyy e consegui em 6 tentativas..."
              type="text"
              onChange={(e) => {
                setAnswer(e.target.value ? e.target.value : "");
              }}
            />
          </div>
          <button
            className="w-fit p-2 bg-blue-600 rounded px-4 text-white font-semibold mt-6"
            onClick={handleSend}
          >
            Enviar resultado
          </button>
        </>
      )}

      {success && (
        <div className="flex flex-col items-center mt-6">
          <span className="text-xl text-green-600">✅</span>
          <span className="text-sm text-gray-400">
            Resultado enviado com sucesso!
          </span>
        </div>
      )}

      <div className="flex flex-col gap-1 w-full mt-4 p-2">
        {history.length > 0 &&
          history.map((daily) => (
            <div
              className="flex items-center justify-between w-full max-w-5xl p-4 bg-white rounded-xl shadow-md dark:bg-zinc-800"
              key={daily.created_at.toString()}
            >
              <div>
                <span className="flex flex-1 text-xs mr-2 text-gray-500">
                  {`${new Date(daily.created_at).getUTCDate()}-${new Date(
                    daily.created_at
                  ).toLocaleString("pt-BR", { month: "short" })}`}
                </span>
                <span className="text-xl mr-2 text-white items-center">
                  {`${daily.score} `}
                  <span className="text-xs">tentativas</span>
                </span>
              </div>
              <div className="flex h-full">
                <div className="grid grid-cols-10 gap-1 text-sm">
                  {daily.answers.map((answer) => {
                    switch (answer) {
                      case "error":
                        return <span className="text-red-500">❌</span>;
                      case "green":
                        return <span className="text-green-500">🟩</span>;
                      case "orange":
                        return <span className="text-yellow-500">🟧</span>;
                      case "purple":
                        return <span className="text-purple-500">🟪</span>;
                      case "blue":
                        return <span className="text-blue-500">🟦</span>;
                      default:
                        return <span className="text-gray-500">❔</span>;
                    }
                  })}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
