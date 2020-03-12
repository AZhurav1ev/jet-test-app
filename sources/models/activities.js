const strToDate = webix.Date.strToDate("%d-%m-%Y %H:%i");
const dateToStr = webix.Date.dateToStr("%Y-%m-%d %H:%i");

export const activities = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/activities/ ",
	save: "rest->http://localhost:8096/api/v1/activities/",
	scheme: {
		$init: (obj) => {
			obj.DueDate = strToDate(obj.DueDate);
			obj.DueTime = dateToStr(obj.DueTime);
		},
		$change: (obj) => {
			obj.DueDate = strToDate(obj.DueDate);
			obj.DueTime = strToDate(obj.DueTime);
		},
		$save: (obj) => {
			obj.DueDate = dateToStr(obj.DueDate);
			obj.DueTime = dateToStr(obj.DueTime);
		}
	}
});
