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
					{view: "combo", label: "Contact", localId: "combo", value: "", name: "ContactID", options: contacts, invalidMessage: "Please select contact", required: true},
					{
						cols: [
							{view: "datepicker", name: "DueDate", type: "date", value: new Date(), format: "%d  %M %Y", invalidMessage: "Please select date", required: true},
							{view: "datepicker", name: "DueTime", type: "time", value: new Date(), invalidMessage: "Please select time", required: true}
						]
					},
					{view: "checkbox", label: "Completed", name: "State", checkValue: "Close", uncheckValue: "Open"},
					{
						cols: [
							{},
							{view: "button", value: "Add", localId: "button", css: "webix_primary", autoWidth: true, click: () => this.addItem()},
							{view: "button", label: "Cancel", css: "webix_primary", autoWidth: true, click: () => this.closeForm()}
						]
					}
				]
			}
		};
	}

	init() {
		this.form = this.$$("activitiesForm");
	}

	showForm(id, add) {
		if (id && !add && activities.exists(id)) {
			const item = activities.getItem(id);
			this.form.setValues(item);
		}
		if (id && add && contacts.exists(id)) {
			this.$$("combo").setValue(id);
			this.$$("combo").define("readonly", true);
		}

		this.getRoot().show();

		const action = id && add ? "Add" : "Edit";
		this.$$("header").setValues({action});
		this.$$("button").setValue(action);
	}

	closeForm() {
		this.form.clear();
		this.form.clearValidation();
		this.getRoot().hide();
	}

	addItem() {
		if (this.form.validate()) {
			const itemData = this.form.getValues();
			const hours = itemData.DueTime.getHours();
			const minutes = itemData.DueTime.getMinutes();
			itemData.DueDate.setHours(hours, minutes);
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
