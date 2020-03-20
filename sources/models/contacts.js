const dateToStr = webix.Date.dateToStr("%Y-%m-%d %H:%i");
const strToDate = webix.Date.strToDate("%Y-%m-%d");

export const contacts = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/contacts/",
	save: "rest->http://localhost:8096/api/v1/contacts/",
	scheme: {
		$init: (obj) => {
			obj.value = `${obj.FirstName}  ${obj.LastName}`;
			obj.Birthday = strToDate(obj.Birthday);
			obj.StartDate = strToDate(obj.StartDate);
		},
		$save: (obj) => {
			obj.Birthday = dateToStr(obj.Birthday);
			obj.StartDate = dateToStr(obj.StartDate);
		}
	}
});
