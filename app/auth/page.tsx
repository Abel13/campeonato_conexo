"use client";
import { useState } from "react";
import TextField from "@/components/Fields";
import { supabase } from "@/config/supabase";
import { useRouter } from "next/navigation";
import { useProfileStore } from "@/hooks/profile";

export default function Register() {
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("default");
  const {
    actions: { setPlayer },
  } = useProfileStore((store) => store);

  const router = useRouter();

  const handleLogin = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.signInWithPassword({
      email,
      password: token,
    });

    if (error) alert(error.message);
    else if (user) {
      const { data: player, error } = await supabase
        .from("players")
        .select("*")
        .eq("id", user.id)
        .single();

      setPlayer(player);
      router.replace("/");
    }
  };

  const register = () => {
    router.replace("/register");
  };

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
            setEmail(e.target.value ? e.target.value : "default");
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
        className="w-fit p-2 bg-blue-600 rounded px-4 text-white font-semibold mt-6"
        onClick={handleLogin}
      >
        Entrar
      </button>
      <span className="mt-4 text-sm text-blue-500" onClick={register}>
        Criar minha conta
      </span>
    </div>
  );
}
