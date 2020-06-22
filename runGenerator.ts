import {Grid} from "./components/Grid";

const grid = new Grid(16, 16);
grid.setTile(8, 0, 'roadVert');
grid.getTile(8, 0).freeze();
grid.setTile(8, 15, 'roadVert');
grid.getTile(8, 15).freeze();
grid.setTile(0, 8, 'roadHor');
grid.getTile(0, 8).freeze();
grid.setTile(15, 8, 'roadHor');
grid.getTile(15, 8).freeze();
grid.generate();
grid.print(true);
console.log(grid.pack());