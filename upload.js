var multer = require("multer");
var sftpStorage = require("multer-sftp");

const newFileUpload = function (req, res, next) {
  var storage = sftpStorage({
    sftp: {
      host: "3.0.209.240",
      port: 22,
      username: "admin",
      password: "a7ed48b900cb04a0b",
    },
    destination: function (req, file, cb) {
      cb(null, "/home/fastnews33.site/public_html/audio");
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + "-" + Date.now());
    },
  });

  var upload = multer({ storage: storage }).array('file');

    upload(req,res,function(err){
        logger.debug(JSON.stringify(req?.body));
              logger.debug(JSON.stringify(req?.files));
          if(err){
               logger.debug("Error Occured", JSON.stringify(err));
               res.json({error_code:1,err_desc:err});
          } else{
               logger.debug("Files uploaded successfully");
              res.json({error_code:0,err_desc:null});
          }
      });
};

newFileUpload();
