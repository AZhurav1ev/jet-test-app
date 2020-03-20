import {JetView, plugins} from "webix-jet";

export default class TopView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		let header = {
			type: "Header",
			id: "header",
			template: "#active#",
			css: "webix_header app_header",
			height: 45
		};

		let menu = {
			view: "menu",
			id: "top:menu",
			css: "app_menu",
			width: 180,
			layout: "y",
			select: true,
			template: "<span class='webix_icon #icon#'></span> #value# ",
			data: [
				{value: _("Contacts"), id: "contacts", icon: "wxi-user"},
				{$template: "Separator"},
				{value: _("Activities"), id: "activities", icon: "wxi-calendar"},
				{$template: "Separator"},
				{value: _("Settings"), id: "settings", icon: "wxi-drag"},
				{$template: "Separator"}
			]
		};

		return {
			paddingX: 5,
			css: "app_layout",
			rows: [
				header,
				{
					cols: [
						{
							rows: [
								{
									css: "webix_shadow_medium",
									rows: [menu]
								}
							]
						},
						{
							rows: [
								{$subview: true}
							]
						}
					]
				}
			]
		};
	}

	init() {
		this.use(plugins.Menu, "top:menu");
		const menu = this.$$("top:menu");
		const header = this.$$("header");

		menu.attachEvent("onAfterSelect", (id) => {
			if (id) {
				let active = menu.getItem(id).value;
				header.setValues({active});
			}
		});
	}
}
