import {Grid} from "../Grid";
import tileLibrary from "../TileLibrary";

export class Tile {
    frozen: boolean = false;
    code: string = 'none';
    previewValue: string = '';
    x: number;
    y: number;

    constructor(
        x: number,
        y: number,
        private grid: Grid,
    ) {
        this.x = x;
        this.y = y;
        // console.warn('Tile.constructor placeholder!');
    }

    static checkPlacement(grid: Grid, x: number, y: number, code: string): boolean {
        // console.warn('static Tile.checkPlacement placeholder!');
        if (code === 'none') {
            return true;
        }
        const tile = tileLibrary.getByCode(code);
        if (!tile) {
            return false;
        }
        return tile.runRules(grid, x, y);
    }

    static getPossibleTilesCodes(grid: Grid, x: number, y: number): string[] {
        // console.warn('static Tile.getPossibleTilesCodes placeholder!');
        const library = tileLibrary.getTiles();
        const validTileCodes = [];
        for (let tileCode of Object.keys(library)) {
            if (Tile.checkPlacement(grid, x, y, tileCode)) {
                validTileCodes.push(tileCode);
            }
        }
        return validTileCodes;
    }

    getPossibleTilesCodes(): string[] {
        return Tile.getPossibleTilesCodes(this.grid, this.x, this.y);
    }

    // unsafe выключает проверку на корректность и тогда я потенциально могу сделать карту невалидной. Зато выполнится быстрее
    setCode(code: string, unsafe = false): void {
        const tile = tileLibrary.getByCode(code);
        if (tile) {
            if (!this.frozen && (unsafe || Tile.checkPlacement(this.grid, this.x, this.y, code))) {
                this.code = tile.code;
                this.previewValue = tile.previewValue;
            }
        } else {
            this.code = 'none';
            this.previewValue = '';
        }
    }

    checkPlacement() {
        return Tile.checkPlacement(this.grid, this.x, this.y, this.code)
    }

    freeze() {
        this.frozen = true;
    }

    unfreeze() {
        this.frozen = false;
    }
}