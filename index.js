// Function to get a list of directories in a path
const getDirectories = source =>
    fs.readdirSync(source, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)

const	webfontsGenerator = require('webfonts-generator'),
        path = require('path'),
		randomstring = require("randomstring"),
        fs = require('fs'),
        GenerateDir = require(__dirname + "/source/lib/generate-dir.js").GenerateDir,
        GenerateCodePoints = require(__dirname + "/source/lib/generate-codepoints.js").GenerateCodePoints,
        GenerateStyle = require(__dirname + "/source/lib/generate-style.js").GenerateStyle;




const fontAndStyle = function(opts) {

    const   fontoutdir = `${opts.fontoutdir}/${(opts.fontname).toLowerCase()}` 
            startcodepoint = '0xE000',
            iconfont = {};
            


    if (!fs.existsSync(fontoutdir)){
        GenerateDir(fontoutdir);
        if (opts.debug) {
            console.log('Created dir for icon font')
        }
    }
    if (!fs.existsSync(opts.cssoutdir)){
        GenerateDir(opts.cssoutdir);
        if (opts.debug) {
            console.log('Created dir for CSS/SCSS file')
        }

	}
      
    let cachebust = "?" + randomstring.generate(7);


    function generateWF(iconfont) {

        let webfontOptions = {
            files: iconfont.svgpaths,
            fontName: opts.fontname,
            descent: 0,
            fontHeight: 512,
            css: false,
            html: false,
            dest: fontoutdir,
            startCodepoint: startcodepoint,
            round: 10e3,
            types: ["eot", "woff2", "woff", "ttf", "svg"],
            rename: function(file) {
                let fullname = path.basename(file, path.extname(file));
                let name = fullname.includes("_") ? fullname.split('_')[1] : fullname;
                name = name.split('(')[0];
                return name;
            },
            codepoints: iconfont.points
        }

        webfontsGenerator(webfontOptions, function () {
		if (opts.debug) {
			console.log(`Exported icon font ${opts.fontname} to ${fontoutdir}`);
		}
        });	
    }



    async function createCodePoints(opts) {
        return greeting = await Promise.resolve(GenerateCodePoints(opts));
    };
        
    createCodePoints(opts).then(function (newiconfont) {
        generateWF(newiconfont);
        GenerateStyle(opts, iconfont.css, cachebust);
        return 
      }).catch(function (error) {
        return console.log(error);
      });

    return iconfont
}


const init = function (useroptions) {

    let defaultOptions = {
        fontname: "MyCoolFontName",
        baseclass: "icon",
        svgindir: "source/assets/icons",
        fontoutdir: "build/assets/fonts",
        cssname: "iconcss",
        cssoutdir: "build/assets/css",
        cssextension: "css",
        debug: false
    }

    const defaults = function (options, defaultOptions) {
        for ( let i in defaultOptions ) {
            if ( !options.hasOwnProperty( i ) ) {
                options[i] = defaultOptions[i];
            }
        }
    }

    let options = useroptions || {};
    defaults(options, defaultOptions);

    let iconfontobj = fontAndStyle(options);
    return iconfontobj

};

module.exports = init;
