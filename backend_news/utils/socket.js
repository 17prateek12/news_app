const { Server } = require('socket.io');

let io = null;

function initSocket(server) {
    if (!io) {
        io = new Server(server, {
            cors: {
                origin: "*",
            }
        });
        io.on('connection', (socket) => {
            console.log('A user connected');
            socket.on('disconnect', () => {
                console.log('User disconnected');
            });
        });
    }
    return io;
}

function getSocket() {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
}

module.exports = { initSocket, getSocket };
