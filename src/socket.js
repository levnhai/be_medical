const { Server } = require('socket.io');

let io;
let activeUsers = new Set(); // Để ngoài để giữ trạng thái khi server restart

const socketSetup = (server) => {
  io = new Server(server, {
    cors: {
      origin: ['http://localhost:3001', 'http://localhost:3000'],
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('🟢 Client connected:', socket.id);

    // Bác sĩ tham gia room riêng
    socket.on('join-doctor-room', (doctorId) => {
      if (doctorId) {
        socket.join(`doctor-${doctorId}`);
      }
    });

    // Khi user online
    socket.on('user_online', (userId) => {
      if (userId) {
        activeUsers.add(userId);
        io.emit('update_active_users', Array.from(activeUsers));
      }
    });

    // Khi user offline
    socket.on('user_offline', (userId) => {
      if (userId) {
        activeUsers.delete(userId);
        io.emit('update_active_users', Array.from(activeUsers));
      }
    });

    // Xử lý khi user disconnect
    socket.on('disconnect', () => {
      console.log('🔴 Client disconnected:', socket.id);
    });
  });
};

// Hàm gửi thông báo đến bác sĩ
const notifyDoctor = (doctorId, appointment) => {
  if (io && doctorId) {
    io.to(`doctor-${doctorId}`).emit('new-appointment', appointment);
    console.log(`📢 Gửi thông báo lịch hẹn mới cho bác sĩ ${doctorId}`);
  }
};

module.exports = { socketSetup, notifyDoctor };
