const express = require('express');
const morgan = require('morgan');
const ffmpeg = require('ffmpeg');
const path = require('path');
const GIFEncoder = require('gifencoder');
const encoder = new GIFEncoder(2000, 2000);
const pngFileStream = require('png-file-stream');
const fs = require('fs');

var multer = require('multer');
const bodyParser = require('body-parser');
const app = express();

require('./changeLogo.js');
//middleware
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

//routes





//FIleUpload
let i = 1;

var storage1 = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, path.join(__dirname,'/public/upload/') );
  },
  filename: function (req, file, callback) {
    //console.log('FieldName : ',file.fieldname);
    console.log('originalName file : ',file.originalname);
    var originalName = file.originalname;
    var c;
    var ext = "";
    for (c = 0; originalName[c]!='.';c++);
    for(c;c<originalName.length;c++){
      ext+= originalName[c];
    }
    console.log('ext : ',ext);
    var newName = "";
    newName += file.fieldname;
    newName += 1
    newName += ext;
    console.log('new name : ',newName);
    callback(null, newName);
  }
});

var upload1 = multer({ storage : storage1 }).array('video',1);


  

app.post('/api/video',async function(req,res){
    await upload1(req,res,async function(err) {
        //console.log(req.body);
        console.log('FILES::',req.files);
        if(err) {
            console.log(err);
            return res.end("Error uploading file.",err);
        }
        try {
            var process = new ffmpeg(path.join(__dirname,'/public/upload/video1.mp4'));
            process.then(async function (video) {
                console.log('The video is ready to be processed');
                await video.fnAddWatermark(path.join(__dirname,'/public/upload/image1.png'),path.join(__dirname,'/public/result/test.avi'),{
                    position : 'SE',
                    margin_nord : null,
                    margin_sud : null,
                    margin_east : null,
                    margin_west : null
                },function(err,doc){
                    if(err) throw err;
                    console.log('s.endVideo Created');
                });  
            }, function (err) {
                console.log('Error: ' + err);
            });
        } catch (e) {
            console.log(e.code);
            console.log(e.msg);
        }
        // var filePathNew = path.join(__dirname, '/public/upload/video1.mp4')
        // await fs.unlinkSync(filePathNew,function(err){
        //     if(err) console.log(err);
        //     console.log('video deleted');
        //});
        res.end("Video is uploaded");
    });
});




app.post('/api/finalUpload',function(req,res){

    
    try {
        var process = new ffmpeg(path.join(__dirname,'/public/upload/video/video1.mp4'));
        process.then(function (video) {
            console.log('The video is ready to be processed');
            video.fnAddWatermark(path.join(__dirname,'/public/fupload/image/image1.png'),path.join(__dirname,'/public/fupload/video/test.avi'),{
                position : 'SE',
                margin_nord : null,
                margin_sud : null,
                margin_east : null,
                margin_west : null
            },function(err,doc){
                if(err) throw err;
                res.end('Video Created');
            });  
        }, function (err) {
            console.log('Error: ' + err);
        });
    } catch (e) {
        console.log(e.code);
        console.log(e.msg);
    }

});



const port = process.env.port || 3300;
app.listen(port, function(){
    console.log('server is listening to port ',port);
});