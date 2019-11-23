const mc = require("minecraft-protocol")
const data = require("./data.json")

var client = mc.createClient({
  host: process.argv[1] || data.server.ip,
  port: process.argv[2] || data.server.port,
  username: data.account.email,
  password: data.account.password,
  hideErrors: true,
});
console.log("Connecting to the server...")

client.on("connect", () => {
  console.log("Logging in...")
})

client.on("error", (err) => {
  //require("child_process").exec(`echo \`${err.toString().replace("`", "\\`").replace("$", "\\$")}\`>>errors.txt`)
})


var chat = []

const sendChat = function (msg) {
  client.write('chat', {message: msg});
  console.log("> " + msg.slice(0, msg.length - 1))
  chat[chat.length] = "> " + msg
}

client.on('chat', function(packet) {
  var jsonMsg = JSON.parse(packet.message);
  var msg = "< "
  if(jsonMsg.text) msg = msg + jsonMsg.text
  if(jsonMsg.extra)
    jsonMsg.extra.forEach(j => {
      if(j.text)
        msg = msg + j.text
      else if(typeof(j) == "string")
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
  if (message != "#last\n" && message != "#stop\n" && message != "#ping\n") {
    sendChat(message)
    message = ""
  }
  if(message == "#last\n") {
    console.log("---\n" + chat.join(", ") + "\n---");
    message = ""
  }
  if(message == "#stop\n") {
    console.log("Disconnecting...")
    process.exit(1)
  }
  if(message == "#ping\n") {
    console.log("---\n" + client.latency + "\n---");
    message = ""
  }
})
