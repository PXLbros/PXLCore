/**
 * pxlCore/Form
 * @param {string} $pxl - pxlCore object reference.
 * @constructor
 */
function pxlCore_Form($pxl)
{
	this.init($pxl);
}

pxlCore_Form.prototype =
{
	$pxl: null,

	file_upload: null,

	init: function($pxl)
	{
		var self = this;

		if ( $pxl.options.debug === true )
		{
			$pxl.log('~ pxlCore/Form ~', '#CCC', 'black');
		}

		self.$pxl = $pxl;

		self.file_upload = new pxlCore_Form_FileUpload(self.$pxl);
	}
};