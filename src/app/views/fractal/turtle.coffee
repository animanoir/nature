Calc = require "app/lib/draw/math/calc"

module.exports = class Turtle

	todos: []

	len: 0
	theta: 0
	y:0

	constructor:(todo, @len, @theta)->

		@set_todo todo, @len
		@theta = Calc.deg2rad theta

	draw:(ctx)->

		ctx.beginPath()
		ctx.moveTo 0, 0

		$.map @todos, (todo, i)=>

			for c, i in todo.s

				if c is "F" or c is "G"
					ctx.lineTo 0, 0, todo.l, 0
					ctx.translate todo.l, 0
				else if c is "+"
					ctx.rotate @theta
				else if c is "-"
					ctx.rotate -@theta
				else if c is "["
					ctx.save()
				else if c is "]"
					ctx.restore()

		ctx.strokeStyle = "#ffffff";
		ctx.lineWidth = 1;
		ctx.stroke()
		ctx.closePath()

	set_todo:(todo, length)->
		@len = length
		@todos.push s:todo, l:@len

