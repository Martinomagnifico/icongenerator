const 	fs = require("fs");

const GenerateStyle = function (opts, cssobject, cachebust) {
	
	let fontname = opts.fontname;
	let baseclass = opts.baseclass;
	let cssoutdir = opts.cssoutdir;
	let cssname = opts.cssname;
	let cssextension = opts.cssextension;

	let css = 
		`@font-face {
	font-family: "${fontname}";
	src:  url("../fonts/${fontname.toLowerCase()}/${fontname}.eot${cachebust}");
	src:  url("../fonts/${fontname.toLowerCase()}/${fontname}.eot${cachebust}#iefix") format("embedded-opentype"),
	url("../fonts/${fontname.toLowerCase()}/${fontname}.ttf${cachebust}") format("truetype"),
	url("../fonts/${fontname.toLowerCase()}/${fontname}.woff${cachebust}") format("woff"),
	url("../fonts/${fontname.toLowerCase()}/${fontname}.svg${cachebust}#${fontname}") format("svg");
	font-weight: normal;
	font-style: normal;
}

.${baseclass}:before, [data-icon]:before {
	font-family: "${fontname}" !important;
}

`

	Object.keys(cssobject).forEach(key => {
		let iconcss = `.${baseclass}.icon-${key}:before {
  content: "\\${cssobject[key]}";
}`
		css = css + iconcss;
	});

	try {
		fs.writeFileSync(`${cssoutdir}/${cssname}.${cssextension}`, css);
		if (opts.debug) {
			console.log(`Exported ${cssextension.toUpperCase()} to ${cssoutdir}/${cssname}.${cssextension}`);
		}

	} catch (e) {
		console.error(e);
	}
}


module.exports = {  
	GenerateStyle: GenerateStyle
}