import { io, Socket } from "socket.io-client";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

// Type-safe `connectWS` function
export const connectWS = (): Socket => {
  return io(BASE_URL);
};
