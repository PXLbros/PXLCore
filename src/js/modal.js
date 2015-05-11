/**
 * pxlCore/Modal
 * @param {string} $pxl - pxlCore object reference.
 * @constructor
 */
function pxlCore_Modal($pxl)
{
	this.init($pxl);
}

pxlCore_Modal.prototype =
{
	default_options:
	{
		width: 320,
		height: 240,
		modal: true,
		autoOpen: false,
		verticalPadding: 20,
		horizontalPadding: 18,
		headerHeight: 40,
		buttonsContainerHeight: 40,
		buttons: [],
		modes: null
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
			open: function(mode)
			{
				var _modal = this;

				_modal.showLoader(_modal.options.loadingText);

				_modal.$modal.classList.add('open');
				$('body').append(_modal.$modal);

				alert('we');
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
				_modal.$loader_text.innerHTML = text;
				_modal.$loader.style.display = 'block';
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

		modal.$buttons_container = document.createElement('div');
		modal.$buttons_container.className = 'pxl-modal-buttons-container';
		modal.$buttons_container.style.height = modal.options.buttonsContainerHeight + 'px';

		modal.$buttons = document.createElement('div');
		modal.$buttons.className = 'core-modal-buttons';

		var initButton = function(button, button_index)
		{
			button.selector = '#pxl-modal-' + modal.id + '-button-' + (button_index + 1),
			button.html = '<a href="javascript:" id="' + button.selector.substring(1) + '" class="ui button tiny disabled">' + button.text + '</a>';

			(function(button, button_index)
			{
				button.setText = function()
				{
				};
			})(button, button_index);

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

		return modal;
	}
};