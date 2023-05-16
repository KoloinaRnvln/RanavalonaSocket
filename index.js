require('dotenv').config();
console.log(process.env.PORT);

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
    });
  
    socket.on("notification action", (notification)=>{
      console.log('ohe');
      // socket.in(notification.to).emit('new notification',notification);
    })

    // socket.on("typing", (room) => socket.in(room).emit("typing"));
    // socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
  
    socket.on("message sent", (newMessageRecieved,to) => {
      console.log(newMessageRecieved,to)
       socket.in(to).emit("new message", newMessageRecieved);
    });
  
    socket.off("setup", () => {
      console.log("USER DISCONNECTED");
      socket.leave(uid);
    });
  });