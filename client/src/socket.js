// socket.js
import { io } from "socket.io-client";

// connect to backend server
export const socket = io("http://localhost:5005");