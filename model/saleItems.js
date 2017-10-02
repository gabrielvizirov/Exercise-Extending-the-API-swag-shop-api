var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var saleItems = new Schema({
    products:[{type: ObjectId, ref: 'Product'}],
    relatedItems:[{type: ObjectId, ref: 'Product'}]
})

module.exports = mongoose.model('SaleItems', saleItems);