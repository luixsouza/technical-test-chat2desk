import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMessages, deleteMessage } from "../api/client";

interface Message {
  id: string;
  title: string;
  body: string;
  author: string;
  status: string;
  created_at?: string;
}

const MessagesListPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setError("");
    setLoading(true);
    try {
      const data = await getMessages();
      if (Array.isArray(data)) {
        setMessages(data);
      } else if (data && typeof data === "object") {
        setMessages([data]);
      } else {
        setMessages([]);
        setError("Resposta inesperada da API");
      }
    } catch (e) {
      setError("Erro ao buscar mensagens");
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Deseja realmente deletar?")) return;
    try {
      await deleteMessage(id);
      setMessages((msgs) => msgs.filter((m) => m.id !== id));
    } catch {
      alert("Erro ao deletar mensagem");
    }
  };

  if (loading) return <div className="text-center mt-10">Carregando...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-purple-600 drop-shadow-lg">
            Mensagens
          </h1>
          <Link
            to="/messages/new"
            className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white px-8 py-3 rounded-2xl font-bold shadow-xl transition-all text-lg border-2 border-white/30 hover:scale-105"
          >
            + Nova Mensagem
          </Link>
        </div>
        {error && (
          <div className="text-red-600 mb-4 text-center font-semibold">
            {error}
          </div>
        )}
        {!Array.isArray(messages) || messages.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-xl font-medium">
              Nenhuma mensagem encontrada.
            </p>
          </div>
        ) : (
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="bg-white/90 rounded-3xl shadow-2xl border border-gray-100 p-8 flex flex-col justify-between hover:shadow-3xl transition-all min-h-[340px] group relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-extrabold text-gray-900 line-clamp-2 group-hover:text-blue-700 transition-colors">
                    {msg.title}
                  </h2>
                  <span className="px-4 py-1 rounded-full text-sm font-bold bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border border-blue-200 shadow-sm">
                    {msg.status}
                  </span>
                </div>
                <p className="text-gray-700 mb-4 line-clamp-3 text-lg italic">
                  {msg.body}
                </p>
                <div className="space-y-2 text-sm text-gray-500 mb-4">
                  <p>
                    <span className="font-semibold">ID:</span> {msg.id}
                  </p>
                  <p>
                    <span className="font-semibold">Autor:</span> {msg.author}
                  </p>
                  {msg.created_at && (
                    <p>
                      <span className="font-semibold">Criado:</span>{" "}
                      {new Date(msg.created_at).toLocaleString()}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-3 mt-auto pt-4 border-t border-gray-100">
                  <Link
                    to={`/messages/${msg.id}`}
                    className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 px-5 py-2 rounded-xl font-bold text-base transition-all border border-blue-200 shadow-sm"
                  >
                    Ver
                  </Link>
                  <Link
                    to={`/messages/${msg.id}/edit`}
                    className="bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-700 px-5 py-2 rounded-xl font-bold text-base transition-all border border-yellow-200 shadow-sm"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="bg-red-500/10 hover:bg-red-500/20 text-red-700 px-5 py-2 rounded-xl font-bold text-base transition-all border border-red-200 shadow-sm"
                  >
                    Deletar
                  </button>
                </div>
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-30 group-hover:scale-110 transition-transform duration-300"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesListPage;
