import { useEffect, useRef, useState } from "react";

export interface SocketOptions {
  namespace?: string; // e.g. '/chat' or '/notifications'
  userId?: string;
  role?: string;
  autoConnect?: boolean;
}

export function useSocket({ namespace = "/notifications", userId, role, autoConnect = true }: SocketOptions = {}) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!autoConnect || !userId) return;

    const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = import.meta.env.VITE_WS_URL || "localhost:3000";
    const url = `${wsProtocol}//${host}${namespace}?userId=${userId}&role=${role || "CUSTOMER"}`;

    const ws = new WebSocket(url);
    socketRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setLastMessage(data);
      } catch {
        setLastMessage(event.data);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    ws.onerror = (err) => {
      console.warn("WebSocket error:", err);
    };

    return () => {
      ws.close();
    };
  }, [namespace, userId, role, autoConnect]);

  const sendMessage = (event: string, payload: any) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ event, data: payload }));
    }
  };

  return {
    isConnected,
    lastMessage,
    sendMessage,
  };
}
