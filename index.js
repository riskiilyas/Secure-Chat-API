const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Array to store connected clients
const clients = [];

io.on('connection', (socket) => {
    const { publicKey, username } = socket.handshake.query;
    const senderId = socket.id;
  
    // Store client information in the array
    clients.push({ clientId: senderId, publicKey, username, socket });
    console.log(`${username} (${senderId}) connected with public key: ${publicKey}`);
  
    // Notify other clients about the new user
    socket.broadcast.emit('userConnected', { id: senderId, username, publicKey });
    socket.emit('welcome', { sessionId: senderId });
    const online_users = clients
      .filter((client) => client.clientId !== senderId)
      .map((client) => ({ id: client.clientId, username: client.username }));
    socket.emit('online_users', { online_users });

    socket.on('all_chat', ({ message }) => {
        io.emit('all_chat', { senderId, username, message });
    });

    socket.on('chat', ({ receiverId, message }) => {
      const receiverSocket = clients.find((client) => client.clientId === receiverId)?.socket;
  
      if (receiverSocket) {
        receiverSocket.emit('chat', { senderId, message });  
      }
    });
 
    // socket.on('list_users', () => {
    //   const userList = clients.map((client) => ({ id: client.clientId, username: client.username, publicKey: client.publicKey }));
    //   socket.emit('users', { userList });
    // });

    socket.on('disconnect', () => {
      // Remove the client from the array when the connection is closed
      const index = clients.findIndex((client) => client.socket === socket);
      if (index !== -1) {
        const { clientId, username } = clients[index];
        clients.splice(index, 1);
        console.log(`${username} (${clientId}) disconnected`);
  
        // Notify other clients about the disconnected user
        socket.broadcast.emit('userDisconnected', { id: clientId });
      }
    });
  });
  
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
