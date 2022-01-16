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
		if (frappe.user.has_role('Stock Manager') || frappe.user.has_role('Agnikul Founder') || frappe.user.has_role('Agnikul Operations Lead') || frappe.user.has_role('Agnikul Operations Systems Engineer')) {
			frm.fields_dict["table_16"].grid.wrapper.find(".grid-add-row").hide();
		}
		
	},
	setup: function (frm) {
		frm.set_indicator_formatter('requested_item',
			function(doc) {
				if (doc.sourcing_status == "Available In Inventory") {
					var indicator = 'orange';
				} 
				else if (doc.sourcing_status == "Pending") {
					var indicator = 'red';
				}
				else if (doc.sourcing_status == "Existing Component") {
					var indicator = 'pink';
				}
				else if (doc.sourcing_status == "New Component") {
					var indicator = 'blue';
				}
				return indicator
			}
		)
		frm.set_indicator_formatter('specification_sheet',
			function(doc) {
				if (doc.request_status == "Approved") {
					var indicator = 'green';
				} 
				else if (doc.request_status == "Closed") {
					var indicator = 'grey';
				}
				else if (doc.request_status == "Pending") {
					var indicator = 'red';
				}
				else if (doc.request_status == "Declined") {
					var indicator = 'red';
				}
				else if (doc.request_status == "Closed Without IIR") {
					var indicator = 'grey';
				}
				return indicator
			}
		)
		if (!frm.doc.__islocal && frm.doc.docstatus == 1) {
			if (frappe.user.has_role('Agnikul Founder')) {
				var adf = frappe.meta.get_docfield("Sourcing Request Item","update_specifications", frm.doc.name);
				adf.hidden = 1;
				var df = frappe.meta.get_docfield("Sourcing Request Item","request_status", frm.doc.name);
				df.read_only = 0;
				df.options = [ "Pending", "Declined", "Approved" ]
				frm.refresh_fields("table_16");
				frm.set_df_property('identified_vendors', 'cannot_add_rows', true);
				frm.set_df_property('identified_vendors', 'cannot_delete_rows', true);
			}
			if (frappe.user.has_role('Stock Manager') || frappe.user.has_role('Agnikul Operations Lead') || frappe.user.has_role('Agnikul Operations Systems Engineer')) {
				var adf = frappe.meta.get_docfield("Sourcing Request Item","update_specifications", frm.doc.name);
				adf.hidden = 1;
				var df = frappe.meta.get_docfield("Sourcing Request Item","sourcing_status", frm.doc.name);
				df.read_only = 0;
				if (frappe.user.has_role('Stock Manager')) {
					df.options = [ "Pending", "New Component", "Existing Component", "Available In Inventory" ]
				}
				frm.refresh_fields("table_16");
				frm.set_df_property('identified_vendors', 'cannot_add_rows', true);
				frm.set_df_property('identified_vendors', 'cannot_delete_rows', true);
			}
		}
	}
});

frappe.ui.form.on('Sourcing Request Item', {
	form_render: function(frm, cdt, cdn) {
		const d = locals[cdt][cdn];
		if (frappe.user.has_role('Stock Manager') || frappe.user.has_role('Agnikul Founder') || frappe.user.has_role('Agnikul Operations Lead') || frappe.user.has_role('Agnikul Operations Systems Engineer')) {
			frm.fields_dict["table_16"].grid.wrapper.find(".grid-insert-row").hide();
			frm.fields_dict["table_16"].grid.wrapper.find(".grid-delete-row").hide();
			frm.fields_dict["table_16"].grid.wrapper.find(".grid-insert-row-below").hide();
			frm.fields_dict["table_16"].grid.wrapper.find(".grid-duplicate-row").hide();
			frm.fields_dict["table_16"].grid.wrapper.find(".grid-move-row").hide();
			frm.fields_dict["table_16"].grid.wrapper.find(".grid-append-row").hide();
			frm.fields_dict["table_16"].grid.wrapper.find(".grid-remove-rows").hide();
		}
		
	},
	request_status: function (frm, cdt, cdn) {
		const d = locals[cdt][cdn];
		if (d.request_status == "Approved") {
			if (d.project_meeting && d.preliminary_design_meeting && d.critical_design_meeting && d.fabrication_level_cdr && d.component_level_cdr && d.bom_meeting && d.component_qaqc && d.purchase_decision ) {
			
			}
			else{
				frappe.model.set_value(cdt, cdn, "request_status", "Pending");
				frappe.throw("Please complete all the meetings before approving.");
			}
		} 
	},
	update_specification: function (frm, cdt, cdn) {
		const d = locals[cdt][cdn];
		console.log("ASDASD");
	}
});
