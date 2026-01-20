import { Server } from 'socket.io';

export const registerPollSocket = (httpServer, config) => {
  const io = new Server(httpServer, {
    cors: {
      origin: config.corsOrigins,
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    socket.on('joinPoll', (pollId) => {
      if (pollId) socket.join(pollId);
    });

    socket.on('leavePoll', (pollId) => {
      if (pollId) socket.leave(pollId);
    });
  });

  return io;
};
