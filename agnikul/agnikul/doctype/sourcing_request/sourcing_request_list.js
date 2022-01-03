// Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
// MIT License. See license.txt

frappe.listview_settings['Sourcing Request'] = {
	add_fields: ["sourcing_status", "request_status"],
	get_indicator: function(doc) {
		if(doc.request_status == "Pending") {
			return [__("Pending"), "grey", "enabled,=,0"];
		} else {
			return [__("Active"), "green", "enabled,=,1"];
		}
	}
};

