import {JetView} from "webix-jet";
import {activitiesTypes} from "../models/activitiesTypes";
import {contacts} from "../models/contacts";
import {activities} from "../models/activities";

export default class ActivitiesForm extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		return {
			view: "window",
			modal: true,
			position: "center",
			head: {
				template: `#action# ${_("activity")}`,
				localId: "header"
			},
			body: {
				view: "form",
				localId: "activitiesForm",
				elements: [
					{view: "textarea", label: _("Details"), name: "Details", minWidth: 300, maxWidth: 500, invalidMessage: _("Please write some details"), required: true},
					{view: "combo", label: _("Type"), name: "TypeID", options: activitiesTypes, invalidMessage: _("Please select type"), required: true},
					{view: "combo", label: _("Contact"), localId: "combo", value: "", name: "ContactID", options: contacts, invalidMessage: _("Please select contact"), required: true},
					{
						cols: [
							{view: "datepicker", name: "DueDate", type: "date", value: new Date(), format: "%d  %M %Y", invalidMessage: _("Please select date"), required: true},
							{view: "datepicker", name: "DueTime", type: "time", value: new Date(), invalidMessage: _("Please select time"), required: true}
						]
					},
					{view: "checkbox", label: _("Completed"), labelWidth: 100, name: "State", checkValue: "Close", uncheckValue: "Open"},
					{
						cols: [
							{},
							{view: "button", value: _("Add"), localId: "button", css: "webix_primary", autoWidth: true, click: () => this.addItem()},
							{view: "button", label: _("Cancel"), css: "webix_primary", autoWidth: true, click: () => this.closeForm()}
						]
					}
				]
			}
		};
	}

	init() {
		this.form = this.$$("activitiesForm");
	}

	showForm(activityId, contactId) {
		const _ = this.app.getService("locale")._;
		if (activityId && activities.exists(activityId)) {
			const item = activities.getItem(activityId);
			this.form.setValues(item);
		}
		if (contactId && contacts.exists(contactId)) {
			this.$$("combo").setValue(contactId);
			this.$$("combo").disable();
		}

		this.getRoot().show();

		const action = activityId ? _("Edit") : _("Add");
		const buttonAction = activityId ? _("Save") : _("Add");
		this.$$("header").setValues({action});
		this.$$("button").setValue(buttonAction);
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
