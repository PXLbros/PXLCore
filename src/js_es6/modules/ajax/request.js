class pxlCore_Ajax_Request extends pxlCore_Module
{
	constructor(pxlCore, data)
	{
		super('Ajax Request', pxlCore);

		this.data = data;
	}

	execute()
	{
		let self = this;

		if ( self.pxlCore.isUndefined(self.data.url) )
		{
			self.pxlCore.error('pxlCore/Ajax/Request: Missing AJAX URL.');

			return;
		}

		var aborted = false;

		if ( !self.pxlCore.isUndefined(self.pxlCore.ajax.requests[self.data.url]) && (self.pxlCore.isUndefined(self.data.extra.allowMultiple) || self.data.extra.allowMultiple === false) )
		{
			self.pxlCore.ajax.requests[self.data.url].abort();

			aborted = true;
		}

		var headers = {};

		/*if ( self.pxlCore.framework !== null )
		{
			headers['X-XSRF-TOKEN'] = self.pxlCore.framework.csrf_token;
		}*/

		var file_upload = (self.pxlCore.isDefined(self.data.file_upload) && self.pxlCore.data.file_upload === true);

		if ( file_upload === true && $pxl.isObject(self.data.file_upload_data) )
		{
			headers = self.pxlCore.extend(headers, self.data.file_upload_data);
		}

		var xml_http = this.createXMLHTTPObject();

        if ( !xml_http )
        {
            if ( self.pxlCore.options.debug === true )
            {
                self.pxlCore.error('pxlCore/Ajax/Request: Could not create XML HTTP object.');
            }

			return;
        }

        xml_http.open(self.data.type, self.data.url, true);

        if ( xml_http.readyState === 4 )
        {
            alert('Aborted');

			return;
        }

		if ( self.pxlCore.getObjectSize(self.data.data) > 0 )
		{
			xml_http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		}

		xml_http.onreadystatechange = function()
		{
            if ( xml_http.readyState !== 4 )
            {
                alert('Aborted 2');

                return;
            }

            if ( xml_http.status !== 200 && xml_http.status !== 304 )
            {
				alert('Error: ' + xml_http.status);

                return;
            }
        };

        //callback(xml_http);

		xml_http.send(self.data.data);

		let debug_str = 'URL: ' + self.data.url + '\nType: ' + self.data.type + '\nData: ' + JSON.stringify(self.data.data) + '\nAborted: ' + (aborted === true ? 'Yes' : 'No');

		self.pxlCore.log(debug_str);
	}

	createXMLHTTPObject()
	{
        let xml_http_factories =
        [
		    function() { return new XMLHttpRequest(); },
		    function() { return new ActiveXObject('Msxml2.XMLHTTP'); },
		    function() { return new ActiveXObject('Msxml3.XMLHTTP'); },
		    function() { return new ActiveXObject('Microsoft.XMLHTTP'); }
		];

		let xml_http = false;

        for ( var i = 0, num_xml_http_factories = xml_http_factories.length; i < num_xml_http_factories; i++ )
        {
	        try
	        {
	            xml_http = xml_http_factories[i]();
	        }
	        catch (e)
	        {
	            continue;
	        }

	        break;
        }

        return xml_http;
    }
}