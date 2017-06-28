const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

var csvparser = require('../models/csvparser');
var multer = require('multer');
var uploadModel = require('../models/upload');
var backtestModel = require('../models/backtest');

// router.use(multer({ dest: '../uploads' }).single('file'));
var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        // console.log(file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
        // console.log(file.originalname);
        var filename = file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1];
        cb(null, filename);
        // console.log(req.user);
    }
});

var upload = multer({ //multer settings
    storage: storage,
    limits: { fileSize: 20000000 }
}).single('file');

// Register
router.post('/', passport.authenticate('jwt', {session: false}), function(req, res, next){
  
  upload(req,res,function(err){
      // console.log(req.file.filename);
      if(err){
           res.json({error_code:1, err_desc:err});
           return;
      }
      csvparser.parseCSV(req.file.path, function(success, json) {
        if (success) {
          // console.log(json);
          uploadModel.addFileInfo(req.file.filename, req.file.size, req.user.id, function(success, result) {
            if (success) {
              uploadModel.getId(req.file.filename, req.user.id, function(success, uploadid) {
                if (success) {
                  backtestModel.addBackTest(uploadid, req.user.id, json, function(success, result) {
                    if (success) {
                      res.json({error_code:0, err_desc: null});
                    } else {
                      res.json({error_code:2, err_desc: result});
                    }
                  });
                } else {
                  res.json({error_code:3, err_desc: result});
                }
              });
            } else {
              res.json({error_code:4, err_desc: result});
            }
          });
        } else {
          res.json({error_code:5, err_desc: result});
        }
      });
      // console.log(req.file);
      // uploadModel.addFileInfo(req.file.filename, req.file.size, req.user.id, function(success, result) {
      //   if (success) {
      //     uploadModel.getId(req.file.filename, req.user.id, function(success, uploadid) {
      //       if (success) {
      //         backtestModel.addBackTest(uploadid, req.user.id, 'aaa', function(success, result) {
      //           if (success) {
      //             res.json({error_code:0, err_desc: null});
      //           } else {
      //             res.json({error_code:2, err_desc: result});
      //           }
      //         });
      //       } else {
      //         res.json({error_code:3, err_desc: result});
      //       }
      //     });
      //   } else {
      //     res.json({error_code:4, err_desc: result});
      //   }
      // });
  });
    
});

module.exports = router;