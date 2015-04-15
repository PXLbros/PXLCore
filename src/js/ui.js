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
	}
};