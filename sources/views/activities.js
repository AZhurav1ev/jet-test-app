import {JetView} from "webix-jet";
import {activities} from "../models/activities";
import {activitiesTypes} from "../models/activitiesTypes";
import {contacts} from "../models/contacts";
import activitiesForm from "./activitiesForm";

export default class Activities extends JetView {
	config() {
		const button = {
			css: "activities_button",
			cols: [
				{},
				{
					view: "button",
					localId: "addButton",
					value: "Add",
					css: "webix_primary",
					width: 150,
					label: "Add activity",
					type: "icon",
					icon: "wxi-plus-circle",
					click: () => this.showForm()
				}
			]
		};

		const table = {
			view: "datatable",
			editable: true,
			select: true,
			localId: "activitiesTable",
			scroll: "auto",
			columns: [
				{id: "State", header: "", template: "{common.checkbox()}", checkValue: "Close", uncheckValue: "Open", width: 50},
				{id: "TypeID", header: ["Activity type", {content: "selectFilter"}], collection: activitiesTypes, sort: "text"},
				{id: "DueDate", header: ["Due Date", {content: "datepickerFilter"}], format: webix.i18n.longDateFormatStr, sort: "date", width: 150},
				{id: "Details", header: ["Details", {content: "textFilter"}], template: "#Details#", fillspace: true, sort: "string"},
				{id: "ContactID", header: ["Contact", {content: "selectFilter"}], width: 150, options: contacts, sort: "string"},
				{id: "edit", header: "", width: 50, template: "<span class='webix_icon wxi-pencil'></span>"},
				{id: "delete", header: "", width: 50, template: "<span class='webix_icon wxi-trash'></span>"}
			],
			onClick: {
				"wxi-pencil": (e, id) => this.editItem(id),
				"wxi-trash": (e, id) => this.deleteItem(id)
			}
		};

		return {
			rows: [
				button,
				table
			]
		};
	}

	init() {
		this.activityForm = this.ui(activitiesForm);
		webix.promise.all([
			contacts.waitData,
			activities.waitData,
			activitiesTypes.waitData
		]).then(() => {
			this.$$("activitiesTable").sync(activities);
		});
	}

	editItem(id) {
		if (id) {
			this.activityForm.showForm(id);
		}
	}

	deleteItem(id) {
		if (id) {
			webix.confirm("Do you really want to delete this item?")
				.then(() => {
					activities.remove(id);
				});
		}
	}

	showForm() {
		this.activityForm.showForm();
	}
}
