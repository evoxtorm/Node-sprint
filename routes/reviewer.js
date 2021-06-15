const router = require('express').Router();
const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;

const User = require('../model/User');
const Task = require('../model/Task');
const Reviewer = require('../model/Reviewer');
const { verify, isAdmin } = require('./verifyTokens');
const { taskValidation, taskeditValidation } = require('../validations'); 


router.post('/assign', verify, isAdmin, async (req, res, next) => {
	// Assign a reviewer for a user.
	const userId = req.body.userId;
	const reviewerIds = req.body.reviewerId;
	if (!ObjectId.isValid(userId)) {
		return res.status(409).json({
			message: "Invalid id for task or reviewer"
		});
	}
	const objectIds = reviewerIds.map(id => ObjectId(id));
	const findQuery = { user: userId };
	const updateQuery = { $addToSet: {reviewers: objectIds} };
	try {
		const assignReviewer = await Reviewer.findOneAndUpdate(findQuery, updateQuery, {
			new: true,
			upsert: true
		});
		res.status(200).json({
			message: "Reviewers assigned to the User"
		})
	} catch(e) {
		res.status(500).json({
			error: e
		});
	}
});


router.post('/remove', verify, isAdmin, async (req, res, next) => {
	// Remove any reviewer from the user
	const userId = req.body.userId;
	const reviewerIds = req.body.reviewerId;
	if (!ObjectId.isValid(userId)) {
		return res.status(409).json({
			message: "Invalid id for task or reviewer"
		});
	}
	const objectIds = reviewerIds.map(id => ObjectId(id));
	const findQuery = { user: userId };
	const updateQuery = { $pull: {reviewers : { $in : objectIds}} };
	try {
		const removeReviews = await Reviewer.updateOne(findQuery, updateQuery);
		res.status(200).json({
			message: "Reviewers is removed"
		});
	} catch(e) {
		res.status(500).json({
			error: e
		});
	}
});


router.get('/users', verify, async (req, res, next) => {
	// Get all the users where you are present as a reviewer
	const id = req.user._id;
	const query = {
		reviewers: {
			$in: [ObjectId(id)]
		}
	}
	const allUsers = await Reviewer.find(query);
	if (!allUsers) {
		return res.status(404).json({
			message: "Not able to find any User"
		});
	}
	res.status(200).json({
		users: allUsers
	});
	
});


router.post('/approve', verify, async (req, res, next) => {
	// Approve a task
	const taskId = req.body.taskId;
	const taskUserId = req.body.taskUserId;
	if (!ObjectId.isValid(taskId) || !ObjectId.isValid(taskUserId)) {
		return res.status(409).json({
			message: "Invalid id for task or task userId"
		});
	}
	const reviewerId = ObjectId(req.user._id);
	const ifReviewer = await Reviewer.findOne({user: taskUserId, reviewers: {$in: [reviewerId]}});
	if (!ifReviewer) {
		return res.status(403).json({
			"message": "Not authorized to perform this request"
		})
	}
	const findQuery = {_id: taskId, approved: {$ne: true}};
	const updateQuery = { $addToSet: {approvedby: [ObjectId(reviewerId)]}, $set: {approved: true} };
	try {
		const approvedTask = await Task.updateOne(findQuery, updateQuery);
		res.status(200).json({
			message: "Task approved"
		});
	} catch(e) {
		res.status(500).json({
			error: e
		});
	}
});

module.exports = router;