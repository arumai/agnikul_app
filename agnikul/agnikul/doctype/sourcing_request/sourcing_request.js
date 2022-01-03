// Copyright (c) 2021, Vigneshwaran Arumainayagam and contributors
// For license information, please see license.txt

frappe.ui.form.on('Sourcing Request', {
	refresh: function(frm) {
		if (frm.doc.__islocal && frm.doc.docstatus == 0 && frappe.session.user != "Administrator") {
			frappe.call({
				"method": "agnikul.agnikul.doctype.sourcing_request.sourcing_request._get_employee_from_user",
				"args": {
					"user": frappe.session.user
				},
				"callback": function (r) {
					frm.set_value("raised_by", r.message.name)
				}
			})
		}
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
			if (frappe.user.has_role('Stock Manager')) {
				frm.add_custom_button(__('New Component'), function() {
					frm.set_value("sourcing_status", "New Component");
					frm.savesubmit();
				}, __('Set Sourcing Status'));
				frm.add_custom_button(__('Existing Component'), function() {
					frm.set_value("sourcing_status", "Existing Component");
					frm.savesubmit();
				}, __('Set Sourcing Status'));
				frm.add_custom_button(__('Available In Inventory'), function() {
					frm.set_value("sourcing_status", "Available In Inventory");
					frm.savesubmit();
				}, __('Set Sourcing Status'));
				frm.add_custom_button(__('No Enough Data'), function() {
	
				}, __('Set Sourcing Status'));
				// frm.add_custom_button(__('Product Found'), function() {
	
				// }, __('Set Sourcing Status'));
				frm.add_custom_button(__('No Visible Progress'), function() {
	
				}, __('Set Sourcing Status'));
			}
			
			if (frappe.user.has_role('System Manager')) {
				frm.add_custom_button(__('Decline'), function() {
					frm.set_value("request_status", "Decline");
					frm.savesubmit();
				}, __('Set Request Status'));
				frm.add_custom_button(__('Approve'), function() {
					frm.set_value("request_status", "Approved");
					frm.savesubmit();
				}, __('Set Request Status'));
				frm.add_custom_button(__('Close'), function() {
					frm.set_value("request_status", "Closed");
					frm.savesubmit();
				}, __('Set Request Status'));
			}
			
		}
		if (frm.doc.sourcing_status == 'Available In Inventory' && frm.doc.request_status == 'Approved') {
			frm.add_custom_button(__('Material Request'), function() {
				if (frm.doc.sourcing_type == "Default") {
					frappe.model.open_mapped_doc({
						method: "agnikul.agnikul.doctype.sourcing_request.sourcing_request.create_material_request",
						frm: frm
					});
				} else if (frm.doc.sourcing_type == "Emergency") {
					
				}
			}, __('Create'));
		}
		if (frm.doc.sourcing_status == 'New Component' || frm.doc.sourcing_status == "Existing Component" && frm.doc.request_status == 'Pending') {
			frm.add_custom_button(__('Material Request'), function() {
				if (frm.doc.sourcing_type == "Default") {
					frappe.model.open_mapped_doc({
						method: "agnikul.agnikul.doctype.sourcing_request.sourcing_request.create_material_request_purchase",
						frm: frm
					});
				} else if (frm.doc.sourcing_type == "Emergency") {
					
				}
			}, __('Create'));
		}
	}
});
