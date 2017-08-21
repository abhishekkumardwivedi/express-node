//config------------------ ----------

var express = require('express');
var app = express();  // app defined with express
var parser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var port = process.env.PORT || 3000;

// schema
var Place = require('./app/models/place');
var Sn = require('./app/models/sn');
var User = require('./app/models/user');

// Needed to parse POST request.
app.use(parser.urlencoded({extended: true})); 
app.use(parser.json());
app.use(morgan('dev'));

//mongodb : db name - traveller
mongoose.connect('mongodb://localhost/traveller');
// mongoose.connect('mongodb://akd1981:test1981app@ds019806.mlab.com:19806/traveller');


//routes for APIs ------------------------------------------------------------

var router = express.Router();

// USER
router.route('/user/register')
      .post(function(req, res) {
          if(req.body.email) {
            console.log(req.body.email);
            User.find({email: req.body.email}, function(err, user) {
              if(err) {
                console.log("error:");
                console.log(err);
                console.log("creating new user");
                var user = new User();
                user.name = req.body.name;
                user.email = req.body.email;
                user.phone = req.body.phone;
                user.googleId = req.body.google_id;
                user.facebookId = req.body.facebook_id;
                user.testId = req.body.test_id;
                user.profileImageUrl = null;
                user.createTime = new Date;
                user.updateTime = new Date;
                user.plan = [];
                user.frinedsId = [];
                user.snfollow = [];
                user.pref_tag = [];
                user.save(function(err) {
                if(err) res.send(err);
                  res.json(user);
                });
              }
              else {
                console.log("user already exists!!");
                res.json(user);
              }
            });
          }   
      });

router.route('/user/login/:login_id')
      .post(function(req,res) {
        if(req.body.use == 'test_id') {
          var query = User.findOne({'testId' : req.params.login_id});
          query.exec(function(err, user) {
            if(err) res.send(err);
            res.json(user);
          });
        }
        else if(req.body.use == '_id'){
          User.findById(req.params.login_id, function(err, user) {
             if(err) res.send(err);
             console.log(user);
             res.json(user);
           });
         }
      });

router.route('/user/get/all/:user_id')
      .post(function(req, res) {
        User.find(function(err, users) {
          if(err)
            res.send(err);
          res.json(users);
        });
      });

router.route('/user/delete/:user_id')
      .post(function(req, res) {
        User.remove({_id: req.params.user_id}, function(err) {
          if(err) res.send(err);
          res.json({message: 'success!!'});
        });
      });

//FRIENDS
router.route('/user/friends/add/:my_id')
      .post(function(req, res) {
        User.findById(req.params.my_id, function(err, user) {
          if(err) res.send(err);
          // var friend = new User.FriendsId;
          user.friendsId.push({
            name: req.body.fname,
            user_id: req.body.fid,
            date: new Date
            });
          user.save(function(err) {
            if(err) res.send(err);
            res.json({SUCCESS, message: 'Friend added!!'});
          });
        });
      });

router.route('/user/friends/remove/:user_id')
      .post(function(req, res) {
        User.findById(req.params.user_id, function(err, user) {
          if(err) res.send(err);
            user.friendsId.findById(req.body.fid, function(err, friend) {
            user.friendsId.remove(friend);
            user.save(function(err) {
              if(err) res.send(err);
              res.json({SUCCESS, message: 'Friend removed from list!!'});
            });
          });
        });
      });

router.route('/user/get/:user_id')
      .get(function(req, res) {
        User.findById(req.params.user_id, function(err, user) {
          if(err)
            res.send(err);
          res.json(user);
        });
      })

// MY PLACE
router.route('/user/myplan/add/:user_id/:place_id')
      .post(function(req, res) {
        User.findById(req.params.user_id, function(err, user) {
          if(err) res.send(err);
          if(req.body.update == 'add') {
            user.plan.push({
              placeId: req.params.place_id,
              planDate: "0",
              friendsId: []
            });
          }
          user.save(function(err) {
            if(err) res.send(err);
            res.json(user);
          });
        });
      });

// MYPLAN
router.route('/user/myplan/get/:user_id')
      .post(function(req, res) {
        User.findOne({'_id' : req.params.user_id}, 'plan', function(err, plan) {
          if(err) res.send(err);
          res.json(plan);
        });
      });

router.route('/user/myplan/date/:user_id/:plan_id/:plan_date')
      .post(function(req, res) {
        User.findOne({'_id' : req.params.user_id}, 'plan', function(err, plan) {
          if(err) res.send(err);
          //plan.
        });
      });

router.route('/place/get/:user_id/:place_id')
      .post(function(req, res) {
        Place.findById( req.params.place_id,function(err, place) {
          if(err) res.send(err);
          console.log(place);
          res.json(place);
        });
      });

router.route('/place/suggest/get/:user_id')
      .post(function(req, res) {
        Place.find(function(err, places) {
          if(err) res.send(err);
          console.log("resp: " + places);
          res.json(places);
        });
      });
