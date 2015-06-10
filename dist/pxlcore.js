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

		var validation_rules = {},
			custom_saving_columns = [];

		for ( var column_id in dynamic_item.columns )
		{
			if ( dynamic_item.columns.hasOwnProperty(column_id) )
			{
				dynamic_item.columns[column_id].id = column_id;

				var column = dynamic_item.columns[column_id],
					rules = [];

				if ( typeof column.form.validation === 'object' )
				{
					if ( typeof column.form.validation.required === 'number' && (column.form.validation.required === dynamic_item.DYNAMIC_ITEM_ALWAYS_REQUIRED || dynamic_item.item_id_to_edit === null && column.form.validation.required === dynamic_item.DYNAMIC_ITEM_REQUIRED_ON_ADD) )
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
						optional: (dynamic_item.item_id_to_edit !== null),
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

		var num_custom_saving_columns = custom_saving_columns.length,
			have_custom_saving_columns = (num_custom_saving_columns > 0);

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
					post_data += '&have_custom_saving_columns=' + (have_custom_saving_columns === true ? 'yes' : 'no');

					inst.$pxl.ajax.post
					(
						inst.item.$form.attr('action'),
						post_data,
						{
							success: function(result)
							{
								var saved_id = (dynamic_item.item_id_to_edit !== null ? dynamic_item.item_id_to_edit : result.data.added_item_id);
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
/**
 * pxlCore/Notification/Engine/SweetAlert
 * @param {string} $pxl - pxlCore object reference.
 * @constructor
 */
function pxlCore_Notification_Engine_SweetAlert($pxl)
{
	this.loaded = this.init($pxl);
}

pxlCore_Notification_Engine_SweetAlert.prototype =
{
	$pxl: null,

	init: function($pxl)
	{
		var self = this;

		if ( typeof sweetAlert !== 'function' )
		{
			return false;
		}

		self.$pxl = $pxl;

		return true;
	},

	showSuccess: function(options)
	{
		swal(
		{
			title: options.title,
			text: (options.message !== null ? options.message : null),
			type: 'success'
		});
	},

	showInfo: function(options)
	{
		swal(
		{
			title: options.title,
			text: (options.message !== null ? options.message : null),
			type: 'info'
		});
	},

	showWarning: function(options)
	{
		swal(
		{
			title: options.title,
			text: (options.message !== null ? options.message : null),
			type: 'warning'
		});
	},

	showError: function(options)
	{
		swal(
		{
			title: options.title,
			text: (options.message !== null ? options.message : null),
			type: 'error'
		});
	},

	showConfirm: function(options)
	{
		var title = (typeof options.title === 'string' ? options.title : null);

		swal(
		{
			title: title,
			text: (options.question !== null ? options.question : null),
			type: (typeof options.type === 'string' ? options.type : 'info'),
			showCancelButton: true,
			confirmButtonText: (typeof options.buttons === 'object' && typeof options.buttons.yes === 'string' ? options.buttons.yes : 'Yes'),
			cancelButtonText: (typeof options.buttons === 'object' && typeof options.buttons.no === 'string' ? options.buttons.no : 'No')
		}, (typeof options.onConfirm === 'function' ? options.onConfirm : function() {}));
	}
};
/**
 * pxlCore/Notification/Engine/Notiny
 * @param {string} $pxl - pxlCore object reference.
 * @constructor
 */
function pxlCore_Notification_Engine_Notiny($pxl)
{
	this.loaded = this.init($pxl);
}

pxlCore_Notification_Engine_Notiny.prototype =
{
	$pxl: null,

	options:
	{
		position: 'right-top',
		width: 'auto'
	},

	init: function($pxl)
	{
		var self = this;

		if ( typeof $.notiny !== 'function' )
		{
			return false;
		}

		self.$pxl = $pxl;

		return true;
	},

	showSuccess: function(options)
	{
		var self = this;

		var auto_hide = ((typeof options.autoHide === 'undefined') || (typeof options.autoHide === 'boolean' && options.autoHide === true) || (typeof options.autoHide === 'number' && options.autoHide > 0));

		$.notiny(
		{
			text: options.message,
			position: self.options.position,
			width: self.options.width,
			delay: (typeof options.autoHide === 'number' ? options.autoHide : 3000),
			autohide: auto_hide,
			clickhide: (typeof options.hideOnClick === 'boolean' ? options.hideOnClick : true)
		});
	},

	showError: function(options)
	{
		var self = this;

		var auto_hide = ((typeof options.autoHide === 'undefined') || (typeof options.autoHide === 'boolean' && options.autoHide === true) || (typeof options.autoHide === 'number' && options.autoHide > 0));

		$.notiny(
		{
			text: options.message,
			position: self.options.position,
			width: self.options.width,
			delay: (typeof options.autoHide === 'number' ? options.autoHide : 3000),
			autohide: auto_hide,
			clickhide: (typeof options.hideOnClick === 'boolean' ? options.hideOnClick : true)
		});
	}
};
/**
 * pxlCore/Notification
 * @param {string} $pxl - pxlCore object reference.
 * @constructor
 */
function pxlCore_Notification($pxl)
{
	this.$pxl = $pxl;

	this.init();
}

pxlCore_Notification.prototype =
{
	engines: [],
	default_engine_id: null,
	current_engine_id: null,

	/**
     * Initialize pxlCore/Notification.
     * @param {string} $pxl - pxlCore object reference.
     */
	init: function()
	{
		var self = this;

		if ( self.$pxl.options.debug === true )
		{
			self.$pxl.log('~ pxlCore/Notification ~', '#CCC', 'black');
		}

		var engine_index,
			engine_id,
			engine_name,
			engine;

		for ( engine_index = 0, num_engines = self.$pxl.options.notification.engines.length; engine_index < num_engines; engine_index++ )
		{
			engine_id = self.$pxl.options.notification.engines[engine_index];
			engine_name = 'pxlCore_Notification_Engine_' + engine_id;
			engine = new window[engine_name](self.$pxl);

			if ( engine.loaded === false )
			{
				self.$pxl.error('Could not load notification engine "' + engine_id + '".');

				continue;
			}

			self.engines[engine_id] = engine;

			if ( (engine_index === 0) || (engine_index > 0 && self.default_engine_id === null) )
			{
				self.default_engine_id = engine_id;
			}
		}

		var num_loaded_engines = self.$pxl.getObjectSize(self.engines);

		if ( self.default_engine_id !== null )
		{
			self.setEngine(self.default_engine_id);
		}

		if ( self.$pxl.options.debug === true )
		{
			var loaded_engines_debug_str = 'Loaded Engines: ';

			if ( num_loaded_engines > 0 )
			{
				engine_index = 0;

				for ( engine_id in self.engines )
				{
					loaded_engines_debug_str += engine_id + (engine_index < (num_loaded_engines - 1) ? ', ' : '');

					engine_index++;
				}
			}
			else
			{
				loaded_engines_debug_str += 'None';
			}

			self.$pxl.log(loaded_engines_debug_str);

			self.$pxl.log('Default Engine: ' + (self.default_engine_id !== null ? self.default_engine_id : '/'));
		}
	},

	/**
	 * Set engine.
	 * @param {string} engine_id Engine to switch to.
	 * @returns {string}
	 */
	setEngine: function(engine_id)
	{
		this.current_engine_id = engine_id;
	},

	/**
	 * Prepare engine before showing notification.
	 * @param {object} options Options.
	 * @param {type} type Type.
	 * @returns {boolean}
	 */
	prepare: function(options, type)
	{
		var self = this;

		if ( typeof options.engine === 'string' )
		{
			if ( typeof self.engines[options.engine] !== 'object' )
			{
				self.$pxl.error('pxlCore/Notification: Engine "' + options.engine + '" not found.');

				return false;
			}

			self.setEngine(options.engine);
		}

		var current_engine = self.engines[self.current_engine_id];

		if ( typeof current_engine['show' + type] !== 'function' )
		{
			self.$pxl.error('pxlCore/Notification: Engine "' + self.current_engine_id + '" doesn\'t support type "' + type + '".');

			return false;
		}

		if ( type === 'Success' || type === 'Info' || type === 'Warning' || type === 'Error' )
		{
			if ( typeof options.message === 'undefined' )
			{
				self.$pxl.error('pxlCore/Notification: Missing required argument "message".');

				return false;
			}
		}
		else if ( type === 'Confirm' )
		{
			if ( typeof options.question === 'undefined' )
			{
				self.$pxl.error('pxlCore/Notification: Missing required argument "question".');

				return false;
			}
		}

		return true;
	},

	/**
	 * Reset engine after showing notification.
	 */
	reset: function()
	{
		this.setEngine(this.default_engine_id);
	},

	/**
	 * Show success notification.
	 * @param {object} options Options.
	 */
	showSuccess: function(options)
	{
		var self = this;

		if ( self.prepare(options, 'Success') === false )
		{
			return;
		}

		self.engines[self.current_engine_id].showSuccess(options);

		self.reset();
	},

	/**
	 * Show info notification.
	 * @param {object} options Options.
	 */
	showInfo: function(options)
	{
		var self = this;

		if ( self.prepare(options, 'Info') === false )
		{
			return;
		}

		self.engines[self.current_engine_id].showInfo(options);

		self.reset();
	},

	/**
	 * Show warning notification.
	 * @param {object} options Options.
	 */
	showWarning: function(options)
	{
		var self = this;

		if ( self.prepare(options, 'Warning') === false )
		{
			return;
		}

		self.engines[self.current_engine_id].showWarning(options);

		self.reset();
	},

	/**
	 * Show error notification.
	 * @param {object} options Options.
	 */
	showError: function(options)
	{
		var self = this;

		if ( self.prepare(options, 'Error') === false )
		{
			return;
		}

		self.engines[self.current_engine_id].showError(options);

		self.reset();
	},

	/**
	 * Show confirmation notification.
	 * @param {object} options Options.
	 */
	showConfirm: function(options)
	{
		var self = this;

		if ( self.prepare(options, 'Confirm') === false )
		{
			return;
		}

		self.engines[self.current_engine_id].showConfirm(options);

		self.reset();
	},

	/**
	 * Show notification.
	 * @param {object} options Options.
	 */
	show: function(options)
	{
		var self = this;

		if ( typeof options.type === 'undefined' )
		{
			self.$pxl.error('pxlCore/Notification: Missing required argument "type".');

			return false;
		}

		var type;

		if ( options.type === 1 ) // PXLBros\PXLFramework\Helpers\NOTIFICATION_TYPE_SUCCESS
		{
			type = 'Success';
		}
		else if ( options.type === 2 ) // PXLBros\PXLFramework\Helpers\NOTIFICATION_TYPE_INFO
		{
			type = 'Info';
		}
		else if ( options.type === 3 ) // PXLBros\PXLFramework\Helpers\NOTIFICATION_TYPE_WARNING
		{
			type = 'Warning';
		}
		else if ( options.type === 4 ) // PXLBros\PXLFramework\Helpers\NOTIFICATION_TYPE_ERROR
		{
			type = 'Error';
		}

		if ( self.prepare(options, type) === false )
		{
			return;
		}

		if ( options.type === 1 ) // PXLBros\PXLFramework\Helpers\NOTIFICATION_TYPE_SUCCESS
		{
			self.engines[self.current_engine_id].showSuccess(options);
		}
		else if ( options.type === 2 ) // PXLBros\PXLFramework\Helpers\NOTIFICATION_TYPE_INFO
		{
			self.engines[self.current_engine_id].showInfo(options);
		}
		else if ( options.type === 3 ) // PXLBros\PXLFramework\Helpers\NOTIFICATION_TYPE_WARNING
		{
			self.engines[self.current_engine_id].showWarning(options);
		}
		else if ( options.type === 4 ) // PXLBros\PXLFramework\Helpers\NOTIFICATION_TYPE_ERROR
		{
			self.engines[self.current_engine_id].showError(options);
		}

		self.reset();
	}
};
/**
 * pxlCore/Modal
 * @param {string} $pxl - pxlCore object reference.
 * @constructor
 */
function pxlCore_Modal($pxl)
{
	this.$pxl = $pxl;

	this.init($pxl);
}

pxlCore_Modal.prototype =
{
	default_options:
	{
		title: null,
		width: 320,
		height: 240,
		modal: true,
		autoOpen: false,
		verticalPadding: 20,
		horizontalPadding: 18,
		headerHeight: 40,
		buttonsContainerHeight: 40,
		buttons: [],
		getURL: null,
		getData: null,
		loadingText: 'Loading',
		modes: null,
		afterLoaded: null
	},

	modals: {},
	current_modal_id: null,

	init: function($pxl)
	{
		if ( $pxl.options.debug === true )
		{
			$pxl.log('~ pxlCore/Modal ~', '#CCC', 'black');
		}
	},

	initFromElement: function(selector, options)
	{
	},

	initFromHTML: function(html, options)
	{
		var self = this;

		return self.create
		(
			options
		);
	},

	create: function(options)
	{
		var self = this,
			modal_id = $pxl.getObjectSize(self.modals) + 1;

		if ( typeof options === 'object' )
		{
			options = $pxl.extend(self.default_options, options);
		}

		var modal =
		{
			id: modal_id,
			selector: '#pxl-modal-' + modal_id,
			$modal: null,
			$loader: null,
			$loader_text: null,
			$header: null,
			$content: null,
			$buttons_container: null,
			$buttons: null,
			default_line_height: null,
			mode: null,
			options: options,
			setLoaderText: function(text)
			{
				var _modal = this;

				_modal.$loader_text.innerHTML = text;
			},
			showLoader: function(text)
			{
				var _modal = this;

				if ( $pxl.isUndefined(text) || text === null )
				{
					text = this.options.loadingText;
				}

				_modal.$modal.classList.add('loading');
				_modal.$content.style.lineHeight = _modal.$content.style.height;

				_modal.setLoaderText(text);

				_modal.$loader.style.display = 'block';
			},
			hideLoader: function()
			{
				var _modal = this;

				_modal.$modal.classList.remove('loading');
				_modal.$loader.style.display = 'none';
			},
			getButtons: function()
			{
				var _modal = this;

				if ( _modal.options.modes !== null )
				{
				}
				else
				{
					return _modal.options.buttons;
				}
			},
			enableButtons: function(exclude_save_buttons)
			{
				var _modal = this;

				if ( typeof exclude_save_buttons !== 'boolean' )
				{
					exclude_save_buttons = false;
				}

				var buttons = _modal.getButtons();

				for ( var button_key in buttons )
				{
					if ( buttons.hasOwnProperty(button_key) )
					{
						var button = buttons[button_key];

						if ( exclude_save_buttons === false || (exclude_save_buttons === true && typeof button.save !== 'undefined' && button.save === false)  )
						{
							//button.classList.remove('disabled');
							$(button.selector).removeClass('disabled');
						}
					}
				}
			},
			disableButtons: function(only_save_buttons)
			{
				var _modal = this;

				if ( typeof only_save_buttons !== 'boolean' )
				{
					only_save_buttons = false;
				}

				var buttons = _modal.getButtons();

				for ( var button_key in buttons )
				{
					if ( buttons.hasOwnProperty(button_key) )
					{
						var button = buttons[button_key];

						if ( only_save_buttons === false || (only_save_buttons && (typeof button.save !== 'undefined' && button.save === true)) )
						{
							$(button.selector).addClass('disabled');
						}
						else
						{
							$(button.selector).removeClass('disabled');
						}
					}
				}
			},
			open: function(mode)
			{
				var _modal = this;

				_modal.showLoader(_modal.options.loadingText);

				_modal.$modal.classList.add('open');
				document.body.appendChild(_modal.$modal);

				// Create buttons
				var buttons = _modal.getButtons();

				var buttons_html = '',
					button_key,
					button;

				for ( button_key in buttons )
				{
					if ( buttons.hasOwnProperty(button_key) )
					{
						button = buttons[button_key];

						buttons_html += button.html;
					}
				}

				_modal.$buttons.innerHTML = buttons_html;

				// Attach click event to buttons
				for ( button_key in buttons )
				{
					if ( buttons.hasOwnProperty(button_key) )
					{
						button = buttons[button_key];

						if ( $pxl.isFunction(button.click) )
						{
							(function(button)
							{
								$(button.selector).on('click', function()
								{
									if ( button.click(button) === false )
									{
										return;
									}
								});
							})(button);
						}
					}
				}

				self.current_modal_id = _modal.id;

				$pxl.ajax.get
				(
					_modal.options.getURL,
					_modal.options.getData,
					{
						success: function(result)
						{
							_modal.$content.innerHTML = result.data.html;

							_modal.$content.style.lineHeight = _modal.default_line_height;

							_modal.hideLoader();
							_modal.enableButtons();

							if ( $pxl.isFunction(_modal.options.afterLoaded) )
							{
								_modal.options.afterLoaded(true, result);
							}
						},
						error: function(result)
						{
							_modal.hideLoader();
							_modal.enableButtons(true);

							if ( $pxl.isFunction(_modal.options.afterLoaded) )
							{
								_modal.options.afterLoaded(false, result);
							}
						}
					}
				);
			},
			close: function()
			{
				var _modal = this;

				_modal.$modal.classList.add('close');
				_modal.$modal.classList.remove('open');

				// $pxl.ui.onAnimationComplete(_modal.selector, function()
				$(_modal.selector).one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function()
				{
					_modal.$modal.classList.remove('close');
					_modal.$content.classList.remove('error');

					$(_modal.selector).remove();
				});

				/*if ( dialog_inst.options.modal === true )
				{
					inst.$mask.removeClass('open').addClass('close');
					inst.$mask.one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function()
					{
						if ( inst.$mask === null )
						{
							return;
						}

						inst.$mask.remove();
						inst.$mask = null;
					});
				}*/

				_modal.current_modal_id = null;
			}
		};

		var content_height = modal.options.height - (modal.options.verticalPadding * 2) - modal.options.headerHeight - modal.options.buttonsContainerHeight;

		modal.$loader = document.createElement('div');
		modal.$loader.className = 'ui segment pxl-modal-loader-container';
		modal.$loader.style.height = content_height + 'px';

		var $loader_dimmer = document.createElement('div');
		$loader_dimmer.className = 'ui active inverted dimmer';

		modal.$loader_text = document.createElement('div');
		modal.$loader_text.setAttribute('id', 'pxl-modal-' + modal.id + '-loader-text');

		var loader_size;

		if ( modal.options.height > 640 )
		{
			loader_size = 'large';
		}
		else if ( modal.options.height > 480 )
		{
			loader_size = 'medium';
		}
		else
		{
			loader_size = 'small';
		}

		modal.$loader_text.className = 'ui ' + loader_size + ' text loader';
		modal.$loader_text.innerHTML = modal.options.loadingText;

		$loader_dimmer.appendChild(modal.$loader_text);
		modal.$loader.appendChild($loader_dimmer);

		modal.$header = document.createElement('div');
		modal.$header.className = 'pxl-modal-header';
		modal.$header.style.height = modal.options.headerHeight + 'px';
		modal.$header.innerHTML = '<div class="pxl-modal-header-title">' + modal.options.title + '</div>' + (modal.options.closeButton === true ? '<div class="pxl-modal-header-buttons"><a href="javascript:" class="pxl-modal-close-button"><i class="remove icon"></i></a></div>' : '');

		modal.$content = document.createElement('div');
		modal.$content.className = 'pxl-modal-content';
		modal.$content.style.height = content_height + 'px';
		modal.$content.style.overflowY = 'auto';

		modal.$buttons_container = document.createElement('div');
		modal.$buttons_container.className = 'pxl-modal-buttons-container';
		modal.$buttons_container.style.height = modal.options.buttonsContainerHeight + 'px';

		modal.$buttons = document.createElement('div');
		modal.$buttons.className = 'core-modal-buttons';

		var initButton = function(button, button_index)
		{
			button.selector = '#pxl-modal-' + modal.id + '-button-' + (button_index + 1),
			button.html = '<a href="javascript:" id="' + button.selector.substring(1) + '" class="ui button tiny disabled">' + button.text + '</a>';

			(function(button)
			{
				button.setText = function()
				{
					$(button.selector).html(text);

					return button;
				};

				button.setLoadingText = function()
				{
					button.setText(button.loadingText);
				};

				button.enable = function()
				{
					$(button.selector).removeClass('disabled');

					return button;
				};

				button.disable = function()
				{
					$(button.selector).addClass('disabled');

					return button;
				};

				button.spin = function()
				{
					$(button.selector).addClass('loading');

					return button;
				};

				button.stopSpin = function()
				{
					$(button.selector).removeClass('loading');

					return button;
				};
			})(button);

			return button;
		};

		var button_index;

		if ( modal.options.modes !== null )
		{
		}
		else
		{
			for ( button_index = 0, num_buttons = options.buttons.length; button_index < num_buttons; button_index++ )
			{
				modal.options.buttons[button_index] = initButton(modal.options.buttons[button_index], button_index);
			}
		}

		modal.$buttons_container.appendChild(modal.$buttons);

		// Create modal DOM
		var $modal = document.createElement('div');
		$modal.className = 'pxl-modal';
		$modal.setAttribute('id', 'pxl-modal-' + modal.id);
		$modal.style.width = modal.options.width + 'px';
		$modal.style.height = modal.options.height + 'px';
		$modal.style.marginTop = -(modal.options.height / 2) + 'px';
		$modal.style.marginLeft = -(modal.options.width / 2) + 'px';
		$modal.style.padding = modal.options.verticalPadding + 'px' + ' ' + modal.options.horizontalPadding + 'px';

		$modal.appendChild(modal.$loader);
		$modal.appendChild(modal.$header);
		$modal.appendChild(modal.$loader);
		$modal.appendChild(modal.$content);
		$modal.appendChild(modal.$buttons_container);

		modal.default_line_height = modal.$content.style.lineHeight;

		modal.$modal = $modal;

		self.modals[modal.id] = modal;

		// Auto open
		if ( modal.options.autoOpen === true )
		{
			modal.open();
		}

		return modal;
	}
};
/**
 * pxlCore/Ajax_Request
 * @param {string} $pxl - pxlCore object reference.
 * @constructor
 */
function pxlCore_Ajax_Request($pxl)
{
	this.init($pxl);
}

pxlCore_Ajax_Request.prototype =
{
	$pxl: null,

	$form: null,

	url: '',
	data: {},
	method: 'GET',
	data_type: 'json',
	cache: false,
	async: true,

	result: null,

	before: null,
	progress: null,
	success: null,
	error: null,
	always: null,
	abort: null,

	init: function($pxl)
	{
		var self = this;

		self.$pxl = $pxl;
	},

	execute: function()
	{
		var inst = this;

		if ( inst.$pxl.isUndefined(inst.url) )
		{
			inst.$pxl.log('Missing AJAX URL.');

			return;
		}

		if ( !inst.$pxl.isUndefined(inst.$pxl.ajax.requests[inst.url]) && (inst.$pxl.isUndefined(inst.allowMultiple) || inst.allowMultiple === false) )
		{
			inst.$pxl.ajax.requests[inst.url].abort();
		}

		var file_upload = (inst.$pxl.isDefined(inst.file_upload) && inst.file_upload === true);

		var headers = { 'X-XSRF-TOKEN': inst.$pxl.framework.csrf_token };

		if ( file_upload === true && inst.$pxl.isObject(inst.file_upload_data) )
		{
			headers = $.extend(headers, inst.file_upload_data);
		}

		inst.$pxl.ajax.requests[inst.url] = $.ajax(
		{
			type: inst.method,
			url: inst.url,
			data: inst.data,
			dataType: inst.data_type,
			cache: inst.cache,
			async: inst.async,
			processData: (file_upload !== true),
			contentType: (file_upload === true ? false : 'application/x-www-form-urlencoded; charset=UTF-8'),
			headers: headers,
			xhr: function()
			{
				var xhr = $.ajaxSettings.xhr();

				if ( inst.$pxl.isFunction(inst.progress) )
				{
					xhr.upload.onprogress = function(e)
					{
						var percent = (e.loaded / e.total) * 100;

						inst.progress(percent);
					};
				}

				return xhr;
			},
			beforeSend: function(xhr, data)
			{
				if ( inst.$pxl.isFunction(inst.before) )
				{
					inst.before(xhr, data);
				}
			}
		}).done(function(result)
		{
			if ( inst.$pxl.isFunction(inst.success) )
			{
				inst.success(result);
			}

			if ( typeof result.notification !== 'undefined' && result.notification !== null )
			{
				if ( typeof result.notification.type === 'number' && typeof result.notification.text === 'string' )
				{
					inst.$pxl.notification.show({ type: result.notification.type, message: result.notification.text });
				}
			}

			if ( !inst.$pxl.isUndefined(result.redirect) )
			{
				setTimeout(function()
				{
					return inst.$pxl.redirect(result.redirect.url);
				}, result.redirect.delay);
			}

			inst.result = result;
		}).always(function(result)
		{
			if ( inst.$pxl.isFunction(inst.always) )
			{
				inst.always(result);
			}

			delete inst.$pxl.ajax.requests[inst.url];
		}).fail(function(xhr, textStatus, errorThrown)
		{
			if ( xhr === 'abort' )
			{
				if ( inst.$pxl.isFunction(inst.abort) )
				{
					inst.abort();
				}
			}
			else
			{
				if ( inst.$pxl.isFunction(inst.error) )
				{
					inst.error(errorThrown);
				}

				if ( inst.$pxl.options.debug === true && inst.$pxl.isDefined(xhr.responseText) )
				{
					inst.$pxl.notification.showError({ message: xhr.responseText, autoHide: false });
				}
			}
		});
	}
};
/**
 * pxlCore/Ajax
 * @param {string} $pxl - pxlCore object reference.
 * @constructor
 */
function pxlCore_Ajax($pxl)
{
	this.init($pxl);
}

pxlCore_Ajax.prototype =
{
	$pxl: null,

	requests: [],

	init: function($pxl)
	{
		var self = this;

		self.$pxl = $pxl;

		if ( self.$pxl.options.debug === true )
		{
			self.$pxl.log('~ pxlCore/Ajax ~', '#CCC', 'black');
		}
	},

	get: function(url, data, callbacks, extra)
	{
		var self = this;

		var request = new pxlCore_Ajax_Request(self.$pxl);
		request.method = 'GET';
		request.url = url;
		request.data = data;

		if ( self.$pxl.isUndefined(callbacks) )
		{
			callbacks = {};
		}

		if ( self.$pxl.isFunction(callbacks.before) )
		{
			request.before = callbacks.before;
		}

		if ( self.$pxl.isFunction(callbacks.progress) )
		{
			request.progress = callbacks.progress;
		}

		if ( self.$pxl.isFunction(callbacks.success) )
		{
			request.success = callbacks.success;
		}

		if ( self.$pxl.isFunction(callbacks.error) )
		{
			request.error = callbacks.error;
		}

		if ( self.$pxl.isFunction(callbacks.always) )
		{
			request.always = callbacks.always;
		}

		if ( self.$pxl.isFunction(callbacks.abort) )
		{
			request.abort = callbacks.abort;
		}

		if ( self.$pxl.isObject(extra) )
		{
			for ( var key in extra )
			{
				if ( extra.hasOwnProperty(key) )
				{
					request[key] = extra[key];
				}
			}
		}

		request.execute();

		return request;
	},

	post: function(url, data, callbacks, extra)
	{
		var self = this;

		var request = new pxlCore_Ajax_Request(self.$pxl);
		request.method = 'POST';
		request.url = url;
		request.data = data;

		if ( self.$pxl.isUndefined(callbacks) )
		{
			callbacks = {};
		}

		if ( self.$pxl.isFunction(callbacks.before) )
		{
			request.before = callbacks.before;
		}

		if ( self.$pxl.isFunction(callbacks.progress) )
		{
			request.progress = callbacks.progress;
		}

		if (self. $pxl.isFunction(callbacks.success) )
		{
			request.success = callbacks.success;
		}

		if ( self.$pxl.isFunction(callbacks.error) )
		{
			request.error = callbacks.error;
		}

		if ( self.$pxl.isFunction(callbacks.always) )
		{
			request.always = callbacks.always;
		}

		if ( self.$pxl.isFunction(callbacks.abort) )
		{
			request.abort = callbacks.abort;
		}

		if ( self.$pxl.isObject(extra) )
		{
			for ( var key in extra )
			{
				if ( extra.hasOwnProperty(key) )
				{
					request[key] = extra[key];
				}
			}
		}

		request.execute();

		return request;
	}
};
/**
 * pxlCore/UI
 * @param {string} $pxl - pxlCore object reference.
 * @constructor
 */
function pxlCore_UI($pxl)
{
	this.$pxl = $pxl;

	this.init($pxl);
}

pxlCore_UI.prototype =
{
	init: function($pxl)
	{
		if ( $pxl.options.debug === true )
		{
			$pxl.log('~ pxlCore/UI ~', '#CCC', 'black');
		}
	},

	onAnimationComplete: function(element, callback)
	{
		if ( element === null )
		{
			return;
		}

		if ( !this.$pxl.isFunction(callback) )
		{
			return;
		}

		element.addEventListener('webkitAnimationEnd', callback, false);
		element.addEventListener('oAnimationEnd', callback, false);
		element.addEventListener('msAnimationEnd', callback, false);
		element.addEventListener('animationend', callback, false);
	},

	onTransitionComplete: function(element, callback)
	{
		if ( element === null )
		{
			return;
		}

		if ( !this.$pxl.isFunction(callback) )
		{
			return;
		}

		element.addEventListener('webkitTransitionEnd', callback, false);
		element.addEventListener('otransitionend', callback, false);
		element.addEventListener('oTransitionEnd', callback, false);
		element.addEventListener('msTransitionEnd', callback, false);
		element.addEventListener('transitionend', callback, false);
	},

	setCaretAtEnd: function(element)
	{
		var value_length = element.value.length;

		if ( document.selection )
		{
			element.focus();

			var range = document.selection.createRange();
			range.moveStart('character', -value_length);
			range.moveStart('character', value_length);
			range.moveEnd('character', 0);
			range.select();
		}
		else if ( element.selectionStart || element.selectionStart === 0 )
		{
			element.selectionStart = value_length;
			element.selectionEnd = value_length;
			element.focus();
		}
	}
};
/**
 * pxlCore/UI
 * @param {string} $pxl - pxlCore object reference.
 * @constructor
 */
function pxlCore_URI($pxl)
{
	this.$pxl = $pxl;
}

pxlCore_URI.prototype =
{
	init: function($pxl)
	{
		this.$pxl = $pxl;

		if ( $pxl.options.debug === true )
		{
			$pxl.log('~ pxlCore/URI ~', '#CCC', 'black');
		}
	},

	urlize: function(url)
	{
		if ( this.$pxl.isUndefined(this.$pxl.framework.base_url) )
		{
			this.$pxl.log('Base URL not set.');

			return;
		}

		return this.$pxl.framework.base_url + url;
	}
};
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

	save_url: null,
	additional_data: {},

	files: [],
	num_files: 0,
	num_files_without_error: 0,

	num_processed_files: 0,
	num_processed_files_without_error: 0,

	allowed_mime_types: null,
	max_file_size: null,

	events: null,

	is_uploading: false,
	cancelled: false,

	_init: function($pxl)
	{
		var self = this;

		self.$pxl = $pxl;
	},

	init: function(save_url, additional_data, allowed_mime_types, events)
	{
		var self = this;

		self.save_url = save_url;
		self.additional_data = (self.$pxl.isObject(additional_data) ? additional_data : {});

		self.allowed_mime_types = allowed_mime_types;
		self.events = events;

		return self;
	},

	checkFileType: function(file)
	{
		var self = this;

		if ( self.allowed_mime_types === null )
		{
			return true;
		}

		if ( !self.$pxl.inArray(file.type, self.allowed_mime_types) )
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
		var self = this;

		self.cancelled = false;
		self.is_uploading = true;

		self.processQueueFile();
	},

	processQueueFile: function()
	{
		var self = this;

		var file = self.files[self.num_processed_files];

		var postSave = function(_file, error)
		{
			if ( self.cancelled === true )
			{
				return;
			}

			if ( self.$pxl.isFunction(self.events.onFileComplete) )
			{
				self.events.onFileComplete(
				{
					file: self.files[self.num_processed_files],
					file_index: self.num_processed_files,
					num_files: self.num_files_without_error,
					percent: Math.round((self.num_processed_files_without_error / self.num_files_without_error) * 100),
					error: error
				});
			}

			if ( self.num_processed_files < (self.num_files - 1) )
			{
				self.num_processed_files++;

				if ( _file.error === false )
				{
					self.num_processed_files_without_error++;
				}

				self.processQueueFile();
			}
			else
			{
				if ( self.$pxl.isFunction(self.events.onAllComplete) )
				{
					self.events.onAllComplete();
				}

				pxl_file_upload.clearQueue();

				self.is_uploading = false;
			}
		};

		if ( self.$pxl.isFunction(self.events.onBeforeFileUpload) )
		{
			self.events.onBeforeFileUpload(
			{
				file: self.files[self.num_processed_files],
				file_index: self.num_processed_files,
				num_files: self.num_files_without_error
			});
		}

		if ( file.error === false )
		{
			var additional_data = self.additional_data;
			additional_data['X-Pxl-Original-Filename'] = file.file.name;
			additional_data['X-Pxl-Size'] = file.file.size;
			additional_data['X-Pxl-Mime'] = file.file.type;

			self.$pxl.ajax.post
			(
				self.save_url,
				file.file,
				{
					progress: function(percent)
					{
						if ( self.$pxl.isFunction(self.events.onFileProgress) )
						{
							self.events.onFileProgress(
							{
								file: file,
								file_index: self.num_processed_files,
								percent: percent
							});
						}
					},
					success: function(result)
					{
						var file = self.files[self.num_processed_files];

						if ( self.$pxl.isFunction(self.events.onFileComplete) )
						{
							self.events.onFileComplete(
							{
								file: file,
								file_index: self.num_processed_files,
								result: result
							});
						}

						postSave(file, null);
					},
					error: function(error)
					{
						if ( self.cancelled === false )
						{
							if ( self.$pxl.isFunction(self.events.onFileError) )
							{
								self.events.onFileError(
								{
									file: file,
									file_index: self.num_processed_files,
									error: error
								});
							}

							postSave(file, error);
						}
					}
				},
				{
					file_upload: true,
					file_upload_data: additional_data
				}
			);
		}
		else
		{
			postSave(file, null);
		}
	},

	throwError: function(error)
	{
		var self = this;

		if ( typeof self.events.onError === 'function' )
		{
			self.events.onError(error);
		}
	},

	removeFileFromQueue: function(index)
	{
		var self = this;

		if ( self.$pxl.isUndefined(self.files[index]) )
		{
			if ( self.$pxl.options.debug === true )
			{
				self.$pxl.error('Could not find queue file on index ' + index + '.');
			}

			return;
		}

		self.files.splice(index, 1);
		self.num_files--;
	},

	getFiles: function()
	{
		var self = this;

		var files = [];

		for ( var i = 0; i < self.num_files; i++ )
		{
			var file = self.files[i];

			files.push(
			{
				file:
				{
					name: file.file.name,
					type: file.file.type,
					size: file.file.size
				},
				error: file.error,
				errors: file.errors
			});
		}

		return files;
	},

	getFile: function(index)
	{
		if ( self.$pxl.isUndefined(this.files[index]) )
		{
			return null;
		}

		return this.files[index];
	},

	clearQueue: function()
	{
		var self = this;

		self.files = [];
		self.num_files = 0;
		self.num_files_without_error = 0;

		self.num_processed_files = 0;
		self.num_processed_files_without_error = 0;
	},

	addFilesToQueue: function(files)
	{
		var self = this;

		for ( var file_index = 0, num_files = files.length; file_index < num_files; file_index++ )
		{
			var file = files[file_index];

			var file_obj =
			{
				file: file,
				errors:
				{
					mime: false,
					size: false
				},
				error: false
			};

			if ( self.checkFileType(file) === false )
			{
				file_obj.errors.mime = true;
				file_obj.error = true;
			}

			if ( self.checkFileSize(file) === false )
			{
				file_obj.errors.size = true;
				file_obj.error = true;
			}

			if ( file_obj.error === false )
			{
				self.num_files_without_error++;
			}

			self.files.push(file_obj);
		}

		self.num_files = self.files.length;
	},

	cancel: function()
	{
		var self = this;

		if ( self.num_files === 0 )
		{
			return;
		}

		self.cancelled = true;

		if ( !self.$pxl.isUndefined(self.$pxl.ajax.requests[self.save_url]) )
		{
			self.$pxl.ajax.requests[self.save_url].abort();
		}

		var was_uploading = (self.is_uploading === true);

		self.is_uploading = false;

		if ( self.$pxl.isFunction(self.events.onCancel) )
		{
			self.events.onCancel(
			{
				file: self.files[self.num_processed_files],
				file_index: self.num_processed_files,
				was_uploading: was_uploading
			});
		}

		self.clearQueue();
	}
};
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
function pxlCore(options)
{
	this.init(options);
}

pxlCore.prototype =
{
	version: '1.0.65',

	options:
	{
		debug: false,
		notification:
		{
			engines: []
		}
	},

	framework: null,

	ui: null,
	ajax: null,
	modal: null,
	notification: null,
	uri: null,
	form: null,
	dynamic_item: null,

	libraries: [],

	init: function(options)
	{
		var self = this;

		if ( typeof options === 'object' )
		{
			self.options = self.extend(self.options, options);
		}

		// Detect pxlFramework
		self.detectPXLFramework();

		if ( self.options.debug === true )
		{
			self.log('~ pxlCore ~', 'black', 'white');
			self.log('Version: ' + self.version);
			self.log('Detected pxlFramework: ' + (self.framework !== null ? 'Yes' : 'No'));

			if ( self.framework !== null )
			{
				self.log('Current Page: ' + self.framework.current_page);
				self.log('Page ID: ' + self.framework.page_id);
				self.log('Base URL: ' + self.framework.base_url);
			}
		}

		// UI
		self.ui = new pxlCore_UI(self);

		// Ajax
		self.ajax = new pxlCore_Ajax(self);

		// Modal
		self.modal = new pxlCore_Modal(self);

		// Notification
		self.notification = new pxlCore_Notification(self);

		if ( self.framework !== null && typeof pxl_notification === 'object' )
		{
			self.notification.show(
			{
				type: pxl_notification.type,
				message: pxl_notification.text
			});
		}

		// URI
		self.uri = new pxlCore_URI(self);

		// Form
		self.form = new pxlCore_Form(self);

		// Dynamic Item
		self.dynamic_item = new pxlCore_DynamicItem(self);
	},

	/**
     * Detect if pxlFramework exist.
     */
	detectPXLFramework: function()
	{
		var self = this;

		if ( typeof pxl === 'object' )
		{
			self.framework = pxl;
		}
	},

	/**
     * Log message to console.
	 * @param {string} text - Text to show.
	 * @param {string} background_color - Background color.
	 * @param {string} color - Text color.
     */
	log: function(text, background_color, color)
	{
		var style = '';

		if ( typeof background_color === 'string' )
		{
			style = 'background:' + background_color + ';padding:0 6px';
		}

		if ( typeof color === 'string' )
		{
			style += (style !== '' ? ';' : '') + 'color:' + color;
		}

		console.log('%c' + text, (style !== '' ? style : null));
	},

	error: function(text)
	{
		this.log(text, '#F00', '#FFF');
	},

	extend: function(defaults, options)
	{
	    var extended = {},
	        key;

	    for ( key in defaults )
	    {
	        if ( Object.prototype.hasOwnProperty.call(defaults, key) )
	        {
	            extended[key] = defaults[key];
	        }
	    }

	    for ( key in options )
	    {
	        if ( Object.prototype.hasOwnProperty.call(options, key) )
	        {
	            extended[key] = options[key];
	        }
	    }

	    return extended;
	},

	isUndefined: function(object)
	{
		return object == void 0;
	},

	isDefined: function(object)
	{
		return !this.isUndefined(object);
	},

	isFunction: function(object)
	{
		return (typeof object === 'function');
	},

	isObject: function(object)
	{
		return object === Object(object);
	},

	inArray: function(subject, array)
	{
		return ($.inArray(subject, array) !== -1);
	},

	getObjectSize: function(object)
	{
		var size = 0,
			key;

		for ( key in object )
		{
			if ( object.hasOwnProperty(key) )
			{
				size++;
			}
		}

		return size;
	},

	redirect: function(url, with_base_url)
	{
		window.location = (typeof with_base_url === 'boolean' ? this.uri.urlize(url) : url);
	},

	implode: function(glue, pieces, last_glue)
	{
		var i = '',
			return_value = '',
			append_glue = '';

		last_glue = last_glue || null;

		if ( arguments.length === 1 )
		{
			pieces = glue;
			glue = '';
		}

		if ( typeof pieces === 'object' )
		{
			if ( Object.prototype.toString.call(pieces) === '[object Array]' && last_glue === null )
			{
				return pieces.join(glue);
			}

			var num_pieces = pieces.length;

			for ( i in pieces )
			{
				if ( pieces.hasOwnProperty(i) )
				{
					return_value += append_glue + pieces[i];

					append_glue = (i < (num_pieces - 2) ? glue : last_glue);
				}
			}

			return return_value;
		}

		return pieces;
	},

	openPopup: function(url, width, height)
	{
		var top_position = ($(window).height() / 2) - (height / 2),
			left_position = ($(window).width() / 2) - (width / 2);

		window.open(url, 'pxl-popup', 'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=no,top=' + top_position + ',left=' + left_position + ',width=' + width + ',height=' + height);
	}
};