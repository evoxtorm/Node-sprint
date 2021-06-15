const router = require('express').Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ObjectId = require('mongoose').Types.ObjectId;

const User = require('../model/User');
const Reviewer = require('../model/Reviewer');
const { registerValidation, loginValidation } = require('../validations'); 
const { verify, isAdmin } = require('./verifyTokens');


router.get('/adminRegister', async (req, res, next) => {
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash("password", salt);
	const user = new User({
		name: "New Admin",
		email: "admin@admin.com",
		password: hashedPassword,
		isAdmin: true
	});
	try {
		const newUser = await user.save();
		res.status(201).json({
			"message": newUser
		});
	} catch(e) {
		res.status(500).json({
			error: e
		});
	}
});

router.post('/login', async (req, res, next) => {
	// Get the jwt token for a particular user so that it can use for testing purpose
	const { error } = loginValidation(req.body);
	if (error) {
		return res.status(400).json({
			"message": error.details[0].message
		});
	}

	const user = await User.findOne({email: req.body.email});
	if (!user) {
		return res.status(409).json({
			"message": "Email Not found"
		});
	}

	const validPass = await bcrypt.compare(req.body.password, user.password);
	if (!validPass) {
		return res.status(403).json({
			"message": "Incorrect password !"
		});
	};

	// Const assign a token or generate a token
	const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
	res.header('auth-token', token).status(200).json({
		"token": token
	});
});

router.post('/register', verify, isAdmin, async (req, res, next) => {

	// Fields validation
	const { error } = registerValidation(req.body);
	if (error) {
		return res.status(400).json({
			"message": error.details[0].message
		});
	}

	// Check for existing email
	const emailExist = await User.findOne({email: req.body.email});
	if (emailExist) {
		return res.status(409).json({
			"message": "Email already exists"
		});
	}

	// Hash the password
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(req.body.password, salt);

	const user = new User({
		name: req.body.name,
		email: req.body.email,
		password: hashedPassword
	});
	try {
		const newUser = await user.save();
		res.status(201).json({
			"message": newUser
		});
	} catch(e) {
		res.status(500).json({
			error: e
		});
	}
});


router.get('/allUsers', verify, isAdmin, async (req, res, next) => {
	// If the data is large we can perform pagination.
	const allUsers = await User.find({isAdmin : {$ne: true}}).select('name email');
	res.status(200).json({
		users: allUsers
	});
});


module.exports = router;