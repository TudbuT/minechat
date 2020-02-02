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
  password: data.account.password
});
console.log("Connecting to the server...")

let free = 0;
let lastmessages = [""];
let lastmessage = 0;

client.on("connect", () => {
  console.log("\nLogging in...");
  process.stdout.write("\n\n>>> ");
  free = 1;
})

/*setInterval(() => {
  if(free) {
    var message = "";
    for (let chr of m) {
      message += "" + chr;
    }
    process.stdout.write("\r\x1b[K")
    process.stdout.write(">>> " + message)
  }
}, 1)*/

const keys = "abcdefghijklmnopqrstuvwxyz#0123456789ßöüä*~+'-_.:,;<>|@€`'°^!\"$%&/()=?{[]}\\ \u0008\u0127\u0003\u001b";

process.stdin.on("data", (key) => {
  for (let chr of key.split(""))
    if(key !== "\r" && (keys.includes(key) || keys.toUpperCase().includes(key))) 
      m[m.length] = key;
  
  var message = "";
  for (let chr of m) {
    message += "" + chr;
  }
  
  if ( key === '\u0003' ) {
    console.log("\n>>> #stop");
    process.exit();
  }
  
  
    
  
  if(!free) {
    return;
  }
  
  
  if(key === "\x7f" || key === "¶" || key === "《" || key === "‹" || key === "\u2408") {
    let emessage = message.slice(0, message.length - 1);
    m = emessage.split("");
    process.stdout.write("\r\x1b[K")
    process.stdout.write(">>> " + emessage)
    return lastmessages[lastmessage] = emessage;
  }
  
  if(key === "\x1b[A") {
    /*lastmessage++;
    if(!lastmessages[lastmessage]) 
      lastmessage += -1;*/
    process.stdout.write("\r\x1b[K")
    process.stdout.write(">>> " + message);
    //m = lastmessages[lastmessage].split("");
    return;
  }

  if(key === "\x1b[B") {
    /*lastmessage++;
    if(!lastmessages[lastmessage]) 
      lastmessage += -1;*/
    process.stdout.write("\r\x1b[K")
    process.stdout.write(">>> " + message);
    //m = lastmessages[lastmessage].split("");
    return;
  }

  if(key === "\x1b[C") {
    process.stdout.write("\r\x1b[K")
    process.stdout.write(">>> " + message);
    return;
  }

  if(key === "\x1b[D") {
    process.stdout.write("\r\x1b[K")
    process.stdout.write(">>> " + message);
    return;
  }
  
  process.stdout.write(key);
  
  if(key === "\r") {
  lastmessage++;
  lastmessages[lastmessage] = message;

  if (message != "#last" && message != "#stop" && message != "#ping" && message != "#pl" && message != "#m" && message != "#um") {
    sendChat(message)
  }
  if(message == "#last") {
    console.log("#\n\n\n---\n" + chat.join("\n").split("\n\n").join("\n") + "\n---");
  }
  if(message == "#stop") {
    console.log("# Disconnecting...")
    client.end("Disconnected")
    console.log("# Disconnected")
    process.exit(1)
  }
  if(message == "#ping") {
    mc.ping({
      host: ip || data.server.ip,
      port: port || data.server.port
    }, (err, results) => {
      console.log("#\n---\n" + "LOC: " + client.latency + "\nSRV: " + results.latency + "\n---");
    })
    message = ""
  }
  if(message == "#pl") {
    mc.ping({
      host: ip || data.server.ip,
      port: port || data.server.port
    }, (err, results) => {
      console.log("#\n---\n" + "MX: " + results.players.max + "\nON: " + results.players.online + "\n---");
    })
  }
  if(message == "#m") {
    showchat = 0
    console.log("# Hiding chat")
  }
  if(message == "#um") {
    showchat = 1
    console.log("# Showing chat")
  }
    process.stdout.write(">>> ")
    m = [];
  }
})

client.on("error", (err) => {
  var message = "";
  for (let chr of m) {
    message += "" + chr;
  }
  console.warn ("\r\x1b[K" + err);
  //require("child_process").exec(`echo \`${err.toString().replace("`", "\\`").replace("$", "\\$")}\`>>errors.txt`)
  process.stdout.write(">>> " + message)
})


var chat = []

const sendChat = function (msg) {
  client.write('chat', {message: msg});
  console.log(">>> " + msg)
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


let m = [""]

const newChat = function (msg) {
  var message = "";
  for (let chr of m) {
    message += "" + chr;
  }
  if(showchat) {
    console.log("\r\x1b[K" + msg)
    process.stdout.write(">>> " + message)
  }
}

process.stdin.setRawMode(true);
