import {Tile} from "../Tile";
import {getRandomNumber} from "../../utils";

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

    constructor(rowCount: number, cellCount?: number) {
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

    getEmptyTiles(): Tile[] {
        const returnValue = [];
        for (const row of this.rows) {
            for (let i = 0; i < row.cellCount; i++) {
                const cell = row.getTile(i);
                if (cell.code === 'none') {
                    returnValue.push(cell);
                }
            }
        }
        return returnValue;
    }

    static generate(xSize: number, ySize: number, forceRecreate = false): Grid {
        const grid = new Grid(xSize, ySize);
        return grid.generate(forceRecreate)
    }

    wipeTileAndNeighbour(x: number, y: number) {
        for (let neighbour of Object.values(this.getNeighbours(x,y))) {
            if (neighbour) {
                neighbour.setCode('none');
            }
        }
        this.getTile(x, y).setCode('none');
    }

    generate(forceRecreate = false): Grid {
        if (!forceRecreate && !this.checkGrid()) {
            throw new Error('Grid already broken')
        } else if (forceRecreate) {
            this.initGrid();
        }
        const setRandomTile = (emptyTiles: Tile[]) => {
            const tileToFill = emptyTiles[getRandomNumber(emptyTiles.length - 1, 0)];
            const possibleTileCodes = tileToFill.getPossibleTilesCodes();
            // Если поставить нечего то значит ситуация невозможная и стираю соседей, что бы их перегенерировать
            if (possibleTileCodes.length === 0) {
                this.wipeTileAndNeighbour(tileToFill.x, tileToFill.y);
            }
            tileToFill.setCode(possibleTileCodes[getRandomNumber(possibleTileCodes.length, 0)], true);
        };
        let emptyTiles = this.getEmptyTiles();
        while (emptyTiles.length > 0) {
            setRandomTile(emptyTiles);
            emptyTiles = this.getEmptyTiles();
        }
        // Если все хорошо то отдаем, иначе перегенерируем
        if (this.checkGrid()) {
            return this;
        } else {
            this.generate(true);
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
                str1 += `| ${x} `;
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

    pack() {
        let res = {
            size: {
                rows: this.rowsCount,
                columns: this.cellCount
            },
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
}