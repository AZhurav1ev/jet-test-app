export const activitiesTypes = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/activitytypes/",
	save: "rest->http://localhost:8096/api/v1/activitytypes/",
	scheme: {
		$init: (obj) => {
			obj.value = obj.Value;
		},
		$save: (obj) => {
			obj.Value = obj.value;
			delete obj.value;
			delete obj.type;
		}
	}
});
