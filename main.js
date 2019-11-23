const mc = require("minecraft-protocol")
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


var chat = []

const sendChat = function (msg) {
  client.write('chat', {message: msg});
}

client.on('chat', function(packet) {
  var jsonMsg = JSON.parse(packet.message);
  var msg = jsonMsg.text
  jsonMsg.extra.forEach(j => {
    if(j.text)
      msg = msg + j.text
    else if(typeof(j) == "STRING")
      msg = msg + j
  })
  chat[chat.length] = msg;
  newChat(msg);
});

process.stdin.setEncoding("utf8")

var message = ""

const newChat = function (msg) {
  console.log(msg)
}


process.stdin.on("data", d => {
  message = message + d;
  if (message != "#last\n") {
    sendChat(message)
    message = ""
  }
  if(message == "#last\n") {
    console.log("---\n" + chat);
    message = ""
  }
})
