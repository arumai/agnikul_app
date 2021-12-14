// Copyright (c) 2021, Vigneshwaran Arumainayagam and contributors
// For license information, please see license.txt

frappe.ui.form.on('Sourcing Request', {
	refresh: function(frm) {
		if (!frm.doc.__islocal) {
			frm.add_custom_button(__('Update Specifications'), function() {
				frappe.confirm(__("Do you want to create new and use the updated Specification for this Request?"), function () {
					frappe.call({
						"method": "agnikul.agnikul.doctype.sourcing_request.sourcing_request.create_updated_spec",
						"args": {
							"spec": frm.doc.specification_sheet
						},
						callback: function (r) {
							frm.set_value("specification_sheet", r.message);
							frm.save();
							frappe.set_route('Form', 'Specification Sheet', r.message);
						}
					})
				})
				
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
