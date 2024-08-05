import io from 'socket.io-client';

const socket = io(process.env.REACT_APP_BACKEND_EXPRESS_SERVER, {
    transports: ['websocket'], // Ensures WebSocket transport is used
});

socket.on('connect', () => {
    console.log('Connected to socket server');
});

socket.on('disconnect', () => {
    console.log('Disconnected from socket server');
});

export default socket;