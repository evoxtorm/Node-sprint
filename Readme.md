# API DOCUMENTATION

## Starting the server
	* `npm install`
	* `npm start` (to start the server)

## Admin Routes ('/admin')
	* `/admin/adminRegister` : This is a `get` method where you can create an admin with email **admin@admin.com** and 	password is **password**.
	*  `/admin/login`:
		Method: Post
		Request Body: {
			"email": "Your email",
			"password": "Your password"
		}
		Response: Return **JWT** Token so that it can be used again in every request inside headers in `auth-token`
	* `/admin/register` :
		Method: Post
		Request header: {
			'auth-token': "JWT Token"
		}
		Request Body: {
			"email": "Your email",
			"password": "Your password",
			"name": "User name"
		}
		Response: Successful creation message or Error if it is Only Admin can perform this task.
	*  `/admin/allUsers` : 
		Method: Get
		Request header: {
			'auth-token': "JWT Token"
		}
		Response: Return data for all users. Admin can do this request only.

## Task Routes ('/task')
	* `/task` :
		Method : Post
		Description: Give all task associated to the user or and reviewer want to see the task for a particular user
		Request header: {
			'auth-token': "JWT Token"
		}
		Request Body: {
			"assigned": Boolean (For Reviewer),
			"userId": ObjectId (Optional)
		}
		Response: Tasks data
	* `/task/:taskid` : 
		Method: Get
		Desciption: Single task request
		Request header: {
			'auth-token': "JWT Token"
		}
		Request-Params: taskId for a particular task
	* `/task/create` :
		Method: Post
		Desciption: Create a Task
		Request header: {
			'auth-token': "JWT Token"
		}
		Request Body: {
			title: "Task Title",
			description: "Task Description"
		}
		Response: Succesfully created message or Error
	* `/task/edit/:taskid` :
		Method: Patch
		Description: Edit any specific task entity like title and description
		Request header: {
			'auth-token': "JWT Token"
		}
		Request Body: {
			title: "Edit Task Title",
			description: "Edit Task Description "
		}
		Response: Succesfully created or Any error

## Review Routes ('/review')
	*`/review/assign`:
		Method: Post
		Description: Assign a reviewer to a user. Only Admin can do this
		Request header: {
			'auth-token': "JWT Token"
		}
		Request Body: {
			userId: ObjectId,
			reviewerId: [ObjectIds]
		}
		Response: Successful or Any Error
	*`/review/remove`:
		Method: Post
		Description: Remove a reviewer to a user. Only Admin can do this
		Request header: {
			'auth-token': "JWT Token"
		}
		Request Body: {
			userId: ObjectId,
			reviewerId: [ObjectIds]
		}
		Response: Successful or Any Error
	*`/review/users`:
		Method: Get
		Description: See all the users where you are reviewer.
		Request header: {
			'auth-token': "JWT Token"
		}
		Response: Get all the users
	*`/review/approve`:
		Method: Post
		Description: Approve a task of a user. Only Reviewer can do this
		Request header: {
			'auth-token': "JWT Token"
		}
		Request Body: {
			taskId: ObjectId,
			taskUserId: ObjectId
		}
		Response: Successful or Any Error