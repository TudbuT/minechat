const mc = require("minecraft-protocol")
const data = require("./data.json")
process.stdin.setEncoding("utf8")


var showchat = 1
var ip = null
var port = null

if(process.env.ip) {
  ip = process.env.ip.split(":")[0]
  port = process.env.ip.split(":")[1] || "25565"
}
if(process.argv[2]) {
  ip = process.argv[2].split(":")[0]
  port = process.argv[2].split(":")[1] || "25565"
}

var client = mc.createClient({
  host: ip || data.server.ip,
  port: port || data.server.port,
  version: data.server.version,
  username: data.account.email,
  password: data.account.password,
  hideErrors: true,
});
console.log("Connecting to the server...")

client.on("connect", () => {
  console.log("Logging in...");
  process.stdout.write(">>> ");
})

client.on("error", (err) => {
  //require("child_process").exec(`echo \`${err.toString().replace("`", "\\`").replace("$", "\\$")}\`>>errors.txt`)
  process.stdout.write("\n>>> " + message)
})


var chat = []

const sendChat = function (msg) {
  client.write('chat', {message: msg});
  //console.log(">>> " + msg.slice(0, msg.length - 1))
  chat[chat.length] = ">>> " + msg
}

client.on('chat', function(packet) {
  var jsonMsg = JSON.parse(packet.message);
  var msg = "<<< "
  if(jsonMsg.text) msg = msg + jsonMsg.text
  if(jsonMsg.extra)
    jsonMsg.extra.forEach(j => {
      if(j.text)
        msg = msg + j.text
      else if(typeof(j) === "string")
        msg = msg + j
    })
  chat[chat.length] = msg;
  newChat(msg);
});


let message = ""

const newChat = function (msg) {
  if(showchat) {
    console.log("\n" + msg)
    process.stdout.write("\n>>> " + message)
  }
}

process.stdin.setRawMode(true);

process.stdin.on("data", (key) => {
  message += key;
  if ( key === '\u0003' ) {
    process.exit();
  }
  if (message != "#last\n" && message != "#stop\n" && message != "#ping\n" && message != "#pl\n" && message != "#m\n" && message != "#um\n") {
    sendChat(message)
    message = ""
  }
  if(message == "#last\n") {
    console.log("#\n\n\n---\n" + chat.join("\n").split("\n\n").join("\n") + "\n---");
    message = ""
  }
  if(message == "#stop\n") {
    console.log("# Disconnecting...")
    client.end("Disconnected")
    console.log("# Disconnected")
    process.exit(1)
  }
  if(message == "#ping\n") {
    mc.ping({
      host: ip || data.server.ip,
      port: port || data.server.port
    }, (err, results) => {
      console.log("#\n---\n" + "LOC: " + client.latency + "\nSRV: " + results.latency + "\n---");
    })
    message = ""
  }
  if(message == "#pl\n") {
    mc.ping({
      host: ip || data.server.ip,
      port: port || data.server.port
    }, (err, results) => {
      console.log("#\n---\n" + "MX: " + results.players.max + "\nON: " + results.players.online + "\n---");
    })
    message = ""
  }
  if(message == "#m\n") {
    showchat = 0
    console.log("# Hiding chat")
    message = ""
  }
  if(message == "#um\n") {
    showchat = 1
    console.log("# Showing chat")
    message = ""
  }
  process.stdout.write(key);
  if(message.endsWith("\u007f"))
    process.stdout.write("\n>>> ")
})
