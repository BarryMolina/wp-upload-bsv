(function( $ ) {
	'use strict';

	/**
	 * All of the code for your admin-facing JavaScript source
	 * should reside in this file.
	 *
	 * Note: It has been assumed you will write jQuery code here, so the
	 * $ function reference has been prepared for usage within the scope
	 * of this function.
	 *
	 * This enables you to define handlers, for when the DOM is ready:
	 *
	 * $(function() {
	 *
	 * });
	 *
	 * When the window is loaded:
	 *
	 * $( window ).load(function() {
	 *
	 * });
	 *
	 * ...and/or other possibilities.
	 *
	 * Ideally, it is not considered best practise to attach more than a
	 * single DOM-ready or window-load handler for a particular page.
	 * Although scripts in the WordPress core, Plugins and Themes may be
	 * practising this, we should strive to set a better example in our own work.
	 */
	$(function() {
		// $('#money-button').text('Money Button');
		const div = document.getElementById('money-button');
		const msg = $('#wpbsv-message')

		const gendale = '67656e64616c652e6e6574';
		
		const op = 'OP_FALSE OP_RETURN'
		const b = '31394878696756345179427633744870515663554551797131707a5a56646f417574';
		const data = '0a3c212d2d0a7469746c653a2022576f72645072657373205465737420506f7374220a617574686f723a2022536f6d65204d61726b646f776e2047656e657261746f72220a646174653a2022323032312d30362d3039220a2d2d3e0a0a2323204e6f73206361706572657420636c6175646f720a0a4c6f72656d206d61726b646f776e756d2061646d6f6e6974752e205661746963696e6174612061657269692e20526170746f722074657267612073706c656e64657363756e742062656c6c6920697576656e616c653a2061626c61746f20706f737465726120636f6e73746974697420666f7265742076756c6e65726520696e7472656d756974210a0a48756e6320616d6172692070726f74696e75732073706f6c6961766974204e656c6561c2a02a2a736f6c612073696d756c61637261206f2a2ac2a0666f7274696275732066756c7669732c206574c2a05b6f207175655d28687474703a2f2f6d6f72612e6e65742f756c63697363692e68746d6c29c2a064656f2c20617370657269746173207075676d616e20657420706f6e69742e20506f74656e7469612063756c70616d2c206574206176656e697320706563746f72612065742063617074757320616c696973207175656d20737472756374612c20656e696d206164757371756520696e66657374757320636c617373653b206875696320737569732e20517569737175616dc2a05b736f6c656e7420696e636c696e6174615d28687474703a2f2f696c6c612e6f72672f29c2a0696e7472612061622071756f642c2041746c616e746520666c61766573636572652070617469656d75722061626972652e0a0a';
		const txmd = '746578742f6d61726b646f776e'
		const utf8 = '7574662d38'
		const output = [op, b, data, txmd, utf8]
		const script = output.join(' ')
		// console.log(script);

		function paymentCallback (p) {
			console.log ('hi thanks for payment')
			console.log(p.txid);
			console.log(p)
			msg.text('txid: ' + p.txid);
		}
		moneyButton.render(div, {
			outputs: [{
				script: script,
				amount: '0',
				currency: 'BSV',
			}],
			onPayment: paymentCallback
		})

	})

})( jQuery );
