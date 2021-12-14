// Copyright (c) 2021, Vigneshwaran Arumainayagam and contributors
// For license information, please see license.txt

frappe.ui.form.on('Specification Sheet', {
	non_cryo: function(frm) {
		if (frm.doc.non_cryo == 1 && frm.doc.cryo == 1) {
			frm.set_value("cryo", false)
		}
	},
	cryo: function(frm) {
		if (frm.doc.non_cryo == 1 && frm.doc.cryo == 1) {
			frm.set_value("non_cryo", false)
		}
	},
	oxy: function(frm) {
		if (frm.doc.oxy == 1 && frm.doc.non_oxy == 1) {
			frm.set_value("non_oxy", false)
		}
	},
	non_oxy: function(frm) {
		if (frm.doc.oxy == 1 && frm.doc.non_oxy == 1) {
			frm.set_value("oxy", false)
		}
	},
	setup: function (frm) {
		frm.fields_dict.table_9.grid.get_field("category").get_query = function(doc, cdt, cdn) {
			var child = locals[cdt][cdn];
			return {
				filters: {
					"domain": child.domain
				}
			};
		}
		frm.fields_dict.table_9.grid.get_field("key").get_query = function(doc, cdt, cdn) {
			var child = locals[cdt][cdn];
			return {
				filters: {
					"domain": child.domain,
					"Category": child.category
				}
			};
		}
		frm.fields_dict.table_9.grid.get_field("value").get_query = function(doc, cdt, cdn) {
			var child = locals[cdt][cdn];
			return {
				filters: {
					"key": child.key
				}
			};
		}

	}
});

frappe.ui.form.on('Specification Sheet Details', {
	table_9_add: function(frm, cdt, cdn) {
		let row = locals[cdt][cdn];
		console.log(row)
	},
	domain: function (frm, cdt, cdn) {
		let row = locals[cdt][cdn];
		console.log(row)
		frappe.confirm(__("Do you want to add all the categories and keys linked with the domain: "+row.domain+" ?"), function () {
			frappe.call({
				method: "frappe.client.get_list",
				args: {
					doctype: "Specification Category",
					fields: ["name"],
					filters: {"domain": row.domain}
				},
				callback: function (r) {
					if (!r.exc) {
						for (let index = 0; index < r.message.length; index++) {
							let element = r.message[index];
							frappe.call({
								method: "frappe.client.get_list",
								args: {
									doctype: "Specification Key",
									fields: ["name"],
									filters: {"domain": row.domain, "category": element.name}
								},
								callback: function (r) {
									if (!r.exc) {
										for (let i = 0; i < r.message.length; i++) {
											let key = r.message[i];
											if (index == 0) {
												var child = row;
											} else {
												var child = frm.add_child("table_9");
											}
											child.domain = row.domain
											child.category = element.name;
											child.key = key.name;
										}
									}
									frm.refresh_field("table_9");
								}
								
							})
						}
						
					}
				}
			})
		})
	},
	category: function (frm, cdt, cdn) {
		let row = locals[cdt][cdn];
		frappe.confirm(__("Do you want to add all the key linked with the category: "+row.category+" ?"), function () {
			frappe.call({
				method: "frappe.client.get_list",
				args: {
					doctype: "Specification Key",
					fields: ["name"],
					filters: {"domain": row.domain, "category": row.category}
				},
				callback: function (r) {
					if (!r.exc) {
						for (let index = 0; index < r.message.length; index++) {
							const element = r.message[index];
							if (index == 0) {
								var child = row;
							} else {
								var child = frm.add_child("table_9");
							}
							child.domain = row.domain
							child.category = row.category;
							child.key = element.name;
						}
					}
					frm.refresh_field("table_9");
				}
				
			})
		})
	}
});