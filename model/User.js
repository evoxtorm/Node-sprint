const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
	name : {
		type: String,
		required: true,
		min: 2,
		max: 255
	},
	isAdmin: Boolean,
	email: {
		type: String,
		required: true,
		min: 4,
		max: 255,
		unique: true
	},
	password: {
		type: String,
		required: true,
		max: 1024,
		min: 6
	}
}, {
		timestamps:true
});

module.exports = mongoose.model('User', userSchema);

