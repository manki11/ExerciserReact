define(["sugar-web/graphics/palette"], function (palette) {
	"use strict";

	var evaluationpalette = {};

	evaluationpalette.EvaluationPalette = function (invoker, primaryText) {
		palette.Palette.call(this, invoker, primaryText);
		this.getPalette().id = "evaluate-mode";
		var real_mode = document.createElement("button");
		real_mode.id = "real_mode";
		real_mode.classList.add("toolbutton");

		var asynchronous_mode = document.createElement("button");
		asynchronous_mode.id = "asynchronous_mode";
		asynchronous_mode.classList.add("toolbutton");

		this.setContent([asynchronous_mode, real_mode]);
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
