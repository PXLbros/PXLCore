function pxlCore_Notification()
{
}

pxlCore_Notification.prototype =
{
	init: function()
	{
		if ( $pxl.options.debug === true )
		{
			$pxl.log('~ pxlCore: Notification ~', 'black', 'white');
		}
	}
};