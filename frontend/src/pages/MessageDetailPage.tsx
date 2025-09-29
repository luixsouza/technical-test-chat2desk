import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getMessageById } from "../api/client";

interface Message {
  id: string;
  title: string;
  body: string;
  author: string;
  status: string;
  created_at?: string;
}

const MessageDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [message, setMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      getMessageById(id)
        .then((msg) => setMessage(msg))
        .catch(() => setError("Erro ao buscar mensagem"))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div className="text-center mt-10">Carregando...</div>;
  if (error)
    return <div className="text-center text-red-600 mt-10">{error}</div>;
  if (!message)
    return <div className="text-center mt-10">Mensagem não encontrada.</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-8">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          {message.title}
        </h2>
        <p className="mb-4 text-gray-700">{message.body}</p>
        <div className="space-y-2 text-sm text-gray-500 mb-6">
          <p>
            <span className="font-medium">ID:</span> {message.id}
          </p>
          <p>
            <span className="font-medium">Autor:</span> {message.author}
          </p>
          <p>
            <span className="font-medium">Status:</span> {message.status}
          </p>
          {message.created_at && (
            <p>
              <span className="font-medium">Criado:</span>{" "}
              {new Date(message.created_at).toLocaleString()}
            </p>
          )}
        </div>
        <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">
          Voltar
        </Link>
      </div>
    </div>
  );
};

export default MessageDetailPage;
