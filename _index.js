const LEFT_IDX = 0, TOP_IDX = 1, RIGHT_IDX = 2, BOTTOM_IDX = 3;

// const SIZE = 8;

const tiles = [
	{
		value: '░░░\r\n░░░\r\n░░░',
		code: 'grass',
		validNb: [
			['grass', 'roadVert',  'roadCornerLB', 'roadCornerLT'], //left
			['grass', 'roadHor', 'roadCornerLT', 'roadCornerRT'], //top
			['grass', 'roadVert',  'roadCornerRB', 'roadCornerRT'], //right
			['grass', 'roadHor', 'roadCornerLB', 'roadCornerRB']  //bottom
		]
	},
	{
		value: '░║░\r\n░║░\r\n░║░',
		code: 'roadVert',
		validNb: [
			['grass'], //left
			['roadCross','roadVert', 'roadCornerLB', 'roadCornerRB'], //top
			['grass'], //right
			['roadCross','roadVert', 'roadCornerLT', 'roadCornerRT'], //bottom
		]
	},
	{
		value: '░░░\r\n═══\r\n░░░',
		code: 'roadHor',
		validNb: [
			['roadCross', 'roadHor', 'roadCornerRT', 'roadCornerRB'], //left
			['grass'], //top
			['roadCross', 'roadHor', 'roadCornerLT', 'roadCornerLB'], //right
			['grass'], //bottom
		]
	},
	{
		value: '░║░\r\n═╬═\r\n░║░',
		code: 'roadCross',
		validNb: [
			[/*'roadCross',*/ 'roadHor', /*'roadCornerRT', 'roadCornerRB'*/], //left
			[/*'roadCross',*/ 'roadVert'], //top
			[/*'roadCross',*/ 'roadHor', /*'roadCornerLT', 'roadCornerLB'*/], //right
			[/*'roadCross',*/ 'roadVert']  //bottom
		]
	},
	{
		value: '░║░\r\n═╝░\r\n░░░',
		code: 'roadCornerLT',
		validNb: [
			['roadCross', 'roadHor', 'roadCornerRT', 'roadCornerRB'], //left
			['roadCross','roadVert', 'roadCornerLB', 'roadCornerRB'], //top
			['grass'], //right
			['grass']  //bottom
		]
	},
	{
		value: '░║░\r\n░╚═\r\n░░░',
		code: 'roadCornerRT',
		validNb: [
			['grass'], //left
			['roadCross','roadVert', 'roadCornerLB', 'roadCornerRB'], //top
			['roadCross', 'roadHor'/*, 'roadCornerLT'*/, 'roadCornerLB'], //right
			['grass']  //bottom
		]
	},
	{
		value: '░░░\r\n═╗░\r\n░║░',
		code: 'roadCornerLB',
		validNb: [
			['roadCross', 'roadHor', 'roadCornerRT', 'roadCornerRB'], //left
			['grass'], //top
			['grass'], //right
			['roadCross','roadVert', 'roadCornerLT', 'roadCornerRT']  //bottom
		]
	},
	{
		value: '░░░\r\n░╔═\r\n░║░',
		code: 'roadCornerRB',
		validNb: [
			['grass'], //left
			['grass'], //top
			['roadCross', 'roadHor', 'roadCornerLT', 'roadCornerLB'], //right
			['roadCross','roadVert', 'roadCornerLT', 'roadCornerRT']  //bottom
		]
	}
];

const codes = tiles.map(el => el.code);
const tilesByCode = tiles.reduce((res, el) => ({...res, [el.code]: el}), {});
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

function arrayIntersect() {
	var result = [];
	var lists;

	if(arguments.length === 1) {
		lists = arguments[0];
	} else {
		lists = arguments;
	}

	for(var i = 0; i < lists.length; i++) {
		var currentList = lists[i];
		for(var y = 0; y < currentList.length; y++) {
			var currentValue = currentList[y];
			if(result.indexOf(currentValue) === -1) {
				if(lists.filter(function(obj) { return obj.indexOf(currentValue) == -1 }).length == 0) {
					result.push(currentValue);
				}
			}
		}
	}
	return result;
}

