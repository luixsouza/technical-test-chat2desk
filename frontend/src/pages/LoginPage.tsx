import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginUser } from "../api/client";

const loginSchema = z.object({
  username: z.string().min(1, "Usuário obrigatório"),
  password: z.string().min(1, "Senha obrigatória"),
});
type LoginForm = z.infer<typeof loginSchema>;

const LoginPageClean = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setError("");
    try {
      const res = await loginUser(data);
      const token = res?.accessToken || res?.token || res?.access_token;

      if (token) {
        localStorage.setItem("authToken", token);
        navigate("/");
      } else {
        setError("Token de acesso não encontrado na resposta do servidor");
      }
    } catch (e) {
      setError("Usuário ou senha inválidos");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 to-white p-4">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md border border-gray-200/50 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <img
                src="/logo-chat2desk.webp"
                alt="Chat2Desk"
                className="h-16 w-auto object-contain drop-shadow-md"
              />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-800 mt-2">
            Fazer Login
          </h2>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2 font-semibold text-sm">
              Usuário
            </label>
            <input
              {...register("username")}
              placeholder="Digite seu usuário"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">
                {errors.username.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 mb-2 font-semibold text-sm">
              Senha
            </label>
            <input
              type="password"
              {...register("password")}
              placeholder="Digite sua senha"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          {error && (
            <div className="text-red-600 text-center text-sm bg-red-50 p-3 rounded-lg border border-red-200">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white py-3 rounded-xl font-bold transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Entrando...
              </span>
            ) : (
              "Entrar"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPageClean;