// SN
router.route('/sn/like/:user_id/:place_id')
      .post(function(req, res) {
        var query = Sn.findOne({'placeId' : req.params.place_id});
        query.select('likes');
        query.exec(function(err, sn) {
          if(err) res.send(err);
          User.findOne({'_id' : req.params.user_id}, 'name', function(err, user) {
            console.log(user);
            if(err) res.send(err);
            sn.likes.push({
              userId : req.params.user_id,
              userName : user.name,
              time : new Date
            });
            sn.save(function(err) {
              if(err) res.send(err);
              Place.findOne({'_id' : req.params.place_id}, 'likesCount', function(err, place){
                if(err) res.send(err);
                place.likesCount = sn.likes.length;
                place.save(function(err) {
                  if(err) res.send(err);
                });
              });
              res.json(sn);
            });
          });
        });
      });

router.route('/sn/comment/:user_id/:place_id')
      .post(function(req, res) {
        var query = Sn.findOne({'placeId' : req.params.place_id});
        query.select('comments');
        query.exec(function(err, sn) {
          if(err) res.send(err);
          User.findOne({'_id' : req.params.user_id}, 'name', function(err, user) {
            if(err) res.send(err);
            console.log(user);
            sn.comments.push({
              comment : req.body.comment,
              userId : req.params.user_id,
              userName : user.name,
              time : new Date
            });
            sn.save(function(err) {
              if(err) res.send(err);
                Place.findOne({'_id' : req.params.place_id}, 'commentsCount', function(err, place) {
                if(err) res.send(err);
                place.commentsCount = sn.comments.length;
                place.save(function(err) {
                  if(err) res.send(err);
                });
              });
              res.json(sn);
            });
          });
        });
      });

router.route('/sn/get/:user_id/:place_id')
      .post(function(req, res) {
        Place.findById(req.params.place_id, function(err, place) {
          if(err) res.send(err);
          Sn.findById(place.snDocId, function(err, sn) {
            if(err) res.send(err);
            res.json(sn);
          });
        });
      });

// HANGOUT
router.route('/place/hangout/get/:user_id')
      .post(function(req, res) {
        Place.find(function(err, places) {
          if(err) res.send(err);
          console.log("resp: " + places);
          res.json(places);
        });
      });

router.route('/hangout/share')
      .post(function(req, res) {
      /** query here **/
      });

router.route('/hangout/my')
      .post(function(req, res) {
      /** query here **/
      });

// ROUTE - 1 : create new place
router.route('/place/create/:user_id')
      .post(function(req, res) {
        var place       = new Place();
        place.name      = req.body.name;
        place.details   = req.body.details;
        place.longitude = req.body.longitude;
        place.latitude  = req.body.latitude;
        place.primaryImage  = req.body.imageUrl;
        place.postedBy  = req.params.user_id;
        place.save(function(err) {
          if(err) res.send(err);
          var sn = new Sn();
          sn.placeId = place._id;
          sn.likes = [];
          sn.comments = [];
          sn.save(function(err) {
            if(err) res.send(err);
            place.snDocId = sn._id;
            place.save(function(err) {
              if(err) res.send(err);
              res.json({message: 'new place created!!'});
            });
          });
        });
      })

// ROUTE - 1 : get places

      .get(function(req, res) {
        Place.find(function(err, places) {
          if(err)
            res.send(err);
          res.json(places);
        });
      });


// ROUTE - 2 : get one place
router.route('/places/:place_id')
      .get(function(req, res) {
        Place.findById(req.params.place_id, function(err, place) {
          if(err)
            res.send(err);
          res.json(place);
        });
      })

// ROUTE - 2 : update one place
      .put(function(req, res) {
        Place.findById(req.params.place_id, function(err, place) {
          if(err)
            res.send(err);
          place.summary = req.body.summary;
          place.save(function(err) {
            if(err)
              res.send(err);
            res.json({message: "place updated!!"});
          });
        });
      })

// ROUTE - 2 : delete one place
      .delete(function(req, res) {
        Place.remove ({
          _id: req.params.place_id
        }, function(err, place) {
          if(err)
            res.send(err);
          res.json({message: 'place deleted'});
        });
      });

// ALL REQUEST 1st HERE
router.use(function(req, res, next) {
        console.log('request >>');
//        console.log(req.headers);
        console.log(req.body);
        console.log(req.params);
        console.log(new Date);
        console.log('----------');
        next();
});

// TEST
router.route('/ping')
      .post(function(req, res) {
           res.send("ok");
      });

//register routes -------------------------------------------------------------

//routes with /api prefix
app.use('/api', router);

//start server -----------------------
app.listen(port);
console.log("Server is live at port " + port + " ...");
//config------------------ ----------

var express = require('express');
var app = express();  // app defined with express
var parser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
