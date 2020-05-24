import {tiles} from './tileLibrary';
// console.log(tiles);

// ToDo Добавить предсказуемый генератор рандомных чисел, что бы можно было строить "миры" по seed'у
// ToDo Превратить всю эту кашу в класс Grid с основным методом generate... Нужно немного (много) рефакторинга


let prevMistake: string = '';

let sameMistakeCount: number = 0;
const codes: string[] = tiles.map(el => el.code);

const tilesByCode = tiles.reduce((res, el) => ({...res, [el.code]: el}), {});
const LEFT_IDX = 0, TOP_IDX = 1, RIGHT_IDX = 2, BOTTOM_IDX = 3;
const possibleNbsByCode = {
	left: tiles.reduce((res, el) => {
		res[el.code] = el.validNb[LEFT_IDX];
		return res;
	}, {}),
	top: tiles.reduce((res, el) => {
		res[el.code] = el.validNb[TOP_IDX];
		return res;
	}, {}),
	right: tiles.reduce((res, el) => {
		res[el.code] = el.validNb[RIGHT_IDX];
		return res;
	}, {}),
	bottom: tiles.reduce((res, el) => {
		res[el.code] = el.validNb[BOTTOM_IDX];
		return res;
	}, {})
};

function arrayIntersect(...args: any) {
	let result = [];
	let lists;

	if(arguments.length === 1) {
		lists = arguments[0];
	} else {
		lists = arguments;
	}

	for(let i = 0; i < lists.length; i++) {
		let currentList = lists[i];
		for(let y = 0; y < currentList.length; y++) {
			let currentValue = currentList[y];
			if(result.indexOf(currentValue) === -1) {
				if(lists.filter(function(obj) { return obj.indexOf(currentValue) === -1 }).length === 0) {
					result.push(currentValue);
				}
			}
		}
	}
	return result;
}

/**
 *
 * @param grid
 * @param {Number} size
 * @returns {string|boolean}
 */

function checkValid(grid, size) {
	const SIZE = size;
	let hasEmpty = false;
	for (let i = 0; i < SIZE-1; i++) {
		const curRow = grid[i];
		const topRow = grid[i-1] || false;
		const bottomRow = grid[i+1] || false;
		for (let j = 0; j < SIZE; j++) {
			const curCellMeta = tilesByCode[curRow[j]];
			const topCell = topRow ? topRow[j] : false;
			const bottomCell = bottomRow ? bottomRow[j] : false;
			const leftCell = curRow[j-1] || false;
			const rightCell = curRow[j+1] || false;
			if (curCellMeta) {
				let mistake = '';
				if (topCell && !possibleNbsByCode.top[curCellMeta.code].includes(topCell)) {
					mistake = `mistake by TOP at ${i}:${j}`;
				}
				if (rightCell && !possibleNbsByCode.right[curCellMeta.code].includes(rightCell)) {
					mistake = (`mistake by RIGHT at ${i}:${j}`);
				}
				if (bottomCell && !possibleNbsByCode.bottom[curCellMeta.code].includes(bottomCell)) {
					mistake = (`mistake by BOTTOM at ${i}:${j}`);
				}
				if (leftCell && !possibleNbsByCode.left[curCellMeta.code].includes(leftCell)) {
					mistake = (`mistake by LEFT at ${i}:${j}`);
				}
				if (mistake) {
					console.warn(mistake);
					if (mistake === prevMistake) {
						if (sameMistakeCount < 5) {
							sameMistakeCount++
						} else {
							console.log('Got repeating mistake');
							// bailOut(grid);
						}
					} else {
						console.log('prevMistake:', prevMistake);
						console.log('sameMistakeCount: ', sameMistakeCount);
						prevMistake = mistake;
						sameMistakeCount = 0;
					}
					return false
				}
			} else {
				hasEmpty = true;
			}
		}
	}
	if (hasEmpty) return 'Has empty';
	return true;
}

/**
 *
 * @param {array} emptyCells
 * @return {array}
 */
function sortEntrop(emptyCells) {
	return emptyCells.sort((a, b) => {
		if (a.entrop === b.entrop) return 0;
		if (a.entrop > b.entrop) return -1;
		if (a.entrop < b.entrop) return 1;
	})
}

/**
 *
 * @param grid
 * @param {Number} size
 * @returns {number}
 */

