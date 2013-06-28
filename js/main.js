var table = [];
var tableSize = 8;

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

        if(selectedColumn != cellColumn && selectedRow != cellRow)
        {
            movePiece(positionObject, toPositionObject);
        }
    }
}

function handlePieceClick(piece)
{
    $(".checkers-piece").each(function(index){
        $(this).removeClass("selected");
    });
    $(piece).toggleClass("selected");
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
            table[i][j] = 0;
            $("div[data-row='"+i+"'] .checkers-cell[data-column='"+j+"']").html(checkersPiece.replace("#color#", 0));
        }
    }

    for(var i = fillUntil + 2; i < tableSize; i++)
    {
        for(var j = i%2; j < tableSize; j+=2)
        {
            table[i][j] = 1;
            $("div[data-row='"+i+"'] .checkers-cell[data-column='"+j+"']").html(checkersPiece.replace("#color#", 1));
        }
    }
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
        }, 500, function(){
            $("div[data-row='"+to.row+"'] .checkers-cell[data-column='"+to.column+"']").html(pieceHtml);
            $("div[data-row='"+from.row+"'] .checkers-cell[data-column='"+from.column+"']").html("");
            piece = $("div[data-row='"+to.row+"'] .checkers-cell[data-column='"+to.column+"']").find(".checkers-piece");
            piece.click(function(){handlePieceClick(this);});
        });
    }
}