<?php

/**
 * Manages the API endpoints for the plugin
 *
 * @link       https://github.com/BarryMolina
 * @since      1.0.0
 *
 * @package    Wp_Upload_Bsv
 * @subpackage Wp_Upload_Bsv/admin
 */

/**
 * Manages the API endpoints for the plugin
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Wp_Upload_Bsv
 * @subpackage Wp_Upload_Bsv/admin
 * @author     Barry Molina <bazzaboy@gmail.com>
 */
class Wp_Upload_Bsv_API_Controller {

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
	 * Register api endpoints
	 *
	 * @return void
	 */
	public function register_endpoints() {
		// POST transactions
		register_rest_route('wpbsv/v1', '/transactions', array(
			'methods' => WP_REST_Server::CREATABLE,
			'callback' => array($this, 'handle_post_transactions'),
			// Validation callback
			// 'args' => array(
			// 	'posts' => array(
			// 		'validate_callback' => function($posts) {
			// 			return !empty($posts);
			// 		}
			// 	),
			// ),
			// Authorization
			// 'permission_callback' => function() {
			// 	return current_user_can( 'publish_posts' );
			// }
			'permission_callback' => '__return_true'
		));

		// GET transactions
		register_rest_route('wpbsv/v1', '/transactions', array(
			'methods' => 'GET',
			'callback' => array($this, 'handle_get_transactions'),
			'permission_callback' => '__return_true'
		));
	}

	/**
	 * GET endpoint to retrieve transaction data from db
	 *
	 * @return 	JSON 			$transactions 				All transactions found in the database
	 */
	public function handle_get_transactions() {
		global $wpdb;
		$tx_table_name = $this->db->get_tx_table();
		
		$query = "SELECT * FROM $tx_table_name ORDER BY time ASC";
		$transactions = $wpdb->get_results($query);
		return $transactions;
	}

	/**
	 * POST endpoint to upload posts to BSV
	 *
	 * @param 		array 			$request  					POST request containing post data
	 * @return 		JSON/bool		$response_data			The info for each transaction if successful, else false 			
	 */
	public function handle_post_transactions($request) {
		// Get the parsed JSON request body as array
		$postData = $request->get_json_params();

		// return $postData;
		// return new WP_Error('error_code', 'this is an error', array('status' => 401) );
		// return new WP_REST_Response(['data' => ['error' => 'no posts']], 400);

		$response = $this->tx_builder->send_many($postData);
		return $response;

		// if (!is_wp_error($response)) {
		// 	return $response
		// }
	}
}
