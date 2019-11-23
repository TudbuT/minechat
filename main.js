const mc = require("minecraft-protocol")
const server = require("./server.js")
const data = require("./data.json")

var client = mc.createClient({
  host: data.server.ip,
  port: data.server.port,
  username: data.account.email,
  password: data.account.password,
});
console.log("Starting")

client.on("connect", () => {
  console.log("Connected")
})

client.on("error", (err) => {
  console.log(err)
})

module.exports = {
  chat: [
     
  ],
  sendChat: function (msg) {
    client.write('chat', {message: msg});
  }
}

client.on('chat', function(packet) {
  var jsonMsg = JSON.parse(packet.message);
    
  var msg = jsonMsg.text && jsonMsg.extra.join("");
  module.exports.chat[module.exports.chat.length] = msg;
  server.newChat(msg);
});
