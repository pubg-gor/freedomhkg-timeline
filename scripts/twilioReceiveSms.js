/**
 * temporary script to handle telephone number from twilio
 */
const http = require('http')
const express = require('express')
const { MessagingResponse, VoiceResponse } = require('twilio').twiml

const app = express()

app.get('/', (req, res) => {
  console.log('hi')
  res.end('hi')
})

app.post('/sms', (req, res) => {
  console.log('receved a sms!')
  const twiml = new MessagingResponse()
  console.log('req.body', req.body)
  console.log('req.params', req.params)

  twiml.message('The Robots are coming! Head for the hills!')

  res.writeHead(200, { 'Content-Type': 'text/xml' })
  res.end(twiml.toString())
})

app.post('/phone', (req, res) => {
  console.log('receved a call!')
  console.log('req.params', req.params)

  // Use the Twilio Node.js SDK to build an XML response
  const twiml = new VoiceResponse()
  // twiml.say('Hello. Please leave a message after the beep.')

  // Use <Record> to record the caller's message
  twiml.record()

  // End the call with <Hangup>
  twiml.hangup()

  // Render the response as XML in reply to the webhook request
  res.type('text/xml')
  res.send(twiml.toString())
})

http.createServer(app).listen(80, () => {
  console.log('Express server listening on port 80')
})
