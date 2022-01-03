// Copyright (c) 2021, Vigneshwaran Arumainayagam and contributors
// For license information, please see license.txt

frappe.ui.form.on('Sourcing Request', {
	refresh: function(frm) {
		if (!frm.doc.__islocal && frm.doc.docstatus == 0) {
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
		}
		if (!frm.doc.__islocal && frm.doc.docstatus == 1) {
			if (frappe.user.has_role('System Manager')) {
			
			}
			frm.add_custom_button(__('New Component'), function() {

			}, __('Set Sourcing Status'));
			frm.add_custom_button(__('Existing Component'), function() {

			}, __('Set Sourcing Status'));
			frm.add_custom_button(__('Already In Inventory'), function() {

			}, __('Set Sourcing Status'));
			frm.add_custom_button(__('No Enough Data'), function() {

			}, __('Set Sourcing Status'));
			frm.add_custom_button(__('Product Found'), function() {

			}, __('Set Sourcing Status'));
			frm.add_custom_button(__('No Visible Progress'), function() {

			}, __('Set Sourcing Status'));
			frm.add_custom_button(__('Decline'), function() {

			}, __('Set Request Status'));
			frm.add_custom_button(__('Approve'), function() {

			}, __('Set Request Status'));
			frm.add_custom_button(__('Close'), function() {

			}, __('Set Request Status'));
		}
	}
});
