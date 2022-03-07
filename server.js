// Main server page
// This page starts the server and includes all required packages, IP, and listen information

const http = require('http');
const app = require('./express');
const path = require('path');

const port = 3000; // Port the server is hosted on
const server = http.createServer(app);
server.listen(port);

app.get('/', function(req, res) { // Function to utilize the given HTML file "index.html"
    res.sendFile(path.join(__dirname, '/index.html'));
  }); 