import {TileLibraryItem} from "../components/TileLibrary";

const tiles = [
	{
		value: '...\r\n...\r\n...',
		code: 'grass',
		rules: [{
            leftNb: ['grass', 'roadVert', 'roadCornerLB', 'roadCornerLT'], //left
            topNb: ['grass', 'roadHor', 'roadCornerLT', 'roadCornerRT'], //top
            rightNb: ['grass', 'roadVert', 'roadCornerRB', 'roadCornerRT'], //right
            bottomNb: ['grass', 'roadHor', 'roadCornerLB', 'roadCornerRB']  //bottom
        }]
	},
	{
		value: '░║░\r\n░║░\r\n░║░',
		code: 'roadVert',
		rules: [{
            leftNb: ['grass'], //left
            topNb: ['roadCross', 'roadVert', 'roadCornerLB', 'roadCornerRB'], //top
            rightNb: ['grass'], //right
            bottomNb: ['roadCross', 'roadVert', 'roadCornerLT', 'roadCornerRT'], //bottom
        }]
	},
	{
		value: '░░░\r\n═══\r\n░░░',
		code: 'roadHor',
		rules: [{
            leftNb: ['roadCross', 'roadHor', 'roadCornerRT', 'roadCornerRB'], //left
            topNb: ['grass'], //top
            rightNb: ['roadCross', 'roadHor', 'roadCornerLT', 'roadCornerLB'], //right
            bottomNb: ['grass'], //bottom
        }]
	},
	{
		value: '░║░\r\n═╬═\r\n░║░',
		code: 'roadCross',
		rules: [{
            leftNb: [/*'roadCross',*/ 'roadHor', /*'roadCornerRT', 'roadCornerRB'*/], //left
            topNb: [/*'roadCross',*/ 'roadVert'], //top
            rightNb: [/*'roadCross',*/ 'roadHor', /*'roadCornerLT', 'roadCornerLB'*/], //right
            bottomNb: [/*'roadCross',*/ 'roadVert']  //bottom
        }]
	},
	{
		value: '░║░\r\n═╝░\r\n░░░',
		code: 'roadCornerLT',
		rules: [{
            leftNb: ['roadHor'], //left
            topNb: ['roadVert'], //top
            rightNb: ['grass'], //right
            bottomNb: ['grass']  //bottom
        }]
	},
	{
		value: '░║░\r\n░╚═\r\n░░░',
		code: 'roadCornerRT',
		rules: [{
            leftNb: ['grass'], //left
            topNb: ['roadVert'], //top
            rightNb: ['roadHor'], //right
            bottomNb: ['grass']  //bottom
        }]
	},
	{
		value: '░░░\r\n═╗░\r\n░║░',
		code: 'roadCornerLB',
		rules: [{
            leftNb: ['roadHor'], //left
            topNb: ['grass'], //top
            rightNb: ['grass'], //right
            bottomNb: ['roadVert']  //bottom
        }]
	},
	{
		value: '░░░\r\n░╔═\r\n░║░',
		code: 'roadCornerRB',
		rules: [{
			leftNb: ['grass'], //left
			topNb: ['grass'], //top
			rightNb: [ 'roadHor'], //right
			bottomNb: ['roadVert']  //bottom
		}]
	}
] as TileLibraryItem[];

export default tiles;
