<?php

/**
 * Fired during plugin deactivation
 *
 * @link       https://github.com/BarryMolina
 * @since      1.0.0
 *
 * @package    Wp_Upload_Bsv
 * @subpackage Wp_Upload_Bsv/includes
 */

/**
 * Fired during plugin deactivation.
 *
 * This class defines all code necessary to run during the plugin's deactivation.
 *
 * @since      1.0.0
 * @package    Wp_Upload_Bsv
 * @subpackage Wp_Upload_Bsv/includes
 * @author     Barry Molina <bazzaboy@gmail.com>
 */
class Wp_Upload_Bsv_Deactivator {

	/**
	 * Short Description. (use period)
	 *
	 * Long Description.
	 *
	 * @since    1.0.0
	 */
	public static function deactivate() {
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-wp-upload-bsv-db.php';
		$db = new Wp_Upload_Bsv_DB;
		global $wpdb;
		$table_name = $db->get_tx_table();
		// $table_name = $wpdb->prefix . 'bsv_transactions';
		$wpdb->query("DROP TABLE IF EXISTS $table_name");
	}
}
