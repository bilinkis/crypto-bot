'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
const emojiStrip = require('emoji-strip')
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function(req, res) {
  res.send('Hello world, I am a chat bot')
})

app.post('/webhook', function(req, res) {

  let events = req.body.entry[0].messaging;
  for (let i = 0; i < events.length; i++) {
    //let crypto = event.message.text.toLowerCase();
    let event = events[i];
    //sendStatus(event.sender.id,"typing_on");
    //let currency = escape(event.message.text.toUpperCase());
    if(event.message.text){
    var message = emojiStrip(event.message.text);
    if (message == ""){
      message = "emoji";
    }
    }
    console.log(message);
    if (message!=undefined && message !="emoji") {
      console.log(event);
      let info = message.split(" ");
      if (info[1]) {
        info[1] = Number(info[1]);
      }
      let currency = escape(message.split(' ')[0].toUpperCase());
      let data = JSON.parse(Get('https://api.bitcoinaverage.com/ticker/global/all'));
      let cryptos = JSON.parse(Get('https://api.cryptonator.com/api/ticker/' + currency + "-btc"));
      if (data[currency] != undefined) {
        if (!isNaN(info[1])) {
          sendMessage(event.sender.id, {
            text: info[1] + " " + info[0].toUpperCase() + " are worth: " + info[1] / data[currency].last + " BTC"
          });
        }
        else {
          sendMessage(event.sender.id, {
            text: "The last price is: " + data[currency].last + " " + currency
          });
        }
      }
      else {
        if (cryptos.ticker != undefined) {
  
          if (!isNaN(info[1])) {
            sendMessage(event.sender.id, {
              text: info[1] + " " + info[0].toUpperCase() + " are worth: " + cryptos.ticker.price * info[1]
            });
            setTimeout(function() {
              sendMessage(event.sender.id, {
                text: "Which is also the same to: " + data["USD"].last * cryptos.ticker.price * info[1] + " USD"
              });
            }, 500);
          }
          else {
            sendMessage(event.sender.id, {
              text: "The last price is: " + cryptos.ticker.price + " BTC"
            });
            setTimeout(function() {
              sendMessage(event.sender.id, {
                text: "Which is also the same to: " + data["USD"].last * cryptos.ticker.price + " USD"
              });
            }, 500);
          }
        }

        else {

          sendMessage(event.sender.id, {
            text: "I'm sorry but your input is not a command I can recognize"
          });
          setTimeout(function() {
            sendMessage(event.sender.id, {
              text: "I recognize a short list of commands"
            });
          }, 500);
          setTimeout(function() {
            sendMessage(event.sender.id, {
              text: "Here are some examples: for BTC price, just send me the currency you want the price in. For example: ars or usd"
            });
          }, 1000);
          setTimeout(function() {
            sendMessage(event.sender.id, {
              text: "For altcoin price, just send me the altcoin symbol. For example: eth or ltc"
            });
          }, 1500);
          setTimeout(function() {
            sendMessage(event.sender.id, {
              text: "If you want a specific amount, just send the symbol, and the amount. For example: eth 100"
            });
          }, 2000);
        }

      }
    }

    else {
      sendMessage(event.sender.id, {
        text: "Unsupported character"
      });
    }

    res.sendStatus(200);
  }

});

function Get(yourUrl) {
  let Httpreq = new XMLHttpRequest(); // a new request
  Httpreq.open("GET", yourUrl, false);
  Httpreq.send(null);
  return Httpreq.responseText;

}

function sendMessage(recipientId, message) {
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {
      access_token: "EAAa1VXnZAdXkBAGRYcOFlp8pihY6xHRuQ6ZC741dgOzjiT3KJV9pqZBAJ2RSMiaHk0Qgj4gvgND4VbTZCGoqwlz5NCZCkDUdxsPiZCQ8Hurp1tTaokG9m4Sa8ctZBYGMrDCD53hLpNZCDKG1yNKMd076e9nM7y3DnVawxP8QZAA1zjAZDZD"
    },
    method: 'POST',
    json: {
      recipient: {
        id: recipientId
      },
      message: message,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    }
    else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
};
/*function sendStatus(recipientId, status) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: "EAAa1VXnZAdXkBAGRYcOFlp8pihY6xHRuQ6ZC741dgOzjiT3KJV9pqZBAJ2RSMiaHk0Qgj4gvgND4VbTZCGoqwlz5NCZCkDUdxsPiZCQ8Hurp1tTaokG9m4Sa8ctZBYGMrDCD53hLpNZCDKG1yNKMd076e9nM7y3DnVawxP8QZAA1zjAZDZD"},
        method: 'POST',
        json: {
            recipient: {id: recipientId},
            sender_action: status,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
};*/
// Spin up the server
app.listen(app.get('port'), function() {
  console.log('running on port', app.get('port'))
})
