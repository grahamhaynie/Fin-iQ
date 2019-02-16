var Jimp = require("jimp");

var fileName = './public/gradient.jpg';
var fileNameNew = './public/gradientnew.jpg';
var watermark = './public/watermark.png'
var company = "asdf"
var imageCaption = `                    10Q filing for ${company}`
var netRev =  `123123123123123`;
var loadedImage;

const image = {}; 

let loadedImageHeight = 700;
let loadedImageWidth = 700;

image.makeImage = function(info, callback) { 
    Jimp.read(fileName)
        .then(function (image) {
            loadedImage = image;
            loadedImage.resize(loadedImageHeight, loadedImageWidth)
            return Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
        })
        .then(function (font) {
            Jimp.read(watermark)
                .then((watermark) => {   
                let counter = 0; 
                Object.keys(info).forEach((item) => { 
                    counter+=20;
                    loadedImage.print(font, 5, 2 * (counter), item.toUpperCase() + ": " + info[item])
                            .composite(watermark, loadedImageWidth - 180, -35)
                    .write((fileNameNew));
                })
                })        
                loadedImage

        })
        .then(() => { 
            return callback() 
        })
        .catch(function (err) {
            console.error(err);
        });
}

// image.makeImage({'name': 'bob', 'occupation': 'mcdondlads'}, () => {

// })

module.exports = image; 