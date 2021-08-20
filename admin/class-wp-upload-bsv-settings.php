<?php

/**
 * The automatic upload functionality of the plugin.
 *
 * @link       https://github.com/BarryMolina
 * @since      1.0.0
 *
 * @package    Wp_Upload_Bsv
 * @subpackage Wp_Upload_Bsv/admin
 */

/**
 * The automatic upload functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Wp_Upload_Bsv
 * @subpackage Wp_Upload_Bsv/admin
 * @author     Barry Molina <bazzaboy@gmail.com>
 */
class Wp_Upload_Bsv_Settings {
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
		$this->db = new Wp_Upload_Bsv_DB;
		// $this->admin = new Wp_Upload_Bsv_Admin;
	}

	private function load_dependencies() {
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-wp-upload-bsv-db.php';
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-wp-upload-bsv-admin.php';
	}

	/**
	 * Register the JavaScript for the settings page.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts($hook) {
		// Only enqueue script on tools page
		if ('settings_page_wpbsv_upload_settings' !== $hook) {
			return;
		}

		if (in_array($_SERVER['REMOTE_ADDR'], array('127.0.0.1', '::1'))) {
			echo 'here';
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
        'nonce' => wp_create_nonce('wpbsv-nonce'),
				'prefixes' => get_option($this->db::DEFAULT_PREFIXES, array()),
				'page' => 'settings',
      )
    );
	}

	/**
	 * Add a submenu page for this plugin to the Tools menu
	 * 
	 */
	public function setup_plugin_management_menu() {

		add_options_page(
			'Mirror to BSV Settings', 					// The title to be displayed in the browser window for this page.
			'Mirror to BSV',					// The text to be displayed for this menu item
			'manage_options',					// Which type of users can see this menu item
			'wpbsv_upload_settings',			// The unique ID - that is, the slug - for this menu item
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
				<h2>Mirror to BSV Settings</h2>
				<div id="wpbsv-settings-page">
					<h2>Wallet Info</h2>
					<table class="form-table" role="presentation">
						<tbody>
							<tr>
								<th scope="row">Address</th>
								<td><?php echo (!is_wp_error($res = $this->get_address()) ? json_decode($res['body'], true)['address']: '') ?></td>
							</tr>
							<tr>
								<th scope="row">Balance</th>
								<td><?php echo (!is_wp_error($res = $this->get_balance()) ? json_decode($res['body'], true)['balance']['confirmed'] : '') ?></td>
							</tr>
						</tbody>
					</table>
					<form action="options.php" method="post" id="wpbsv-settings-form">
						<?php
							settings_fields($this->db::AUTO_UPLOAD_GROUP);
							do_settings_sections($this->db::AUTO_UPLOAD_GROUP);
							// submit_button('Save Settings');
						?>
					</form>
					<h2>Default Prefixes</h2>
					<div id="wpbsv-prefix-container"></div>
				</div>
			</div>
		<?php
	}

	public function initialize_plugin_settings() {

		register_setting($this->db::AUTO_UPLOAD_GROUP, $this->db::UPLOAD_ON_PUBLISH);
		register_setting($this->db::AUTO_UPLOAD_GROUP, $this->db::UPLOAD_ON_UPDATE);

		add_settings_section(
			'upload_settings_section',
			'Auto Upload Settings',
			array($this, 'upload_section_callback'),
			$this->db::AUTO_UPLOAD_GROUP
		);

		add_settings_field(
			'upload_on_publish',
			'On Publish',
			array($this, 'upload_on_publish_callback'),
			$this->db::AUTO_UPLOAD_GROUP,
			'upload_settings_section'
		);

		add_settings_field(
			'upload_on_update',
			'On Update',
			array($this, 'upload_on_update_callback'),
			$this->db::AUTO_UPLOAD_GROUP,
			'upload_settings_section'
		);
	}

	/**
	 * The callback for the auto upload settings section
	 *
	 * @return void
	 */
	public function upload_section_callback() {}

	public function upload_on_publish_callback() {
		?>
			<input 
				type="checkbox" 
				name="<?php echo $this->db::UPLOAD_ON_PUBLISH; ?>" 
				value="1" 
				<?php checked(1, get_option($this->db::UPLOAD_ON_PUBLISH), true); ?>
			/>
		<?php
	}

	public function upload_on_update_callback() {
		?>
			<input 
				type="checkbox" 
				name="<?php echo $this->db::UPLOAD_ON_UPDATE; ?>" 
				value="1" 
				<?php checked(1, get_option($this->db::UPLOAD_ON_UPDATE), true); ?>
			/>
		<?php
	}

	public function default_prefixes_callback() {
		?>
			<input
				id="wpbsv-default-prefixes"
				type="text"
				name="<?php echo $this->db::DEFAULT_PREFIXES; ?>"
				value="<?php echo get_option($this->db::DEFAULT_PREFIXES); ?>"
			/>
		<?php
	}

	public function save_default_prefixes() {
		check_ajax_referer('wpbsv-nonce');

		// Have to remove extra slashes added by wp
		$prefixes = json_decode(wp_unslash($_POST['prefixes']));
		update_option($this->db::DEFAULT_PREFIXES, $prefixes);

		wp_send_json('true');

	}

	/**
	 * Get the address associated with the wallet's private key
	 *
	 * @return 	array|WP_Error 			$out 					The wallet's address or WP_Error on failure
	 */
	private function get_address() {
		$response = wp_remote_get('http://localhost:9999/address');
    $code = wp_remote_retrieve_response_code($response);

    // Check if bad request
    if (!empty($code) && ( $code < 200 || $code >= 400 )) {
      $body = wp_remote_retrieve_body($response);
      $out = new WP_Error($code, $response, array('status' => $code));
    }
    else {
      $out = $response;
    }
		return $out;
	}

	/**
	 * Get the balance available at the wallet's private key
	 *
	 * @return 	array|WP_Error 			$out 					The wallet's address or WP_Error on failure
	 */
	private function get_balance() {
		$response = wp_remote_get('http://localhost:9999/balance');
    $code = wp_remote_retrieve_response_code($response);

    // Check if bad request
    if (!empty($code) && ( $code < 200 || $code >= 400 )) {
      $body = wp_remote_retrieve_body($response);
      $out = new WP_Error($code, $response, array('status' => $code));
    }
    else {
      $out = $response;
    }
		return $out;
	}

	public function test_get_address() {
		$response = $this->get_address();
		if (!is_wp_error($response)) {
			$balance = json_decode($response['body'], true);
			print_r($balance);
		}
		else {
			echo 'Error!';
			print_r($response);
		}
	}
}