var Jimp = require("jimp");

var fileName = './public/gradient.jpg';
var fileNameNew = './public/gradientnew.jpg';
var watermark = './public/watermark.png'

var loadedImage;

const image = {}; 

let loadedImageHeight = 1000;
let loadedImageWidth = 700;

function calculateMath(firstValue, secondValue) { 
    let val1 = Number(firstValue.replace(/,/g, ""));
    let val2 = Number(secondValue.replace(/,/g, ""));
    console.log(val1) 
    console.log(val2)
    let difference = val2-val1;
    if (difference && difference > 0) { 
        return " -- There was a " + ((Math.abs(difference)/val1)*100).toFixed(2) + "% increase!";
    } else if (difference && difference < 0){ 
        return " -- There was a " + ((Math.abs(difference)/val1)*100).toFixed(2) + "% decrease!";
    } 
}

image.makeImage = function(info, callback) { 
    Jimp.read(fileName)
        .then(function (image) {
            loadedImage = image;
            loadedImage.resize(loadedImageWidth, loadedImageHeight)
            return Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
        })
        .then(function (font) {
            Jimp.read(watermark)
                .then((watermark) => {   
                let counter = 0; 
                Object.keys(info).forEach((item) => { 
                    
                    switch(item.toUpperCase()){
                        case 'NAME':
                            loadedImage.print(font, 50, 2 * (counter), '10Q Filing: ' + info[item])
                                .composite(watermark, loadedImageWidth - 180, -35)
                                .write((fileNameNew));
                            counter+=25;
                            break;
                        case 'IRS_ID':
                            loadedImage.print(font, 50, 2 * (counter), 'IRS id: ' + info[item])
                                .composite(watermark, loadedImageWidth - 180, -35)
                                .write((fileNameNew));
                            counter+=25;
                            break;
                        case 'NETINCOME':
                            loadedImage.print(font, 5, 2 * (counter), 'Net income: ')
                                .composite(watermark, loadedImageWidth - 180, -35)
                                .write((fileNameNew));
                            counter += 25;
                            let firstNetIncome; 
                            let printCounter = 0;
                            let indexReal = Object.keys(info.netIncome).length;
                            Object.keys(info[item]).forEach((year)=>{
                                // let index = Object.keys(info.netIncome).length;
                                loadedImage.print(font, 50, 2 * (counter), year + ': $' + info[item][year])
                                    .composite(watermark, loadedImageWidth - 180, -35)
                                    .write((fileNameNew));
                                    counter += 25;
                                if (printCounter == 0) { 
                                    firstNetIncome = info[item][year];
                                } else if (printCounter == 1) { 
                                    // let calcFont = Jimp.loadFont(Jimp.FONT_SANS_32_WHITE)
                                    loadedImage.print(font, 50, 2 * (counter), 
                                    calculateMath(firstNetIncome, info[item][year]))
                                        .write((fileNameNew));
                                        counter += 25;
                                }
                                printCounter++; 
                            });
  
                            break;
                        case 'DEPRECIATION':
                            loadedImage.print(font, 5, 2 * (counter), 'Deprecation: ')
                            .composite(watermark, loadedImageWidth - 180, -35)
                            .write((fileNameNew));
                            counter += 25;
                            let firstDepreciation; 
                            let printCounter2 = 0;
                            Object.keys(info[item]).forEach((year)=>{
                                loadedImage.print(font, 50, 2 * (counter), year + ': $' + info[item][year])
                                    .composite(watermark, loadedImageWidth - 180, -35)
                                    .write((fileNameNew));
                                    counter += 25;
                                if (printCounter2 == 0) { 
                                    firstDepreciation = info[item][year];
                                } else if (printCounter2 == 1) { 
                                    loadedImage.print(font, 50, 2 * (counter), 
                                    calculateMath(firstDepreciation, info[item][year]))
                                        .write((fileNameNew));
                                        counter += 25;
                                }
                                printCounter2++; 
                            });
                            break;
                        case 'TOTAL_LIABILITIES':
                            loadedImage.print(font, 5, 2 * (counter), 'Total Liabilities: ')
                            .composite(watermark, loadedImageWidth - 180, -35)
                            .write((fileNameNew));
                            counter += 25;
                            let firstLiability; 
                            let printCounter3 = 0;
                            Object.keys(info[item]).forEach((year)=>{
                                loadedImage.print(font, 50, 2 * (counter), year + ': $' + info[item][year])
                                    .composite(watermark, loadedImageWidth - 180, -35)
                                    .write((fileNameNew));
                                    counter += 25;
                                if (printCounter3 == 0) { 
                                    firstLiability = info[item][year];
                                } else if (printCounter3 == 1) { 
                                    loadedImage.print(font, 50, 2 * (counter), 
                                    calculateMath(firstLiability, info[item][year]))
                                        .write((fileNameNew));
                                        counter += 25;
                                }
                                printCounter3++; 
                            });
                            break;
                        case 'TCA':
                            loadedImage.print(font, 5, 2 * (counter), 'Total Current Assets: ')
                            .composite(watermark, loadedImageWidth - 180, -35)
                            .write((fileNameNew));
                            counter += 25;
                            let firstTCA; 
                            let printCounter4 = 0;
                            Object.keys(info[item]).forEach((year)=>{
                                loadedImage.print(font, 50, 2 * (counter), year + ': $' + info[item][year])
                                    .composite(watermark, loadedImageWidth - 180, -35)
                                    .write((fileNameNew));
                                    counter += 25;
                                if (printCounter4 == 0) { 
                                    firstTCA = info[item][year];
                                } else if (printCounter4 == 1) { 
                                    loadedImage.print(font, 50, 2 * (counter), 
                                    calculateMath(firstTCA, info[item][year]))
                                        .write((fileNameNew));
                                        counter += 25;
                                }
                                printCounter4++; 
                            });
                            break;
                        default://do nothing
                            break;
                    }
                    
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

module.exports = image; 