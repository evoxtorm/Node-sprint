const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewerSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
		unique: true
	},
	reviewers: [{
		type: Schema.Types.ObjectId,
		ref: 'User'
	}]
}, {
		timestamps:true
});

module.exports = mongoose.model('Reviewer', reviewerSchema);