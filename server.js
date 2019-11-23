const client = require("./main.js")
process.stdin.setEncoding("utf8")

var message = ""

module.exports = {
  newChat: function (msg) {
    console.log(msg)
  }
}

process.stdin.on("data", d => {
  message = message + d;
  if(d == "\n" && message != "#last\n") {
    client.sendChat(message)
    message = ""
  }
  if(message == "#last\n") {
    console.log("---\n" + client.chat);
    message = ""
  }
})
