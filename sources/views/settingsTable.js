import {JetView} from "webix-jet";
import {activitiesTypes} from "../models/activitiesTypes";
import settingsForm from "./settingsForm";
import {statuses} from "../models/statuses";

export default class SettingsTable extends JetView {
	constructor(app, name, data) {
		super(app, name);
		this._componentData = data;
		this._name = name;
	}

	config() {
		const _ = this.app.getService("locale")._;
		return {
			rows: [
				{
					view: "datatable",
					localId: "table",
					scroll: "auto",
					select: true,
					autowidth: true,
					autoheight: true,
					columns: [
						{id: "Value", header: _("Activity"), width: 265, editor: "text"},
						{id: "Icon", header: _("Icon"), width: 265, template: obj => `<span class='mdi mdi-${obj.Icon}'></span>`},
						{id: "edit", header: "", width: 70, template: "<span class='webix_icon wxi-pencil'></span>"},
						{id: "delete", header: "", width: 70, template: "<span class='webix_icon wxi-trash'></span>"}
					],
					onClick: {
						"wxi-pencil": (e, id) => this.openEditor(id),
						"wxi-trash": (e, id) => this.deleteItem(id)
					}
				},
				{
					cols: [
						{},
						{
							view: "button",
							css: "webix_primary",
							width: 150,
							label: _("Add new item"),
							type: "icon",
							icon: "wxi-plus-circle",
							click: () => this.addItem()
						}
					]
				},
				{}
			]
		};
	}

	init() {
		this.$$("table").sync(this._componentData);
		this.form = this.ui(settingsForm);
	}

	openEditor(id) {
		this.form.showForm(id.row, this._name);
	}

	deleteItem(id) {
		const _ = this.app.getService("locale")._;
		if (id) {
			const typeName = this._name === "Activity" ? _("activity") : _("status");
			webix.confirm(`${_("Do you want to delete this")} ${typeName}?`)
				.then(() => {
					if (this._name === "Activity") {
						activitiesTypes.remove(id);
						return false;
					}
					statuses.remove(id);
					return false;
				});
		}
	}

	addItem() {
		this.form.showForm(false, this._name);
	}
}
