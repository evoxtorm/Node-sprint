const Joi = require('@hapi/joi');

module.exports = {
	registerValidation: (data) => {
		const schema = {
			name: Joi.string().min(2).required(),
			email: Joi.string().min(4).required().email(),
			password: Joi.string().min(2).required(),
			isAdmin: Joi.boolean()
		};
		return Joi.validate(data, schema);
	},
	loginValidation: (data) => {
		const schema = {
			email: Joi.string().min(4).required().email(),
			password: Joi.string().min(2).required()
		};
		return Joi.validate(data, schema);
	},
	taskValidation: (data) => {
		const schema = {
			title: Joi.string().min(2).required(),
			description: Joi.string().min(2).required()
		};
		return Joi.validate(data, schema);
	},
	taskeditValidation: (data) => {
		const schema = {
			title: Joi.string().min(2),
			description: Joi.string().min(2)
		};
		return Joi.validate(data, schema);
	}
}
