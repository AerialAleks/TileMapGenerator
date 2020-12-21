import {TileLibraryItem} from "../components/TileLibrary";

const tiles:TileLibraryItem[] = [
    {
        value: '...\r\n...\r\n...',
        code: 'grass',
        tags: {
            topTag: 'grass',
            rightTag: 'grass',
            bottomTag: 'grass',
            leftTag: 'grass'
        },
        rules: []
    },
	{
		value: '░║░\r\n░║░\r\n░║░',
		code: 'roadVert',
        tags: {
            topTag: 'road',
            rightTag: 'grass',
            bottomTag: 'road',
            leftTag: 'grass'
        },
		rules: [{
            topTag: 'road',
            rightTag: 'grass',
            bottomTag: 'road',
            leftTag: 'grass'
        }, {
            leftNb: ['grass'], //left
            topNb: ['roadCross', 'roadVert', 'roadCornerLB', 'roadCornerRB'], //top
            rightNb: ['grass'], //right
            bottomNb: ['roadCross', 'roadVert', 'roadCornerLT', 'roadCornerRT'], //bottom
        }]
	},
	{
		value: '░░░\r\n═══\r\n░░░',
		code: 'roadHor',
        tags: {
            topTag: 'grass',
            rightTag: 'road',
            bottomTag: 'grass',
            leftTag: 'road'
        },
		rules: [{
            topTag: 'grass',
            rightTag: 'road',
            bottomTag: 'grass',
            leftTag: 'road'
        }, {
            leftNb: ['roadCross', 'roadHor', 'roadCornerRT', 'roadCornerRB'], //left
            topNb: ['grass'], //top
            rightNb: ['roadCross', 'roadHor', 'roadCornerLT', 'roadCornerLB'], //right
            bottomNb: ['grass'], //bottom
        }]
	},
	{
		value: '░║░\r\n═╬═\r\n░║░',
		code: 'roadCross',
        tags: {
            topTag: 'road',
            rightTag: 'road',
            bottomTag: 'road',
            leftTag: 'road'
        },
		rules: [{
            topTag: 'road',
            rightTag: 'road',
            bottomTag: 'road',
            leftTag: 'road'
        }, {
            leftNb: [/*'roadCross',*/ 'roadHor', /*'roadCornerRT', 'roadCornerRB'*/], //left
            topNb: [/*'roadCross',*/ 'roadVert'], //top
            rightNb: [/*'roadCross',*/ 'roadHor', /*'roadCornerLT', 'roadCornerLB'*/], //right
            bottomNb: [/*'roadCross',*/ 'roadVert']  //bottom
        }]
	},
	{
		value: '░║░\r\n═╝░\r\n░░░',
		code: 'roadCornerLT',
        tags: {
            topTag: 'road',
            rightTag: 'grass',
            bottomTag: 'grass',
            leftTag: 'road'
        },
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
        tags: {
            topTag: 'road',
            rightTag: 'road',
            bottomTag: 'grass',
            leftTag: 'grass'
        },
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
        tags: {
            topTag: 'grass',
            rightTag: 'grass',
            bottomTag: 'road',
            leftTag: 'road'
        },
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
        tags: {
            topTag: 'grass',
            rightTag: 'road',
            bottomTag: 'road',
            leftTag: 'grass'
        },
		rules: [{
			leftNb: ['grass'], //left
			topNb: ['grass'], //top
			rightNb: [ 'roadHor'], //right
			bottomNb: ['roadVert']  //bottom
		}]
	},
    {
        value: '~~~\r\n~~~\r\n~~~',
        code: 'water',
        tags: {
            topTag: 'water',
            rightTag: 'water',
            bottomTag: 'water',
            leftTag: 'water',
        },
        rules: []
    },
    {
        value: '~,.\r\n~,.\r\n~,.',
        code: 'shoreLR',
        tags: {
            topTag: 'shoreVR',
            rightTag: 'grass',
            bottomTag: 'shoreVR',
            leftTag: 'water',
        },
        rules: []
    },
    {
        value: '.,~\r\n.,~\r\n.,~',
        code: 'shoreRL',
        tags: {
            topTag: 'shoreVL',
            rightTag: 'water',
            bottomTag: 'shoreVL',
            leftTag: 'grass',
        },
        rules: []
    },
    {
        value: '...\r\n,,,\r\n~~~',
        code: 'shoreTB',
        tags: {
            topTag: 'grass',
            rightTag: 'shoreHT',
            bottomTag: 'water',
            leftTag: 'shoreHT',
        },
        rules: []
    },
    {
        value: '~~~\r\n,,,\r\n...',
        code: 'shoreBT',
        tags: {
            topTag: 'water',
            rightTag: 'shoreHB',
            bottomTag: 'grass',
            leftTag: 'shoreHB',
        },
        rules: []
    },
    {
        value: '...\r\n,,.\r\n~,.',
        code: 'shoreAngleTR',
        tags: {
            topTag: 'grass',
            rightTag: 'grass',
            bottomTag: 'shoreVR',
            leftTag: 'shoreHT',
        },
        rules: []
    },
    {
        value: '...\r\n.,,\r\n.,~',
        code: 'shoreAngleTL',
        tags: {
            topTag: 'grass',
            rightTag: 'shoreHT',
            bottomTag: 'shoreVL',
            leftTag: 'grass',
        },
        rules: []
    },
    {
        value: '.,~\r\n.,,\r\n...',
        code: 'shoreAngleBL',
        tags: {
            topTag: 'shoreVL',
            rightTag: 'shoreHB',
            bottomTag: 'grass',
            leftTag: 'grass',
        },
        rules: []
    },
    {
        value: '~,.\r\n,,.\r\n...',
        code: 'shoreAngleBR',
        tags: {
            topTag: 'shoreVR',
            rightTag: 'grass',
            bottomTag: 'grass',
            leftTag: 'shoreHB',
        },
        rules: []
    },
    {
        value: '.,~\r\n,,~\r\n~~~',
        code: 'shoreAngleWBR',
        tags: {
            topTag: 'shoreVL',
            rightTag: 'water',
            bottomTag: 'water',
            leftTag: 'shoreHT',
        },
        rules: []
    },
    {
        value: '~,.\r\n~,,\r\n~~~',
        code: 'shoreAngleWBL',
        tags: {
            topTag: 'shoreVR',
            rightTag: 'shoreHT',
            bottomTag: 'water',
            leftTag: 'water',
        },
        rules: []
    },
    {
        value: '~~~\r\n,,~\r\n.,~',
        code: 'shoreAngleWTR',
        tags: {
            topTag: 'water',
            rightTag: 'water',
            bottomTag: 'shoreVL',
            leftTag: 'shoreHB',
        },
        rules: []
    },
    {
        value: '~~~\r\n~,,\r\n~,.',
        code: 'shoreAngleWTL',
        tags: {
            topTag: 'water',
            rightTag: 'shoreHB',
            bottomTag: 'shoreVR',
            leftTag: 'water',
        },
        rules: []
    }
];

export default tiles;
