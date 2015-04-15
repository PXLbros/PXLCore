function pxlCore_Notification($pxl)
{
	this.init($pxl);
}

pxlCore_Notification.prototype =
{
	init: function($pxl)
	{
		if ( $pxl.options.debug === true )
		{
			$pxl.log('~ pxlCore/Notification ~', '#CCC', 'black');
		}
	}
};