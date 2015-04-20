/**
 * pxlCore/Dialog
 * @param {string} $pxl - The pxlCore object reference.
 * @constructor
 */
function pxlCore_Dialog($pxl)
{
	this.init($pxl);
}

pxlCore_Dialog.prototype =
{
	init: function($pxl)
	{
		if ( $pxl.options.debug === true )
		{
			$pxl.log('~ pxlCore/Dialog ~', '#CCC', 'black');
		}
	},

	init_from_element: function(selector, options)
	{
		console.log('init from element');
	}
};