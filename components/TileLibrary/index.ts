import {Grid} from "../Grid";
import tiles from "../../generator/tileLibrary";

class TileLibrary {
    private library: {
        [code: string]: TileLibraryTile
    } = {};

    constructor() {
    }

    init() {
        for (let tile of tiles) {
            if (this.library[tile.code]) {
                this.library = {};
                throw new Error('Library initialization error - Duplicated tile code found!')
            }
            this.library[tile.code] = new TileLibraryTile(tile);
        }
    }

    getByCode(code: string): TileLibraryTile | false {
        if (code === 'none') {
            return false;
        }
        return this.library[code] || false;
    }

    getTiles() {
        return this.library;
    }
}

class TileLibraryTile {
    code: string;
    previewValue: string;
    rules: TileRule[] = [];
    tags: RuleSimpleTag;

    constructor(item: TileLibraryItem) {
        this.code = item.code;
        this.previewValue = item.value;
        this.tags = item.tags;
        this.rules.push(new TileRule(item.tags));
        for (let rule of item.rules) {
            this.rules.push(new TileRule(rule))
        }
    }

    /**
     * Выполняет проверку правил этого инстаса, тайла, для заданного грида в заданной точке. Условно - проверяет может ли стоять этот конкретный тайл (this) в данном конкретном гриде в данной конкретной точке
     */
    runRules(grid, x, y): boolean {
        let valid = true;
        const nbs = grid.getNeighboursCodes(x, y);
        for (let rule of this.rules) {
            if (valid) {
                valid = rule.runRule(grid, x, y, nbs);
            }
        }
        return valid;
    }
}

type RulePredicate = string;
type RuleSimpleNb = {
    topNb?: string[],
    rightNb?: string[],
    bottomNb?: string[],
    leftNb?: string[],
}
type RuleSimpleTag = {
    topTag?: string,
    rightTag?: string,
    bottomTag?: string,
    leftTag?: string,
}

type RuleType = RulePredicate | RuleSimpleNb & RuleSimpleTag
export type neighbours = {
    top: string
    right: string
    bottom: string
    left: string
}

class TileRule {
    private readonly type: 'simple' | 'predicate' = 'simple';
    private readonly predicate: (grid: Grid, x: number, y: number) => boolean;
    private readonly simpleRule: { topNb?: string[], rightNb?: string[], bottomNb?: string[], leftNb?: string[] };

    constructor(rule: RuleType) {
        if (typeof rule === "string") {
            this.type = 'predicate';
            try {
                this.predicate = new Function(`
                    const grid = arguments[0];
                    const x = arguments[1];
                    const y = arguments[2];
                    return (${rule})(grid, x, y)
                `) as (grid: Grid, x: number, y: number) => boolean;
            } catch (e) {
                console.error(e);
                throw new Error(`Error while compiling predicate - ${e}`);
            }
        } else {
            this.simpleRule = rule;
        }
    }

    runRule(grid: Grid, x: number, y: number, nbs: neighbours): boolean {
        let valid = true;
        switch (this.type) {
            case 'predicate': {
                valid = this.runPredicate(grid, x, y);
                break;
            }
            case "simple": {
                valid = this.runSimple(nbs);
                break
            }
        }
        return valid;
    }

    private runPredicate(grid: Grid, x: number, y: number): boolean {
        return this.predicate(grid, x, y);
    }

    private runSimple(nbs: neighbours): boolean {
        const oppositeSides = {
            top: 'bottom',
            left: 'right',
            bottom: 'top',
            right: 'left'
        };
        // console.warn('private TileRule.runSimple placeholder!');
        let valid = true;
        for (let side of ['top', 'right', 'bottom', 'left']) {
            const nbTile = tileLibrary.getByCode(nbs[side]);
            if (valid && nbs[side] && nbs[side] !== 'none' && this.simpleRule[`${side}Nb`]) {
                valid = this.simpleRule[`${side}Nb`].includes(nbs[side]);
            }
            if (valid && nbTile && this.simpleRule[`${side}Tag`]) {
                valid = this.simpleRule[`${side}Tag`] === nbTile.tags[`${oppositeSides[side]}Tag`];
            }
        }
        return valid;
    }
}

/**
 * Тип описывает как хранятся тайлы в библиотеке в json до загрузки.
 */
export interface TileLibraryItem {
    code: string; // Должен быть уникален
    value: string;
    tags: RuleSimpleTag,
    // rules - массив, элементами могут быть как predicate который будет выполнен (в виде строки) либо в виде объекта
    // описывающего список возможных соседей этого тайла по кодам или по тегам.
    // Что бы позиция считалась валидной, надо что бы все условия в массиве были удовлетворены.
    // Правила проверяются по порядку в массиве, имеет смысл в начало массива размещать самые "простые" правила,
    // либо правила сильнее всего отсеивающие некоректные варианты
    // Сигнатура predicate - (grid: Grid, x: number, y: number) => Boolean
    rules: Array<RuleType>;
    elevations?: number[] // Если тайл меняет высоту (например гора) то тут описываются смены высоты по граням, начиная с верхней, по часовой стрелке
}


// Использую библиотеку по сути как синглтон
const tileLibrary = new TileLibrary();
tileLibrary.init();
export default tileLibrary;
