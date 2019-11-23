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

client.on("error" => (err) => {
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
  if(jsonMsg.translate == 'chat.type.announcement' || jsonMsg.translate == 'chat.type.text') {
    var username = jsonMsg.with[0].text;
    var msg = jsonMsg.with[1];
    module.exports.chat[module.exports.chat.length] = "\n<" + username + "> " + msg
    server.newChat("<" + username + "> " + msg);
  }
});
