<?php
/**
 * The database accessor class.
 *
 * This is used to interface with the database.
 *
 * Also maintains the custom table names.
 *
 * @since      1.0.0
 * @package    Wp_Upload_Bsv
 * @subpackage Wp_Upload_Bsv/includes
 * @author     Barry Molina <bazzaboy@gmail.com>
 */
class Wp_Upload_Bsv_DB {

	/**
	 * The name assigned to transactions table
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    TRANSACTION_TABLE    The name assigned to the transactions table

	 */
	public const TX_TABLE = 'bsv_transactions';

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of the plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct() {
  }

	/**
	 * Retrieve the transaction table name, including prefix
	 *
	 * @since    1.0.0
	 * @return   string      $events     The events response body
	 */
  public function get_tx_table() {
		global $wpdb;
		return $wpdb->prefix . self::TX_TABLE;
  }

	public function insert_tx($post_id, $tx_id, $bsv_prefix, $time) {
		global $wpdb;

		$tx_info = array(
			'post_id' => $post_id,
			'tx_id' => $tx_id,
			'prefix' => $bsv_prefix,
			'time' => $time,
		);

		// print_r($tx_info);
		$wpdb->insert(
			$wpdb->prefix . self::TX_TABLE,
			$tx_info
		);

		$tx_info['id'] = $wpdb->insert_id;

		return $tx_info;
	}
}

