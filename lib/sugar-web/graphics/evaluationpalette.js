define([
	"sugar-web/graphics/palette",
	"text!sugar-web/graphics/evaluationpalette.html",
], function (palette, template) {
	"use strict";

	var evaluationpalette = {};

	evaluationpalette.EvaluationPalette = function (invoker, primaryText) {
		palette.Palette.call(this, invoker, primaryText);
		this.getPalette().id = "evaluate-mode";
		// var real_mode = document.createElement("button");
		// real_mode.id = "real_mode";
		// real_mode.classList.add("toolbutton");
		// real_mode.addEventListener("click", () => {
		// 	this.getPalette().querySelector(".header").innerHTML = "Realtime";
		// });

		// var asynchronous_mode = document.createElement("button");
		// asynchronous_mode.id = "asynchronous_mode";
		// asynchronous_mode.classList.add("toolbutton");
		// asynchronous_mode.addEventListener("click", () => {
		// 	this.getPalette().querySelector(".header").innerHTML = "Asynchronous";
		// });

		// this.setContent([asynchronous_mode, real_mode]);
		var containerElem = document.createElement("div");
		containerElem.innerHTML = template;
		this.setContent([containerElem]);
	};

	var addEventListener = function (type, listener, useCapture) {
		return this.getPalette().addEventListener(type, listener, useCapture);
	};

	evaluationpalette.EvaluationPalette.prototype = Object.create(
		palette.Palette.prototype,
		{
			addEventListener: {
				value: addEventListener,
				enumerable: true,
				configurable: true,
				writable: true,
			},
		}
	);

	return evaluationpalette;
});
