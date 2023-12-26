"use client";
import Image from "next/image";
import { useState } from "react";
import TextField from "@/components/Fields";
import { supabase } from "@/config/supabase";
import { useRouter } from "next/navigation";

export default function Register() {
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [nick, setNick] = useState("default");
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const router = useRouter();

  const handleSignUp = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: token,
    });

    if (error) {
      alert(error.message);
    } else {
      const { data: userData, error } = await supabase.from("players").insert([
        {
          name: nick,
          id: data.user?.id,
        },
      ]);

      if (error) {
        alert(error.message);
      } else {
        setRegisterSuccess(true);
      }
    }
  };

  return (
    <div className="flex w-full pt-5 flex-col items-center">
      <div
        className="flex w-full px-2 text-blue-500"
        onClick={() => router.replace("/")}
      >
        voltar
      </div>
      <Image
        className={`rounded-full border-2`}
        src={`https://api.dicebear.com/7.x/fun-emoji/png?seed=${nick}`}
        alt="Icon"
        width={80}
        height={80}
      />

      <div className="flex flex-col p-2 w-full mt-5">
        <span className="text-sm mb-1 text-gray-400 w-80">
          Informe um e-mail válido.
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
        <span className="text-sm mb-1 text-gray-400 w-80">
          Informe seu nick.
        </span>
        <TextField
          id="nick"
          className="flex-1"
          placeholder="Nick"
          type="text"
          onChange={(e) => {
            setNick(e.target.value ? e.target.value : "default");
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
        onClick={handleSignUp}
      >
        Cadastrar
      </button>
      {registerSuccess && (
        <div className="flex m-2 border border-green-900 p-2 rounded bg-green-700 text-xs text-center">
          Cadastro realizado com suesso!
          <br />
          Confirme seu e-mail para acessar o jogo.
        </div>
      )}
    </div>
  );
}
