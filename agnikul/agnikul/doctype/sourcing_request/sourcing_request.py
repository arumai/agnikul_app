# Copyright (c) 2021, Vigneshwaran Arumainayagam and contributors
# For license information, please see license.txt

from hashlib import new
import frappe
from frappe.model.document import Document
from frappe.utils.data import flt
from pypika import NULL
from frappe.model.mapper import get_mapped_doc
from six import string_types
import json

class SourcingRequest(Document):
	pass

@frappe.whitelist()
def create_updated_spec(spec):
	doc = frappe.get_doc("Specification Sheet", spec)
	new_doc = frappe.new_doc("Specification Sheet")
	new_doc.item = doc.item
	new_doc.specification_version = "{:.2f}".format(float(doc.specification_version)+float(0.1))
	new_doc.enhanced_specification = True
	new_doc.base_specification = doc.name
	new_doc.non_cryo = True if int(doc.non_cryo) == 1 else False 
	new_doc.cryo = True if int(doc.cryo) == 1 else False
	new_doc.oxy = True if int(doc.oxy) == 1 else False
	new_doc.non_oxy = True if int(doc.non_oxy) == 1 else False 
	for i in doc.table_9:
		new_doc.append('table_9', i)
	new_doc.insert()
	return new_doc.name

@frappe.whitelist()
def check_inventory_against_spec(spec):
	spec_sheet = frappe.get_doc("Specification Sheet", spec)
	spec = spec_sheet.table_9
	spec_data = []
	for i in spec:
		obj = {}
		obj["domain"] = i.domain
		obj["category"] = i.category
		obj["key"] = i.key
		obj["value"] = i.value
		obj["must_have"] = i.must_have
		spec_data.append(obj)

	serial_nos_linked_with_item = frappe.db.get_list("Serial No",
		fields = ["name"],
		filters = {"item_code": spec_sheet.item}
		)
	
	inventory_spec_data = []

	for j in serial_nos_linked_with_item:
		inventory_spec = frappe.get_doc("Serial No", j.name).specifications
		for o in inventory_spec:
			obj1 = {}
			obj1["domain"] = o.domain
			obj1["category"] = o.category
			obj1["key"] = o.key
			obj1["value"] = o.value
			inventory_spec_data.append(obj1)

	result = []
	for u in spec_data:
		for y in inventory_spec_data:
			if u["key"] == y["key"] and u["domain"] == y["domain"] and u["category"] == y["category"] and u["value"] == y["value"]:
				u["status"] = "Matching"
				result.append(u)
			else:
				u["status"] = "Not Matching"
				result.append(u)
	return result

@frappe.whitelist()
def create_material_request(source_name, target_doc=None, args=None):
	def set_missing_values(source, target):
		data = frappe.flags.args.doc
		if data["sourcing_status"] == "Existing Component" or data["sourcing_status"] == "New Component":
			target.material_request_type = "Purchase"
		elif data["sourcing_status"] == "Available In Inventory":
			target.material_request_type = "Material Transfer"
			
		target.against_sourcing_request_item = data['name']
		target.against_sourcing_request = source.name
		item = frappe.get_doc("Item", data["requested_item"])
		target.append('items', {
			'item_code': data["requested_item"],
			'qty': float(data["approved_qty"]) + float(data["approved_spare_qty"]),
			'description': item.description,
			'stock_uom': item.stock_uom,
			'project': source.project,
			'uom': item.stock_uom
		})

	doc = get_mapped_doc("Sourcing Request", source_name, {
		"Sourcing Request": {
			"doctype": "Material Request"
		}
	}, target_doc, set_missing_values)

	return doc

@frappe.whitelist()
def _get_employee_from_user(user):
	employee_docname = frappe.db.exists(
		{'doctype': 'Employee', 'user_id': user})
	if employee_docname:
		# frappe.db.exists returns a tuple of a tuple
		return frappe.get_doc('Employee', employee_docname[0][0])
	return None

@frappe.whitelist()
def validate_po(doc, method):
	for i in doc.items:
		if i.material_request:
			mr = frappe.get_doc("Material Request", i.material_request)
			sr = frappe.get_doc("Sourcing Request Item", mr.against_sourcing_request_item)
			sourcing_request_doc = frappe.get_doc("Sourcing Request", sr.parent)
			if sourcing_request_doc.sourcing_type == "Default":
				if sr.purchase_decision:
					pass
				else:
					frappe.throw("Please compleate the PD Meeting for the Sourcing Request")
			if sourcing_request_doc.sourcing_type == "Emergency":
				if sr.request_status == "Approved":
					pass
				else:
					frappe.throw("Please get the approval for sourcing request "+ sourcing_request_doc.name +" before creating the Purchase Order")

@frappe.whitelist()
def validate_mr(doc, method):
	if doc.against_sourcing_request:
		sr = frappe.get_doc("Sourcing Request Item", doc.against_sourcing_request_item)
		sr.material_request = doc.name
		sr.save(ignore_permissions=True)
		sr.submit()

@frappe.whitelist()
def query_conditions(user):
	user_roles = frappe.get_roles()
	if "Agnikul Designer" in user_roles:
		pass
	else:
		# pass
		return """(`tabSourcing Request`.`docstatus`=1)"""