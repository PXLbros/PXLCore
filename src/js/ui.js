/**
 * pxlCore/UI
 * @param {string} $pxl - pxlCore object reference.
 * @constructor
 */
function pxlCore_UI($pxl)
{
	this.init($pxl);
}

pxlCore_UI.prototype =
{
	init: function($pxl)
	{
		if ( $pxl.options.debug === true )
		{
			$pxl.log('~ pxlCore/UI ~', '#CCC', 'black');
		}
	},

	onAnimationComplete: function(element, callback)
	{
		var self = this;

		if ( element === null )
		{
			return;
		}

		if ( !self.$pxl.isFunction(callback) )
		{
			return;
		}

		element.addEventListener('webkitAnimationEnd', callback, false);
		element.addEventListener('oAnimationEnd', callback, false);
		element.addEventListener('msAnimationEnd', callback, false);
		element.addEventListener('animationend', callback, false);
	},

	onTransitionComplete: function(element, callback)
	{
		var self = this;

		if ( element === null )
		{
			return;
		}

		if ( !self.$pxl.isFunction(callback) )
		{
			return;
		}

		element.addEventListener('webkitTransitionEnd', callback, false);
		element.addEventListener('otransitionend', callback, false);
		element.addEventListener('oTransitionEnd', callback, false);
		element.addEventListener('msTransitionEnd', callback, false);
		element.addEventListener('transitionend', callback, false);
	}
};