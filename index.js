'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
const wolfram = require('wolfram').createClient("6PUVEA-P8K93R4666");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
})

// for Facebook verification
app.post('/webhook', function (req, res) {
    
    var events = req.body.entry[0].messaging;
    for (var i = 0; i < events.length; i++) {
        //var crypto = event.message.text.toLowerCase();
        var event = events[i];
        //sendStatus(event.sender.id,"typing_on");
        var data = JSON.parse(Get('https://api.bitcoinaverage.com/ticker/global/all'));
        var cryptos = JSON.parse(Get('https://api.cryptonator.com/api/ticker/'+ event.message.text+"-btc"));
        //console.log(data);
        //console.log(data.USD);
        //sendMessage(event.sender.id,{text: "fetching info..."});
        var currency = event.message.text.toUpperCase();
        if (data[currency]!= undefined)
        {
            sendMessage(event.sender.id, {text: "The last price is: " + data[currency].last +" "+currency});
            
        }
        else{
            
            
            
            if(cryptos.ticker!=undefined){
                sendMessage(event.sender.id, {text: "The last price is: " + cryptos.ticker.price+" BTC"});
                setTimeout(function() {sendMessage(event.sender.id, {text: "Which is also the same to: " + data["USD"].last * cryptos.ticker.price+" USD"});}, 500);
            } else{
            sendMessage(event.sender.id, {text: "The currency you entered doesn't exist or is not supported"});
            sendMessage(event.sender.id, {text: "If you think this is a mistake, send an email to nico@bilinkis.com, for the currency to be added!"});
            } 
        }
        /*switch(currency)
        {
            
            case "USD":
            sendMessage(event.sender.id, {text: "The last price is: " + data[currency].last});  
            break;
            case "ARS":
            sendMessage(event.sender.id, {text: "The last price is: " + data[currency].last});
            break;
            
            case "CNY":
            sendMessage(event.sender.id, {text: "The last price is: " + data[currency].last});
            break;
            case "PEN":
            sendMessage(event.sender.id, {text: "The last price is: " + data[currency].last});
            break;
            case "CLP":
            sendMessage(event.sender.id, {text: "The last price is: " + data[currency].last});
            break;
            case "COP":
            sendMessage(event.sender.id, {text: "The last price is: " + data[currency].last});
            break;
            case "VEF":
            sendMessage(event.sender.id, {text: "The last price is: " +  data[currency].last});
            break;
            case "BRL":
            sendMessage(event.sender.id, {text: "The last price is: " +  data[currency].last});
            break;
            case "UYU":
            sendMessage(event.sender.id, {text: "The last price is: " +  data[currency].last});
            break;
            case "PYG":
            sendMessage(event.sender.id, {text: "The last price is: " +  data[currency].last});
            break;
            case "BOB":
            sendMessage(event.sender.id, {text: "The last price is: " +  data[currency].last});
            break;
            case "MXN":
            sendMessage(event.sender.id, {text: "The last price  : " +  data[currency].last});
            break;
            case "CAD":
            sendMessage(event.sender.id, {text: "The last price is: " +  data[currency].last});
            break;
            case "ETH":
            sendMessage(event.sender.id, {text: "The last price is: " + cryptos[1].price_btc});
            break;
            case "XRP":
            sendMessage(event.sender.id, {text: "The last price is: " + cryptos[2].price_btc});
            break;
            case "LTC":
            sendMessage(event.sender.id, {text: "The last price is: " + cryptos[3].price_btc});
            break;
            case "ETC":
            sendMessage(event.sender.id, {text: "The last price is: " + cryptos[4].price_btc});
            break;
            case "XMR":
            sendMessage(event.sender.id, {text: "The last price is: " + cryptos[5].price_btc});
            break;
            case "DASH":
            sendMessage(event.sender.id, {text: "The last price is: " + cryptos[6].price_btc});
            break;
            case "REP":
            sendMessage(event.sender.id, {text: "The last price is: " + cryptos[7].price_btc});
            break;
            case "WAVES":
            sendMessage(event.sender.id, {text: "The last price is: " + cryptos[8].price_btc});
            break;
            case "XEM":
            sendMessage(event.sender.id, {text: "The last price is: " + cryptos[9].price_btc});
            break;
            default:
            sendMessage(event.sender.id, {text: "The currency you entered doesn't exist or is not supported"});
            setTimeout(sendMessage(event.sender.id, {text: "If you think this is a mistake, send an email to nico@bilinkis.com, for the currency to be added!"}), 1000);
            
*/





            
        }
        /*wolfram.query(event.message.text, function(err, result) {
            if(result == undefined){
                sendMessage(event.sender.id, {text: "I couldn't find what you were looking for, sorry m8!"});
            } else{
                for(var i = 0;i<result.length; i++)
                {
                    console.log(result[i].subpods[0]);
                sendMessage(event.sender.id, {text: result[i].subpods[0].value});
                sendMessage(event.sender.id, {attachment:{type:"image", payload:{url:result[i].subpods[0].image}}})
                }
                
            }
            
            })
        
    }*/
    
    res.sendStatus(200);
});
function Get(yourUrl){
var Httpreq = new XMLHttpRequest(); // a new request
Httpreq.open("GET",yourUrl,false);
Httpreq.send(null);
return Httpreq.responseText;          

    }
function sendMessage(recipientId, message) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: "EAAa1VXnZAdXkBAGRYcOFlp8pihY6xHRuQ6ZC741dgOzjiT3KJV9pqZBAJ2RSMiaHk0Qgj4gvgND4VbTZCGoqwlz5NCZCkDUdxsPiZCQ8Hurp1tTaokG9m4Sa8ctZBYGMrDCD53hLpNZCDKG1yNKMd076e9nM7y3DnVawxP8QZAA1zjAZDZD"},
        method: 'POST',
        json: {
            recipient: {id: recipientId},
            message: message,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
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

    
