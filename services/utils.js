/*jslint node: true */
/*global exports */
'use strict';

var _ = require('lodash');
var fs = require('fs');
var path = require('path');

// Get the proper request IP Address
exports.getClientIp = function ( req ) {
	var ipAddress;

	// Do we have this on the request object?
	if (req.ip){
		return req.ip;
	}

	// Amazon EC2 / Heroku workaround to get real client IP
	var forwardedIpsStr = req.header('x-forwarded-for');
	if ( forwardedIpsStr ) {
		// 'x-forwarded-for' header may return multiple IP addresses in
		// the format: "client IP, proxy 1 IP, proxy 2 IP" so take the
		// the first one
		var forwardedIps = forwardedIpsStr.split(',');
		ipAddress = forwardedIps[0];
	}
	if ( !ipAddress ) {
		// Ensure getting client IP address still works in
		// development environment
		ipAddress = req.connection.remoteAddress;
	}

	return ipAddress;
};

// Test an object to see if empty object
exports.isEmptyObject = function ( obj ) {
	return Object.getOwnPropertyNames(obj).length === 0;
};

// Create an expiration date
exports.createExpirationDate = function(expires_in){
	return new Date(new Date().getTime() + (expires_in * 1000));
};

// Create a random integer
exports.createRandomInt = function(min, max){
	return Math.floor( ( Math.random() * max) + min );
};

// Create a random string (uses lodash)
exports.createRandomString = function(length) {
	var chars = "abcdefghijklmnopqrstufwxyzABCDEFGHIJKLMNOPQRSTUFWXYZ1234567890".split('');
	var pwd = _.sampleSize(chars, length || 12);
	return pwd.join("");
};

// String replacement of simple tag values(no attributes) within an HTML/XML string
exports.replaceTagContent = function(xml_string, node_name, new_value){
	if ( (xml_string || '').length > 0 ){

		var start = xml_string.indexOf('<' + node_name + '>');
		var end = xml_string.indexOf('</' + node_name + '>');
		if (start === -1 || end === -1){
			return xml_string;
		}
		start += node_name.length + 2;

		return xml_string.substr(0, start) + new_value + xml_string.substr(end);

	}
	return '';
};

// String removal of a simple tag (no attributes) from an HTML/XML string
exports.removeTag = function(xml_string, node_name){
	if ( (xml_string || '').length > 0 ){

		var start = xml_string.indexOf('<' + node_name + '>');
		var end = xml_string.indexOf('</' + node_name + '>');
		if (start === -1 || end === -1){
			return xml_string;
		}
		end += ('</' + node_name + '>').length;

		return xml_string.substr(0, start) + xml_string.substr(end);

	}
	return '';
};

exports.readJSON = function(path){
	try {
		var raw = fs.readFileSync(path, {
			encoding: 'utf8'
		});
		return JSON.parse(raw);
	} catch (e){
		return false;
	}
};

exports.writeJSON = function(path, content){
	try {
		fs.writeFileSync(path, content, 'utf8');
		return true;
	} catch (e){
		return false;
	}
};

// Get a file list optionally filtered by extension
exports.fetchFileListFilter = function ( folder, ext_filter ) {
	return new Promise(function ( resolve, reject ) {

		var return_files = [];

		// Read the raw file list
		fs.readdir(folder, function ( err, files ) {

			if ( err ) {
				return reject(err);
			}

			// Sort by name in descending order
			files.sort().reverse();

			// Parse the file info
			return_files = _.map(files, function ( file ) {

				return {
					file    : file,
					fullpath: path.join(folder, file),
					ext     : path.extname(file).replace('.', '')
				};

			});

			// Apply ext filter
			if (ext_filter && ext_filter.length > 0){
				return_files = _.filter(return_files, function(o){
					return o.ext === ext_filter;
				});
			}

			// File only filter
			return_files = _.filter(return_files, function(o){
				return fs.statSync(o.fullpath).isFile();
			});

			return resolve(return_files);

		});

	});
};