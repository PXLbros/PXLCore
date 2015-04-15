function pxlCore()
{
	this.init();
}

pxlCore.prototype =
{
	framework: null,

	init: function()
	{
		this.detectPXLFramework();
	},

	detectPXLFramework: function()
	{
		var self = this;

		if ( 1 === 1 )
		{
			self.pxlframework = 1;
		}
	}
};