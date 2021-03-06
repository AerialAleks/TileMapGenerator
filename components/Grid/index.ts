import {Tile} from "../Tile";
import {getRandomNumber} from "../../utils";
import * as uuid from 'uuid';
import * as seedrandom from "seedrandom";

export interface PackedGrid {
    size: {
        rows: number,
        columns: number,
    },
    seed: string,
    rows: Array<string[]>
}

class Row {
    readonly cellCount: number;
    readonly rowNumber: number;
    private readonly cells: Tile[];
    private readonly grid: Grid;

    constructor(size: number, rowNumber: number, grid: Grid) {
        this.grid = grid;
        this.cells = [];
        this.cellCount = size;
        this.rowNumber = rowNumber;
        this.cells.length = size;
        for (let i = 0; i < this.cellCount; i++) {
            this.cells[i] = new Tile(i, this.rowNumber, this.grid)
        }
    }

    private checkIndexOutOfRange(x) {
        if (x >= this.cellCount || x < 0) {
            throw new Error(`Index out of range - ${x} is not within range 0-${this.cellCount}`)
        }
    }

    getTile(index: number): Tile {
        this.checkIndexOutOfRange(index);
        return this.cells[index];
    }
}

// ToDo эта реализация значительно медленнее старой (раз этак в 10). Нужно найти где так сильно затыкаюсь
// Предположительно - косяк в постоянных, параноидальных проверках, которых терь еще больше и которые при этом более тяжелые
export class Grid {
    readonly rowsCount: number;
    readonly cellCount: number;
    private readonly rows: Row[] = [];
    private readonly rng: seedrandom.prng;

    constructor(
      public seed: string,
      rowCount: number,
      cellCount?: number,
    ) {
        if (!cellCount) {
            cellCount = rowCount;
        }
        if (rowCount < 0 || cellCount < 0) {
            throw new Error('Trying to create grid with negative size... What is wrong with you?!?!?!?')
        }
        if (rowCount === 0 || cellCount === 0) {
            throw new Error('Trying to create grid with 0 elements... WHY?!?!?!?')
        }
        this.rowsCount = rowCount;
        this.cellCount = cellCount;
        this.rng = seedrandom(seed);
        this.initGrid()
    }

    initGrid() {
        this.rows.length = 0;
        for (let i = 0; i < this.rowsCount; i++) {
            this.rows[i] = new Row(this.cellCount, i, this)
        }
    }

    private checkIndexOutOfRange(x, y) {
        if (y >= this.rowsCount || y < 0) {
            throw new Error(`Index out of range - ${y} is not within range 0-${this.rowsCount}`)
        }
        if (x >= this.cellCount || x < 0) {
            throw new Error(`Index out of range - ${x} is not within range 0-${this.rowsCount}`)
        }
    }

    checkGrid(): boolean | 'Has empty' {
        let hasEmpty = false;
        for (const row of this.rows) {
            for (let i = 0; i < row.cellCount; i++) {
                const cell = row.getTile(i);
                if (cell.code === 'none') {
                    hasEmpty = true;
                }
                if (!cell.checkPlacement()) {
                    return false;
                }
            }
        }
        if (hasEmpty) {
            return 'Has empty'
        }
        return true;
    }

    getTile(x, y): Tile{
        this.checkIndexOutOfRange(x, y);
        return this.rows[y].getTile(x);
    }

    /**
     * Same as getTile but will return false on OutOfRange error instead of Error
     */
    getTileSafe(x, y): Tile | false {
        try {
            this.checkIndexOutOfRange(x, y);
        } catch (e) {
            return false;
        }
        return this.rows[y].getTile(x);
    }

    setTile(x, y, code): void {
        this.checkIndexOutOfRange(x, y);
        this.rows[y].getTile(x).setCode(code);
    }

    // Todo Это какая та дичь, потом лучше переписать и описать типы... а пока - дичь
    getNeighboursCodes(x, y) {
        let returnValue: any = this.getNeighbours(x, y);
        for (let returnValueKey in returnValue) {
            if (returnValue[returnValueKey]) {
                returnValue[returnValueKey] = (returnValue[returnValueKey] as Tile).code
            } else {
                returnValue[returnValueKey] = 'none';
            }
        }
        return returnValue
    }

    getNeighbours(x, y): {
        top: Tile | false,
        right: Tile | false,
        bottom: Tile | false,
        left: Tile | false,
    } {
        let returnValue: any = {};
        returnValue.top = this.getTileSafe(x, y - 1);
        returnValue.right = this.getTileSafe(x + 1, y);
        returnValue.bottom = this.getTileSafe(x, y + 1);
        returnValue.left = this.getTileSafe(x - 1, y);
        return returnValue
    }

