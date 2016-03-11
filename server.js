var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function (req, res) {

res.send('to do api');
});

//GET /todos

app.get('/todos', function(req, res){
res.json(todos); //this converted todos into json 

})
app.get('/todos/:id', function(req, res){
var todoId = parseInt(req.params.id,10);
//console.log(typeof todoId);
var matchedTodo = _.findWhere(todos, {id: todoId});
//todos.forEach(function (todo){
	//if (todoId === todo.id) {
//		matchedTodo = todo;
//	}
//});
if (matchedTodo) {
	res.json(matchedTodo);
}
else {
	res.status(404).send(); 
}


});

// POST /todos
app.post('/todos', function (req, res){
 var body = req.body;

 // use pick method  to only pick description and completed

 var picked = _.pick(body,'completed','description');

 if ((!_.isBoolean(picked.completed)) || (!_.isString(picked.description)) || (picked.description.trim().length === 0))
  {

 	return res.status(400).send();
 }

picked.description = picked.description.trim();



 picked.id = todoNextId++;
 todos.push(picked);

 console.log (todos);
 res.json(picked);

}) ;


app.delete('/todos/:id', function (req, res){

var todoId = parseInt(req.params.id,10);
var matchedTodo = _.findWhere(todos, {id: todoId});
  
  

  if (!matchedTodo) {

  	res.status(404).json({" error" : "no todo found with id mentioned"});
  }

  else{
  	todos =_.without(todos,matchedTodo);
  	res.json(matchedTodo);
  };



});

app.listen(PORT, function(){

console.log('Server is running on port no. ' + PORT);

})