<?php

/**
 * Fired during plugin activation
 *
 * @link       https://github.com/BarryMolina
 * @since      1.0.0
 *
 * @package    Wp_Upload_Bsv
 * @subpackage Wp_Upload_Bsv/includes
 */

/**
 * Fired during plugin activation.
 *
 * This class defines all code necessary to run during the plugin's activation.
 *
 * @since      1.0.0
 * @package    Wp_Upload_Bsv
 * @subpackage Wp_Upload_Bsv/includes
 * @author     Barry Molina <bazzaboy@gmail.com>
 */
class Wp_Upload_Bsv_Activator {

	/**
	 * Short Description. (use period)
	 *
	 * Long Description.
	 *
	 * @since    1.0.0
	 */
	public static function activate() {
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-wp-upload-bsv-db.php';
		$db = new Wp_Upload_Bsv_DB;
		global $wpdb;

		// $table_name = $wpdb->prefix . "bsv_transactions";
		$table_name = $db->get_tx_table();

		$charset_collate = $wpdb->get_charset_collate();

		$sql = "CREATE TABLE $table_name (
			id mediumint(9) NOT NULL AUTO_INCREMENT,
			post_id bigint(20) NOT NULL,
			tx_id char(64) NOT NULL,
			prefix varchar(65) DEFAULT '' NOT NULL,
			time datetime DEFAULT '0000-00-00 00:00:00' NOT NULL,
			PRIMARY KEY  (id)
		) $charset_collate;";

		require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
		dbDelta($sql);

		// Set default prefix to B://
		add_option($db::DEFAULT_PREFIXES, array('19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut'));
	}
}
