# Copyright (c) 2021, Vigneshwaran Arumainayagam and contributors
# For license information, please see license.txt

from hashlib import new
import frappe
from frappe.model.document import Document
from pypika import NULL

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