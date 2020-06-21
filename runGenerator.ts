import {Grid} from "./components/Grid";

const grid = Grid.generate(16, 16);
grid.print(true);
console.log(grid.pack());