module.exports = function (sequelize,dataType) {

return  sequelize.define('todo', {

	description: {
		type: dataType.STRING,
		allowNull: false,
		validate: {
			len: [1, 250]
		}
	},
	completed: {
		type: dataType.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}

});

};