
const uri = "mongodb+srv://abdulmoizsarwar21:abdulmoiz123@node-test-app.0ounrb0.mongodb.net/sample_mflix?retryWrites=true&w=majority&appName=Node-test-app";

const express = require('express')
const mongoose = require('mongoose')
const routes = require('./routes')
const cors = require('cors');
const WebSocket = require('ws');

const app = express()

app.use(express.json())
app.use(cors())

mongoose.connect(uri)
.then( () => {
    console.log("connecting to mongo DB");
    startChangeStreams();
    } )
.catch( (err) => {console.log(err)} )


const Team = require('./models')
const wss = new WebSocket.Server({ noServer: true });

function startChangeStreams() {
    const changeStream = Team.watch();
    changeStream.on('change', (change) => {
      console.log('Change occurred:', change);

      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(change));
        }
      });

    });
    changeStream.on('error', (err) => {
      console.error('Change stream error:', err);
    });
  }


app.use('/data',routes)
const server = app.listen(3000, () => console.log("listening on port 3000"))

server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (socket) => {
      wss.emit('connection', socket, request);
    });
  });