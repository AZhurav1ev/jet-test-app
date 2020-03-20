import {JetView} from "webix-jet";
import {activities} from "../models/activities";
import {activitiesTypes} from "../models/activitiesTypes";
import {contacts} from "../models/contacts";
import activitiesForm from "./activitiesForm";

export default class Activities extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		const button = {
			css: "activities_button",
			cols: [
				{
					view: "button",
					localId: "addButton",
					value: "Add",
					css: "webix_primary",
					width: 220,
					label: _("Add activity"),
					type: "icon",
					icon: "wxi-plus-circle",
					click: () => this.showForm()
				}
			]
		};

		const table = {
			view: "datatable",
			editable: true,
			select: true,
			localId: "activitiesTable",
			scroll: "auto",
			columns: [
				{id: "State", header: "", template: "{common.checkbox()}", checkValue: "Close", uncheckValue: "Open", width: 50},
				{id: "TypeID", header: [_("Activity type"), {content: "selectFilter"}], collection: activitiesTypes, sort: "text"},
				{id: "DueDate", header: [_("Due Date"), {content: "dateRangeFilter"}], format: webix.i18n.longDateFormatStr, sort: "date", width: 150},
				{id: "Details", header: [_("Details"), {content: "textFilter"}], template: "#Details#", fillspace: true, sort: "string"},
				{id: "ContactID", header: [_("Contact"), {content: "selectFilter"}], width: 150, options: contacts, sort: "string"},
				{id: "edit", header: "", width: 50, template: "<span class='webix_icon wxi-pencil'></span>"},
				{id: "delete", header: "", width: 50, template: "<span class='webix_icon wxi-trash'></span>"}
			],
			onClick: {
				"wxi-pencil": (e, id) => this.editItem(id),
				"wxi-trash": (e, id) => this.deleteItem(id)
			}
		};

		const tabbar = {
			view: "tabbar",
			localId: "activitiesFilterTabbar",
			options: [
				{value: _("All")},
				{value: _("Overdue")},
				{value: _("Completed")},
				{value: _("Today")},
				{value: _("Tomorrow")},
				{value: _("This week")},
				{value: _("This month")}
			]
		};

		return {
			rows: [
				{
					type: "clean",
					cols: [
						tabbar,
						button
					]
				},
				table
			]
		};
	}

	init() {
		this.activityForm = this.ui(activitiesForm);
		webix.promise.all([
			contacts.waitData,
			activities.waitData,
			activitiesTypes.waitData
		]).then(() => {
			this.$$("activitiesTable").sync(activities);
			activities.data.filter();
		});
		this.$$("activitiesFilterTabbar").attachEvent("onChange", () => this.$$("activitiesTable").filterByAll());

		this.$$("activitiesTable").registerFilter(
			this.$$("activitiesFilterTabbar"), {
				columnId: "State",
				compare: (status, filter, activity) => {
					const currentDate = new Date();
					const today = webix.Date.datePart(currentDate);
					const tomorrow = webix.Date.add(currentDate, 1, "day", true);
					const currentWeekStart = webix.Date.weekStart(currentDate);
					const currentMonthStart = webix.Date.monthStart(currentDate);
					switch (filter) {
						case "Overdue":
						case "Просроченные":
							return activity.DueDate < today && status !== "Close";
						case "Completed":
						case "Выполненные":
							return status !== "Open";
						case "Today":
						case "На сегодня":
							return webix.Date.equal(webix.Date.datePart(activity.DueDate), today) && status !== "Close";
						case "Tomorrow":
						case "На завтра":
							return webix.Date.equal(webix.Date.datePart(activity.DueDate), tomorrow);
						case "This week":
						case "На этой неделе":
							return activity.DueDate > currentWeekStart && activity.DueDate < webix.Date.add(currentWeekStart, 7, "day", true);
						case "This month":
						case "В этом месяце":
							return activity.DueDate > currentMonthStart && activity.DueDate < webix.Date.add(currentMonthStart, 1, "month", true);
						default:
							return true;
					}
				}
			},
			{
				getValue: node => node.getValue(),
				setValue: (node, value) => node.setValue(value)
			}

		);
	}

	editItem(id) {
		if (id) {
			this.activityForm.showForm(id);
		}
	}

	deleteItem(id) {
		if (id) {
			webix.confirm("Do you really want to delete this item?")
				.then(() => {
					activities.remove(id);
				});
		}
	}

	showForm() {
		this.activityForm.showForm();
	}
}
