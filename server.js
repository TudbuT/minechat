const client = require("./main.js")

module.exports = {
  newChat: function (msg) {
    console.log(msg)
  }
}

process.stdin.on("data", d => {
  client.sendChat(d);
})
