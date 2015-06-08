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

		self.initTable();
	},

	initTable: function()
	{
		var self = this;

		self.table.$container = $(self.table.container_selector);

		if ( self.table.$container.length === 0 )
		{
			self.$pxl.log('Could not find dynamic table element "' + self.table.container_selector + '".');

			return;
		}

		/*if ( typeof dynamic_item.table.urls === 'undefined' )
		{
			self.show_error();

			self.$pxl.log('Required attribute "urls" is not defined.');

			return;
		}*/

		self.table.loading_html = self.table.$container.html();

		self.refreshTable(true);
	},

	refreshTable: function(init)
	{
		var inst = this;

		if ( init === false )
		{
			inst.showTableLoader();
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

		inst.$pxl.ajax.get
		(
			dynamic_item.config.table.routes.get,
			ajax_data,
			{
				success: function(result)
				{
					inst.table.$container.html(result.data.html);

					if ( dynamic_item.config.table.paging.enabled === true )
					{
						inst.current_page = result.data.paging.current_page;
						inst.num_pages = result.data.paging.num_pages;
					}

					inst.binds();
				},
				error: function()
				{
					inst.showTableError();
				}
			}
		);
	},

	showTableLoader: function()
	{
		this.table.$container.html(this.table.loading_html);
	},

	showTableError: function()
	{
		this.table.$container.html('Could not load ' + dynamic_item.config.identifier.plural + '.');
	},

	binds: function(id)
	{
		var self = this,
			$container = (self.$pxl.isDefined(id) ? $('#dynamic-table-item-' + id) : self.table.$container);

		if ( dynamic_item.config.table.paging.enabled === true )
		{
			self.$paging_containers = self.table.$container.find('.pagination');

			self.$paging_containers.find('.prev:not(.disabled)').on('click', function()
			{
				self.current_page--;

				self.refreshTable(false);
			});

			self.$paging_containers.find('.next:not(.disabled)').on('click', function()
			{
				self.current_page++;

				self.refreshTable(false);
			});
		}

		if ( dynamic_item.config.table.search.enabled === true )
		{
			self.$search_input = $(self.table.search_input_selector);

			if ( self.searching === true )
			{
				self.$pxl.ui.setCaretAtEnd(document.querySelector(self.search_input_selector));

				self.searching = false;
			}

			if ( self.$search_input.length === 0 )
			{
				self.$pxl.log('Could not find dynamic table search input ' + self.table.search_input_selector + '.');
			}
			else
			{
				self.$search_input.on('keyup', function(e)
				{
					if ( (e.keyCode || e.which) === 13 )
					{
						self.search_query = self.$search_input.val();
						self.searching = true;

						self.refreshTable(false);
					}
				});
			}
		}
	}
};