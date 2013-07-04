var table = [];
var tableSize = 8;
var ANIMATION_SPEED = 500;

function initGame()
{
    initTable();
    initPieces();
    addEventListeners();
}

function addEventListeners()
{
    $(".checkers-cell").click(function(){handleCellClick(this);});
    $(".checkers-piece").click(function(){handlePieceClick(this);});
}

function handleCellClick(cell)
{
    var selectedPiece = $(".checkers-piece.selected");
    if(selectedPiece)
    {
        var selectedColumn = selectedPiece.parent(".checkers-column").attr('data-column');
        var selectedRow = selectedPiece.parent(".checkers-column").parent(".checkers-row").attr('data-row');
        var positionObject = {row: selectedRow, column: selectedColumn};

        var cellColumn = $(cell).attr('data-column');
        var cellRow = $(cell).parent(".checkers-row").attr('data-row');
        var toPositionObject = {row: cellRow, column: cellColumn};

        var possibleMoveMovements = getMoveActions(table, positionObject);
        var possibleEatMovements = getEatActions(table, positionObject, [], []);

        if(possibleMoveMovements.length > 0)
        {
            for(var i = 0; i < possibleMoveMovements.length; i++)
            {
                if(possibleMoveMovements[i].row == toPositionObject.row && possibleMoveMovements[i].column == toPositionObject.column)
                {
                    movePiece(positionObject, toPositionObject);
                    return;
                }
            }
        }

        if(possibleEatMovements.length > 0)
        {
            for(var i = 0; i < possibleEatMovements.length; i++)
            {
                var possibleEatMovement = possibleEatMovements[i];
                var lastMovementPosition = possibleEatMovement.movementPositions[possibleEatMovement.movementPositions.length - 1];
                if(lastMovementPosition.row == toPositionObject.row && lastMovementPosition.column == toPositionObject.column)
                {
                    eatPiece(positionObject, possibleEatMovement);
                }
            }
        }

    }
}

function handlePieceClick(piece)
{
    var hasClass = $(piece).hasClass("selected");
    $(".checkers-piece").each(function(index){
        $(this).removeClass("selected");
    });
    if(!hasClass)
    {
        $(piece).toggleClass("selected");
    }
}

function initTable()
{
    initTableStructure(tableSize);
    var wholeTable = "";
    for(var i = 0; i < table.length ; i++)
    {
        var color = i % 2;
        var row = "<div class='checkers-row' data-row='"+i+"'>";
        for(var j = 0; j < table[i].length; j++)
        {
            color = !color;
            var column = "<div data-color='"+color+"' data-column='"+j+"' class='checkers-cell checkers-column'></div>";
            row += column;
        }
        row += "</div>";
        wholeTable += row;
        wholeTable += "<div class='clear-fix'></div>";
    }
    $("#checkersTable").html(wholeTable);
}

function initTableStructure(size)
{
    var i, j;
    for(i = 0; i<size; i++)
    {
        var line = [];
        for(j = 0; j < size ; j++)
        {
            line[j] = -1;
        }
        table.push(line);
    }
}

function initPieces()
{
    var fillUntil = (tableSize - 2) / 2;
    var checkersPiece = "<div data-color='#color#' class='checkers-piece'></div>";
    for(var i = 0; i < fillUntil; i++)
    {
        for(var j = i%2; j < tableSize; j+=2)
        {
            table[i][j] = TOP_PLAYER;
            $("div[data-row='"+i+"'] .checkers-cell[data-column='"+j+"']").html(checkersPiece.replace("#color#", TOP_PLAYER));
        }
    }

    for(var i = fillUntil + 2; i < tableSize; i++)
    {
        for(var j = i%2; j < tableSize; j+=2)
        {
            table[i][j] = BOTTOM_PLAYER;
            $("div[data-row='"+i+"'] .checkers-cell[data-column='"+j+"']").html(checkersPiece.replace("#color#", BOTTOM_PLAYER));
        }
    }
}


function eatPiece(from, possibleEatMovement)
{
    var currentPosition = from;
    for(var i = 0; i < possibleEatMovement.movementPositions.length; i++)
    {
        movePiece(currentPosition, possibleEatMovement.movementPositions[i]);

        removePiece(possibleEatMovement.removedPiecesPosition[i]);
        currentPosition = possibleEatMovement.movementPositions[i];
    }
}

function removePiece(piecePosition)
{
    $("div[data-row='"+piecePosition.row+"'] .checkers-cell[data-column='"+piecePosition.column+"']").html("");
    table[piecePosition.row][piecePosition.column] = EMPTY_CELL;
}

function movePiece(from, to)
{
    var piece = $("div[data-row='"+from.row+"'] .checkers-cell[data-column='"+from.column+"']").find(".checkers-piece");
    if(piece)
    {
        var pieceHtml = $("div[data-row='"+from.row+"'] .checkers-cell[data-column='"+from.column+"']").html();

        var toPosition = $("div[data-row='"+to.row+"'] .checkers-cell[data-column='"+to.column+"']").position();

        var actualLeft = piece.position().left + "px";
        var actualTop = piece.position().top + "px";
        piece.css({
            "position":"absolute",
            "left": actualLeft,
            "top": actualTop
        });

        piece.animate({
            left: (toPosition.left + 12) + "px",
            top: toPosition.top + "px"
        }, ANIMATION_SPEED, function(){
            $("div[data-row='"+to.row+"'] .checkers-cell[data-column='"+to.column+"']").html(pieceHtml);
            $("div[data-row='"+from.row+"'] .checkers-cell[data-column='"+from.column+"']").html("");
            piece = $("div[data-row='"+to.row+"'] .checkers-cell[data-column='"+to.column+"']").find(".checkers-piece");
            piece.click(function(){handlePieceClick(this);});

            table[to.row][to.column] = table[from.row][from.column];
            table[from.row][from.column] = -1;
            callback();
        });
    }
}