<?php

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       https://github.com/BarryMolina
 * @since      1.0.0
 *
 * @package    Wp_Upload_Bsv
 * @subpackage Wp_Upload_Bsv/admin
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Wp_Upload_Bsv
 * @subpackage Wp_Upload_Bsv/admin
 * @author     Barry Molina <bazzaboy@gmail.com>
 */
class Wp_Upload_Bsv_Admin {

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
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;

	}

	/**
	 * Register the stylesheets for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {

		wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/wp-upload-bsv-admin.css', array(), $this->version, 'all' );
	}

	/**
	 * Register the JavaScript for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts($hook) {
		// Enqueue script only for this page
		if ('tools_page_wpbsv_upload' !== $hook) {
			return;
		}

		$js_to_load = '';
		if (in_array($_SERVER['REMOTE_ADDR'], array('127.0.0.1', '::1'))) {
			// DEV React dynamic loading
			$js_to_load = 'http://localhost:8080/bundle.js';
			// wp_enqueue_script( 'react-app-js', 'http://localhost:8080/bundle.js', array(), $this->version, true );
		}
		else {
			// Use production build
			$js_to_load = plugin_dir_url( __FILE__ ) . 'js/admin-panel-react/build/bundle.js';
		}
		wp_enqueue_script( 'wpbsv-admin-panel-react', $js_to_load, array(), $this->version, true );
		// wp_enqueue_script( 'admin-panel-react', plugin_dir_url( __FILE__ ) . 'admin-panel-react/build/bundle.js', array(), $this->version, true );
	}

	/**
	 * Add a submenu page for this plugin to the Tools menu
	 * 
	 */
	public function setup_plugin_management_menu() {

		add_management_page(
			'Upload Posts to BSV', 					// The title to be displayed in the browser window for this page.
			'Mirror to BSV',					// The text to be displayed for this menu item
			'manage_options',					// Which type of users can see this menu item
			'wpbsv_upload',			// The unique ID - that is, the slug - for this menu item
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
				<div id='money-button'></div>
				<p id='wpbsv-message'></p>
			</div>
			<div id="wpbsv-admin-panel"></div>
		<?php
		}
	
	// public function se_inspect_scripts() {
	// 	global $wp_scripts;
	// 	echo "<h2>Enqueued JS Scripts</h2><ul>";
	// 	foreach( $wp_scripts->queue as $handle ) :
	// 		echo "<li>" . $handle . "</li>";
	// 	endforeach;
	// 	echo "</ul>";
	// }
	

}
