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
	}
};