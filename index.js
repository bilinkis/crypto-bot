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
        var event = events[i];
        
        switch(event.message.text)
        {
            case "usd":
            var data = JSON.parse(Get("https://api.bitcoinaverage.com/ticker/global/USD/"));
            sendMessage(event.sender.id, {text: data.last});
            break;
            case "USD":
            var data = JSON.parse(Get("https://api.bitcoinaverage.com/ticker/global/USD/"));
            sendMessage(event.sender.id, {text: data.last});  
            break;
            case "ARS":
            var data = JSON.parse(Get("https://api.bitcoinaverage.com/ticker/global/ARS/"));
            sendMessage(event.sender.id, {text: data.last});
            break;
            case "ars":
            var data = JSON.parse(Get("https://api.bitcoinaverage.com/ticker/global/ARS/"));
            sendMessage(event.sender.id, {text: data.last});
            break;
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
    }
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
        qs: {access_token: "EAAa1VXnZAdXkBALTr0ZAYlopUWZA6u3YWhHpRg4toVpoXQ22lBVxEENqeTIEAsjoRmchI5nIAmScB4UuJ4MGjzQBDsv6SqDyPeAt33J3gHO8hkrFGFxfypS9nJ5RKaKk3ATW2NOZAVOmOhAoBgsZCwNr6SJiZAjrqm0vgUXcLP9AZDZD"},
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
// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})
    
