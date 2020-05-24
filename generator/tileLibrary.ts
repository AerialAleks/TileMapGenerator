export const tiles = [
	{
		value: '...\r\n...\r\n...',
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
			['roadHor'], //left
			['roadVert'], //top
			['grass'], //right
			['grass']  //bottom
		]
	},
	{
		value: '░║░\r\n░╚═\r\n░░░',
		code: 'roadCornerRT',
		validNb: [
			['grass'], //left
			['roadVert'], //top
			[ 'roadHor'], //right
			['grass']  //bottom
		]
	},
	{
		value: '░░░\r\n═╗░\r\n░║░',
		code: 'roadCornerLB',
		validNb: [
			['roadHor'], //left
			['grass'], //top
			['grass'], //right
			['roadVert']  //bottom
		]
	},
	{
		value: '░░░\r\n░╔═\r\n░║░',
		code: 'roadCornerRB',
		validNb: [
			['grass'], //left
			['grass'], //top
			[ 'roadHor'], //right
			['roadVert']  //bottom
		]
	}
];