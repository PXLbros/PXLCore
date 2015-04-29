/**
 * pxlCore/Form/FileUpload
 * @param {string} $pxl - pxlCore object reference.
 * @constructor
 */
function pxlCore_Form_FileUpload($pxl)
{
	this._init($pxl);
}

pxlCore_Form_FileUpload.prototype =
{
	$pxl: null,

	files: [],
	num_files: 0,
	current_file_index: 0,

	allowed_mime_types: null,
	max_file_size: null,
	events: null,

	_init: function($pxl)
	{
		var self = this;

		self.$pxl = $pxl;
	},

	init: function(files, save_url, allowed_mime_types, additional_data, events)
	{
		var self = this;

		self.allowed_mime_types = allowed_mime_types;
		self.events = events;

		for ( var file_index = 0, num_files = files.length; file_index < num_files; file_index++ )
		{
			var file = files[file_index];

			var file_obj =
			{
				file: file,
				mime_error: (self.checkFileType(file) === false),
				size_error: (self.checkFileSize(file) === false)
			};

			self.files.push(file_obj);
		}

		return self;
	},

	checkFileType: function(file)
	{
		var self = this;

		if ( self.allowed_mime_types === null )
		{
			return true;
		}

		if ( !$pxl.inArray(file.type, self.allowed_mime_types) )
		{
			//self.throwError('Selected file type (' + file.type + ') is not valid (Allowed file types are: ' + $pxl.implode(', ', self.allowed_mime_types, ' and ') + ').');

			return false;
		}

		return true;
	},

	checkFileSize: function(file)
	{
		var self = this;

		if ( self.max_file_size === null )
		{
			return true;
		}

		return true;
	},

	start: function()
	{
		if ( $pxl.options.debug === true )
		{
		}
	},

	throwError: function(error)
	{
		var self = this;

		if ( typeof self.events.onError === 'function' )
		{
			self.events.onError(error);
		}
	}
};