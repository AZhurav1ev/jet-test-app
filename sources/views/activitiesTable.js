import {JetView} from "webix-jet";
import {contacts} from "../models/contacts";
import activitiesForm from "./activitiesForm";
import {activities} from "../models/activities";
import {contactsData} from "../models/contactsData";
import {activitiesTypes} from "../models/activitiesTypes";

export default class ActivitiesTable extends JetView {
	config() {
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
						"wxi-pencil": (e, id) => this.editItem(id),
						"wxi-trash": (e, id) => this.deleteActivity(id)
					}
				},
				{
					css: "activities_button",
					cols: [
						{},
						{view: "button", value: "+Add activity", css: "webix_primary", width: 150, click: () => this.showForm()}
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
								{id: "Name", header: "Name", fillspace: true, sort: "string"},
								{id: "Date", header: "Change Date", format: webix.Date.dateToStr("%d %M %Y"), sort: "date"},
								{id: "Size", header: "Size", sort: this.sortBySize},
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
							label: "Upload file",
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
						{value: "Activities"},
						{value: "Files"}
					]
				},
				{
					cells: [
						{localId: "Activities", rows: [activitiesTable]},
						{localId: "Files", rows: [filesTable]}
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
			const id = +this.getParam("id", true);
			if (id && contacts.exists(id)) {
				activities.data.filter(activity => +activity.ContactID === id);
				contactsData.data.filter(data => data.ContactID === id);
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

	editItem(id) {
		if (id) {
			this.activityForm.showForm(id);
		}
	}

	showForm() {
		const id = this.getParam("id", true);
		this.activityForm.showForm(false, id);
	}
}
