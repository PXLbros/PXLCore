/**
 * pxlCore/UI
 * @param {string} $pxl - pxlCore object reference.
 * @constructor
 */
function pxlCore_URI($pxl)
{
	this.init($pxl);
}

pxlCore_URI.prototype =
{
	init: function($pxl)
	{
		if ( $pxl.options.debug === true )
		{
			$pxl.log('~ pxlCore/URI ~', '#CCC', 'black');
		}
	},

	urlize: function(url)
	{
		if ( $pxl.isUndefined($pxl.framework.base_url) )
		{
			$pxl.log('Base URL not set.');

			return;
		}

		return $pxl.framework.base_url + url;
	}
};