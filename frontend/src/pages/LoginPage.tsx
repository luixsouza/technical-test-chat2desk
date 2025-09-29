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
      localStorage.setItem("authToken", res.accessToken);
      navigate("/");
    } catch (e) {
      setError("Usuário ou senha inválidos");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 to-white">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-100">
        <div className="flex flex-col items-center gap-3 mb-4">
          <img
            src="/logo-chat2desk.webp"
            alt="Chat2Desk"
            className="h-10 w-10 rounded"
          />
          <h2 className="text-3xl font-extrabold text-center text-gray-900">
            Login
          </h2>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-gray-700 mb-1 font-semibold">
              Usuário
            </label>
            <input
              {...register("username")}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">
                {errors.username.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 mb-1 font-semibold">
              Senha
            </label>
            <input
              type="password"
              {...register("password")}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          {error && (
            <div className="text-red-600 text-center text-sm">{error}</div>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white py-2 rounded-lg font-bold transition-colors"
          >
            {isSubmitting ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPageClean;
