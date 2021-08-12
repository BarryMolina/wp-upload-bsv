<?php

/**
 * Builds and sends transactions via external API
 *
 * @link       https://github.com/BarryMolina
 * @since      1.0.0
 *
 * @package    Wp_Upload_Bsv
 * @subpackage Wp_Upload_Bsv/admin
 */

/**
 * Builds and sends transactions via external API
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Wp_Upload_Bsv
 * @subpackage Wp_Upload_Bsv/admin
 * @author     Barry Molina <bazzaboy@gmail.com>
 */
class Wp_Upload_Bsv_Tx_Builder {

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
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct() {

		$this->load_dependencies();

		// $this->plugin_name = $plugin_name;
		// $this->version = $version;

		$this->db = new Wp_Upload_Bsv_DB;
	}

	private function load_dependencies() {
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-wp-upload-bsv-db.php';
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'vendor/autoload.php';
	}

	function sample_admin_notice__error() {
    $class = 'notice notice-error';
    $message = __( 'Irks! An error has occurred.', 'sample-text-domain' );
 
    printf( '<div class="%1$s"><p>%2$s</p></div>', esc_attr( $class ), esc_html( $message ) ); 
	}

	public function send_one($post_id) {
		$prefixes = array('19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut', 'gendale.net');
		// $prefixes = array('gendale.net');
		// $prefixes = get_option($this->db::DEFAULT_PREFIXES);

		$markdown = $this->markdown_from_id($post_id);

		$data_to_send = array();

		foreach ($prefixes as $prefix) {
			// Build new tx data for each prefix
			$tx_data = $this->build_tx_data($markdown, $prefix, 'text/markdown', 'utf-8');
			// Link tx data to post id
			$data_to_send[$post_id][] = $tx_data;
		}

		$response = $this->send_transaction($data_to_send);
		
		// If transaction was successful
		if (!is_wp_error($response)) {
			// Parse the txid data
			$post_txids = json_decode($response['body'], true);
			
			// Create entries in transactions table
			foreach ($post_txids[$post_id] as $i => $txid) {
					$this->db->insert_tx($post_id, $txid, $prefixes[$i], current_time('mysql'));
			}
		}
	}

	public function send_many($postData) {
		if (empty($postData['postIds'])) {
      return new WP_Error('missing_posts', 'Post data must be in the form [postIds] => [0, 1, 2]', array('status' => 400));
		}

		$data_to_send = array();

		foreach ($postData['postIds'] as $post_id) {
			$markdown = $this->markdown_from_id($post_id);

			// Initialize array for this post
			$data_to_send[$post_id] = array();
			
			foreach ($postData['prefixes'] as $prefix) {
				// Build data for each transaction
				$tx_data = $this->build_tx_data($markdown, $prefix, 'text/markdown', 'utf-8');

				// Link tx data to post
				$data_to_send[$post_id][] = $tx_data;
			}
		}
		// Send transaction
		$response = $this->send_transaction($data_to_send);


		// If transaction was successful
		if (!is_wp_error($response)) {
			// Parse the txid data
			$post_txids = json_decode($response['body'], true);
			
			$response_data = array();
			// Create entries in transactions table
			foreach ($post_txids as $post_id => $txids) {
				for ($i = 0; $i < count($txids); $i++) {
					$tx_info = $this->db->insert_tx($post_id, $txids[$i], $postData['prefixes'][$i], current_time('mysql'));
					$response_data[] = $tx_info;
				}
			}
			// Automatically converts array to JSON
			return $response_data;
		}
		return $response;
	}
	/**
	 * Build BSV transaction data
	 *
	 * @param 	string 							$content			The data to send
	 * @param 	string 							$prefix				Optional prefix
	 * @param 	string 							$file_type		Optional file type
	 * @param 	string 							$encoding			Optional encoding
	 * @return 	array															The transaction data
	 */
	private function build_tx_data($content, $prefix='', $file_type='', $encoding='') {
		$data = array($prefix, $content, $file_type, $encoding);
		// Remove falsy elements
		array_filter($data);

		// Check that data exists
		if (empty($data)) {
			return new WP_Error('empty', 'Transaction contains no data');
		}

		return $data;
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
	 * Sends data off to external api for upload to bsv
	 *
	 * @param 				array 				$data					An associative array of post ids and the data to send
	 * @return 	array|WP_Error 			$out 					The response or WP_Error on failure
	 */
	public function send_transaction($data) {

		$response = wp_remote_post ('http://localhost:9999/buildfile', array(
			'method'      => 'POST',
			'timeout'			=> 120,
			'headers'     => array('Content-Type' => 'application/json; charset=utf-8'),
			'body'        => json_encode(['data' => $data]),
			'data_format' => 'body',
		));

    $code = wp_remote_retrieve_response_code($response);

    // Check if bad request
    if (!empty($code) && ( $code < 200 || $code >= 400 )) {
			// echo 'running code is ' . $code . 'that was the code';
      $body = wp_remote_retrieve_body($response);
      // $out = new WP_Error($code, $body);
      $out = new WP_Error($code, $response, array('status' => $code));
    }
    else {
      $out = $response;
    }
		return $out;
	}
}