function hasUnknownTiles(grid) {
	for (let row of grid) {
		for (let cell of row) {
			if (!cell) return true
		}
	}
	return false;
}

function bailOut(grid) {
	console.log('bailing out');
	print(grid);
	process.exit(1);
}

let prevMistake = '';
let sameMistakeCount = 0;

function checkValid(grid) {
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
							bailOut(grid);
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

function resolveRandom(grid) {
	let emptyCells = [];
	for (let i = 0; i < SIZE - 1; i++) {
		for (let j = 0; j < SIZE - 1; j++) {
			let hasTop = !!grid[i-1] && !!grid[i-1][j],
				hasBottom = !!grid[i+1] && !!grid[i+1][j],
				hasLeft = !!grid[i][j-1] && !!grid[i][j-1],
				hasRight = !!grid[i][j+1] && !!grid[i][j+1];
			if (!grid[i][j]) {
				emptyCells.push({i,j, entrop: [hasBottom, hasLeft, hasRight, hasTop].reduce((res,el) => res+el, 0)})
			}
		}
	}
	if (!emptyCells.length) {
		console.warn('Tried to resolve grid with all known cells');
		debugger
		return;
	}

	// emptyCells = sortEntrop(emptyCells);
	// const lowestEntrop = Math.min(...emptyCells.map(el => el.entrop));
	// emptyCells = emptyCells.filter(el => el.entrop === lowestEntrop);

	const cellToResolve = Math.floor(Math.random() * emptyCells.length);

	const {i, j} = emptyCells[cellToResolve];

	let topNb = !!grid[i-1] && grid[i-1][j],
		bottomNb = !!grid[i+1] && grid[i+1][j],
		leftNb = !!grid[i][j-1] && grid[i][j-1],
		rightNb = !!grid[i][j+1] && grid[i][j+1];

	let possibleTiles = [];
	let possibleByTop = codes,possibleByBottom = codes,possibleByLeft = codes,possibleByRight = codes;

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
		console.warn('Have no possible tiles!!!');
		// print(grid);
		debugger;
		// grid[i][j] = 'grass';
		if (topNb) grid[i-1][j] = undefined;
		if (bottomNb)grid[i+1][j] = undefined;
		if (leftNb)grid[i][j-1] = undefined;
		if (rightNb)grid[i][j+1] = undefined;
	} else {
		grid[i][j] = possibleTiles[Math.floor(Math.random() * possibleTiles.length)]
	}

	if (checkValid(grid) === false) {
		console.log({i, j});
		console.log({emptyCells});
		console.log({possibleTiles});
		console.log({topNb, bottomNb, leftNb, rightNb});
		console.warn('made a mistake, reverting');
		// print(grid);
		grid[i][j] = undefined;
		// print(grid);
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
	return remainingCellCount;
}

function print(grid) {
	let i = 0;
	for (let row of grid) {
		for (let j = 0; j < 3; j++) {
			let str = ''; //`${i}\t`;
			for (let cell of row) {
				if (!cell) {
					str += '   ';
				} else {
					str += tilesByCode[cell].value.split('\r\n')[j]
				}
				// str += '|'
			}
			console.log(str);
		}
		i++
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let grid = new Array(SIZE).fill(new Array(SIZE)).map(() => (new Array(SIZE)));

// grid[0] = new Array(SIZE).fill('grass');
// grid[SIZE-1] = new Array(SIZE).fill('grass');
// for (let i = 0; i < SIZE-1; i++) {
// 	grid[i][0] = 'grass';
// 	grid[i][SIZE-1] = 'grass';
// }
// // grid[2][2] = 'roadCross';
// grid[1][1] = 'roadHor';
//  grid[1][2] = 'roadCornerLT';

print(grid);
console.log(checkValid(grid));
let remainingCount;
const start = new Date().getTime();
let count = 0;
do {
	remainingCount = resolveRandom(grid);
} while (remainingCount > 0);
console.log(checkValid(grid));
print(grid);
console.log (`--    time elapsed: ${new Date().getTime() - start}ms`);