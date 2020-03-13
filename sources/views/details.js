import {JetView} from "webix-jet";
import {contacts} from "../models/contacts";
import {statuses} from "../models/statuses";

export default class Details extends JetView {
	config() {
		const details = {
			view: "template",
			localId: "userDetails",
			template: contact => `
				<div class="details_wrapper">
					<div class="details_header">
						<h2>${contact.FirstName || "-"} ${contact.LastName || "-"}</h2>
					</div>
					<div class="details_body">
						<div class="details_image">
							<image src="${contact.Photo || "https://ru.seaicons.com/wp-content/uploads/2015/06/Users-User-Male-4-icon.png"}" />
							<p class="status">${contact.Status || "-"}</p>
						</div>
						<div class="details_contacts">
							<span class="mdi mdi-email"> ${contact.Email || "-"}</span>
							<span class="mdi mdi-skype"> ${contact.Skype || "-"}</span>
							<span class="mdi mdi-tag"> ${contact.Job || "-"}</span>
							<span class='mdi mdi-briefcase'> ${contact.Company || "-"}</span>
						</div>
						<div class="details_contacts">
							<span class='mdi mdi-calendar-month'> ${contact.Birthday || "-"}</span>
							<span class='mdi mdi-map-marker'> ${contact.Address || "-"}</span>
					</div>
					</div>
				</div>
			`
		};

		const buttons = {
			padding: 15,
			css: "details_buttons",
			rows: [
				{
					cols: [
						{
							view: "button",
							disabled: true,
							css: "webix_primary",
							width: 100,
							label: "Delete",
							type: "icon",
							icon: "wxi-trash"
						},
						{
							view: "button",
							disabled: true,
							css: "webix_primary",
							width: 100,
							label: "edit",
							type: "icon",
							icon: "wxi-pencil"
						}
					]
				},
				{}
			]
		};

		return {
			rows: [
				{
					cols: [
						details,
						buttons
					]
				}
			]
		};
	}

	urlChange() {
		const userDetails = this.$$("userDetails");
		webix.promise.all([
			contacts.waitData,
			statuses.waitData
		]).then(() => {
			const id = this.getParam("id");
			if (id && contacts.exists(id)) {
				const contact = contacts.getItem(id);
				if (contact.StatusID) {
					contact.Status = statuses.getItem(contact.StatusID).State || false;
				}
				userDetails.setValues(contact);
			}
		});
	}
}
