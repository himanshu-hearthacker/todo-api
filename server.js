var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [{
	id : 1,
	discription : "want to have a meeting with ",
	completed : false


},
{
	id : 2,
	discription : "want to go for grocery item",
	completed : false
},
	{id : 3,
	discription : "meeting with mummy",
	completed : true
}
] ;

app.get('/', function (req, res) {

res.send('to do api');
});

app.get('/todos', function(req, res){
res.json(todos); //this converted todos into json 

})
app.get('/todos/:id', function(req, res){
var todoId = parseInt(req.params.id,10);
console.log(typeof todoId);
var matchedTodo;
todos.forEach(function (todo){
	if (todoId === todo.id) {
		matchedTodo = todo;
	}
});
if (matchedTodo) {
	res.json(matchedTodo);
}
else {
	res.status(404).send(); 
}


});

app.listen(PORT, function(){

console.log('Server is running on port no. ' + PORT);

})