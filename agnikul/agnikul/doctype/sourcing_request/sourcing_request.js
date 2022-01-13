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
		if (!frm.doc.__islocal && frm.doc.docstatus == 1) {
			if (frappe.user.has_role('Stock Manager')) {
				var df = frappe.meta.get_docfield("Sourcing Request Item", "sourcing_required", cur_frm.doc.name);
				df.read_only = 1;
			}
		}
		if (!frm.doc.__islocal && frm.doc.docstatus == 1) {
			if (frappe.user.has_role('Agnikul Founder')) {
				var df = frappe.meta.get_docfield("Sourcing Request Item", "approved_qty", cur_frm.doc.name);
				df.read_only = 0;
				var df = frappe.meta.get_docfield("Sourcing Request Item", "approved_spare_qty", cur_frm.doc.name);
				df.read_only = 0;
			}
		}
	},
	setup: function (frm) {
		frm.set_indicator_formatter('requested_item',
			function(doc) {
				let indicator = 'blue';
				return indicator;
			}
		);
	}
});

// frappe.ui.form.on('Sourcing Request Item', {
// 	form_render: function(frm, cdt, cdn) {
// 		const d = locals[cdt][cdn];
// 		console.log(d)
// 	},
// 	specification_sheet: function (frm, cdt, cdn) {
// 		const d = locals[cdt][cdn];
// 	}
// });
