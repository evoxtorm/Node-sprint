const jwt = require('jsonwebtoken');

const User = require('../model/User');

module.exports = {
	verify: (req, res, next) => {
		const token = req.header('auth-token');
		if (!token) {
			return res.status(401).json({
				message: "Access Denied"
			});
		}
		try {
			const verified = jwt.verify(token, process.env.TOKEN_SECRET);
			req.user = verified;
			next();
		} catch(e) {
			res.status(401).json({
				message: "Invalid Token"
			});
		}
	},
	isAdmin: async (req, res, next) => {
		const adminId = req.user._id
		const user = await User.findOne({_id: adminId, isAdmin: true});
		if (!user) {
			return res.status(403).json({
				message: "You are not allowed to perform this action. Only admin can do that."
			});
		}
		req.isAdmin = true;
		next();
	}
}