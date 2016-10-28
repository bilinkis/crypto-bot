/*'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
const wolfram = require('wolfram').createClient("6PUVEA-P8K93R4666");

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
        wolfram.query(event.message.text, function(err, result) {
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
        
    }
    res.sendStatus(200);
});
function sendMessage(recipientId, message) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
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
})*/
var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
//the imports

app = express()
app.set('port', (process.env.PORT || 5000))
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())
app.get('/',function(req,res){
        if (req.query['hub.verify_token'] === '1234') {
        res.send(hub.query['hub.challenge'])
        }
        res.send('wrong token,error'
                 )
        })


app.get('/webhook',function(req,res){
        if (req.query['hub.verify_token'] === '1234') {
        res.send(hub.query['hub.challenge'])
        }
        res.send('wrong token,error'
                 )
        })


app.listen(app.get('port'), function(req,res) {
           console.log('server running on port',app.get('port'))
           })