<?php

/**
 * The manual upload functionality of the plugin.
 *
 * @link       https://github.com/BarryMolina
 * @since      1.0.0
 *
 * @package    Wp_Upload_Bsv
 * @subpackage Wp_Upload_Bsv/admin
 */

/**
 * The manual upload functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Wp_Upload_Bsv
 * @subpackage Wp_Upload_Bsv/admin
 * @author     Barry Molina <bazzaboy@gmail.com>
 */
class Wp_Upload_Bsv_Tools {
	// use League\HTMLToMarkdown\HtmlConverter;

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * The class responsible for querying the database
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      Wp_Upload_Bsv_DB    $db    Handles database access
	 */
	protected $db;

	/**
	 * The class responsible for all upload functionality
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      Wp_Upload_Bsv_Admin    $db    Handles database access
	 */
	protected $admin;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		// $this->load_dependencies();

		$this->plugin_name = $plugin_name;
		$this->version = $version;
	}

	private function load_dependencies() {
	}

	/**
	 * Register the JavaScript for the tools page.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts($hook) {

		// Only enqueue script on tools page
		if ('tools_page_wpbsv_upload_tools' !== $hook) {
			return;
		}

		if (in_array($_SERVER['REMOTE_ADDR'], array('127.0.0.1', '::1'))) {
			wp_enqueue_script( 'wpbsv-admin-panel-react', 'http://localhost:3000/bundle.js', array(), $this->version, true );
		}
		// Production scripts
		else {
			wp_enqueue_script( 'wpbsv-admin-panel-react', plugin_dir_url( __FILE__ ) . 'js/admin-panel-react/build/bundle.js', array(), $this->version, true );
		}
		wp_localize_script(
      'wpbsv-admin-panel-react',
      'wpbsv_ajax_obj', 
      array(
        'nonce' => wp_create_nonce('wp_rest'),
				'urls' => array(
					'api' => get_rest_url(),
					// 'transactions' => rest_url('wpbsv-upload-bsv/v1/transactions'),
				),
				'page' => 'tools'
      )
    );
	}

	/**
	 * Add a submenu page for this plugin to the Tools menu
	 * 
	 */
	public function setup_plugin_management_menu() {

		add_management_page(
			'Mirror Posts to BSV', 					// The title to be displayed in the browser window for this page.
			'Mirror Posts to BSV',					// The text to be displayed for this menu item
			'manage_options',					// Which type of users can see this menu item
			'wpbsv_upload_tools',			// The unique ID - that is, the slug - for this menu item
			array( $this, 'render_management_page_content')				// The name of the function to call when rendering this menu's page
		);

	}
		/**
	 * Renders the contents of the settings page
	 */
	public function render_management_page_content() {
		// check user capabilities
		if ( ! current_user_can( 'manage_options' ) ) {
		  return;
		}
		?>
			<div class="wrap">
				<h2>Mirror Posts to BSV</h2>
				<div id="wpbsv-admin-panel"></div>
			</div>
		<?php
	}
}
