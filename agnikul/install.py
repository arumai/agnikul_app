import frappe
from frappe.desk.page.setup_wizard.setup_wizard import make_records

def before_install():
    records = [
        {'doctype': "Role", "role_name": "Agnikul Designer"},
		{'doctype': "Role", "role_name": "Agnikul Operations Lead"},
		{'doctype': "Role", "role_name": "Agnikul Operations Systems Engineer"},
		{'doctype': "Role", "role_name": "Agnikul Fabricator"}
    ]
    # make_records(records)
    for d in records:
        try:
            frappe.get_doc(d).insert()
        except frappe.NameError:
            pass
    frappe.db.commit()
    frappe.clear_cache()