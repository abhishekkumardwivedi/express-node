var mongoose = require('mongoose');
var schema = mongoose.Schema;

var placeSchema = new schema({
                   name: String,
                   details: String,
                   city: String,
                   state: String,
                   tags: [String],
                   months: {
                    jan: String,
                    feb: String,
                    mar: String,
                    apr: String,
                    may: String,
                    jun: String,
                    jul: String,
                    aug: String,
                    sep: String,
                    oct: String,
                    nov: String,
                    dec: String
                   },
                   longitude: String,
                   latitude: String,
                   primaryImage: String,
                   moreImages: [String],
                   snDocId: String,
                   postedBy: String
                 });

module.exports = mongoose.model('place', placeSchema);
