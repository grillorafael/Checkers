var table = [];
var tableSize = 8;
var ANIMATION_SPEED = 500;
var ENABLE_HINT = false;
var currentTurn = TOP_PLAYER;
var ENABLE_IA = false;
var IA_VS_IA = false;
var RANDOM_PLAYER = false;

var PLAYER = BOTTOM_PLAYER;

var MESSAGE_TYPE = -1;

var maxPieces;
var ws;
var paired = false;

function write(text) {
    var date = new Date();
    var dateText = '['+date.getFullYear()+'-'+(date.getMonth()+1 > 9 ? date.getMonth()+1 : '0'+date.getMonth()+1)+'-'+(date.getDate() > 9 ? date.getDate() : '0'+date.getDate())+' '+(date.getHours() > 9 ? date.getHours() : '0'+date.getHours())+':'+(date.getMinutes() > 9 ? date.getMinutes() : '0'+date.getMinutes())+':'+(date.getSeconds() > 9 ? date.getSeconds() : '0'+date.getSeconds())+']';
    console.log(dateText + ' ' + text);
}

function initGame()
{
    initTable();
    initPieces();
    addEventListeners();
    maxPieces = getTotalPieces(table);
    $('#gameConfigModal').modal('toggle');
    $('#gameConfigModal').on('hidden', function(){
        changeTurn();
    })
}

function getConfig(callback){
    $.getJSON("/project-config.json", function(data) {
        callback(data.dev ? data.development : data.production);
    });
}

function againstRandom(){
    $("#gameMode").toggleClass("hidden");
    $("#chat").removeClass("hidden");
    $("#waiting").toggleClass("hidden");
    RANDOM_PLAYER = true;
    getConfig(function(config){
        var url = "ws://" + config.web_socket.js_host + ":" + config.web_socket.port;
        ws = new WebSocket(url);
        write("Connecting to the WebSocket...");

        ws.onopen = function(msg) {
            write('Connection successfully opened');
        };

        ws.onmessage = function(msg){
            if(msg.data == "change_player"){
                PLAYER = TOP_PLAYER;
            }
            else if(msg.data == 'disconnected'){
                $('#disconnectedModal').modal('show');
            }
            else if(msg.data == "paired"){
                $('#gameConfigModal').modal('hide');
                if(!paired){
                    paired = true;
                    ws.send("paired");
                }
            }
            else{
                var parsedMsg = JSON.parse(msg.data);
                if(parsedMsg.type == MESSAGE_TYPE)
                {
                    appendMessage(parsedMsg.msg, true);
                }
                else
                {
                    movePiece(parsedMsg.arg0, parsedMsg.arg1, parsedMsg.arg2);
                }
            }
        }

        ws.onerror = function(msg){
            $('#disconnectedModal').modal('show');
        }

        ws.onclose = function(msg){
        }
    });
}

function enableIa(value)
{
    if(value == 'ia')
    {
        IA_VS_IA = true;
        ENABLE_IA = true;
    }
    else
    {
        ENABLE_IA = value;
    }
    $('#gameConfigModal').modal('hide');
}

function addEventListeners()
{
    $(".checkers-cell").click(function(){handleCellClick(this);});
    $(".checkers-piece").click(function(){handlePieceClick(this);});
    $("#hint").click(function(){handleHintClick(this);});

    $("#sendMessage").submit(function(e){
        e.preventDefault();
        handleSendMessageSubmit();
    });

    $(window).resize(function() {
        adjustSizes();
    });
}

function handleSendMessageSubmit(){
    var msg = $("#sendMessage").find("textarea").val().escape();
    appendMessage(msg);
    if(RANDOM_PLAYER)
    {
        ws.send(JSON.stringify({type: MESSAGE_TYPE, msg: msg.escape()}));
    }
    $("#sendMessage").find("textarea").val("");
}

function appendMessage(msg, sent){
    if(arguments.length == 1)
    {
        $("#chat").find("ul").append("<li>"+msg+"</li>");
    }
    else
    {
        $("#chat").find("ul").append("<li class='external'>"+msg+"</li>");
    }
}

function handleHintClick(button)
{
    ENABLE_HINT = !ENABLE_HINT;
    if(!ENABLE_HINT)
    {
        removeCellHighlights();
        $("#hint").html("I NEED A HINT!");
    }
    else
    {
        var selectedPiece = $(".checkers-piece.selected");
        if(selectedPiece.length > 0)
        {
            highlightMoves(selectedPiece);
        }
        $("#hint").html("I DON'T NEED ANY HINT!");
    }
}

function handleCellClick(cell)
{
    var selectedPiece = $(".checkers-piece.selected");
    if(selectedPiece && (currentTurn == PLAYER || !RANDOM_PLAYER))
    {
        var pieceColor = selectedPiece.attr("data-color");
        if(currentTurn == pieceColor)
        {
            var selectedColumn = selectedPiece.parent(".checkers-column").attr('data-column');
            var selectedRow = selectedPiece.parent(".checkers-column").parent(".checkers-row").attr('data-row');
            var positionObject = {row: selectedRow, column: selectedColumn};

            var cellColumn = $(cell).attr('data-column');
            var cellRow = $(cell).parent(".checkers-row").attr('data-row');
            var toPositionObject = {row: cellRow, column: cellColumn};

            var possibleMoveMovements = getMoveActions(table, positionObject);
            var possibleEatMovements = getEatActions(table, positionObject, [], [], positionObject);

            if(possibleMoveMovements.length > 0)
            {
                for(var i = 0; i < possibleMoveMovements.length; i++)
                {
                    if(possibleMoveMovements[i].row == toPositionObject.row && possibleMoveMovements[i].column == toPositionObject.column)
                    {
                        movePiece(positionObject, [toPositionObject], []);
                        if(RANDOM_PLAYER)
                        {
                            ws.send(JSON.stringify({type: MOVE_PIECE, arg0: positionObject, arg1:[toPositionObject], arg2: []}));
                        }
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
                        if(RANDOM_PLAYER)
                        {
                            var strsend = JSON.stringify({type: EAT_PIECE, arg0: positionObject, arg1:possibleEatMovement.movementPositions,  arg2: possibleEatMovement.removedPiecesPosition});
                            ws.send(strsend);
                        }
                        movePiece(positionObject, possibleEatMovement.movementPositions, possibleEatMovement.removedPiecesPosition);
                    }
                }
            }
        }
    }
}

