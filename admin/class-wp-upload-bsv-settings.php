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
		if ('tools_page_wpbsv_upload_settings' !== $hook) {
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
					// 'api' => rest_url('wpbsv-upload-bsv/v1/'),
					'api' => get_rest_url(),
				),
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
				<div id="wpbsv-settings">
					<form action="options.php" method="post">
						<?php
							settings_fields($this->db::AUTO_UPLOAD_GROUP);
							do_settings_sections($this->db::AUTO_UPLOAD_GROUP);
							submit_button('Save');
						?>
					</form>
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
			'Upload on Publish',
			array($this, 'upload_on_publish_callback'),
			$this->db::AUTO_UPLOAD_GROUP,
			'upload_settings_section'
		);

		add_settings_field(
			'upload_on_update',
			'Upload on Update',
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

	/**
	 * Undocumented function
	 *
	 * @return void
	 */
	public function onPublishPost() {
		echo 'post published';
	}
}