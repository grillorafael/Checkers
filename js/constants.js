var LADY_ADD_VALUE = 10;

var TOP_PLAYER = 0;
var LADY_TOP_PLAYER = TOP_PLAYER + LADY_ADD_VALUE;

var BOTTOM_PLAYER = 1;
var LADY_BOTTOM_PLAYER = BOTTOM_PLAYER + LADY_ADD_VALUE;

var IA_PLAYER = TOP_PLAYER;
var HUMAN_PLAYER = BOTTOM_PLAYER;

var MAX_ITERATION = 4;

var EMPTY_CELL = -1;

var MOVE_PIECE = 0;
var EAT_PIECE = 1;

//COORDINATES
var NO = {row: -1, column: -1};
var NE = {row: -1, column: 1};
var SO = {row: 1, column: -1};
var SE = {row: 1, column: 1};