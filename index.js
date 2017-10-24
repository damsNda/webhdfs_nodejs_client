'use strict';
let logger=require("./custom_node_modules/logging/fileAppender.js")();
var PropertiesReader = require('properties-reader');
var http = require('http');
var fs   = require('fs');
const url = require('url');

console.log("application Initialization");
var properties = PropertiesReader('config/application.properties');
let webhdfs_host=properties.get('webhdfs_url');
let user=properties.get('user');
let password=properties.get('password');
console.log("End application Initialization");

console.log("Request send");
var options={
  hostname : 'localhost',
  port     : 50070,
  path     : '/webhdfs/v1/layer3?op=CREATE&overwrite=true&user.name=root',
  method   : 'PUT',
};


http.request(options, function(response) {
	if (response && response.statusCode == 307) {
			//gestion de la redirection sur le datanode ou on doit pousher les donnees
			var datanodeLocation = response.headers[hasHeader('location', response.headers)];
			console.log('Redirection vers le datanode '+datanodeLocation);
			var dataNodeUrl=url.parse(datanodeLocation);
			//pour l'instant en dur
			var options2={
				hostname : datanodeLocation,
				method   : 'PUT',
			};

			let options={
					hostname : dataNodeUrl.hostname,
					port     : dataNodeUrl.port,
					path     : dataNodeUrl.path,
					method   : 'PUT',
			};
			fs.createReadStream('files_sample/baseballdatabank-2017.1/core/AllstarFull.csv').pipe(http.request(options, function(response, body) {
				console.log("status code "+ response.statusCode + " statusMessage " + response.statusMessage + " redirect url "+ response.url);	
			}));
			
        } 
	else {    
		console.log("status code "+ response.statusCode + " statusMessage " + response.statusMessage + " redirect url "+ response.url);	
		console.log("erreur lors de la recuperation du datanode");
         
    }
}).end();


var hasHeader = function (header, headers) {
  var headers = Object.keys(headers || this.headers)
    , lheaders = headers.map(function (h) {return h.toLowerCase()})
    ;
  header = header.toLowerCase()
  for (var i=0;i<lheaders.length;i++) {
    if (lheaders[i] === header) return headers[i]
  }
  return false
};

console.log("End Request send");