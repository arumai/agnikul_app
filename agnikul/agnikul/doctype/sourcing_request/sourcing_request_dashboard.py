
from frappe import _


def get_data():
	return {
		'fieldname': 'against_sourcing_request',
		# 'non_standard_fieldnames': {
		# 	'Journal Entry': 'reference_name',
		# 	'Payment Entry': 'reference_name',
		# 	'Auto Repeat': 'reference_document'
		# },
		# 'internal_links': {
		# 	'Material Request': ['items', 'material_request'],
		# 	'Supplier Quotation': ['items', 'supplier_quotation'],
		# 	'Project': ['items', 'project'],
		# },
		'transactions': [
			{
				'label': _('Related'),
				'items': [
                    'Material Request'
                    # 'Request for Quotation',
                    # 'Supplier Quotation',
                    # 'Purchase Order',
                    # 'Purchase Reciept',
                    # 'Purchase Invoice'
                ]
			}
		]
	}
