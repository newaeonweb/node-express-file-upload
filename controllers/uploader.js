// Import file system
var fs = require('fs');

// Post function
exports.post = function(req, res) {
    // single() function data come in "req.file" regardless of the attribute "name" on the form
    var tmp_path = req.file.path;
    //  Stored originalname in a variable.
    var target_path = './public/uploads/' + req.file.originalname;
    // using Node Stream API to copy and save file
    var src = fs.createReadStream(tmp_path);
    var dest = fs.createWriteStream(target_path);
    src.pipe(dest);
    src.on('end', function() { res.json({ msg: 'Uploaded with Success'}); });
    src.on('error', function(err) { res.render('error'); });
};
