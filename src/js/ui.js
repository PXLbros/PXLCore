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
		if ( element === null )
		{
			return;
		}

		if ( !this.$pxl.isFunction(callback) )
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
		if ( element === null )
		{
			return;
		}

		if ( !this.$pxl.isFunction(callback) )
		{
			return;
		}

		element.addEventListener('webkitTransitionEnd', callback, false);
		element.addEventListener('otransitionend', callback, false);
		element.addEventListener('oTransitionEnd', callback, false);
		element.addEventListener('msTransitionEnd', callback, false);
		element.addEventListener('transitionend', callback, false);
	},

	setCaretAtEnd: function(element)
	{
		var value_length = element.value.length;

		if ( document.selection )
		{
			element.focus();

			var range = document.selection.createRange();
			range.moveStart('character', -value_length);
			range.moveStart('character', value_length);
			range.moveEnd('character', 0);
			range.select();
		}
		else if ( element.selectionStart || element.selectionStart === 0 )
		{
			element.selectionStart = value_length;
			element.selectionEnd = value_length;
			element.focus();
		}
	}
};