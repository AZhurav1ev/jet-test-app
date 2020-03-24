import {JetView} from "webix-jet";
import settingsForm from "./settingsForm";
import SettingsTable from "./settingsTable";
import {activitiesTypes} from "../models/activitiesTypes";
import {statuses} from "../models/statuses";

export default class Settings extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		const segmentedButton = {
			paddingX: 10,
			cols: [
				{
					view: "segmented",
					label: _("Language"),
					localId: "language",
					inputWidth: 400,
					value: this.app.getService("locale").getLang(),
					options: [
						{id: "en", value: _("English")},
						{id: "ru", value: _("Russian")}
					],
					click: () => this.toggleLanguage()
				}
			]
		};

		const tableTitle = {
			height: 50,
			template: `<h2 class='title'>${_("Activity and Status section")}</h2>`
		};

		const languageTitle = {
			height: 50,
			template: `<h2 class="title">${_("Language section")}</h2>`
		};

		return {
			type: "space",
			rows: [
				languageTitle,
				segmentedButton,
				{
					height: 100
				},
				tableTitle,
				{
					view: "tabbar",
					localId: "tabbar",
					options: [
						{value: _("Activity type")},
						{value: _("Status")}
					]
				},
				{
					cells: [
						{localId: _("Activity type"), rows: [new SettingsTable(this.app, "Activity", activitiesTypes)]},
						{localId: _("Status"), rows: [new SettingsTable(this.app, "Status", statuses)]}
					]
				},
				{}
			]
		};
	}

	init() {
		this.settingsForm = this.ui(settingsForm);
		this.$$("tabbar").attachEvent("onChange", value => this.$$(value).show());
	}

	toggleLanguage() {
		const langs = this.app.getService("locale");
		const value = this.$$("language").getValue();
		langs.setLang(value);
	}
}

