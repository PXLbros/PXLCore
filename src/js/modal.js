/**
 * pxlCore/Modal
 * @param {string} $pxl - pxlCore object reference.
 * @constructor
 */
function pxlCore_Modal($pxl)
{
	this.init($pxl);
}

pxlCore_Modal.prototype =
{
	default_options:
	{
		width: 320,
		height: 240,
		modal: true,
		autoOpen: false
	},

	init: function($pxl)
	{
		if ( $pxl.options.debug === true )
		{
			$pxl.log('~ pxlCore/Modal ~', '#CCC', 'black');
		}
	},

	initFromElement: function(selector, options)
	{
		console.log('init from element');
	},

	initFromHTML: function(html, options)
	{
	}
};