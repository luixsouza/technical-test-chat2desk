import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMessages, deleteMessage, type Message } from "../api/client";

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
      setMessages(Array.isArray(data) ? data : []);
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
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 items-center mb-10 gap-4">
          <div className="justify-self-start flex items-center">
            <img
              src="/logo-chat2desk.webp"
              alt="Chat2Desk"
              className="h-8 w-auto object-contain"
            />
          </div>
          <h1 className="justify-self-center text-center text-4xl sm:text-5xl font-black text-brand-700 tracking-tight">
            Painel de Mensagens
          </h1>
          <div className="justify-self-end">
            <Link
              to="/messages/new"
              className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-xl font-bold shadow-md transition-all text-lg"
            >
              + Nova Mensagem
            </Link>
          </div>
        </div>
        {error && (
          <div className="text-red-600 mb-4 text-center font-semibold">
            {error}
          </div>
        )}
        {messages.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-xl font-medium">
              Nenhuma mensagem encontrada.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 flex flex-col justify-between hover:shadow-lg transition-all min-h-[300px] group relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-extrabold text-gray-900 line-clamp-2 group-hover:text-brand-700 transition-colors">
                    {msg.title}
                  </h2>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200 shadow-sm">
                    {msg.status}
                  </span>
                </div>
                <p className="text-gray-700 mb-4 line-clamp-3 text-base">
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
                    className="bg-brand-50 hover:bg-brand-100 text-brand-700 px-4 py-2 rounded-lg font-bold text-sm transition-all border border-brand-200 shadow-sm"
                  >
                    Ver
                  </Link>
                  <Link
                    to={`/messages/${msg.id}/edit`}
                    className="bg-yellow-50 hover:bg-yellow-100 text-yellow-700 px-4 py-2 rounded-lg font-bold text-sm transition-all border border-yellow-200 shadow-sm"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2 rounded-lg font-bold text-sm transition-all border border-red-200 shadow-sm"
                  >
                    Deletar
                  </button>
                </div>
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-100 rounded-full opacity-30 group-hover:scale-110 transition-transform duration-300"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesListPage;