    getEmptyTiles(entropy = false): Tile[] {
        const returnValue: Tile[] = [];
        for (const row of this.rows) {
            for (let i = 0; i < row.cellCount; i++) {
                const cell = row.getTile(i);
                if (cell.code === 'none') {
                    returnValue.push(cell);
                }
            }
        }
        if (!entropy) {
            return returnValue;
        }
        const entropyMap = returnValue.map(el => this.getEntropy(el.x, el.y));
        let maxEntropy = [...entropyMap].sort()[entropyMap.length-1];
        if (maxEntropy === 1) {
            maxEntropy +=1
        }
        return returnValue.filter((el, i) => entropyMap[i] >= maxEntropy-1);
    }

    getEntropy(x: number, y: number) {
        const nbs = Object.values(this.getNeighbours(x, y));
        return Object.values(this.getNeighbours(x, y)).filter(el => Boolean(el) && (el as Tile).code !== 'none').length;
    }

    static generate(xSize: number, ySize: number, forceRecreate = false, seed = uuid.v4()): Grid {
        const grid = new Grid(seed,  xSize, ySize);
        return grid.generate(forceRecreate)
    }

    wipeTileAndNeighbour(x: number, y: number, depth = 0) {
        for (let neighbour of Object.values(this.getNeighbours(x,y))) {
            if (neighbour) {
                if (depth > 0) {
                    this.wipeTileAndNeighbour(neighbour.x, neighbour.y, depth-1)
                } else {
                    neighbour.setCode('none');
                }
            }
        }
        this.getTile(x, y).setCode('none');
    }

    generate(forceRecreate = false): Grid {
        const useEntropy = true;

        if (!forceRecreate && !this.checkGrid()) {
            throw new Error('Grid already broken')
        } else if (forceRecreate) {
            this.initGrid();
        }

        const setRandomTile = (emptyTiles: Tile[]) => {
            const tileToFill = emptyTiles[getRandomNumber(emptyTiles.length - 1, 0, this.rng)];
            const possibleTileCodes = tileToFill.getPossibleTilesCodes();
            // Если поставить нечего то значит ситуация невозможная и стираю соседей, что бы их перегенерировать
            if (possibleTileCodes.length === 0) {
                this.wipeTileAndNeighbour(tileToFill.x, tileToFill.y, useEntropy ? 2 : 1);
            }
            tileToFill.setCode(possibleTileCodes[getRandomNumber(possibleTileCodes.length, 0, tileToFill.rng)], true);
        };

        let emptyTiles = this.getEmptyTiles(useEntropy);
        while (emptyTiles.length > 0) {
            setRandomTile(emptyTiles);
            emptyTiles = this.getEmptyTiles(useEntropy);
        }

        // Если все хорошо то отдаем, иначе перегенерируем
        if (this.checkGrid()) {
            return this;
        } else {
            console.warn('Something is wrong... Regenerating');
            this.print(true);
            return this.generate(true);
        }
    }

    print(indexed = false): void {
        console.log('--->>>>>  printing');
        if (indexed) {
            let str0 = ` \t`;
            let str1 = ` \t`;
            let str2 = ` \t`;
            for (let x = 0; x < this.cellCount; x++) {
                str0 += `   |`;
                str1 += `|${x.toString().padStart(3, '0')}`;
                str2 += '+---'
            }
            console.log(str0);
            console.log(str1);
            console.log(str2);
        }
        for (let row of this.rows) {

            let str0 = indexed ? ` \t|` : ''; //;
            let str1 = indexed ? `${row.rowNumber}\t|` : ''; //;
            let str2 = indexed ? ` \t|` : ''; //;
            for (let i = 0; i < this.rowsCount; i++) {
                const cell = row.getTile(i);
                const strs = cell.previewValue.split('\r\n');
                str0 += `${strs[0] ? strs[0] : '   '}${indexed ? '|' : ''}`;
                str1 += `${strs[1] ? strs[1] : '   '}${indexed ? '|' : ''}`;
                str2 += `${strs[2] ? strs[2] : '   '}${indexed ? '|' : ''}`;
            }
            console.log(str0);
            console.log(str1);
            console.log(str2);
        }

    }

    pack(): PackedGrid {
        let res: PackedGrid = {
            size: {
                rows: this.rowsCount,
                columns: this.cellCount
            },
            seed: this.seed,
            rows: []
        };
        for (let i = 0; i < this.rowsCount; i++) {
            res.rows[i] = [];
            for (let j = 0; j < this.cellCount; j++) {
                res.rows[i][j] = this.getTile(j, i).code;
            }
        }
        return res;
    }

    static unPack(packedGrid: PackedGrid, unsafe = false): Grid {
        let res = new Grid(packedGrid.seed, packedGrid.size.rows, packedGrid.size.columns);
        for (let rowIndex in packedGrid.rows) {
            for (let cellIndex in packedGrid.rows[rowIndex]) {
                const tile = res.getTile(cellIndex, rowIndex);
                tile.setCode(packedGrid.rows[rowIndex][cellIndex], unsafe)
            }
        }
        return res;
    }
}
