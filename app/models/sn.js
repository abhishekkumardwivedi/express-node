var mongoose = require('mongoose');
var schema = mongoose.Schema;

var likeSchema = new schema({
                   userId: String,
                   userName: String,
                   time: String
				});

var commentSchema = new schema ({
					comment: String,
					userId: String,
                   	userName: String,
                   	time: String
				});

var snSchema = new schema({
                   likes: [likeSchema],
                   comments: [commentSchema],
                   placeId: String,
                   created: String,
                   lastUpdated: String
				});

module.exports = mongoose.model('sn', snSchema);
