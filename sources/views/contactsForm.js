import {JetView} from "webix-jet";
import {contacts} from "../models/contacts";
import {statuses} from "../models/statuses";

export default class ContactsForm extends JetView {
	config() {
		const header = {
			paddingX: 30,
			cols: [
				{
					localId: "header",
					template: "<h2 class='contactsForm_header'>#action# contact</h2>",
					type: "clean",
					height: 50
				},
				{}
			]
		};

		const leftPart = {
			paddingX: 30,
			rows: [
				{view: "text", labelWidth: 100, label: "First Name", name: "FirstName", invalidMessage: "Please enter your first name", required: true},
				{view: "text", labelWidth: 100, label: "Last Name", name: "LastName", invalidMessage: "Please enter your last name", required: true},
				{view: "datepicker", labelWidth: 100, label: "Joining date", name: "StartDate", value: new Date(), format: "%d %M %Y", invalidMessage: "Please select date"},
				{view: "combo", labelWidth: 100, label: "Status", name: "StatusID", value: 1, options: statuses, invalidMessage: "Please select status", required: true},
				{view: "text", labelWidth: 100, label: "Job", name: "Job", invalidMessage: "Please enter your current job"},
				{view: "text", labelWidth: 100, label: "Company", name: "Company", invalidMessage: "Please enter your company name"},
				{view: "text", labelWidth: 100, label: "Website", name: "Website", invalidMessage: "Please enter your website"},
				{view: "textarea", labelWidth: 100, label: "Address", name: "Address", invalidMessage: "Please enter your address"}
			]
		};

		const rightTopPart = {
			paddingX: 30,
			rows: [
				{view: "text", label: "Email", name: "Email", invalidMessage: "Please enter your email", required: true},
				{view: "text", label: "Skype", name: "Skype", invalidMessage: "Please enter youк Skype name"},
				{view: "text", label: "Phone", name: "Phone", invalidMessage: "Phone number must be digits"},
				{view: "datepicker", label: "Birthday", name: "Birthday", type: "date", invalidMessage: "Please select date", required: true}
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
							value: "Change photo",
							localId: "imageUploader",
							link: "userImage",
							accept: "image/png, image/gif, image/jpg, image/jpeg",
							autosend: false,
							multiple: false,
							width: 150
						},
						{
							view: "button",
							value: "Delete photo",
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
				{view: "button", value: "Cancel", css: "webix_primary", width: 150, click: (id, e) => this.closeForm(e.target.innerHTML)},
				{view: "button", localId: "button", value: "Add", css: "webix_primary", width: 150, click: () => this.addContact()}
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

		this.$$("imageUploader").attachEvent("onBeforeFileAdd", (upload) => {
			this.reader.readAsDataURL(upload.file);
			this.reader.onload = () => this.image.setValues({Photo: this.reader.result});
		});
	}

	urlChange() {
		webix.promise.all([
			contacts.waitData,
			statuses.waitData
		]).then(() => {
			const id = this.getParam("id", true);
			const action = id ? "Edit" : "Add";
			if (id && contacts.exists(id)) {
				const item = contacts.getItem(id);
				this.form.setValues(item);
				this.image.setValues({Photo: item.Photo});
			}
			if (!id) {
				this.form.clear();
				this.form.clearValidation();
				this.image.setValues({Photo: ""});
			}
			this.$$("header").setValues({action});
			this.$$("button").setValue(action);
		});
	}

	closeForm(id) {
		this.form.clear();
		this.form.clearValidation();
		const userId = this.getParam("id", true);
		if (id === "Cancel" && userId) {
			this.show(`/top/contacts?id=${userId}/details`);
		}
		else if (Number.isInteger(id)) {
			this.show(`/top/contacts?id=${id}/details`);
		}
		else {
			const firstId = contacts.getFirstId();
			this.show(`/top/contacts?id=${firstId}/details`);
		}
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
