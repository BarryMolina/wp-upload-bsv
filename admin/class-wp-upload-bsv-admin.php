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
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;
		$this->load_dependencies();

	}

	private function load_dependencies() {
		// Load html-to-markdown
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'vendor/autoload.php';
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

		// Only enqueue script on tools page
		if ('tools_page_wpbsv_upload' !== $hook) {
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
					'transaction' => rest_url('wpbsv-upload-bsv/v1/transaction'),
				),
      )
    );
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
			<div id="wpbsv-admin-panel-svelte"></div>
			<div id="wpbsv-admin-panel"></div>
			<div id="wpbsv-auto-upload"></div>
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

	public function sendTransaction($content, $prefix='', $file_type='', $encoding='') {
		

		
		return true;
	}

	/**
	 * Endpoint to receive post ids from admin panel
	 *
	 * @param array $request 
	 * @return bool 
	 */
	public function bsv_api_proxy($request) {
		// The JSON object sent from admin panel
		$postData = $request->get_json_params();

		foreach ($postData['posts'] as $post_id) {


			// print_r(get_post($post, ARRAY_A));
		}
		// return $this->sendTransaction()
		return true;
	}

	// 
	/**
	 * Register the transaction endpoint
	 *
	 * @return void
	 */
	public function register_bsv_api() {
		register_rest_route('wpbsv-upload-bsv/v1', '/transaction', array(
			// POST request
			'methods' => WP_REST_Server::CREATABLE,
			'callback' => array($this, 'bsv_api_proxy'),
			// Validation callback
			'args' => array(
				'posts' => array(
					'validate_callback' => function($posts) {
						return !empty($posts);
					}
				),
			),
			// Authorization
			// 'permission_callback' => function() {
			// 	return current_user_can( 'publish_posts' );
			// }
			'permission_callback' => '__return_true'
		));
	}
	public function markdown_test() {

		$markdown = $this->markdown_from_id(55);

		// POST markdown to api
		$response = wp_remote_post ('http://localhost:9999/', array(
			'headers'     => array('Content-Type' => 'application/json; charset=utf-8'),
			'body'        => json_encode(['data' => $markdown]),
			'method'      => 'POST',
			'data_format' => 'body',
		));
		if ( is_wp_error( $response ) ) {
			$error_message = $response->get_error_message();
			echo "Something went wrong: $error_message";
		} else {
			echo 'Response:<pre>';
			print_r( $response['body'] );
			echo '</pre>';
		}
	}

	/**
	 * Retrieve post by id and convert to markdown
	 *
	 * @param 		int 		$post_id			The id of the post
	 * @return 		string								The post markdown
	 */
	public function markdown_from_id($post_id) {
		$post = get_post($post_id, OBJECT, 'display');
		return $this->markdown_from_post($post);
	}

	/**
	 * Create markdown from post object
	 *
	 * @param 		WP_Post 		$post					The post to convert
	 * @return 		string 			$markdown			The post markdown
	 */
	private function markdown_from_post($post) {

		$title = get_the_title($post);

		$meta = array(
			'title' 				=> $title,
			'author' 				=> get_the_author_meta('display_name', $post->post_author),
			'slug' 					=> $post->post_name,
			'published_gmt' => $post->post_date_gmt,
			'modified_gmt' 	=> $post->post_modified_gmt,
			'tx_date_gmt' 	=> gmdate('Y-m-d H:i:s'),
		);

		// Build frontmatter
		$frontmatter = '<!--';
		foreach ($meta as $key => $value) {
			$frontmatter .= "\n$key: \"$value\"";
		}
		$frontmatter .= "\n-->\n\n";

		// Set converter options
		$converter_options = array(
			'strip_tags' => true,
		);
		// Instantiate converter
		$converter = new League\HTMLToMarkdown\HtmlConverter($converter_options);

		// Title markdown
		$title_md = "# $title\n\n";

		// Content to markdown
		$content = apply_filters('the_content', $post->post_content);
		$markdown = $converter->convert($content);

		return $frontmatter . $title_md . $markdown;
	}

	/**
	 * Retrieve JSON post data from WP rest API
	 *
	 * @param 	int 			$post_id 				The post id
	 * @return 	string 		$post						The JSON post data
	 */
	private function get_post_json($post_id) {
		$response = wp_remote_get(rest_url("wp/v2/posts/$post_id"));
    $code = wp_remote_retrieve_response_code($response);

    // Check if bad request
    if ($code < 200 || $code >= 400) {
      $body = wp_remote_retrieve_body($response);
      $out = new WP_Error($code ,$body);
    }
    else {
      $out = $response;
    }

		if (is_wp_error($out)) {
      return false;
    }

		// Parse post data into associative array
    // $post = json_decode($out['body'], true);

		// Get body
    $post = $out['body'];

    return $post;
	}
}
