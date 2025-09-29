import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { createMessage, updateMessage, getMessageById } from "../api/client";

const messageSchema = z.object({
  title: z.string().min(1, "Título obrigatório"),
  body: z.string().min(1, "Corpo obrigatório"),
  author: z.string().optional(),
  status: z.string().min(1, "Status obrigatório"),
});

type MessageForm = z.infer<typeof messageSchema>;

const MessageFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<MessageForm>({
    resolver: zodResolver(messageSchema),
  });

  useEffect(() => {
    if (isEditing && id) {
      getMessageById(id).then((msg) => {
        setValue("title", msg.title);
        setValue("body", msg.body);
        setValue("author", msg.author);
        setValue("status", msg.status);
      });
    }
  }, [id, isEditing, setValue]);

  const onSubmit = async (data: MessageForm) => {
    setError("");
    try {
      if (isEditing && id) {
        await updateMessage(id, {
          title: data.title,
          body: data.body,
          status: data.status,
        });
      } else {
        await createMessage(data as Required<MessageForm>);
      }
      navigate("/");
    } catch (e) {
      setError("Erro ao salvar mensagem");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 to-white py-8 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-extrabold text-gray-900">
            {isEditing ? "Editar Mensagem" : "Nova Mensagem"}
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="text-brand-700 hover:text-brand-900 font-bold"
          >
            Voltar
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-gray-700 mb-1 font-semibold">
              Título
            </label>
            <input
              {...register("title")}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 mb-1 font-semibold">
              Corpo
            </label>
            <textarea
              {...register("body")}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-400"
              rows={4}
            />
            {errors.body && (
              <p className="text-red-500 text-sm mt-1">{errors.body.message}</p>
            )}
          </div>
          {!isEditing && (
            <div>
              <label className="block text-gray-700 mb-1 font-semibold">
                Autor
              </label>
              <input
                {...register("author")}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
              {errors.author && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.author.message}
                </p>
              )}
            </div>
          )}
          <div>
            <label className="block text-gray-700 mb-1 font-semibold">
              Status
            </label>
            <input
              {...register("status")}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
            {errors.status && (
              <p className="text-red-500 text-sm mt-1">
                {errors.status.message}
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
            {isSubmitting ? "Salvando..." : "Salvar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MessageFormPage;
