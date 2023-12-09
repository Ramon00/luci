'use strict';
'require view';
'require rpc';
'require poll';
'require dom';
'require ui';
'require form';
'require uci';

var Hosts, Remotehosts, Remoteinfo, Localinfo, Clients;

var HearingMap = form.DummyValue.extend({
	renderWidget: function () {
		var body = E([
			E('h3', _('Hearing map'))
		]);
		for (var mac in Clients) {
			var maciphost = '';
			maciphost = mac;
			var macUp = mac.toUpperCase();
			if (typeof Hosts[macUp] !== 'undefined') {
				if ((String(Hosts[macUp]['ipaddrs'][0]).length > 0) && (typeof Hosts[macUp]['ipaddrs'][0] !== 'undefined'))
					maciphost += '\u2003' + Hosts[macUp]['ipaddrs'];
				if ((String(Hosts[macUp]['name']).length > 0) && (typeof Hosts[macUp]['name'] !== 'undefined'))
					maciphost += '\u2003%h'.format(Hosts[macUp]['name']);
			}
			body.appendChild(
				E('h4', maciphost)
			);
			var client_table = E('table', {'class': 'table cbi-section-table'}, [
				E('tr', {'class': 'tr table-titles'}, [
					E('th', {'class': 'th', 'style': 'width:35%'}, _('IP & Interface','Combination of IP and interface name in usteer overview')),
					E('th', {'class': 'th', 'style': 'width:25%'}, _('SSID')),
					E('th', {'class': 'th', 'style': 'width:15%'}, _('Frequency','BSS operating frequency in usteer overview')),
					E('th', {'class': 'th', 'style': 'width:15%'}, _('Connected','Connection state in usteer overview')),
					E('th', {'class': 'th', 'style': 'width:15%'}, _('Signal','Signal strength reported by wireless station in usteer overview'))
				])
			]);
			var client_table_entries = [];
			for (var wlanc in Clients[mac]) {
				var SSID = '';
				var freq = 0;
				if (typeof Localinfo[wlanc] !== 'undefined') {
					SSID = Localinfo[wlanc]['ssid'];
					freq = Localinfo[wlanc]['freq'];
				}
				if (typeof Remoteinfo[wlanc] !== 'undefined') {
					SSID = Remoteinfo[wlanc]['ssid'];
					freq = Remoteinfo[wlanc]['freq'];
				}
				client_table_entries.push([
					'<nobr>' + wlanc + '</nobr>',
					SSID,
					freq,
					Clients[mac][wlanc]['connected'] === true ? 'Yes' : 'No',
					Clients[mac][wlanc]['signal']
				]);
			}
			cbi_update_table(client_table, client_table_entries, E('em', _('No data')));
			body.appendChild(client_table);
		}
		return E('div', {'class': 'cbi-section cbi-tblsection'}, [body]);
	}
});

