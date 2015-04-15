function pxlCore_AJAX()
{
}

pxlCore_AJAX.prototype =
{
	init: function()
	{
		if ( $pxl.options.debug === true )
		{
			$pxl.log('~ pxlCore: AJAX ~', 'black', 'white');
		}
	}
};