var jimp = require('jimp');
var path = require('path');

jimp.read(path.join(__dirname,'/public/img/xelp.jpg'))
    .then(lenna => {
        return lenna
        .resize(100, 100) // resize
        .quality(99) // set JPEG quality
        .write(path.join(__dirname,'/public/upload/image1.png')); // save
        
    })
    .catch(err => {
        console.error(err);
    });