var Clientinfooverview = form.DummyValue.extend({

	collectWlanAPInfos: function (compactconnectioninfo_table_entries, wlanAPInfos) {
		for (var wlan in wlanAPInfos) {
			var hostl = '';
			for (var mac in Clients) {
				if (typeof Clients[mac] !== 'undefined')
					if (typeof Clients[mac][wlan] !== 'undefined')
						if (String(Clients[mac][wlan]['connected']).valueOf() == String('true').valueOf()) {
							var foundname = mac;
							var macUp = mac.toUpperCase();
							if (typeof Hosts[macUp] !== 'undefined') {
								if ((String(Hosts[macUp]['ipaddrs'][0]).length > 0) && (typeof Hosts[macUp]['ipaddrs'][0] !== 'undefined')) {
									foundname = Hosts[macUp]['ipaddrs'][0];
								}
								if ((String(Hosts[macUp]['name']).length > 0) && (typeof Hosts[macUp]['name'] !== 'undefined')) {
									foundname = Hosts[macUp]['name'];
								}
							}
							hostl += '%h\u2003'.format(foundname);
						}
			}
			compactconnectioninfo_table_entries.push([
				'<nobr>'+wlan+'</nobr>', 
				wlanAPInfos[wlan]['ssid'],
				wlanAPInfos[wlan]['freq'],
				wlanAPInfos[wlan]['load'],
				wlanAPInfos[wlan]['n_assoc'],
				hostl
			]);
		}
	},

	collectWlanAPInfoEntries: function (connectioninfo_table_entries, wlanAPInfos) {
		for (var wlan in wlanAPInfos) {
			connectioninfo_table_entries.push([
				'<nobr>' + wlan + '</nobr>',
				wlanAPInfos[wlan]['bssid'],
				wlanAPInfos[wlan]['ssid'],
				wlanAPInfos[wlan]['freq'],
				wlanAPInfos[wlan]['n_assoc'],
				wlanAPInfos[wlan]['noise'],
				wlanAPInfos[wlan]['load'],
				wlanAPInfos[wlan]['max_assoc'],
				typeof wlanAPInfos[wlan]['roam_events']['source'] !== 'undefined' ? wlanAPInfos[wlan]['roam_events']['source'] : '',
				typeof wlanAPInfos[wlan]['roam_events']['target'] !== 'undefined' ? wlanAPInfos[wlan]['roam_events']['target'] : ''
			]);
		}
	},

	renderWidget: function () {
		var body = E([
			E('h3', _('Remote hosts'))
		]);
		var remotehost_table = E('table', {'class': 'table cbi-section-table'}, [
			E('tr', {'class': 'tr table-titles'}, [
				E('th', {'class': 'th'}, _('IP address')),
				E('th', {'class': 'th'}, _('Identifier'))
			])
		]);
		var remotehosttableentries = [];
		for (var IPaddr in Remotehosts) {
			remotehosttableentries.push([IPaddr, Remotehosts[IPaddr]['id']]);
		}
		cbi_update_table(remotehost_table, remotehosttableentries, E('em', _('No data')));
		body.appendChild(remotehost_table);
		body.appendChild(
			E('h3', _('Client list'))
		);
		var connectioninfo_table = E('table', {'class': 'table cbi-section-table'}, [
			E('tr', {'class': 'tr table-titles'}, [
				E('th', {'class': 'th'}, _('IP & Interface name','Combination of IP and interface name in usteer overview')),
				E('th', {'class': 'th'}, _('BSSID')),
				E('th', {'class': 'th'}, _('SSID')),
				E('th', {'class': 'th'}, _('Frequency','BSS operating frequency in usteer overview')),
				E('th', {'class': 'th'}, _('N','Number of associated clients in usteer overview')),
				E('th', {'class': 'th'}, _('Noise','Channel noise in usteer overview')),
				E('th', {'class': 'th'}, _('Load','Channel load in usteer overview')),
				E('th', {'class': 'th'}, _('Max assoc','Max associated clients in usteer overview')),
				E('th', {'class': 'th'}, _('Roam src','Roam source in usteer overview')),
				E('th', {'class': 'th'}, _('Roam tgt','Roam target in usteer overview'))
			])
		]);
		var connectioninfo_table_entries = [];
		this.collectWlanAPInfoEntries(connectioninfo_table_entries, Localinfo);
		this.collectWlanAPInfoEntries(connectioninfo_table_entries, Remoteinfo);

		cbi_update_table(connectioninfo_table, connectioninfo_table_entries, E('em', _('No data')));
		body.appendChild(connectioninfo_table);
		var compactconnectioninfo_table = E('table', {'class': 'table cbi-section-table'}, [
			E('tr', {'class': 'tr table-titles'}, [
				E('th', {'class': 'th'}, _('IP & Interface name', 'Combination of IP and interface name in usteer overview')),
				E('th', {'class': 'th'}, _('SSID')),
				E('th', {'class': 'th'}, _('Frequency', 'BSS operating frequency in usteer overview')),
				E('th', {'class': 'th'}, _('Load', 'Channel load in usteer overview')),
				E('th', {'class': 'th'}, _('N', 'Number of associated clients in usteer overview')),
				E('th', {'class': 'th'}, _('Host', 'host hint in usteer overview'))
			])
		]);
		var compactconnectioninfo_table_entries = [];
		this.collectWlanAPInfos(compactconnectioninfo_table_entries, Localinfo);
		this.collectWlanAPInfos(compactconnectioninfo_table_entries, Remoteinfo);
		cbi_update_table(compactconnectioninfo_table, compactconnectioninfo_table_entries, E('em', _('No data')));
		body.appendChild(compactconnectioninfo_table);
		return E('div', {'class': 'cbi-section cbi-tblsection'}, [body]);
	}
});


return view.extend({
	callHostHints: rpc.declare({
		object: 'luci-rpc',
		method: 'getHostHints',
		expect: {'': {}}
	}),
	callGetRemotehosts: rpc.declare({
		object: 'usteer',
		method: 'remote_hosts',
		expect: {'': {}}
	}),
	callGetRemoteinfo: rpc.declare({
		object: 'usteer',
		method: 'remote_info',
		expect: {'': {}}
	}),
	callGetLocalinfo: rpc.declare({
		object: 'usteer',
		method: 'local_info',
		expect: {'': {}}
	}),
	callGetClients: rpc.declare({
		object: 'usteer',
		method: 'get_clients',
		expect: {'': {}}
	}),
	load: function () {
		return Promise.all([
			rpc.list('usteer'),
			this.callHostHints().catch (function (){return null;}),
			this.callGetRemotehosts().catch (function (){return null;}),
			this.callGetRemoteinfo().catch (function (){return null;}),
			this.callGetLocalinfo().catch (function (){return null;}),
			this.callGetClients().catch (function (){return null;})
		]);
	},



	render: function (data) {
		Hosts = data[1];
		Remotehosts = data[2];
		Remoteinfo = data[3];
		Localinfo = data[4];
		Clients = data[5];

		var m, s, o;

		if (!('usteer' in data[0])) {
			m = new form.Map('usteer', _('Usteer'),
				_('Usteer is not running. Make sure it is installed and running.') + '<br />' +
				_('To start it running try %s').format('<code>/etc/init.d/usteer start</code>')
			);
			return m.render();
		}
		[m, s, o] = renderSettings(m, s, o);

		return m.render();
	},


	addFooter: function () {
		return null;
	},
});

function renderSettings(m, s, o) {
	m = new form.Map('usteer', _('Usteer'));

	s = m.section(form.TypedSection);
	s.anonymous = true;
	s.tab('status', _('Status'));
	s.tab('hearingmap', _('Hearing map'));

	o = s.taboption('status', Clientinfooverview);
	o.readonly = true;

	o = s.taboption('hearingmap', HearingMap);
	o.readonly = true;
	return [m, s, o];
}

