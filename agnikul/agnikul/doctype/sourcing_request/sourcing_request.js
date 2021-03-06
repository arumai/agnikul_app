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
		if (!frm.doc.__islocal && frm.doc.docstatus == 1 && frappe.user.has_role('Agnikul Designer') ) {
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
			if (frappe.user.has_role('Agnikul Designer')) {
				frm.set_df_property('identified_vendors', 'cannot_add_rows', true);
				frm.set_df_property('identified_vendors', 'cannot_delete_rows', true);
			}
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
				var ss = frappe.meta.get_docfield("Sourcing Request Item","specification_sheet", frm.doc.name);
				ss.read_only = 1;
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
		if (!frm.doc.__islocal && frm.doc.docstatus == 1 && frappe.user.has_role('Agnikul Designer') ) {
			frm.fields_dict["table_16"].grid.wrapper.find(".grid-insert-row").hide();
			frm.fields_dict["table_16"].grid.wrapper.find(".grid-delete-row").hide();
			frm.fields_dict["table_16"].grid.wrapper.find(".grid-insert-row-below").hide();
			frm.fields_dict["table_16"].grid.wrapper.find(".grid-duplicate-row").hide();
			frm.fields_dict["table_16"].grid.wrapper.find(".grid-move-row").hide();
			frm.fields_dict["table_16"].grid.wrapper.find(".grid-append-row").hide();
			frm.fields_dict["table_16"].grid.wrapper.find(".grid-remove-rows").hide();
		}
	},
	sourcing_status: function (frm, cdt, cdn) {
		const d = locals[cdt][cdn];
		console.log(d)
		if (d.sourcing_status == "Existing Component") {
			frappe.confirm(__("Do you want to get all the suppliers linked to item:"+ d.requested_item +" ?"), function () {
				frappe.call({
					"method": "agnikul.agnikul.doctype.sourcing_request.sourcing_request.get_linked_suppliers",
					"args": {
						"item": d.requested_item
					},
					callback: function (r) {
						console.log(r.message);
						frm.clear_table("identified_vendors");
						for (let i = 0; i < r.message.length; i++) {
							const element = r.message[i];
							var childTable = frm.add_child("identified_vendors");
							childTable.supplier = element
							childTable.for_row_number = d.idx
						}
						frm.refresh_fields("identified_vendors");
					}
				})
			})
		}
	},
	request_status: function (frm, cdt, cdn) {
		const d = locals[cdt][cdn];
		if (d.request_status == "Approved") {
			if (frm.doc.sourcing_type == "Default") {
				if (d.project_meeting && d.preliminary_design_meeting && d.critical_design_meeting && d.fabrication_level_cdr && d.component_level_cdr && d.bom_meeting && d.component_qaqc && d.purchase_decision ) {
			
				}
				else{
					frappe.model.set_value(cdt, cdn, "request_status", "Pending");
					frappe.throw("Please complete all the meetings before approving.");
				}
			} else if (frm.doc.sourcing_type == "Emergency") {
				
			}
			
		} 
	},
	update_specifications: function (frm, cdt, cdn) {
		const doc = locals[cdt][cdn];
		frappe.confirm(__("Do you want to create new and use the updated Specification for this Request?"), function () {
			frappe.call({
				"method": "agnikul.agnikul.doctype.sourcing_request.sourcing_request.create_updated_spec",
				"args": {
					"spec": doc.specification_sheet
				},
				callback: function (r) {
					frappe.model.set_value(cdt, cdn, "specification_sheet", r.message);
					frm.savesubmit();
					frappe.set_route('Form', 'Specification Sheet', r.message);
				}
			})
		})
	},
	create_material_request: function (frm, cdt, cdn) {
		const doc = locals[cdt][cdn];
		frappe.model.open_mapped_doc({
			method: "agnikul.agnikul.doctype.sourcing_request.sourcing_request.create_material_request",
			frm: frm,
			args: {
				doc: doc
			}
		});
	},
	project_meeting: function (frm, cdt, cdn) {
		const d = locals[cdt][cdn];
		if (d.project_meeting && !d.preliminary_design_meeting && !d.critical_design_meeting && !d.fabrication_level_cdr && !d.component_level_cdr && !d.bom_meeting && !d.component_qaqc && !d.purchase_decision) {
			frappe.model.set_value(cdt, cdn, "request_status", "Project meeting");
		}
	},
	preliminary_design_meeting: function (frm, cdt, cdn) {
		const d = locals[cdt][cdn];
		if (d.project_meeting && d.preliminary_design_meeting && !d.critical_design_meeting && !d.fabrication_level_cdr && !d.component_level_cdr && !d.bom_meeting && !d.component_qaqc && !d.purchase_decision) {
			frappe.model.set_value(cdt, cdn, "request_status", "Preliminary design meeting");
		}
	},
	critical_design_meeting: function (frm, cdt, cdn) {
		const d = locals[cdt][cdn];
		if (d.project_meeting && d.preliminary_design_meeting && d.critical_design_meeting && !d.fabrication_level_cdr && !d.component_level_cdr && !d.bom_meeting && !d.component_qaqc && !d.purchase_decision) {
			frappe.model.set_value(cdt, cdn, "request_status", "Critical design meeting");
		}
	},
	fabrication_level_cdr: function (frm, cdt, cdn) {
		const d = locals[cdt][cdn];
		if (d.project_meeting && d.preliminary_design_meeting && d.critical_design_meeting && d.fabrication_level_cdr && !d.component_level_cdr && !d.bom_meeting && !d.component_qaqc && !d.purchase_decision) {
			frappe.model.set_value(cdt, cdn, "request_status", "Fabrication level CDR");
		}
	},
	component_level_cdr: function (frm, cdt, cdn) {
		const d = locals[cdt][cdn];
		if (d.project_meeting && d.preliminary_design_meeting && d.critical_design_meeting && d.fabrication_level_cdr && d.component_level_cdr && !d.bom_meeting && !d.component_qaqc && !d.purchase_decision) {
			frappe.model.set_value(cdt, cdn, "request_status", "Component level CDR");
		}
	},
	bom_meeting: function (frm, cdt, cdn) {
		const d = locals[cdt][cdn];
		if (d.project_meeting && d.preliminary_design_meeting && d.critical_design_meeting && d.fabrication_level_cdr && d.component_level_cdr && d.bom_meeting && !d.component_qaqc && !d.purchase_decision) {
			frappe.model.set_value(cdt, cdn, "request_status", "BOM Meeting");
		}
	},
	component_qaqc: function (frm, cdt, cdn) {
		const d = locals[cdt][cdn];
		if (d.project_meeting && d.preliminary_design_meeting && d.critical_design_meeting && d.fabrication_level_cdr && d.component_level_cdr && d.bom_meeting && d.component_qaqc && !d.purchase_decision) {
			frappe.model.set_value(cdt, cdn, "request_status", "Component QA/QC");
		}
	},
	purchase_decision: function (frm, cdt, cdn) {
		const d = locals[cdt][cdn];
		if (d.project_meeting && d.preliminary_design_meeting && d.critical_design_meeting && d.fabrication_level_cdr && d.component_level_cdr && d.bom_meeting && d.component_qaqc && d.purchase_decision) {
			frappe.model.set_value(cdt, cdn, "request_status", "Purchase Decision");
		}
	}
});
