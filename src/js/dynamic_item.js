/**
 * pxlCore/DynamicItem
 * @param {string} $pxl - pxlCore object reference.
 * @constructor
 */
function pxlCore_DynamicItem($pxl)
{
	this.init($pxl);
}

pxlCore_DynamicItem.prototype =
{
	$pxl: null,

	table:
	{
		container_selector: '#dynamic-table-container',
		search_input_selector: '#dynamic-table-search',

		$container: null,
		$paging_containers: null,

		$search_input: null,
		search_query: '',
		searching: false,

		loading_html: null,

		current_page: 1,
		num_pages: null
	},

	init: function($pxl)
	{
		var self = this;

		if ( $pxl.options.debug === true )
		{
			$pxl.log('~ pxlCore/DynamicItem ~', '#CCC', 'black');
		}

		self.$pxl = $pxl;
	},

	initTable: function()
	{
		if ( typeof dynamic_item.table === 'object' )
		{
			this.table.$container = $(this.table.container_selector);

			if ( this.table.$container.length === 0 )
			{
				$pxl.log('Could not find dynamic table element "' + this.table.container_selector + '".');

				return;
			}

			/*if ( typeof dynamic_item.table.urls === 'undefined' )
			{
				this.show_error();

				$pxl.log('Required attribute "urls" is not defined.');

				return;
			}*/

			this.table.loading_html = this.table.$container.html();

			this.refreshTable(true);
		}
	},

	refreshTable: function(init)
	{
		var inst = this;

		if ( init === false )
		{
			this.showTableLoader();
		}

		var ajax_data = {};

		if ( dynamic_item.config.table.paging.enabled === true )
		{
			ajax_data.page = inst.current_page;
		}

		if ( dynamic_item.config.table.search.enabled === true )
		{
			ajax_data.search_query = inst.search_query;
		}

		/*$core.ajax.get
		(
			dynamic_table.urls.get,
			ajax_data,
			{
				success: function(result)
				{
					$(result.data.html).imagesLoaded().always(function()
					{
						inst.$container.html(result.data.html);

						if ( dynamic_table.paging.enabled === true )
						{
							inst.current_page = result.data.paging.current_page;
							inst.num_pages = result.data.paging.num_pages;
						}

						inst.binds();
					});
				},
				error: function()
				{
					inst.show_error();
				}
			}
		);*/

		alert('we');
	},

	showTableLoader: function()
	{
		this.table.$container.html(this.table.loading_html);
	},

	showTableError: function()
	{
		this.table.$container.html('Could not load ' + dynamic_item.config.identifier.plural + '.');
	},
};