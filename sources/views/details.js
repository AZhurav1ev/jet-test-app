import {JetView} from "webix-jet";
import {contacts} from "../models/contacts";
import {statuses} from "../models/statuses";
import {activities} from "../models/activities";
import {contactsData} from "../models/contactsData";
import ContactData from "./contactData";

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
							<span class='mdi mdi-calendar-month'> ${webix.i18n.longDateFormatStr(contact.Birthday) || "-"}</span>
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
							css: "webix_primary",
							width: 100,
							label: "Delete",
							type: "icon",
							icon: "wxi-trash",
							click: () => this.deleteContact()
						},
						{
							view: "button",
							css: "webix_primary",
							width: 100,
							label: "Edit",
							type: "icon",
							icon: "wxi-pencil",
							click: () => this.editContact()
						}
					]
				},
				{}
			]
		};

		return {
			type: "clean",
			rows: [
				{
					gravity: 0.8,
					cols: [
						details,
						buttons
					]
				},
				ContactData
			]
		};
	}

	urlChange() {
		webix.promise.all([
			contacts.waitData,
			statuses.waitData
		]).then(() => {
			const id = this.getParam("id", true);
			if (id && contacts.exists(id)) {
				const contact = webix.copy(contacts.getItem(id));
				contact.Status = statuses.getItem(contact.StatusID).Value;
				this.$$("userDetails").setValues(contact);
			}
		});
	}

	editContact() {
		this.show("./contactsForm");
	}

	collectionRemover(collection, userId) {
		collection
			.find(item => String(item.ContactID) === String(userId))
			.forEach(item => collection.remove(item.id));
	}

	deleteContact() {
		const id = +this.getParam("id", true);
		if (id && contacts.exists(id)) {
			webix.confirm("Do you really want to delete this contact?")
				.then(() => {
					this.collectionRemover(activities, id);
					this.collectionRemover(contactsData, id);

					contacts.remove(id);

					const firstId = contacts.getFirstId();
					this.show(`/top/contacts?id=${firstId}/details`);
				});
		}
	}
}

