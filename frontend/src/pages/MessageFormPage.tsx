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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-8">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {isEditing ? "Editar Mensagem" : "Nova Mensagem"}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-gray-700 mb-1">Título</label>
            <input
              {...register("title")}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Corpo</label>
            <textarea
              {...register("body")}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows={4}
            />
            {errors.body && (
              <p className="text-red-500 text-sm mt-1">{errors.body.message}</p>
            )}
          </div>
          {!isEditing && (
            <div>
              <label className="block text-gray-700 mb-1">Autor</label>
              <input
                {...register("author")}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.author && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.author.message}
                </p>
              )}
            </div>
          )}
          <div>
            <label className="block text-gray-700 mb-1">Status</label>
            <input
              {...register("status")}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
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
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-colors"
          >
            {isSubmitting ? "Salvando..." : "Salvar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MessageFormPage;
