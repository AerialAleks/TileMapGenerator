const tileMapAssets = {
	grass: 'roadTexture_25.png',
	roadVert: 'roadTexture_01.png',
	roadHor: 'roadTexture_13.png',
	roadCross: 'roadTexture_10.png',
	roadCornerLT: 'roadTexture_19.png',
	roadCornerRT: 'roadTexture_18.png',
	roadCornerLB: 'roadTexture_07.png',
	roadCornerRB: 'roadTexture_06.png',
	water: 'roadTexture_37.png',
	shoreLR: 'roadTexture_75.png',
	shoreRL: 'roadTexture_74.png',
	shoreTB: 'roadTexture_87.png',
	shoreBT: 'roadTexture_86.png',
	shoreAngleTR: 'roadTexture_55.png',
	shoreAngleTL: 'roadTexture_54.png',
	shoreAngleBL: 'roadTexture_66.png',
	shoreAngleBR: 'roadTexture_67.png',
	shoreAngleWBR: 'roadTexture_95.png',
	shoreAngleWBL: 'roadTexture_94.png',
	shoreAngleWTR: 'roadTexture_83.png',
	shoreAngleWTL: 'roadTexture_82.png',
};

const mapContainer = document.querySelector('.map');
const seedInput= document.getElementById('mapSeed');

async function getData() {
	const seed = seedInput.shouldClear ? '' : seedInput.value || '';
	const response = await fetch(`/generate/${seed}`);
	return await response.json();
}

function print(rows) {
	mapContainer.innerHTML = '';
	for (let row of rows) {
		const rowEl = document.createElement('div');
		rowEl.className = 'row';
		for (let cell of row) {
			const cellEl = document.createElement('div');
			cellEl.className = 'tile';
			cellEl.style.setProperty('background-image', `url(/visualizer/assets/tiles/${tileMapAssets[cell]})`);
			rowEl.appendChild(cellEl)
		}
		mapContainer.appendChild(rowEl);
	}
}

async function makeMap() {
	mapContainer.classList.add('loader');
	const data = await getData();
	print(data.rows);
	seedInput.shouldClear = true;
	seedInput.placeholder = data.seed;
	mapContainer.classList.remove('loader');
}

seedInput.addEventListener('focus', () => seedInput.value = seedInput.placeholder);
document.getElementById('getMap').addEventListener('click', makeMap);
