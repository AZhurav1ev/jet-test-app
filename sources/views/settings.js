import {JetView} from "webix-jet";

export default class Settings extends JetView {
	config() {
		return {
			rows: [
				{
					template: "Settings page"
				}
			]
		};
	}
}
