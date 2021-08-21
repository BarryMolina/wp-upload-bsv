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
	 * The class responsible for querying the database
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      Wp_Upload_Bsv_DB    $db    Handles database access
	 */
	protected $db;

	/**
	 * The class responsible for building and sending transactions
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      Wp_Upload_Bsv_Tx_Builder    $tx_builder    build and sends transactions
	 */
	protected $tx_builder;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->load_dependencies();

		$this->plugin_name = $plugin_name;
		$this->version = $version;
		$this->db = new Wp_Upload_Bsv_DB;
		$this->tx_builder = new Wp_Upload_Bsv_Tx_Builder;
	}

	private function load_dependencies() {
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-wp-upload-bsv-db.php';
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'admin/class-wp-upload-bsv-tx-builder.php';
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
	public function enqueue_scripts() {
	}

	/**
	 * Handle the auto-upload feature. Called whenever a post is created or updated
	 *
	 * @param String $new_status    The current post status
	 * @param String $old_status		The previous post status
	 * @param String $post					The post itself
	 * @return void
	 */
	public function auto_upload_post($new_status, $old_status, $post) {
		if ($this->should_upload($new_status, $old_status, $post->post_type)) {
			// Upload post
			$this->tx_builder->send_one($post->ID);
		}
	}

	/**
	 * Determine whether to upload post. 
	 *
	 * @param String 			$new_status    	The current post status
	 * @param String 			$old_status			The previous post status
	 * @param String 			$post_type			The post type
	 * @return boolean										Whether the post should be uploaded
	 */
	private function should_upload($new_status, $old_status, $post_type) {
		if ($post_type != 'post') return false;

		$on_publish = get_option($this->db::UPLOAD_ON_PUBLISH) === '1';
		$on_update = get_option($this->db::UPLOAD_ON_UPDATE) === '1';

		$published = $new_status === 'publish';
		$updated = $old_status === 'publish';

		$only_on_publish = $on_publish && !$on_update;
		$only_on_update = !$on_publish && $on_update;
		$on_update_and_publish = $on_publish && $on_update;

		if ($only_on_publish && $published && !$updated) return true;
		if ($only_on_update && $published && $updated) return true;
		if ($on_update_and_publish && $published) return true;

		return false;
	}

	public function sample_admin_notice__error() {
    $class = 'notice notice-error';
    $message = 'Irks! An error has occurred.';
 
    printf( '<div class="%1$s"><p>%2$s</p></div>', esc_attr( $class ), esc_html( $message ) ); 
	}
}
