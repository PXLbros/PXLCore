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

	item:
	{
		form_selector: '#dynamic-item-form',
		$form: null,

		loader_selector: '#dynamic-item-form-loader',
		$loader: null,
		$loader_text: null,

		tabs_selector: '#dynamic-item-tabs',
		$tabs: null,

		save_button_selector: '#dynamic-item-save-button',
		$save_button: null,

		types_with_custom_saving: ['image'],
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
		self.initItem();
	},

	initTable: function()
	{
		var self = this;

		if ( typeof dynamic_item === 'undefined' || dynamic_item.current_page !== 'table' )
		{
			return;
		}

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
				self.$pxl.ui.setCaretAtEnd(document.querySelector(self.table.search_input_selector));

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
	},

	initItem: function()
	{
		var inst = this;

		if ( typeof dynamic_item === 'undefined' )
		{
			return;
		}

		if ( typeof dynamic_item === 'undefined' || dynamic_item.current_page !== 'item' )
		{
			return;
		}

		inst.item.$form = $(inst.item.form_selector);

		if ( inst.item.$form.length === 0 )
		{
			inst.$pxl.log('Could not find dynamic item form "' + inst.item.form_selector + '".');

			return;
		}

		inst.item.$form.on('submit', function()
		{
			return false;
		});

		inst.item.$loader = $(inst.item.loader_selector);
		inst.item.$loader_text = inst.item.$loader.children('.text');

		inst.item.$save_button = $(inst.item.save_button_selector);
		inst.item.$save_button.attr('data-default_text', inst.item.$save_button.text());

		var validation_rules = {};

		for ( var column_id in dynamic_item.columns )
		{
			if ( dynamic_item.columns.hasOwnProperty(column_id) )
			{
				dynamic_item.columns[column_id].id = column_id;

				var column = dynamic_item.columns[column_id],
					rules = [];

				if ( typeof column.form.validation === 'object' )
				{
					if ( typeof column.form.validation.required === 'number' && (column.form.validation.required === dynamic_item.DYNAMIC_ITEM_ALWAYS_REQUIRED || item_id_to_edit === null && column.form.validation.required === dynamic_item.DYNAMIC_ITEM_REQUIRED_ON_ADD) )
					{
						var error_message = '';

						if ( column.form.type === 'select' )
						{
							error_message = 'Choose a ' + column.title.toLowerCase();
						}
						else
						{
							error_message = column.title + ' is required';
						}

						rules.push({ type: 'empty', prompt: error_message });
					}

					if ( typeof column.form.maxlength === 'number' )
					{
						rules.push({ type: 'maxLength[' + column.validation.maxlength + ']', prompt: 'Name can\'t be longer than ' + column.validation.maxlength + ' character' + (column.validation.maxlength !== 1 ? 's' : '') });
					}
				}

				if ( typeof column.form.verify === 'boolean' && column.form.verify === true )
				{
					var verify_identifier = 'verify-' + column_id;

					validation_rules[verify_identifier] =
					{
						identifier: verify_identifier,
						optional: (item_id_to_edit !== null),
						rules:
						[
							{
								type: 'empty',
								prompt: 'Verify ' + column.title + ' is required'
							},
							{
								type: 'match[' + column_id + ']',
								prompt: 'Verify ' + column.title + ' doesn\'t match with ' + column.title
							}
						]
					};
				}

				validation_rules[column_id] =
				{
					identifier: column_id,
					rules: rules
				};
			}
		}

		inst.item.$form.form
		(
			validation_rules,
			{
				inline: true,
				onSuccess: function()
				{
					inst.item.$save_button.prop('disabled', true);

					inst.item.$loader.addClass('active');

					var post_data = inst.item.$form.find(':input').serialize();

					inst.$pxl.ajax.post
					(
						inst.item.$form.attr('action'),
						post_data,
						{
							success: function(result)
							{
							},
							error: function()
							{
							},
							always:
							{
							}
						}
					);
				}
			}
		);
	}
};