function handlePieceClick(piece)
{
    if(currentTurn == PLAYER || !RANDOM_PLAYER)
    {
        var hasClass = $(piece).hasClass("selected");
        removeCellHighlights();
        removePieceSelections();

        var pieceColor = $(piece).attr("data-color");
        if(pieceColor == currentTurn)
        {
            if(!hasClass)
            {
                $(piece).toggleClass("selected");
            }
        }

        if(ENABLE_HINT &&  $(piece).hasClass("selected"))
        {
            highlightMoves($(piece));
        }
    }
}

function highlightMoves(piece)
{
    var selectedColumn = piece.parent(".checkers-column").attr('data-column');
    var selectedRow = piece.parent(".checkers-column").parent(".checkers-row").attr('data-row');
    var positionObject = {row: selectedRow, column: selectedColumn};

    var possibleMoveMovements = getMoveActions(table, positionObject);
    var possibleEatMovements = getEatActions(table, positionObject, [], [], positionObject);

    for(var i = 0; i < possibleMoveMovements.length; i++)
    {
        addCellHighlight(possibleMoveMovements[i]);
    }

    for(var i = 0; i < possibleEatMovements.length; i++)
    {
        for(var j = 0; j < possibleEatMovements[i].movementPositions.length; j++)
        {
            addCellHighlight(possibleEatMovements[i].movementPositions[j]);
        }
    }
}

function addCellHighlight(position)
{
    $("div[data-row='"+position.row+"'] .checkers-cell[data-column='"+position.column+"']").addClass("highlight");
}

function removeCellHighlights()
{
    $(".checkers-cell").each(function(index){
        $(this).removeClass("highlight");
    });
}

function removePieceSelections()
{
    $(".checkers-piece").each(function(index){
        $(this).removeClass("selected");
    });
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

    adjustSizes();
}

function adjustSizes()
{
    var tableWidth = $("#checkersTable").width();
    var cellWidth = tableWidth / table.length;
    $(".checkers-cell").width(cellWidth);
    $(".checkers-cell").height(cellWidth);

    var checkersSize = cellWidth * 0.8;
    $(".checkers-piece").width(cellWidth * 0.8);
    $(".checkers-piece").height(cellWidth * 0.8);
    $(".checkers-piece").css('margin-top', ((cellWidth - checkersSize)/2) + "px");
}

function removePiece(piecePosition)
{
    $("div[data-row='"+piecePosition.row+"'] .checkers-cell[data-column='"+piecePosition.column+"']").html("");
    table[piecePosition.row][piecePosition.column] = EMPTY_CELL;
}

function movePiece(from, movements, removedPieces)
{
    var piece = $("div[data-row='"+from.row+"'] .checkers-cell[data-column='"+from.column+"']").find(".checkers-piece");
    if(piece)
    {
        var pieceHtml = $("div[data-row='"+from.row+"'] .checkers-cell[data-column='"+from.column+"']").html();

        var to = arrayShift(movements);
        var pieceToRemove = removedPieces.length > 0 ? arrayShift(removedPieces) : null;
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
            table[from.row][from.column] = EMPTY_CELL;

            if(pieceToRemove != null)
            {
                removePiece(pieceToRemove);
            }

            removePieceSelections();
            removeCellHighlights();
            if(movements.length == 0)
            {
                if(isLadyPosition(to, currentTurn) && !pieceIsLady(to))
                {
                    table[to.row][to.column] += LADY_ADD_VALUE;
                    piece.addClass("checkers-lady");
                }
                changeTurn();
            }
            else
            {
                movePiece(to, movements, removedPieces);
            }
        });
    }
}

function arrayShift(array)
{
    var indexToRemove = 0;
    var numberToRemove = 1;
    return array.splice(indexToRemove, numberToRemove)[0];
}

function changeTurn()
{
    if(currentTurn)
    {
        currentTurn = TOP_PLAYER;
    }
    else
    {
        currentTurn = BOTTOM_PLAYER;
    }

    var winner = checkWinner(table,currentTurn);
    if(winner != null)
    {
        $("#winnerName").html(winner == TOP_PLAYER ? "Top Player" : "Bottom Player");
        $('#winnerModal').modal('toggle');
    }
    else
    {
        if(currentTurn)
        {
            if(ENABLE_IA && IA_VS_IA) iaMove(HUMAN_PLAYER);
        }
        else
        {
            if(ENABLE_IA) iaMove(IA_PLAYER);
        }
        $("#turnShower").attr("data-color", currentTurn);
    }
}

String.prototype.escape = function() {
    var tagsToReplace = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;'
    };
    return this.replace(/[&<>]/g, function(tag) {
        return tagsToReplace[tag] || tag;
    });
};