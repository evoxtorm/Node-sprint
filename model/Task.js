const mongoose = require('mongoose');
const { Schema } = mongoose;

const taskSchema = new Schema({
	title : {
		type: String,
		required: true,
		min: 2
	},
	description: {
		type: String,
		required: true,
		min: 6
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	approved: {
		type: Boolean
	},
	approvedby: [{
		type: Schema.Types.ObjectId,
		ref: 'User'
	}]
}, {
		timestamps:true
});


module.exports = mongoose.model('Task', taskSchema);