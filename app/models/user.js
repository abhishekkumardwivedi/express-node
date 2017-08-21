var mongoose = require('mongoose');
var schema = mongoose.Schema;

var friendSchema = new schema({
                   user_id: String,
                   name: String,
                   profileImageUrl: String,
                   date: String
                 });
                   
var planSchema = new schema({
                   placeId: String,
                   planDate: String,
                   friendsId: [String]
                 });

var userSchema = new schema({
                   googleId: String,
                   facebookId: String,
                   testId: String,
                   name: String,
                   email: String,
                   phone: String,
                   profileImageUrl: String,
                   plan: [planSchema],         //for myplans
                   friendsId: [friendSchema],
                   snfollow: [String],         //for hangout
                   pref_tags: [String],        //for suggest
                   createTime: String,
                   updateTime: String
                 });

module.exports = mongoose.model('user', userSchema);
