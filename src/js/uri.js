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
		if ( this.$pxl.isUndefined(this.$pxl.framework.base_url) )
		{
			this.$pxl.log('Base URL not set.');

			return;
		}

		return this.$pxl.framework.base_url + url;
	}
};