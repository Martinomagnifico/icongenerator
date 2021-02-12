const	fs = require('fs'),
		path =require('path');

const mkdirSync = function (dirPath) {
	try {
	  fs.mkdirSync(dirPath)
	} catch (err) {
	  if (err.code !== 'EEXIST') throw err
	}
}

const GenerateDir = function (dirPath) {
	const parts = dirPath.split(path.sep)
	for (let i = 1; i <= parts.length; i++) {
	  mkdirSync(path.join.apply(null, parts.slice(0, i)))
	}
}

module.exports = {  
	GenerateDir: GenerateDir
}