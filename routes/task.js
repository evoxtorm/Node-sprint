const router = require('express').Router();
const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;

const User = require('../model/User');
const Task = require('../model/Task');
const { verify, isAdmin } = require('./verifyTokens');
const { taskValidation, taskeditValidation } = require('../validations'); 


router.post('/', verify, async (req, res, next) => {
	// Get all tasks for the user or reviewer who want to see the tasks he is reviewing
	let userId = req.user._id;
	const assigned = req.body.assigned;
	if (assigned) {
		userId = req.body.userId;
	}
	const allTasks = await Task.find({user: userId}).select('title description approved');
	res.status(200).json({
		tasks: allTasks
	});
});

router.get('/:taskid', verify, async (req, res, next) => {
	// Get single task
	const taskId = req.params.taskid;
	if (!ObjectId.isValid(taskId)) {
		return res.status(409).json({
			message: "Invalid id for the task"
		});
	}
	const task = await Task.findById(taskId);
	if (!task) {
		return res.status(404).json({
			"message": "Can't able to find the task"
		});
	}
	res.status(200).json({
		"task": task
	});
});


router.post('/create', verify, async (req, res, next) => {
	// Create a new task
	const { error } = taskValidation(req.body);
	if (error) {
		return res.status(400).json({
			message: error.details[0].message
		});
	}
	const task = new Task({
		title: req.body.title,
		description: req.body.description,
		user: req.user._id
	});
	try {
		const newtask = await task.save();
		res.status(201).json({
			message: "Task sucessfully created"
		});
	} catch(e) {
		res.status(500).json({
			error: e
		});
	}
});

router.patch('/edit/:taskid', verify, async (req, res, next) => {
	// Edit a task
	const { error } = taskeditValidation(req.body);
	if (error) {
		return res.status(400).json({
			message: error.details[0].message
		});
	}
	const taskId = req.params.taskid;
	const updateTask = {};
	for (const ops in req.body) {
		updateTask[ops] = req.body[ops];
	}
	try {
		const updatedTask = await Task.updateOne({_id: taskId}, {$set: updateTask});
		res.status(200).json({
			message: "Task edited sucessfully.",
			result: updatedTask
		});
	} catch(e) {
		res.status(500).json({
			error: e
		});
	}

});

module.exports = router;
