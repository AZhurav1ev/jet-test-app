import {JetView} from "webix-jet";
import {contacts} from "../models/contacts";

export default class Contacts extends JetView {
	config() {
		return {
			rows: [
				{
					cols: [
						{
							view: "list",
							localId: "contactsList",
							width: 250,
							scroll: false,
							select: true,
							type: {
								height: 62
							},
							template: contact => `
								<image class="user_image" src=${contact.image || "https://ru.seaicons.com/wp-content/uploads/2015/06/Users-User-Male-4-icon.png"} />
								<div class="user_block">
									<span class="user_credentials"><b>${contact.FirstName || "-"} ${contact.LastName || "-"}</b></span>
									<span class="user_credentials"><small>${contact.Job || "-"}</small></span>
								</div>
							`
						},
						{$subview: true}
					]
				}
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
}
