// Copyright (c) 2021, Vigneshwaran Arumainayagam and contributors
// For license information, please see license.txt

frappe.ui.form.on('Sourcing Request', {
	refresh: function(frm) {
		if (!frm.doc.__islocal) {
			frm.add_custom_button(__('Update Specifications'), function() {
				frappe.call({
					method: "frappe.client.get",
					args: {
						doctype: "Specification Sheet",
						name: frm.doc.specification_sheet
					}
				}).then((r) => {
					r.message.specification_version = undefined;
					frappe.new_doc("Specification Sheet", r.message);
				});
			});
			frm.add_custom_button(__('Conference, Exhibitions, Related Tender-Vendor Databasse'), function() {
				alert("ASD");
			}, __('Search'));
			frm.add_custom_button(__('Internal Search Statement'), function() {
				alert("ASD");
			}, __('Search'));
			frm.add_custom_button(__('Market Search Statement'), function() {
				window.open("https://www.google.com/search?q="+frm.doc.requested_item+" suppliers");
			}, __('Search'));
		}
	}
});
