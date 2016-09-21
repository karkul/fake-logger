// We need these three modules: winston, winston-elasticsearch, elasticsearch
var winston = require('winston');
var Elasticsearch = require('winston-elasticsearch');
var elasticsearch = require('elasticsearch');

// Create a new elasticsearch client connection
var elasticClient = new elasticsearch.Client({
  host: 'elasticsearch-roambee.appa6.tsi-af.de',  // this is the default one if we don't specify one.
  log: 'trace',
  requestTimeout: 60000
});

// Define the tansports to use.
var elasticTransport = {
  level: 'info',    //Messages logged with a severity greater or equal to the given one are logged to ES; others are discarded.
  client: elasticClient,  // include the ES instance created previously
  flushInterval: 3000
};

// Create a new logger using the transport/client created before.
var logger = new winston.Logger({
  transports: [
    new Elasticsearch(elasticTransport)
  ]
});

const fs = require ('fs');
const readline = require('readline');
const filePath = 'txtbooks/the_little_prince.txt'

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

fs.readFile(filePath, {encoding: 'utf-8'}, function (err,file){
  if (!err) {   
    var rd = readline.createInterface ({
      input: fs.createReadStream(filePath),
      output: process.stdout,
      terminal: false
    });

    var level = 0;

    // Logger 
    rd.on('line', function(line){
      level = getRandomInt(1, 4);

      switch(level){
        case 1: logger.info(line);
                break;
        case 2: logger.warn(line);
                break;
        case 3: logger.error(line);
                break;
        case 4: logger.debug(line);
                break;
        default: console.log ('Severity not found');
      }  
    });

  } else {
    console.log(err);
  }
});



