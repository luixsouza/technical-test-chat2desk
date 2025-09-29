import axios from "axios";

// Tipos básicos usados pelo frontend
export interface Message {
  id: string;
  title: string;
  body: string;
  author: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

const api = axios.create({
  baseURL: "http://localhost:5678/webhook",
});

// Alguns webhooks do n8n retornam objetos no formato { json: {...}, pairedItem: {...} }
// Este helper "desembrulha" esse formato tanto para arrays quanto para objetos únicos
const unwrapN8n = <T = unknown>(data: any): T | T[] => {
  if (Array.isArray(data)) {
    return data.map((item) =>
      item && typeof item === "object" && "json" in item ? item.json : item
    ) as T[];
  }
  if (data && typeof data === "object" && "json" in data) {
    return (data.json as T) ?? (data as T);
  }
  return data as T;
};

// LOGIN
export const loginUser = async (credentials: {
  username: string;
  password: string;
}) => {
  const response = await api.post("/login", credentials);
  return response.data;
};

// LISTAR MENSAGENS
export const getMessages = async (): Promise<Message[]> => {
  const response = await api.get("/messages");
  const unwrapped = unwrapN8n<Message>(response.data);
  if (Array.isArray(unwrapped)) return unwrapped;
  if (unwrapped && typeof unwrapped === "object") return [unwrapped as Message];
  return [];
};

// BUSCAR POR ID
export const getMessageById = async (id: string): Promise<Message> => {
  const response = await api.get(
    `/e8b452ab-d339-48be-9700-56e77fa619db/api/messages/${id}`
  );
  const unwrapped = unwrapN8n<Message>(response.data);
  return (Array.isArray(unwrapped) ? unwrapped[0] : unwrapped) as Message;
};

// CRIAR
export const createMessage = async (data: {
  title: string;
  body: string;
  author: string;
  status: string;
}) => {
  const response = await api.post("/api/messages/", data);
  return response.data;
};

// ATUALIZAR
export const updateMessage = async (
  id: string,
  data: { title: string; body: string; status: string }
) => {
  const response = await api.put(
    `/3621eaf5-1083-4274-bc9f-21599eecab9e/api/messages/${id}`,
    data
  );
  return response.data;
};

// DELETAR
export const deleteMessage = async (id: string) => {
  return api.delete(`/4517e62a-2edd-42db-8f73-3f5bc20f3773/api/messages/${id}`);
};

export default api;
