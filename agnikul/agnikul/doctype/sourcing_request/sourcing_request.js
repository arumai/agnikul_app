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
				frappe.call({
					method: "agnikul.agnikul.doctype.sourcing_request.sourcing_request.check_inventory_against_spec",
					args: {
						"spec": frm.doc.specification_sheet
					},
					callback: function (r) {
						console.log(r.message);
						var dialog = new frappe.ui.Dialog({
							title: __("Internal Search Statement"),
							fields: [
								{fieldtype: "HTML", fieldname: "result", label: __("Result")},
								]
						});
						var wrapper = dialog.fields_dict.result.$wrapper;
						var html = `<table class="table">
						<thead>
						  <tr>
							<th scope="col">Domain</th>
							<th scope="col">Category</th>
							<th scope="col">Key</th>
							<th scope="col">Value</th>
							<th scope="col">Must Have</th>
							<th scope="col">Result</th>
						  </tr>
						</thead>
						<tbody>`;
						for (let i = 0; i < r.message.length; i++) {
							const element = r.message[i];
							let row = ``;
							if (element.status == "Matching") {
								row = `<tr style="background-color: lightgreen;">
											<td>`+element.domain+`</td>
											<td>`+element.category+`</td>
											<td>`+element.key+`</td>
											<td>`+element.value+`</td>
											<td>`+element.must_have+`</td>
											<td>`+element.status+`</td>
										</tr>`
							} else {
								row = `<tr style="background-color: lightcoral;">
											<td>`+element.domain+`</td>
											<td>`+element.category+`</td>
											<td>`+element.key+`</td>
											<td>`+element.value+`</td>
											<td>`+element.must_have+`</td>
											<td>`+element.status+`</td>
										</tr>`
							}
							
							html = html + row
						}
						html = html + `</tbody>
						</table>`
						wrapper.html(html);
						dialog.show();
					}
				})
			}, __('Search'));
			frm.add_custom_button(__('Market Search Statement'), function() {
				window.open("https://www.google.com/search?q="+frm.doc.requested_item+" suppliers");
			}, __('Search'));
		}
	}
});

frappe.ui.form.on("Sales Invoice Item", {
	qty: function(frm, dt, dn) {
		var d = locals[dt][dn];
		if (d.qty > 0) {
			d.amount = parseFloat(d.qty) * parseFloat(d.rate);
		}
		else{
			d.qty = 0;
		}
		refresh_field("table_13");
	},
	rate: function(frm, dt, dn) {
		var d = locals[dt][dn];
		if (d.rate > 0) {
			d.amount = parseFloat(d.qty) * parseFloat(d.rate);
		}
		else{
			d.rate = 0;
		}
		refresh_field("table_13");
	}
});