<?php

/**
 * The file that defines the core plugin class
 *
 * A class definition that includes attributes and functions used across both the
 * public-facing side of the site and the admin area.
 *
 * @link       https://github.com/BarryMolina
 * @since      1.0.0
 *
 * @package    Wp_Upload_Bsv
 * @subpackage Wp_Upload_Bsv/includes
 */

/**
 * The core plugin class.
 *
 * This is used to define internationalization, admin-specific hooks, and
 * public-facing site hooks.
 *
 * Also maintains the unique identifier of this plugin as well as the current
 * version of the plugin.
 *
 * @since      1.0.0
 * @package    Wp_Upload_Bsv
 * @subpackage Wp_Upload_Bsv/includes
 * @author     Barry Molina <bazzaboy@gmail.com>
 */
class Wp_Upload_Bsv {

	/**
	 * The loader that's responsible for maintaining and registering all hooks that power
	 * the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      Wp_Upload_Bsv_Loader    $loader    Maintains and registers all hooks for the plugin.
	 */
	protected $loader;

	/**
	 * The unique identifier of this plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $plugin_name    The string used to uniquely identify this plugin.
	 */
	protected $plugin_name;

	/**
	 * The current version of the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $version    The current version of the plugin.
	 */
	protected $version;

	/**
	 * Define the core functionality of the plugin.
	 *
	 * Set the plugin name and the plugin version that can be used throughout the plugin.
	 * Load the dependencies, define the locale, and set the hooks for the admin area and
	 * the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function __construct() {
		if ( defined( 'WP_UPLOAD_BSV_VERSION' ) ) {
			$this->version = WP_UPLOAD_BSV_VERSION;
		} else {
			$this->version = '1.0.0';
		}
		$this->plugin_name = 'wp-upload-bsv';

		$this->load_dependencies();
		$this->set_locale();
		$this->define_admin_hooks();
		$this->define_public_hooks();

	}

	/**
	 * Load the required dependencies for this plugin.
	 *
	 * Include the following files that make up the plugin:
	 *
	 * - Wp_Upload_Bsv_Loader. Orchestrates the hooks of the plugin.
	 * - Wp_Upload_Bsv_i18n. Defines internationalization functionality.
	 * - Wp_Upload_Bsv_Admin. Defines all hooks for the admin area.
	 * - Wp_Upload_Bsv_Public. Defines all hooks for the public side of the site.
	 *
	 * Create an instance of the loader which will be used to register the hooks
	 * with WordPress.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function load_dependencies() {

		/**
		 * The class responsible for orchestrating the actions and filters of the
		 * core plugin.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-wp-upload-bsv-loader.php';

		/**
		 * The class responsible for defining internationalization functionality
		 * of the plugin.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-wp-upload-bsv-i18n.php';

		/**
		 * The class responsible for defining all actions that occur in the admin area.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'admin/class-wp-upload-bsv-admin.php';

		/**
		 * The class responsible for defining the tools page.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'admin/class-wp-upload-bsv-tools.php';

		/**
		 * The class responsible for defining the settings page.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'admin/class-wp-upload-bsv-settings.php';

		/**
		 * The class responsible for defining the additional API endpoints
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'admin/class-wp-upload-bsv-api-controller.php';

		/**
		 * The class responsible for building and sending transactions
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'admin/class-wp-upload-bsv-tx-builder.php';

		/**
		 * The class responsible for defining all actions that occur in the public-facing
		 * side of the site.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'public/class-wp-upload-bsv-public.php';

		$this->loader = new Wp_Upload_Bsv_Loader();

	}

	/**
	 * Define the locale for this plugin for internationalization.
	 *
	 * Uses the Wp_Upload_Bsv_i18n class in order to set the domain and to register the hook
	 * with WordPress.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function set_locale() {

		$plugin_i18n = new Wp_Upload_Bsv_i18n();

		$this->loader->add_action( 'plugins_loaded', $plugin_i18n, 'load_plugin_textdomain' );

	}

	/**
	 * Register all of the hooks related to the admin area functionality
	 * of the plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function define_admin_hooks() {

		$plugin_admin = new Wp_Upload_Bsv_Admin( $this->get_plugin_name(), $this->get_version() );
		$plugin_tools = new Wp_Upload_Bsv_Tools( $this->get_plugin_name(), $this->get_version() );
		$plugin_settings = new Wp_Upload_Bsv_Settings( $this->get_plugin_name(), $this->get_version() );
		$controller = new Wp_Upload_Bsv_API_Controller( $this->get_plugin_name(), $this->get_version() );

		// $this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_styles' );

		// Tools page
		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_tools, 'enqueue_scripts' );
		$this->loader->add_action( 'admin_menu', $plugin_tools, 'setup_plugin_management_menu' );

		// Settings page
		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_settings, 'enqueue_scripts' );
		$this->loader->add_action( 'admin_menu', $plugin_settings, 'setup_plugin_management_menu' );
		$this->loader->add_action( 'admin_init', $plugin_settings, 'initialize_plugin_settings' );
		$this->loader->add_action( 'wp_ajax_wpbsv_default_prefixes', $plugin_settings, 'save_default_prefixes');

		// API Controller endpoints
		$this->loader->add_action( 'rest_api_init', $controller, 'register_endpoints' );

		// Auto upload posts
		$this->loader->add_action( 'transition_post_status', $plugin_admin, 'auto_upload_post', 10, 3 );
	}

	/**
	 * Register all of the hooks related to the public-facing functionality
	 * of the plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function define_public_hooks() {

		$plugin_public = new Wp_Upload_Bsv_Public( $this->get_plugin_name(), $this->get_version() );

		$this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_styles' );
		$this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_scripts' );

	}

	/**
	 * Run the loader to execute all of the hooks with WordPress.
	 *
	 * @since    1.0.0
	 */
	public function run() {
		$this->loader->run();
	}

	/**
	 * The name of the plugin used to uniquely identify it within the context of
	 * WordPress and to define internationalization functionality.
	 *
	 * @since     1.0.0
	 * @return    string    The name of the plugin.
	 */
	public function get_plugin_name() {
		return $this->plugin_name;
	}

	/**
	 * The reference to the class that orchestrates the hooks with the plugin.
	 *
	 * @since     1.0.0
	 * @return    Wp_Upload_Bsv_Loader    Orchestrates the hooks of the plugin.
	 */
	public function get_loader() {
		return $this->loader;
	}

	/**
	 * Retrieve the version number of the plugin.
	 *
	 * @since     1.0.0
	 * @return    string    The version number of the plugin.
	 */
	public function get_version() {
		return $this->version;
	}

}
