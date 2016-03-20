var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function(req, res) {

	res.send('to do api');
});

//GET /todos
// GET /todos?completed=false&q=work
app.get('/todos', function(req, res) {
	var queryParams = req.query;
	var filteredTodos = todos;

	if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
		filteredTodos = _.where(filteredTodos, {
			completed: true
		});
	} else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
		filteredTodos = _.where(filteredTodos, {
			completed: false
		});
	}

	if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
		filteredTodos = _.filter(filteredTodos, function(todo) {
			return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
		});
	}

	res.json(filteredTodos);
});

app.get('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	//console.log(typeof todoId);
	var matchedTodo = _.findWhere(todos, {
		id: todoId
	});
	//todos.forEach(function (todo){
	//if (todoId === todo.id) {
	//		matchedTodo = todo;
	//	}
	//});
	if (matchedTodo) {
		res.json(matchedTodo);
	} else {
		res.status(404).send();
	}


});

// POST /todos
app.post('/todos', function(req, res) {
	var body = req.body;

	// use pick method  to only pick description and completed

	var picked = _.pick(body, 'completed', 'description');
	db.todo.create(body).then(function(todo){
		res.json(todo.toJSON());

	},function(e){
		res.status(400).json(e);

	});

	//if ((!_.isBoolean(picked.completed)) || (!_.isString(picked.description)) || (picked.description.trim().length === 0)) {

	//	return res.status(400).send();
	//	}

	//	picked.description = picked.description.trim();



	//	picked.id = todoNextId++;
	//	todos.push(picked);

	//	console.log(todos);
	//	res.json(picked);

});


app.delete('/todos/:id', function(req, res) {

	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {
		id: todoId
	});



	if (!matchedTodo) {

		res.status(404).json({
			" error": "no todo found with id mentioned"
		});
	} else {
		todos = _.without(todos, matchedTodo);
		res.json(matchedTodo);
	};



});

app.put('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {
		id: todoId
	});

	var body = _.pick(req.body, 'completed', 'description');
	var validAttribute = {};

	if (!matchedTodo) {

		res.status(404).send();
	}

	if ((body.hasOwnProperty('completed')) && (_.isBoolean(body.completed))) {

		validAttribute.completed = body.completed
	} else if (body.hasOwnProperty(completed)) {
		res.status(400).send();

	}

	if ((body.hasOwnProperty('description')) && (_.isString(body.description)) && (body.description.trim().length > 0)) {

		validAttribute.description = body.description
	} else if (body.hasOwnProperty(description)) {
		res.status(400).send();

	}
	_.extend(matchedTodo, validAttribute);

	res.json(matchedTodo);


});

db.sequelize.sync({force : true}).then(function() {

			app.listen(PORT, function() {

				console.log('Server is running on port no. ' + PORT);

			});
		});