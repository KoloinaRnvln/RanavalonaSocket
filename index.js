require('dotenv').config();
const { instrument } = require("@socket.io/admin-ui");

const io = require("socket.io")(process.env.PORT, {
  cors: {
    origin: ["https://admin.socket.io", process.env.CLIENT_URL],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.on("start", (uid) => {
    socket.join(uid);
    console.log("Connected to socket.io " + uid);
  });

  socket.on("notification", (to) => {
    socket.in(to).emit("new notification");
  });

  socket.on("relation change", ({ body, category }) => {
    socket.in(body.to).emit("relation update", { from: body.from, category });
  });

  // socket.on("typing", (room) => socket.in(room).emit("typing"));
  // socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("message sent", (newMessageRecieved, to) => {
    socket.in(to).emit("new message", newMessageRecieved);
  });

  socket.on("delete message", ({ userId, messageId, conversationId }) => {
    socket
      .in(userId)
      .emit("deleted message", { messageId, conversationId, userId });
  });
});

instrument(io, {
  auth: false,
});