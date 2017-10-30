'use strict';
let logger=require("./custom_node_modules/logging/fileAppender.js")();
var PropertiesReader = require('properties-reader');
var http = require('http');
var fs   = require('fs');
const url = require('url');
const dataLoader=require('./custom_node_modules/loader/data-loader');

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

function init(){
	console.log("=========================================");
	console.log("Initialization Start");
	console.log("=========================================");
	
	dataLoader.init().then(function(){
		console.log("=========================================");
		console.log("Initialization End");
		console.log("=========================================");
	});;
}
init();