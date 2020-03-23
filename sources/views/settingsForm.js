import {JetView} from "webix-jet";
import {iconTypes} from "../models/iconTypes";
import {activitiesTypes} from "../models/activitiesTypes";
import {statuses} from "../models/statuses";

export default class SettingsForm extends JetView {
	config() {
		return {
			view: "window",
			modal: true,
			position: "center",
			head: {
				template: "#action# #type#",
				localId: "header"
			},
			body: {
				view: "form",
				localId: "settingsForm",
				elements: [
					{view: "text", name: "Value", label: "Name", width: 300, required: true},
					{
						view: "richselect",
						label: "Icon",
						name: "Icon",
						value: 1,
						options: {
							data: iconTypes,
							template: obj => `<span class="mdi mdi-${obj.value}"></span> ${obj.value}`,
							body: {
								template: obj => `<span class="mdi mdi-${obj.value}"></span> ${obj.value}`
							}
						},
						required: true
					},
					{
						cols: [
							{view: "button", localId: "button", value: "Add", css: "webix_primary", click: () => this.changeValues()},
							{view: "button", value: "Cancel", css: "webix_primary", click: () => this.closeForm()}
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
		let item = {};
		if (id) item = type === "Activity" ? activitiesTypes.getItem(id) : statuses.getItem(id);
		item.type = type;
		this.form.setValues(item);

		this.getRoot().show();

		const action = id ? "Edit" : "Add";
		const buttonAction = action === "Edit" ? "Save" : "Add";
		this.$$("header").setValues({action, type});
		this.$$("button").setValue(buttonAction);
	}

	changeValues() {
		if (this.form.validate()) {
			let itemData = this.form.getValues();
			let iconId = itemData.Icon;
			itemData.Icon = iconTypes.getItem(iconId).Icon;

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
		}
		this.closeForm();
	}

	closeForm() {
		this.form.clear();
		this.form.clearValidation();
		this.getRoot().hide();
	}
}