function resolveRandom(grid, size) {

	// console.log('--->>>>>  resolving');
	const SIZE = size;
	let emptyCells = [];
	for (let i = 0; i < SIZE; i++) {
		for (let j = 0; j < SIZE; j++) {
			let hasTop = !!grid[i-1] && !!grid[i-1][j],
				hasBottom = !!grid[i+1] && !!grid[i+1][j],
				hasLeft = !!grid[i][j-1] && !!grid[i][j-1],
				hasRight = !!grid[i][j+1] && !!grid[i][j+1];
			if (!grid[i][j]) {
				emptyCells.push({i,j, entrop: [hasBottom, hasLeft, hasRight, hasTop].reduce((res,el) => res + Number(el), 0)})
			}
		}
	}
	if (!emptyCells.length) {
		console.warn('Tried to resolve grid with all known cells');
		return 0;
	}

	if (process.env.USE_ENTROPY_PRIORITISE && process.env.USE_ENTROPY_PRIORITISE.toLowerCase() === 'true') {
		console.log('Will prioritise cells on entropy basis');
		emptyCells = sortEntrop(emptyCells);
		const lowestEntrop = Math.min(...emptyCells.map(el => el.entrop));
		emptyCells = emptyCells.filter(el => el.entrop === lowestEntrop);
	}

	const cellToResolve = Math.floor(Math.random() * emptyCells.length);

	const {i, j} = emptyCells[cellToResolve];

	let topNb = !!grid[i-1] && grid[i-1][j],
		bottomNb = !!grid[i+1] && grid[i+1][j],
		leftNb = !!grid[i][j-1] && grid[i][j-1],
		rightNb = !!grid[i][j+1] && grid[i][j+1];

	let possibleTiles = [];
	// По умолчанию можно поставить любой тайл...
	let possibleByTop = codes,possibleByBottom = codes,possibleByLeft = codes,possibleByRight = codes;
	// Если есть какой то сосед то ограничиваем список тайлов списком возможных соседей этого соседа
	if (topNb) {
		possibleByTop = possibleNbsByCode.bottom[topNb]
	}
	if (bottomNb) {
		possibleByBottom = possibleNbsByCode.top[bottomNb]
	}
	if (leftNb) {
		possibleByLeft = possibleNbsByCode.right[leftNb]
	}
	if (rightNb) {
		possibleByRight = possibleNbsByCode.left[rightNb]
	}
	possibleTiles = arrayIntersect([possibleByTop, possibleByBottom, possibleByLeft, possibleByRight]);

	if (possibleTiles.length === 0) {
		// Если по какой то причине не существует тайлов которые можно сюда поставить, значит эта комбинация соседей невозможная и их нужно переделать
		// console.warn('Have no possible tiles!!!');
		if (topNb) grid[i-1][j] = undefined;
		if (bottomNb)grid[i+1][j] = undefined;
		if (leftNb)grid[i][j-1] = undefined;
		if (rightNb)grid[i][j+1] = undefined;
	} else {
		grid[i][j] = possibleTiles[Math.floor(Math.random() * possibleTiles.length)]
	}

	// После каждого установленного тайла проверяю что я не сделал карту "невозможной"
	if (checkValid(grid, SIZE) === false) {
		console.warn('made a mistake, reverting', {i, j, emptyCells, possibleTiles, nbs: {topNb, bottomNb, leftNb, rightNb}});
		print(grid, true);
		grid[i][j] = undefined;
		// На всякий случай обнуляю еще и соседей - они привели к выбору невозможного тайла и могут сделать это еще раз
		if (topNb) grid[i-1][j] = undefined;
		if (bottomNb)grid[i+1][j] = undefined;
		if (leftNb)grid[i][j-1] = undefined;
		if (rightNb)grid[i][j+1] = undefined;
	}

	let remainingCellCount = 0;
	for (let i = 0; i < SIZE - 1; i++) {
		for (let j = 0; j < SIZE - 1; j++) {
			if (!grid[i][j]) remainingCellCount++
		}
	}
	// Не самый очевидный интерфейс, что этот метод возвращает количество оставшихся клеток, но пусть будет пока, все равно надо все переделать
	return remainingCellCount;
}

export function generate (size) {

	console.log('--->>>>>  generating');

	const SIZE = size;
	// Инициализация решетки заданными размерами.... Выглядит как дичь, стоит переделать наверн
	let grid = new Array(SIZE).fill(new Array(SIZE)).map(() => (new Array(SIZE)));
	// Делаю рамку из травы.... В целом бесполезная операция - судя по всему механизм резолва невозможных ситуаций регулярно эту рамку ломает.
	// Но пусть пока будет
	grid[0] = new Array(SIZE).fill('grass');
	grid[SIZE-1] = new Array(SIZE).fill('grass');
	for (let i = 0; i < SIZE-1; i++) {
		grid[i][0] = 'grass';
		grid[i][SIZE-1] = 'grass';
	}
	let remainingCount;
	const start = new Date().getTime();
	do {
		remainingCount = resolveRandom(grid, SIZE);
	} while (remainingCount > 0);
	console.log (`--    time elapsed: ${new Date().getTime() - start}ms`);
	return grid;
};

export function print(grid, indexed = false) {

	console.log('--->>>>>  printing');

	let i = 0;
	for (let row of grid) {
		for (let j = 0; j < 3; j++) {
			let str = indexed ? `${i}\t` : ''; //;
			for (let cell of row) {
				if (!cell) {
					str += '   ';
				} else {
					str += tilesByCode[cell].value.split('\r\n')[j]
				}
				if (indexed) {
					str += '|'
				}
			}
			console.log(str);
		}
		i++
	}
}