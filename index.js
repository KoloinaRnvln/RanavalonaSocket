require('dotenv').config()

const io = require("socket.io")(process.env.PORT, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });
  
  io.on("connection", (socket) => {
    socket.on("start", (uid) => {
      socket.join(uid);
      console.log("Connected to socket.io "+uid);
      // socket.emit("connected");
    });
  
    socket.on("change", (to)=>{
      socket.in(to).emit('notif');
    })

    // socket.on("typing", (room) => socket.in(room).emit("typing"));
    // socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
  
    socket.on("sendMessage", (newMessageRecieved) => {
      var {conversationId} = newMessageRecieved;
      // console.log(conversationId)
      conversationId.members.forEach((user) => {
        if (user._id == newMessageRecieved.sender._id) return;
       else 
       socket.in(user._id).emit("newMessage", newMessageRecieved);
      });
    });
  
    socket.off("setup", () => {
      console.log("USER DISCONNECTED");
      socket.leave(uid);
    });
  });