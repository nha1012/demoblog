var express = require('express');
var router = express.Router();
var app = express();
// connect mongodb
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
var multer = require('multer')
var cors = require('cors');
app.use(cors());
// Connection URL
const url = 'mongodb://localhost:27017';
// Database Name
const dbName = 'blog';
// storage multer

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname )    
  }
})

var upload = multer({ storage: storage }).array('file')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home Page' });
});

/* GET about page. */
router.get('/about', function(req, res, next) {
  res.render('about', { title: 'About page' });
});

/* GET contact page. */
router.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'Contact page' });
});

/* GET myblog page. */
router.get('/blog', function(req, res, next) {
  res.render('blog', { title: 'Blog' });
});

router.post('/add-new-blog-page', function(req, res, next) {
  var tenfile = "/public/uploads/"
    upload(req, res, function (err) {
      req.files.forEach(element => {
        tenfile = tenfile+ element.filename
      })
    })

    const insertDocuments = function(db, callback) {
      const collection = db.collection('blog');
      collection.insert({
        tittle: req.body.tittle,content1: req.body.content1,content2:req.body.content2,content3:req.body.content3    }, function(err, result) {
        // console.log("Inserted 3 documents into the collection");
        callback(result);
      });
    }
    MongoClient.connect(url, function(err, client) {
      assert.equal(null, err);
      // console.log("Connected successfully to server");
      const db = client.db(dbName);
      insertDocuments(db, function() {
        client.close();
      });
    });

    
});

module.exports = router;
