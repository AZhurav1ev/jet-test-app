import {JetView} from "webix-jet";
import {contacts} from "../models/contacts";
import {statuses} from "../models/statuses";

export default class ContactsForm extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		const header = {
			paddingX: 30,
			cols: [
				{
					localId: "header",
					template: `<h2 class='contactsForm_header'>#action# ${_("contact")}</h2>`,
					type: "clean",
					height: 50
				},
				{}
			]
		};

		const leftPart = {
			paddingX: 30,
			rows: [
				{view: "text", labelWidth: 100, label: _("First Name"), name: "FirstName", invalidMessage: _("Please enter your first name"), required: true},
				{view: "text", labelWidth: 100, label: _("Last Name"), name: "LastName", invalidMessage: _("Please enter your last name"), required: true},
				{view: "datepicker", labelWidth: 100, label: _("Joining date"), name: "StartDate", value: new Date(), format: "%d %M %Y"},
				{view: "combo", labelWidth: 100, label: _("Status"), name: "StatusID", value: 1, options: statuses, invalidMessage: _("Please select status"), required: true},
				{view: "text", labelWidth: 100, label: _("Job"), name: "Job"},
				{view: "text", labelWidth: 100, label: _("Company"), name: "Company"},
				{view: "text", labelWidth: 100, label: _("Website"), name: "Website"},
				{view: "textarea", labelWidth: 100, label: _("Address"), name: "Address"}
			]
		};

		const rightTopPart = {
			paddingX: 30,
			rows: [
				{view: "text", label: _("Email"), name: "Email", invalidMessage: _("Please enter your email"), required: true},
				{view: "text", label: "Skype", name: "Skype"},
				{view: "text", label: _("Phone"), name: "Phone"},
				{view: "datepicker", label: _("Birthday"), name: "Birthday", type: "date", invalidMessage: _("Please select date"), required: true}
			]
		};

		const rightBottomPart = {
			paddingX: 30,
			cols: [
				{
					template: contact => `<image class="contactsForm_userImage" src=${contact.Photo || "https://ru.seaicons.com/wp-content/uploads/2015/06/Users-User-Male-4-icon.png"} />`,
					name: "Photo",
					localId: "userImage",
					type: "clean",
					maxHeight: 200
				},
				{
					margin: 5,
					rows: [
						{},
						{
							view: "uploader",
							value: _("Change photo"),
							localId: "imageUploader",
							link: "userImage",
							accept: "image/png, image/gif, image/jpg, image/jpeg",
							autosend: false,
							multiple: false,
							width: 150
						},
						{
							view: "button",
							value: _("Delete photo"),
							width: 150,
							click: () => this.deletePhoto()
						}
					]
				}
			]
		};

		const footer = {
			cols: [
				{},
				{view: "button", value: _("Cancel"), css: "webix_primary", width: 150, click: () => this.cancelForm()},
				{view: "button", localId: "button", css: "webix_primary", width: 150, click: () => this.addContact()}
			]
		};

		return {
			view: "form",
			localId: "contactsForm",
			elements: [
				header,
				{
					cols: [
						leftPart,
						{
							rows: [
								rightTopPart,
								rightBottomPart
							]
						}
					]
				},
				{},
				footer
			],
			rules: {
				Email: webix.rules.isEmail
			}
		};
	}

	init() {
		this.form = this.$$("contactsForm");
		this.image = this.$$("userImage");
		this.reader = new FileReader();
		this.reader.onload = () => this.image.setValues({Photo: this.reader.result});

		this.$$("imageUploader").attachEvent("onBeforeFileAdd", (upload) => {
			this.reader.readAsDataURL(upload.file);
		});
	}

	urlChange() {
		const _ = this.app.getService("locale")._;
		webix.promise.all([
			contacts.waitData,
			statuses.waitData
		]).then(() => {
			const id = this.getParam("id", true);
			const action = id ? _("Edit") : _("Add");
			const buttonAction = id ? _("Save") : _("Add");
			if (id && contacts.exists(id)) {
				const item = contacts.getItem(id);
				this.form.setValues(item);
				this.image.setValues({Photo: item.Photo});
			}
			if (!id) {
				this.form.clear();
				this.deletePhoto();
			}
			this.form.clearValidation();
			this.$$("header").setValues({action});
			this.$$("button").setValue(buttonAction);
		});
	}

	closeForm(id) {
		this.form.clear();
		this.form.clearValidation();
		if (id) {
			this.show(`/top/contacts?id=${id}/details`);
			return;
		}
		const firstId = contacts.getFirstId();
		this.show(`/top/contacts?id=${firstId}/details`);
	}

	cancelForm() {
		const id = this.getParam("id", true);
		this.closeForm(id);
	}

	addContact() {
		if (this.form.validate()) {
			const itemData = this.form.getValues();
			itemData.Photo = this.image.getValues().Photo;
			contacts.waitSave(() => {
				if (itemData && itemData.id) {
					contacts.updateItem(itemData.id, itemData);
				}
				else {
					contacts.add(itemData, 0);
				}
			}).then((res) => {
				this.closeForm(res.id);
			});
		}
	}

	deletePhoto() {
		this.image.setValues({Photo: ""});
	}
}
