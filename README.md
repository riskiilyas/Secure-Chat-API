# Socket.io Secure Chat Server Documentation

## Connection

- **URL:** Socket.io connection endpoint (e.g., `http://your-server:your-port`).
- **Request Message:** The connection is initiated by the client connecting to the server using Socket.io. The client includes a handshake query with `publicKey` and `username`.
- **Response Message:** Upon successful connection, the server emits a `welcome` event to the connected client, providing a `sessionId` (client's `socket.id`).

## User Connection and Disconnection Events

- **Event:** `userConnected`
  - **Format:** `{ id: clientId, username, publicKey }`
  - **Description:** Broadcasted to all connected clients when a new user connects.

- **Event:** `userDisconnected`
  - **Format:** `{ id: clientId }`
  - **Description:** Broadcasted to all connected clients when a user disconnects.

## Chat Events

- **Event:** `all_chat`
  - **Format:** `{ senderId, username, message }`
  - **Description:** Broadcasts a chat message to all connected clients.

- **Event:** `chat`
  - **Format:** `{ senderId, message }`
  - **Description:** Sends a chat message to a specific receiver.

## Online Users Event

- **Event:** `online_users`
  - **Format:** `{ online_users: [{ id, username }] }`
  - **Description:** Sent to a newly connected client, providing a list of online users (excluding the client).

## Disconnect Event

- **Event:** `disconnect`
  - **Description:** Automatically triggered when a client disconnects. Removes the client from the array and broadcasts a 'userDisconnected' event.

## Note

- The `clients` array stores information about connected clients.
- The server logs connection, disconnection, and chat events to the console.

## Example Code Snippet

```javascript
const socket = io('http://your-server:your-port', {
  query: {
    publicKey: 'userPublicKey',
    username: 'userUsername',
  },
});

socket.on('welcome', ({ sessionId }) => {
  console.log(`Welcome! Your session ID is ${sessionId}`);
});

// Other event listeners...
