//config------------------ ----------
var morgan = require('morgan');
var mongoose = require('mongoose');
var morgan = require('morgan');
//var port = process.env.PORT || 3000;

// schema
var Place = require('./app/models/place');
var Sn = require('./app/models/sn');
var User = require('./app/models/user');

//mongodb : db name - traveller
mongoose.connect('mongodb://akd1981:test1981app@ds019806.mlab.com:19806/traveller');

//-------------------------------------------------------

var place       = new Place();
place.name      = "Delhi";
place.details   = "Captail city";
place.longitude = "28";
place.latitude  = "77";
place.primaryImage  = null;
place.postedBy  = null;
place.save(function(err) {
  if(err) console.log(err);
});