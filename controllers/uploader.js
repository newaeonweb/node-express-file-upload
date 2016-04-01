// Import file system
var fs = require('fs');
var mime = require('mime');

//Constants
var IMAGE_TYPES = ['image/jpeg','image/jpg', 'image/png'];

// Pdestt function
exports.post = function(req, res) {
    // single() function data come in "req.file" regardless of the attribute "name" on the form
    var tmp_path = req.file.path;

    console.log(req.file);
    //  Stored originalname in a variable.
    var target_path = './public/uploads/' + req.file.originalname;
    // using Node Stream API to copy and save file
    var src = fs.createReadStream(tmp_path);
    var dest = fs.createWriteStream(target_path);
    src.pipe(dest);

    src.on('end', function() {
        //res.json({ msg: 'Uploaded with Success'});
        res.render('images', {
          name: req.file.name,
          type: req.file.mimetype
        });

    });
    src.on('error', function(err) {
        //res.render(err);
        res.send(500, 'Something went wrong');
    });
};

exports.uploadImage = function(req, res) {
    var src;
    var dest;
    var targetPath;
    var targetName;
    var tempPath = req.file.path;

    console.log('file: ' + req.file);
    //get the mime type of the file
    var type = mime.lookup(req.file.mimetype);
    console.log('type: ' + type)
    //get the extenstion of the file
    var extension = req.file.path.split(/[. ]+/).pop();

    console.log('extension: ' + extension);

    //check to see if we support the file type
    if (IMAGE_TYPES.indexOf(type) == -1) {
        return res.status('415').send('Supported image formats: jpeg, jpg, jpe, png.');
    }

    //create a new name for the image
    //targetName = uid(22) + '.' + extension;

    //determin the new path to save the image
    targetPath = './public/images/' + req.file.originalname;

    //create a read stream in order to read the file
    src = fs.createReadStream(tempPath);

    //create a write stream in order to write the a new file
    dest = fs.createWriteStream(targetPath);

    src.pipe(dest);

    //handle error
    src.on('error', function() {
        if (err) {
            return res.send(500, 'Something went wrong');
        }
    });

    //if we are done moving the file
    src.on('end', function() {

        //delete file from temp folder
        fs.unlink(tempPath, function(err) {
            if (err) {
                return res.send(500, 'Something went wrong');
            }

            //send something nice to user
            res.render('images', {
                name: req.file.originalname,
                type: type,
                extension: extension
            });

        });//#end - unlink
    });
};
