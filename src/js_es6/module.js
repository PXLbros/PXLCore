class pxlCore_Module
{
	constructor(name, pxlCore, show_console_title = true)
	{
		this.name = name;
		this.pxlCore = pxlCore;

		if ( this.pxlCore.options.debug === true && show_console_title === true )
		{
			this.pxlCore.log('~ pxlCore / ' + this.name + ' ~', this.pxlCore.options.console.module_title_background_color, this.pxlCore.options.console.module_title_foreground_color);
		}
	}
}