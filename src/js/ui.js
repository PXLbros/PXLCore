function pxlCore_UI()
{
}

pxlCore_UI.prototype =
{
	init: function()
	{
		if ( $pxl.options.debug === true )
		{
			$pxl.log('~ pxlCore: UI ~', 'black', 'white');
		}
	}
};