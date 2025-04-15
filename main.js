async function getContributions(username) {
	if (username == "") {
		getDefaultContributions();
		return 0;
	}

document.querySelectorAll(".ch-container").forEach(el => el.remove());
	let user_data = await (await fetch(`https://artbobylev.ru/gitcloths/api/${username}?y=last`)).json();
	if (user_data.error){
	window.location.href = "http://artbobylev.ru/gitcloths";
		return 0;
	}
	user_data = user_data.contributions;
	user_data.forEach( obj => delete obj["level"]);
	let my_date = new Date(user_data[0]["date"]);
	let first_date = new Date(my_date.getFullYear(), my_date.getMonth() + 2, 1);
	let summ = 0;
	let values = [];
	user_data.forEach( obj => summ += obj["count"]); 
	let summ_text = "";
	if (Math.floor(summ / 1000)) {
		summ_text = summ.toString().slice(0, -3) + "," + summ.toString().slice(-3);
	} else {
		summ_text = summ;
	}
	user_data.forEach( obj => obj["count"] != 0 ? values.push(obj["count"]):null); 
	document.querySelectorAll(".cal-heatmap").forEach(function(el) {
	render_cal(el, user_data, first_date, getClassBounds(values, 4));
		el.classList.remove("[&_.ch-subdomain-bg]:fill-[#386c3e]");
	});

	document.querySelectorAll(".user-name").forEach(el => el.innerHTML = "@" + username + " on github");
	document.querySelectorAll(".item_username").forEach(el => el.value = username);
	document.querySelectorAll(".contrib-data").forEach(el => el.innerHTML = summ_text + " contributions in the last year");
}

function getClassBounds(data, nClasses) {
	let minValue = Math.min(...data);
	let maxValue = Math.max(...data);
	let classWidth = (maxValue - minValue) / nClasses;
	let classBounds = [minValue];
	for (let i = 1; i < nClasses; i++) {
		classBounds[i] = Math.ceil(minValue + (i * classWidth));
	}
	return classBounds;
}


function render_cal(element, data, first_date, domain=[1, 2, 3, 4]) {
	const cal = new CalHeatmap();
	cal.paint({
		itemSelector: element,
		domain: {
			type: 'month',
			gutter: 4,
			label: { text: '', textAlign: 'start', position: 'top' },
		},
		subDomain: { type: 'ghDay', radius: 2, width: 11, height: 11, gutter: 4 },
		date: { start: first_date },
		range: 12,
		data: {
			source: data,
			x: (datum) => +new Date(datum["date"]),
			y: (datum) => +datum["count"]
		},
		scale: {
			color: {
				type: 'threshold',
				range: ['rgb(235,237,240)', 'rgb(172,231,174)', 'rgb(105,193,110)', 'rgb(83,159,87)', 'rgb(56,108,62)'],
				domain: domain,
			},
		},
	},
	);
}

function getDefaultContributions() {
	document.querySelectorAll(".ch-container").forEach(el => el.remove());
	document.querySelectorAll(".cal-heatmap").forEach(function(el) {
	render_default_cal(el);
	el.classList.add("[&_.ch-subdomain-bg]:fill-[#386c3e]");
	});
	document.querySelectorAll(".user-name").forEach(el => el.innerHTML = "&infin; contributions in 2025");
	document.querySelectorAll(".item_username").forEach(el => el.value = "default");
	document.querySelectorAll(".contrib-data").forEach(el => el.innerHTML = "");
}

async function render_default_cal(element) {
	const cal = new CalHeatmap();
	cal.paint({
		itemSelector: element,
		domain: {
			type: 'month',
			gutter: 4,
			label: { text: '', textAlign: 'start', position: 'top' },
		},
		subDomain: { type: 'ghDay', radius: 2, width: 11, height: 11, gutter: 4 },
		date: { start: new Date('2024-01-01') },
		range: 12,
		data: { },
		scale: {
			color: {
				type: 'linear',
				range: ['rgb(56,108,62)'],
				domain: [1],
			},
		},
	},
	);
}

function findGetParameter(parameterName) {
	let result = null,
	tmp = [];
	const items = location.search.substr(1).split("&");
	for (let index = 0; index < items.length; index++) {
		tmp = items[index].split("=");
		if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
	}
	return result;
}

window.addEventListener('load', function() {
	if (findGetParameter("user")) {
		getContributions(findGetParameter("user"));
		document.getElementById('git_input').value = findGetParameter("user");
	} else {
		getDefaultContributions();
	}
});
