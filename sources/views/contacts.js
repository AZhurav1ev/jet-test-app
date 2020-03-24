import {JetView} from "webix-jet";
import {contacts} from "../models/contacts";

export default class Contacts extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		return {
			cols: [
				{
					type: "clean",
					rows: [
						{
							view: "text",
							css: "contacts_filterInput",
							localId: "contactsFilterInput",
							placeholder: _("type to find matching contacts"),
							on: {
								onTimedKeyPress: () => this.contactsFilter()
							}
						},
						{
							view: "list",
							localId: "contactsList",
							width: 250,
							scroll: "auto",
							select: true,
							type: {
								height: 62
							},
							template: contact => `
								<image class="user_image" src=${contact.Photo || "https://ru.seaicons.com/wp-content/uploads/2015/06/Users-User-Male-4-icon.png"} />
								<div class="user_block">
									<span class="user_credentials"><b>${contact.FirstName || "-"} ${contact.LastName || "-"}</b></span>
									<span class="user_credentials"><small>${contact.Job || "-"}</small></span>
								</div>
							`
						},
						{view: "button", value: _("+AddContact"), width: 200, css: "webix_primary", align: "center", click: () => this.addContact()}
					]
				},
				{$subview: true}
			]
		};
	}

	init() {
		this.list = this.$$("contactsList");
		this.list.sync(contacts);
		this.list.attachEvent("onItemClick", (id) => {
			this.setParam("id", id, true);
		});

		contacts.waitData.then(() => {
			const id = this.getParam("id") ? this.getParam("id") : this.list.getFirstId();
			this.list.select(id);
			this.setParam("id", id, true);
			this.show("./details");
		});
	}

	urlChange() {
		let id = this.getParam("id");
		if (id && contacts.exists(id)) {
			this.list.select(id);
		}
		if (id && !contacts.exists(id)) {
			this.list.unselectAll();
		}
	}

	addContact() {
		this.list.unselectAll();
		this.show("/top/contacts/contactsForm");
	}

	contactsFilter() {
		const value = this.$$("contactsFilterInput").getValue().toLowerCase();
		this.list.filter(contact => ["FirstName", "LastName", "Email", "Skype", "Job", "Company", "Address"]
			.some(key => contact[key].toLowerCase().indexOf(value) !== -1) ||
			webix.i18n.longDateFormatStr(contact.Birthday).toLowerCase().indexOf(value) !== -1);
	}
}
