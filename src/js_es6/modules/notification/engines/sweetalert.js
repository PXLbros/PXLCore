class pxlCore_Notification_Engine_SweetAlert extends pxlCore_Notification_Engine
{
	constructor(pxlCore)
	{
		super('SweetAlert', pxlCore);

		this.loaded = (typeof sweetAlert === 'function');
	}

	show(options)
	{
		if ( this.pxlCore.isUndefined(options.title) )
		{
			this.pxlCore.error('Missing required property "title".');

			return false;
		}

		var settings =
		{
			title: options.title,
			text: options.message
		};

		switch ( options.type )
		{
			case this.pxlCore.notification.TYPE_SUCCESS:
				settings.type = 'success';

				break;
			case this.pxlCore.notification.TYPE_INFO:
				settings.type = 'info';

				break;
			case this.pxlCore.notification.TYPE_WARNING:
				settings.type = 'warning';

				break;
			case this.pxlCore.notification.TYPE_ERROR:
				settings.type = 'error';

				break;
			default:
				if ( this.pxlCore.options.debug === true )
				{
					this.pxlCore.error('pxlCore/Notification/Engine/SweetAlert: Doesn\'t support type "' + this.pxlCore.notification.convertTypeToTitle(options.type) + '".');

					return false;
				}
		}

		swal(settings);

		return true;
	}
}