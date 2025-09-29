import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5678/webhook",
});

// LOGIN
export const loginUser = async (credentials: {
  username: string;
  password: string;
}) => {
  const response = await api.post("/login", credentials);
  return response.data;
};

// LISTAR MENSAGENS
export const getMessages = async () => {
  const response = await api.get("/messages");
  const data = response.data;
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") return [data];
  return [];
};

// BUSCAR POR ID
export const getMessageById = async (id: string) => {
  const response = await api.get(
    `/e8b452ab-d339-48be-9700-56e77fa619db/api/messages/${id}`
  );
  return response.data;
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
