class pxlCore_UI extends pxlCore_Module
{
	constructor(pxlCore)
	{
		super('UI', pxlCore);
	}

	onAnimationComplete(element, callback)
	{
		if ( element === null )
		{
			return;
		}

		if ( !this.pxlCore.isFunction(callback) )
		{
			return;
		}

		element.addEventListener('webkitAnimationEnd', callback, false);
		element.addEventListener('oAnimationEnd', callback, false);
		element.addEventListener('msAnimationEnd', callback, false);
		element.addEventListener('animationend', callback, false);
	}

	onTransitionComplete(element, callback)
	{
		if ( element === null )
		{
			return;
		}

		if ( !this.pxlCore.isFunction(callback) )
		{
			return;
		}

		element.addEventListener('webkitTransitionEnd', callback, false);
		element.addEventListener('otransitionend', callback, false);
		element.addEventListener('oTransitionEnd', callback, false);
		element.addEventListener('msTransitionEnd', callback, false);
		element.addEventListener('transitionend', callback, false);
	}
}