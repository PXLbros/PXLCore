/**
 * pxlCore/Ajax
 * @param {string} $pxl - The pxlCore object reference.
 * @constructor
 */
function pxlCore_Ajax($pxl)
{
	this.init($pxl);
}

pxlCore_Ajax.prototype =
{
	init: function($pxl)
	{
		if ( $pxl.options.debug === true )
		{
			$pxl.log('~ pxlCore/Ajax ~', '#CCC', 'black');
		}
	}
};