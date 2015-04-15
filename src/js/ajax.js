function pxlCore_AJAX($pxl)
{
	this.init($pxl);
}

pxlCore_AJAX.prototype =
{
	init: function($pxl)
	{
		if ( $pxl.options.debug === true )
		{
			$pxl.log('~ pxlCore/AJAX ~', '#CCC', 'black');
		}
	}
};