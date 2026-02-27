import { Server, Socket } from "socket.io";
import db from "../db.ts";

// Helper to calculate distance between two points in km
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

export const setupSockets = (io: Server) => {
  const userLocations = new Map<string, { lat: number, lon: number, userId: number }>();

  io.on("connection", (socket: Socket) => {
    console.log(`[Socket] User connected: ${socket.id}`);

    socket.on("update_location", (data: { lat: number, lon: number, userId: number }) => {
      if (!data.lat || !data.lon) return;
      userLocations.set(socket.id, data);
      console.log(`[Socket] Location updated for user ${data.userId}: ${data.lat}, ${data.lon}`);
    });

    socket.on("join_sos", (sosId: string | number) => {
      const room = `sos_${sosId}`;
      socket.join(room);
      console.log(`[Socket] ${socket.id} joined room: ${room}`);
    });

    socket.on("new_sos", (sos: any) => {
      console.log(`[Socket] Broadcasting SOS ${sos.id} from user ${sos.user_id}`);
      
      let broadcastCount = 0;
      userLocations.forEach((loc, socketId) => {
        const distance = getDistance(sos.latitude, sos.longitude, loc.lat, loc.lon);
        const radiusInKm = sos.radius / 1000;

        if (distance <= radiusInKm) {
          console.log(`[Socket] Alerting user ${loc.userId} at distance ${distance.toFixed(2)}km`);
          io.to(socketId).emit("sos_alert", sos);
          broadcastCount++;
        }
      });
      console.log(`[Socket] SOS ${sos.id} broadcasted to ${broadcastCount} nearby users`);
    });

    socket.on("respond_sos", (data: { sosId: number, userId: number, name: string }) => {
      const { sosId, userId, name } = data;
      console.log(`[Socket] User ${name} (${userId}) responding to SOS ${sosId}`);
      
      try {
        db.prepare('INSERT INTO responders (sos_id, user_id) VALUES (?, ?)').run(sosId, userId);
        io.to(`sos_${sosId}`).emit("responder_joined", { userId, name, sosId });
      } catch (err: any) {
        console.error(`[Socket] Error saving responder: ${err.message}`);
      }
    });

    socket.on("send_message", (data: { sosId: number, userId: number, name: string, message: string }) => {
      const { sosId, userId, name, message } = data;
      try {
        db.prepare('INSERT INTO messages (sos_id, user_id, message) VALUES (?, ?, ?)').run(sosId, userId, message);
        io.to(`sos_${sosId}`).emit("new_message", { userId, name, message, createdAt: new Date() });
      } catch (err: any) {
        console.error(`[Socket] Error saving message: ${err.message}`);
      }
    });

    socket.on("resolve_sos", (sosId: number) => {
      io.to(`sos_${sosId}`).emit("sos_resolved", sosId);
    });

    socket.on("disconnect", () => {
      userLocations.delete(socket.id);
      console.log(`[Socket] User disconnected: ${socket.id}`);
    });
  });
};
