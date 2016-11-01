'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
const wolfram = require('wolfram').createClient("6PUVEA-P8K93R4666");
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
    if (event.message.text != undefined) {
      console.log(event);
      let info = event.message.text.split(" ");
      let currency = escape(event.message.text.split(' ')[0].toUpperCase());
      let data = JSON.parse(Get('https://api.bitcoinaverage.com/ticker/global/all'));
      let cryptos = JSON.parse(Get('https://api.cryptonator.com/api/ticker/' + currency + "-btc"));
      if (data[currency] != undefined) {
        if (typeof info[1] === 'number') {
          sendMessage(event.sender.id, {
            text: "The last price is: " + data[currency].last * info[1] + " " + currency
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
          console.log(typeof info[1]);
          if (typeof info[1] === 'number') {
            sendMessage(event.sender.id, {
              text: "The last price is: " + cryptos.ticker.price * info[1] + " BTC"
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
            text: "The currency you entered doesn't exist or is not supported"
          });
          sendMessage(event.sender.id, {
            text: "If you think this is a mistake, send an email to nico@bilinkis.com, for the currency to be added!"
          });
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
