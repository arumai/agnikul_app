# Copyright (c) 2021, Vigneshwaran Arumainayagam and contributors
# For license information, please see license.txt

from hashlib import new
import frappe
from frappe.model.document import Document

class SourcingRequest(Document):
	pass

@frappe.whitelist()
def create_updated_spec(spec):
	doc = frappe.get_doc("Specification Sheet", spec)
	new_doc = frappe.new_doc("Specification Sheet")
	new_doc.item = doc.item
	new_doc.specification_version = float(doc.specification_version)+float(0.1)
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