document.addEventListener("DOMContentLoaded", () => {
	var map = L.map("map").setView([55.7558, 37.6176], 12);

	L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
		attribution:
			'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		maxZoom: 18,
	}).addTo(map);

	var marker = L.marker([55.7558, 37.6176])
		.addTo(map)
		.bindPopup("Эта точка является примером билборда")
		.openPopup();

	document
		.getElementById("price-list")
		.addEventListener("change", handleFileSelect, false);

	function handleFileSelect(event) {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = function (e) {
				const data = new Uint8Array(e.target.result);
				const workbook = XLSX.read(data, { type: "array" });

				const firstSheetName = workbook.SheetNames[0];
				const worksheet = workbook.Sheets[firstSheetName];
				const points = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

				processPoints(points);
			};
			reader.readAsArrayBuffer(file);
		}
	}

	function processPoints(points) {
		const pointResults = document.getElementById("point-results");
		pointResults.innerHTML = "";

		points.forEach((point, index) => {
			if (index === 0) return;

			const [lat, lng] = point;
			if (lat && lng) {
				L.marker([lat, lng])
					.addTo(map)
					.bindPopup(`Точка ${index}: ${lat}, ${lng}`);

				// Пример анализа охвата
				const coverage = calculateCoverage(lat, lng);
				const resultItem = document.createElement("li");
				resultItem.textContent = `Точка ${index}: ${lat}, ${lng} - Прогнозное значение охвата: ${coverage}`;
				pointResults.appendChild(resultItem);
			}
		});
	}

	function calculateCoverage(lat, lng) {
		// Пример простой функции для прогнозирования охвата
		// Здесь нужно добавить ваш алгоритм расчета охвата
		return Math.floor(Math.random() * 1000); // Случайное значение для примера
	}
});
