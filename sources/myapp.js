import {JetApp, EmptyRouter, HashRouter, plugins} from "webix-jet";
import "./styles/app.css";

export default class MyApp extends JetApp {
	constructor(config) {
		const defaults = {
			id: APPNAME,
			version: VERSION,
			router: BUILD_AS_MODULE ? EmptyRouter : HashRouter,
			debug: !PRODUCTION,
			start: "/top/settings"
		};

		super({...defaults, ...config});
	}
}

if (!BUILD_AS_MODULE) {
	webix.ready(() => {
		let app = new MyApp();
		app.render();
		app.attachEvent("app:error:resolve", () => {
			webix.delay(() => app.show("/top/activities"));
			webix.message("You were redirected here, because somthing went wrong with contacts page");
		});
		app.use(plugins.Locale, {
			lang: "en",
			storage: webix.storage.local,
			webix: {
				en: "en-US",
				ru: "ru-RU"
			}});
	});
}
