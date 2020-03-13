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

	init(view, url) {
		this.list = this.$$("contactsList");
		this.list.sync(contacts);
		this.list.attachEvent("onItemClick", (id) => {
			this.show(`./details?id=${id}`);
		});
		contacts.attachEvent("onAfterLoad", () => {
			if (url.length <= 1 && this.list.getFirstId()) {
				this.show(`./details?id=${this.list.getFirstId()}`);
			}
			else if (url[1].params.id) {
				this.show(`./details?id=${url[1].params.id}`);
			}
			else {
				this.show("./details");
			}
		});
	}

	ready(view, url) {
		if (url.length <= 1 && this.list.getFirstId()) {
			this.show(`./details?id=${this.list.getFirstId()}`);
		}
		else {
			this.show("./details");
		}
	}

	urlChange(view, url) {
		contacts.waitData.then(() => {
			let id;
			if (url.length <= 1) {
				id = url[0].params.id || this.list.getFirstId();
			}
			else if (url[1].params.id && contacts.exists(url[1].params.id)) {
				id = url[1].params.id;
			}
			else {
				this.list.unselectAll();
			}

			if (id) {
				this.list.select(id);
			}
		});
	}
}
