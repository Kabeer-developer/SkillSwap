const Message = require("../models/Message");

const chatSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("joinRoom", (barterId) => {
      socket.join(barterId);
    });

    socket.on("sendMessage", async (data) => {
      const { barterId, senderId, text } = data;

      const message = await Message.create({
        barterId,
        senderId,
        text,
      });

      io.to(barterId).emit("receiveMessage", message);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

module.exports = chatSocket;