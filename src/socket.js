const { Server } = require('socket.io');

let io;

const socketSetup = (server) => {
  io = new Server(server, {
    cors: {
      origin: ['http://localhost:3001'],
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('🟢 Client connected:', socket.id);

    // Bác sĩ tham gia room riêng của mình
    socket.on('join-doctor-room', (doctorId) => {
      socket.join(`doctor-${doctorId}`);
    });

    // Rời khỏi room khi disconnect
    socket.on('disconnect', () => {
      console.log('❌ Client disconnected:', socket.id);
    });
  });
};

const notifyDoctor = (doctorId, appointment) => {
  if (io) {
    io.to(`doctor-${doctorId}`).emit('new-appointment', appointment);
    console.log(`📢 Gửi thông báo lịch hẹn mới cho bác sĩ ${doctorId}`);
  }
};

module.exports = { socketSetup, notifyDoctor };
