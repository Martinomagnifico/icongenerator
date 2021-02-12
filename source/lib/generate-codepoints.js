const	glob = require("glob"),
		he = require('he'),
		fs = require('fs'),
		normalize = require('normalize-path'),
		regexFile = new RegExp(/^(?<parentpath>.*[\\\/])?(?<fullname>(?<number>[^_]+)_(?<name>.[^\.]+)*?)(?<extension>\.[^.]*?|)$/i);

const hexToDec = function (hex) {
	return parseInt(hex,16);
}
const decToHex = function (dec) {
	return dec.toString(16);
}

function removeNonMatching(originalArray, regex) {
    var j = 0;
    while (j < originalArray.length) {
		if (!regex.test(originalArray[j])) {
			let thePath = normalize(originalArray[j]).split('/');
			let filename = thePath[(thePath).length - 1];
			console.log(`${filename} does not match the required name convention of NUMBER_NAME(OPTIONAL KEYWORDS).svg`);
			originalArray.splice(j, 1);
		}
            
        else
            j++;
    }
    return originalArray;
}



const getDirectories = source =>
fs.readdirSync(source, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name)


const GenerateCodePoints = function (opts) {

	let fontname = opts.fontname;
	let folder = opts.svgindir;

	let svgpaths = glob.sync(folder + "/**/*.svg");
	let points = {};
	let web = [];
	let css = {};

	let subfolders = getDirectories(folder);

	if (subfolders) {
		web = {};
		subfolders.forEach(
			function(subfolder) { 
				web[subfolder] = [];
			}
		);
	} 

	const split = function (value) {

		let icongroup = value.match(regexFile).groups;
		let iconname = icongroup.name;

		let iconkeywords = (icongroup.name).split('(')
			.filter(function(v){ return v.indexOf(')') > -1})
			.map( function(value) { 
				return value.split(')')[0]
			})

		iconkeywords = (iconkeywords.toString()).replace(/[\[\]']+/g,'');

		let icon = {
			number: parseInt(icongroup.number),
			parentpath: normalize(icongroup.parentpath).split('/'),
			name: iconname
		};

		if (iconkeywords.length > 0) {
			let newname = (icongroup.name).replace(/\s*\(.*?\)\s*/g, '')
			icon.name = newname;
			icon.keywords = iconkeywords;
		}

		icon.parentfolder = icon.parentpath[(icon.parentpath).length - 1];
		icon.start = hexToDec(icon.parentfolder.split('.')[0]);
		
		let unicodePrefix = "0x";
		let csscodePrefix = ("\\").substring(1);

		icon.unipoint = unicodePrefix + decToHex(icon.start + icon.number);
		icon.csspoint = csscodePrefix + decToHex(icon.start + icon.number);

		icon.html = he.encode(String.fromCodePoint(icon.unipoint), {
			'useNamedReferences': true
		});


		if (css[icon.name]) {

			console.log(`CSS for ${icon.name} already exists`);

		} else {
			points[icon.name] = icon.unipoint;
			css[icon.name] = icon.csspoint;


			if (subfolders) {
				subfolders.forEach(
					function(subfolder) { 

						if (icon.parentfolder == subfolder) {
							if (iconkeywords.length > 0) {
								web[subfolder].push({
									"number": icon.number,
									"name": icon.name,
									"html": icon.html,
									"keywords": icon.keywords
								});
							} else {
								web[subfolder].push({
									"number": icon.number,
									"name": icon.name,
									"html": icon.html
								});
							}

						}
					}
				);
			} else {
				if (iconkeywords.length > 0) {
					web.push({
						"number": icon.number,
						"name": icon.name,
						"html": icon.html,
						"keywords": icon.keywords
					});
				} else {
					web.push({
						"number": icon.number,
						"name": icon.name,
						"html": icon.html
					});
				}
			}
			
		}

		
	};

	const init = function () {

		removeNonMatching(svgpaths, regexFile);

		svgpaths.forEach(split);
		this.iconfont = { 
			'fontname': fontname,
			'svgpaths': svgpaths,
			'points': points,
			'web': web,
			'css': css
		};

		return this.iconfont;
	};
	
	return init();
}

module.exports = {  
    GenerateCodePoints: GenerateCodePoints
}