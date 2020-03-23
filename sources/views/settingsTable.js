import {JetView} from "webix-jet";
import {activitiesTypes} from "../models/activitiesTypes";
import {iconTypes} from "../models/iconTypes";
import settingsForm from "./settingsForm";

export default class SettingsTable extends JetView {
	constructor(app, name, data) {
		super(app, name);
		this._componentData = data;
		this._name = name;
	}

	config() {
		return {
			rows: [
				{
					view: "datatable",
					localId: "table",
					scroll: "auto",
					select: "cell",
					editable: true,
					// editaction: "dblclick",
					columns: [
						{id: "Value", header: "Activity", fillspace: true, editor: "text"},
						{
							id: "Icon",
							header: "Icon",
							fillspace: true,
							localId: "icon",
							template: obj => `<span class='mdi mdi-${obj.Icon}'></span>`,
							// template: "<span class='mdi mdi-#value#'></span>",
							editor: "richselect",
							collection: iconTypes,
							suggest: {
								template: "<span class='mdi mdi-#value#'></span>",
								body: {
									// template: obj => `<span class='mdi mdi-${obj.Icon}'></span> ${obj.Value}`
									template: "<span class='mdi mdi-#value#'></span> #value#"
								}
							}
						},
						{id: "edit", header: "", width: 50, template: "<span class='webix_icon wxi-pencil'></span>"},
						{id: "delete", header: "", width: 50, template: "<span class='webix_icon wxi-trash'></span>"}
					],
					onClick: {
						"wxi-pencil": (e, id) => this.openEditor(id),
						"wxi-trash": (e, id) => this.deleteItem(id)
					}
				},
				{
					css: "activities_button",
					cols: [
						{},
						{
							view: "button",
							css: "webix_primary",
							width: 150,
							label: "Add new item",
							type: "icon",
							icon: "wxi-plus-circle",
							click: () => this.addItem()
						}
					]
				}
			]
		};
	}

	init() {
		this._componentData.waitData
			.then(() => {
				this.$$("table").sync(this._componentData);
			});

		this.form = this.ui(settingsForm);
		// this.$$("table").attachEvent("onAfterEditStop", (state, editor) => {
		// 	let item = activitiesTypes.getItem(editor.row);
		// 	item.Icon = iconTypes.getItem(+state.value).Icon;
		// });
	}

	openEditor(id) {
		this.form.showForm(id.row, this._name);
	}

	deleteItem(id) {
		if (id && activitiesTypes.exists(id)) {
			webix.confirm("Do you want to delete this activity?")
				.then(() => {
					activitiesTypes.remove(id);
				});
		}
	}

	transformIcon(icon) {
		return `<span class='mdi mdi-${icon}'></span>`;
	}

	addItem() {
		this.form.showForm(false, this._name);
	}
}
