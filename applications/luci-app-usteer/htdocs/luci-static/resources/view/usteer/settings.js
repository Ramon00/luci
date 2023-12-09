'use strict';
'require view';
'require form';
'require uci';
'require tools.widgets as widgets';


return view.extend({

	render: function (data) {
		var m, s, o;
		m = new form.Map('usteer', _('Usteer'),
			_('See <a %s>documentation</a>').format('href="https://openwrt.org/docs/guide-user/network/wifi/usteer"')
		);

		s = m.section(form.TypedSection, 'usteer', _('Settings'),
			_('The first four options below are mandatory.') + ' ' +
			_('Also be sure to enable rrm reports, 80211kv, etc.')
		);
		s.anonymous = true;

		o = s.option(widgets.NetworkSelect, 'network', _('Network'),
			_('The network interface for inter-AP communication')
		);
		o.multiple = false;
		o.nocreate = true;

		o = s.option(form.Flag, 'syslog', _('Syslog'),
			_('Log messages to syslog')
		);
		o.default = '1';
		o.rmempty = false;

		o = s.option(form.Flag, 'ipv6', _('IPv6 mode'),
			_('Use IPv6 for remote exchange')
		);
		o.rmempty = false;

		o = s.option(form.ListValue, 'debug_level', _('Debug level'));
		o.placeholder = 'lan';
		o.value('0', _('Fatal'));
		o.value('1', _('Info'));
		o.value('2', _('Verbose'));
		o.value('3', _('Some debug'));
		o.value('4', _('Network packet info'));
		o.value('5', _('All debug messages'));
		o.rmempty = false;

		o = s.option(form.Value, 'max_neighbour_reports', _('Max neighbour reports'),
			_('Maximum number of neighbor reports set for a node')
		);
		o.optional = true;
		o.placeholder = 8;
		o.datatype = 'uinteger';

		o = s.option(form.Value, 'sta_block_timeout', _('Sta block timeout'),
			_('Maximum amount of time (ms) a station may be blocked due to policy decisions')
		);
		o.optional = true;
		o.placeholder = 30000;
		o.datatype = 'uinteger';

		o = s.option(form.Value, 'local_sta_timeout', _('Local STA timeout'),
			_('Maximum amount of time (ms) a local unconnected station is tracked')
		);
		o.optional = true;
		o.placeholder = 12000;
		o.datatype = 'uinteger';

		o = s.option(form.Value, 'measurement_report_timeout', _('Measurement report timeout'),
			_('Maximum amount of time (ms) a measurement report is stored')
		);
		o.optional = true;
		o.placeholder = 120000;
		o.datatype = 'uinteger';

		o = s.option(form.Value, 'local_sta_update', _('Local STA update'),
			_('Local station information update interval (ms)')
		);
		o.optional = true;
		o.placeholder = 1000;
		o.datatype = 'uinteger';

		o = s.option(form.Value, 'max_retry_band', _('Max retry band'),
			_('Maximum number of consecutive times a station may be blocked by policy')
		);
		o.optional = true;
		o.placeholder = 5;
		o.datatype = 'uinteger';

		o = s.option(form.Value, 'seen_policy_timeout', _('Seen policy timeout'),
			_('Maximum idle time of a station entry (ms) to be considered for policy decisions')
		);
		o.optional = true;
		o.placeholder = 30000;
		o.datatype = 'uinteger';

		o = s.option(form.Value, 'load_balancing_threshold', _('Load balancing threshold'),
			_('Minimum number of stations delta between APs before load balancing policy is active')
		);
		o.optional = true;
		o.placeholder = 0;
		o.datatype = 'uinteger';

		o = s.option(form.Value, 'band_steering_threshold', _('Band steering threshold'),
			_('Minimum number of stations delta between bands before band steering policy is active')
		);
		o.optional = true;
		o.placeholder = 5;
		o.datatype = 'uinteger';

		o = s.option(form.Value, 'remote_update_interval', _('Remote update interval'),
			_('Interval (ms) between sending state updates to other APs')
		);
		o.optional = true;
		o.placeholder = 1000;
		o.datatype = 'uinteger';

		o = s.option(form.Value, 'remote_node_timeout', _('Remote node timeout'),
			_('Number of remote update intervals after which a remote-node is deleted')
		);
		o.optional = true;
		o.placeholder = 10;
		o.datatype = 'uinteger';

		o = s.option(form.Flag, 'assoc_steering', _('Assoc steering'),
			_('Allow rejecting assoc requests for steering purposes')
		);
		o.optional = true;

		o = s.option(form.Flag, 'probe_steering', _('Probe steering'),
			_('Allow ignoring probe requests for steering purposes')
		);
		o.optional = true;

		o = s.option(form.Value, 'min_connect_snr', _('Min connect SNR'),
			_('Minimum signal-to-noise ratio or signal level (dBm) to allow connections')
		);
		o.optional = true;
		o.placeholder = 0;
		o.datatype = 'integer';

		o = s.option(form.Value, 'min_snr', _('Min SNR'),
			_('Minimum signal-to-noise ratio or signal level (dBm) to remain connected')
		);
		o.optional = true;
		o.placeholder = 0;
		o.datatype = 'integer';

		o = s.option(form.Value, 'min_snr_kick_delay', _('Min SNR kick delay'),
			_('Timeout after which a station with SNR < min_SNR will be kicked')
		);
		o.optional = true;
		o.placeholder = 5000;
		o.datatype = 'uinteger';

		o = s.option(form.Value, 'roam_process_timeout', _('Roam process timeout'),
			_('Timeout (in ms) after which a association following a disassociation is not seen as a roam')
		);
		o.optional = true;
		o.placeholder = 5000;
		o.datatype = 'uinteger';

		o = s.option(form.Value, 'roam_scan_snr', _('Roam scan SNR'),
			_('Minimum signal-to-noise ratio or signal level (dBm) before attempting to trigger client scans for roam')
		);
		o.optional = true;
		o.placeholder = 0;
		o.datatype = 'integer';

		o = s.option(form.Value, 'roam_scan_tries', _('Roam scan tries'),
			_('Maximum number of client roaming scan trigger attempts')
		);
		o.optional = true;
		o.placeholder = 3;
		o.datatype = 'uinteger';

		o = s.option(form.Value, 'roam_scan_timeout', _('Roam scan timeout'),
			_('Retry scanning when roam_scan_tries is exceeded after this timeout (in ms).') + '<br />' +
			_('In case this option is disabled, the client is kicked instead')
		);
		o.optional = true;
		o.placeholder = 0;
		o.datatype = 'uinteger';

		o = s.option(form.Value, 'roam_scan_interval', _('Roam scan interval'),
			_('Minimum time (ms) between client roaming scan trigger attempts')
		);
		o.optional = true;
		o.placeholder = 10000;
		o.datatype = 'uinteger';

		o = s.option(form.Value, 'roam_trigger_snr', _('Roam trigger SNR'),
			_('Minimum signal-to-noise ratio or signal level (dBm) before attempting to trigger forced client roaming')
		);
		o.optional = true;
		o.placeholder = 0;
		o.datatype = 'integer';

		o = s.option(form.Value, 'roam_trigger_interval', _('Roam trigger interval'),
			_('Minimum time (ms) between client roaming trigger attempts')
		);
		o.optional = true;
		o.placeholder = 60000;
		o.datatype = 'uinteger';

		o = s.option(form.Value, 'roam_kick_delay', _('Roam kick delay'),
			_('Timeout (in 100ms beacon intervals) for client roam requests')
		);
		o.optional = true;
		o.placeholder = 100;
		o.datatype = 'uinteger';

		o = s.option(form.Value, 'signal_diff_threshold', _('Signal diff threshold'),
			_('Minimum signal strength difference until AP steering policy is active')
		);
		o.optional = true;
		o.placeholder = 0;
		o.datatype = 'uinteger';

		o = s.option(form.Value, 'initial_connect_delay', _('Initial connect delay'),
			_('Initial delay (ms) before responding to probe requests (to allow other APs to see packets as well)')
		);
		o.optional = true;
		o.placeholder = 0;
		o.datatype = 'uinteger';

		o = s.option(form.Flag, 'load_kick_enabled', _('Load kick enabled'),
			_('Enable kicking client on excessive channel load')
		);
		o.optional = true;

		o = s.option(form.Value, 'load_kick_threshold', _('Load kick threshold'),
			_('Minimum channel load (%) before kicking clients')
		);
		o.optional = true;
		o.placeholder = 75;
		o.datatype = 'uinteger';

		o = s.option(form.Value, 'load_kick_delay', _('Load kick delay'),
			_('Minimum amount of time (ms) that channel load is above threshold before starting to kick clients')
		);
		o.optional = true;
		o.placeholder = 10000;
		o.datatype = 'uinteger';

		o = s.option(form.Value, 'load_kick_min_clients', _('Load kick min clients'),
			_('Minimum number of connected clients before kicking based on channel load')
		);
		o.optional = true;
		o.placeholder = 10;
		o.datatype = 'uinteger';

		o = s.option(form.Value, 'load_kick_reason_code', _('Load kick reason code'),
			_('Reason code on client kick based on channel load.') + '<br />' +
			_('Default: %s').format('<code>WLAN_REASON_DISASSOC_AP_BUSY</code>')
		);
		o.optional = true;
		o.placeholder = 5;
		o.datatype = 'uinteger';

		o = s.option(form.Value, 'band_steering_interval', _('Band steering interval'),
			_('Attempting to steer clients to a higher frequency-band every n ms.') + '<br />' +
			_('A value of 0 disables band-steering.')
		);
		o.optional = true;
		o.placeholder = 120000;
		o.datatype = 'uinteger';

		o = s.option(form.Value, 'band_steering_min_snr', _('Band steering min SNR'),
			_('Minimal SNR or absolute signal a device has to maintain over band_steering_interval to be steered to a higher frequency band.')
		);
		o.optional = true;
		o.placeholder = -60;
		o.datatype = 'integer';

		o = s.option(form.Value, 'link_measurement_interval', _('Link measurement interval'),
			_('Interval (ms) the device is sent a link-measurement request to help assess the bi-directional link quality.') + '<br />' +
			_('Setting the interval to 0 disables link-measurements.')
		);
		o.optional = true;
		o.placeholder = 30000;
		o.datatype = 'uinteger';

		o = s.option(form.Value, 'node_up_script', _('Node up script'),
			_('Script to run after bringing up a node')
		);
		o.optional = true;
		o.datatype = 'string';

		o = s.option(form.MultiValue, 'event_log_types', _('Event log types'),
			_('Message types to include in log.')
		);
		o.value('probe_req_accept');
		o.value('probe_req_deny');
		o.value('auth_req_accept');
		o.value('auth_req_deny');
		o.value('assoc_req_accept');
		o.value('assoc_req_deny');
		o.value('load_kick_trigger');
		o.value('load_kick_reset');
		o.value('load_kick_min_clients');
		o.value('load_kick_no_client');
		o.value('load_kick_client');
		o.value('signal_kick');
		o.optional = true;
		o.datatype = 'list(string)';

		o = s.option(form.DynamicList, 'ssid_list', _('SSID list'),
			_('List of SSIDs to enable steering on')
		);
		o.optional = true;
		o.datatype = 'list(string)';

		return m.render();
	},

});
