"use client";
import { useEffect, useState } from "react";
import TextField from "@/components/Fields";
import { supabase } from "@/config/supabase";
import { useRouter } from "next/navigation";
import { useProfileStore } from "@/hooks/useProfileStore";

export default function Register() {
  const router = useRouter();

  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState<string>();
  const { loadPlayer } = useProfileStore((store) => store);

  const handleLogin = async () => {
    setLoading(true);
    if (!email || !token) return alert("Preencha todos os campos!");

    const {
      data: { user },
      error,
    } = await supabase.auth.signInWithPassword({
      email,
      password: token,
    });

    if (error) alert(error.message);
    else if (user) {
      await loadPlayer(user.id);
      router.replace("/");
    }
    setLoading(false);
  };

  const handleMagicLink = async () => {
    setLoading(true);

    if (!email) return alert("Informe seu email!");

    const { data, error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: "https://campeonato-conexo.vercel.app",
      },
    });

    if (error) {
      if (error.status === 400) alert("Informe um email válido!");
      else if (error.status === 429)
        alert(
          "Limite de emails atingido, aguarde alguns minutos e tente novamente!"
        );
      else alert(error.message);
    } else alert("Magic Link enviado para seu email!");
    setLoading(false);
  };

  const register = () => {
    router.replace("/register");
  };

  const fetchData = async () => {
    const { data, error } = await supabase.auth.getUser();

    if (data.user) {
      loadPlayer(data.user?.id);
      router.replace("/");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex w-full pt-5 flex-col items-center">
      LOGIN
      <div className="flex flex-col p-2 w-full mt-5">
        <span className="text-sm mb-1 text-gray-400 w-80">
          Informe seu e-mail.
        </span>
        <TextField
          id="email"
          className="flex-1"
          placeholder="E-mail"
          type="text"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />

        <span className="text-sm mb-1 text-gray-400 mt-4">
          Informe sua senha.
        </span>
        <TextField
          id="token"
          className="flex-1"
          placeholder="Senha"
          type="password"
          maxLength={6}
          onChange={(e) => {
            setToken(e.target.value ? e.target.value : "");
          }}
        />
      </div>
      <button
        disabled={loading}
        className="w-fit p-2 bg-blue-600 rounded px-4 text-white font-semibold mt-6"
        onClick={handleLogin}
      >
        Entrar
      </button>
      <span
        className="mt-4 text-sm bg-purple-500 p-2 px-4 rounded"
        onClick={handleMagicLink}
      >
        🧙‍♂️ Entrar com Magic Link 🧙‍♂️
      </span>
      <span className="mt-4 text-sm text-blue-500" onClick={register}>
        Criar minha conta
      </span>
    </div>
  );
}
