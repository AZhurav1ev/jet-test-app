import {JetView} from "webix-jet";
import {activitiesTypes} from "../models/activitiesTypes";
import {contacts} from "../models/contacts";
import {activities} from "../models/activities";

export default class ActivitiesForm extends JetView {
	config() {
		return {
			view: "window",
			modal: true,
			position: "center",
			head: {
				template: "#action# activity",
				localId: "header"
			},
			body: {
				view: "form",
				localId: "activitiesForm",
				elements: [
					{view: "textarea", label: "Details", name: "Details", minWidth: 300, maxWidth: 500, invalidMessage: "Please write some details", required: true},
					{view: "combo", label: "Type", name: "TypeID", options: activitiesTypes, invalidMessage: "Please select type", required: true},
					{view: "combo", label: "Contact", name: "ContactID", options: contacts, invalidMessage: "Please select contact", required: true},
					{
						cols: [
							{view: "datepicker", format: webix.i18n.longDateFormatStr, name: "DueDate", invalidMessage: "Please select date", required: true},
							{view: "datepicker", type: "time", format: webix.i18n.timeFormat, name: "DueTime", invalidMessage: "Please select time", required: true}
						]
					},
					{view: "checkbox", label: "Completed", name: "State", checkValue: "Close", uncheckValue: "Open"},
					{
						cols: [
							{},
							{view: "button", value: "Add (*save)", localId: "actionButton", css: "webix_primary", autoWidth: true, click: () => this.addItem()},
							{view: "button", label: "Cancel", css: "webix_primary", autoWidth: true, click: () => this.closeForm()}
						]
					}
				]
			}
		};
	}

	showForm(id, value = false) {
		const form = this.$$("activitiesForm");
		const header = this.$$("header");
		const button = this.$$("actionButton");
		const action = value ? "Add" : "Edit";

		if (id && activities.exists(id)) {
			const item = activities.getItem(id);
			this.getRoot().show();
			form.setValues(item);
		}

		this.getRoot().show();

		header.setValues({action});
		button.setValue(action);
	}

	closeForm() {
		const form = this.$$("activitiesForm");
		form.clear();
		form.clearValidation();
		this.getRoot().hide();
	}

	addItem() {
		const form = this.$$("activitiesForm");
		if (form.validate()) {
			const itemData = form.getValues();
			if (itemData && itemData.id) {
				activities.updateItem(itemData.id, itemData);
			}
			else {
				activities.add(itemData, 0);
			}
			this.closeForm();
		}
	}
}
