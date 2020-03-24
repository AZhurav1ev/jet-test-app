import {JetView} from "webix-jet";
import {iconTypes} from "../models/iconTypes";
import {activitiesTypes} from "../models/activitiesTypes";
import {statuses} from "../models/statuses";

export default class SettingsForm extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		return {
			view: "window",
			modal: true,
			position: "center",
			head: {
				template: "#action# #formType#",
				localId: "header"
			},
			body: {
				view: "form",
				localId: "settingsForm",
				elements: [
					{view: "text", name: "Value", label: _("Type"), width: 300, required: true, invalidMessage: _("This field can not be empty")},
					{
						view: "richselect",
						label: _("Icon"),
						name: "Icon",
						value: 1,
						options: {
							data: iconTypes,
							template: obj => `<span class="mdi mdi-${obj.value}"></span> ${obj.value}`,
							body: {
								template: obj => `<span class="mdi mdi-${obj.value}"></span> ${obj.value}`
							}
						},
						required: true,
						invalidMessage: _("This field can not be empty")
					},
					{
						cols: [
							{view: "button", localId: "button", value: "Add", css: "webix_primary", click: () => this.changeValues()},
							{view: "button", value: _("Cancel"), css: "webix_primary", click: () => this.closeForm()}
						]
					}
				]
			}
		};
	}

	init() {
		this.form = this.$$("settingsForm");
	}

	showForm(id, type) {
		const _ = this.app.getService("locale")._;
		let item = {};
		if (id) item = type === "Activity" ? activitiesTypes.getItem(id) : statuses.getItem(id);
		item.type = type;
		this.form.setValues(item);

		this.getRoot().show();

		const formType = item.type === "Activity" ? _("activity") : _("status");
		const action = id ? _("Edit") : _("Add");
		const buttonAction = id ? _("Save") : _("Add");
		this.$$("header").setValues({action, formType});
		this.$$("button").setValue(buttonAction);
	}

	changeValues() {
		if (this.form.validate()) {
			let itemData = this.form.getValues();
			if (itemData.type === "Activity" && itemData.id) {
				activitiesTypes.updateItem(itemData.id, itemData);
			}
			if (itemData.type === "Status" && itemData.id) {
				statuses.updateItem(itemData.id, itemData);
			}
			if (itemData.type === "Activity" && !itemData.id) {
				activitiesTypes.add(itemData, 0);
			}
			if (itemData.type === "Status" && !itemData.id) {
				statuses.add(itemData, 0);
			}
			this.closeForm();
		}
	}

	closeForm() {
		this.form.clear();
		this.form.clearValidation();
		this.getRoot().hide();
	}
}
