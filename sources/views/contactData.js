import {JetView} from "webix-jet";
import {contacts} from "../models/contacts";
import activitiesForm from "./activitiesForm";
import {activities} from "../models/activities";
import {contactsData} from "../models/contactsData";
import {activitiesTypes} from "../models/activitiesTypes";

export default class ContactData extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		const activitiesTable = {
			rows: [
				{
					view: "datatable",
					editable: true,
					select: true,
					localId: "table",
					scroll: "auto",
					columns: [
						{id: "State", header: "", template: "{common.checkbox()}", checkValue: "Close", uncheckValue: "Open", width: 50},
						{id: "TypeID", header: [{content: "selectFilter"}], collection: activitiesTypes, sort: "text"},
						{id: "DueDate", header: [{content: "dateRangeFilter"}], format: webix.Date.dateToStr("%d %M %Y"), sort: "date", width: 180},
						{id: "Details", header: [{content: "textFilter"}], template: "#Details#", fillspace: true, sort: "string"},
						{id: "edit", header: "", width: 50, template: "<span class='webix_icon wxi-pencil'></span>"},
						{id: "delete", header: "", width: 50, template: "<span class='webix_icon wxi-trash'></span>"}
					],
					onClick: {
						"wxi-pencil": (e, id) => this.showActivityEditor(id),
						"wxi-trash": (e, id) => this.deleteActivity(id)
					}
				},
				{
					css: "activities_button",
					cols: [
						{},
						{
							view: "button",
							value: "Add",
							css: "webix_primary",
							width: 220,
							label: _("Add activity"),
							type: "icon",
							icon: "wxi-plus-circle",
							click: () => this.showActivityEditor()
						}
					]
				}
			]
		};

		const filesTable = {
			rows: [
				{
					view: "form",
					elements: [
						{
							view: "datatable",
							localId: "filesTable",
							select: true,
							scroll: "auto",
							columns: [
								{id: "Name", header: _("Name"), fillspace: true, sort: "string"},
								{id: "Date", header: _("Change Date"), format: webix.Date.dateToStr("%d %M %Y"), sort: "date"},
								{id: "Size", header: _("Size"), sort: this.sortBySize},
								{id: "delete", header: "", width: 50, template: "<span class='webix_icon wxi-trash'></span>"}
							],
							onClick: {
								"wxi-trash": (e, id) => this.deleteFile(id)
							}
						}
					]
				},
				{
					css: "activities_button",
					cols: [
						{},
						{
							view: "uploader",
							label: _("Upload file"),
							localId: "fileUploader",
							autosend: false,
							css: "webix_primary",
							type: "icon",
							icon: "wxi-download",
							width: 150
						},
						{}
					]
				}
			]
		};

		return {
			rows: [
				{
					view: "tabbar",
					localId: "tabbar",
					options: [
						{value: _("Activities")},
						{value: _("Files")}
					]
				},
				{
					cells: [
						{localId: _("Activities"), rows: [activitiesTable]},
						{localId: _("Files"), rows: [filesTable]}
					]
				}
			]
		};
	}

	sortBySize(a, b) {
		return parseFloat(a.Size) - parseFloat(b.Size);
	}

	init() {
		this.activityForm = this.ui(activitiesForm);

		this.$$("table").sync(activities);
		this.$$("filesTable").sync(contactsData);

		this.$$("tabbar").attachEvent("onChange", value => this.$$(value).show());
		this.$$("fileUploader").attachEvent("onBeforeFileAdd", (upload) => {
			const id = +this.getParam("id", true);
			const file = {
				Name: upload.name,
				Date: upload.file.lastModifiedDate,
				Size: upload.sizetext,
				ContactID: id
			};
			if (file) {
				contactsData.add(file);
			}
		});
	}

	urlChange() {
		webix.promise.all([
			contacts.waitData,
			activities.waitData,
			activitiesTypes.waitData
		]).then(() => {
			const id = this.getParam("id", true);
			if (id && contacts.exists(id)) {
				activities.data.filter(activity => String(activity.ContactID) === String(id));
				contactsData.data.filter(data => String(data.ContactID) === String(id));
			}
		});
	}

	deleteActivity(id) {
		if (id) {
			webix.confirm("Do you want to delete this activity?")
				.then(() => {
					activities.remove(id);
				});
		}
	}

	deleteFile(id) {
		if (id) {
			this.webix.confirm("Do you want to delete this file?")
				.then(() => {
					contactsData.remove(id);
				});
		}
	}

	showActivityEditor(activityId) {
		const contactId = this.getParam("id", true);
		if (activityId && contactId) this.activityForm.showForm(activityId, contactId);
		if (!activityId && contactId) this.activityForm.showForm(false, contactId);
	}
}
