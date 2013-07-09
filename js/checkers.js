/*
* piecePosition = {row: ?, column: ?}
* TOP_PLAYER = BLUE
* BOTTOM_PLAYER = RED
* */
function getMoveActions(table, piecePosition)
{
    var possibleMoves = [];
    var pieceColor = table[piecePosition.row][piecePosition.column];

    var newPositions = getDiagonalMoves(pieceColor, piecePosition);

    for(var i = 0 ; i < newPositions.length ; i++)
    {
        try
        {
            var tableAux = copyTable(table);
            var position = newPositions[i];
            if(table[position.row][position.column] == EMPTY_CELL)
            {
                tableAux[position.row][position.column] = pieceColor;
                tableAux[piecePosition.row][piecePosition.column] = EMPTY_CELL;
                position.table = tableAux;
                possibleMoves.push(position);
            }
        }
        catch(error)
        {

        }
    }

    return possibleMoves;
}

function getEatActions(checkersTable, piecePosition, movementPositions, removedPiecesPositions, initialPiecePosition)
{
    var possibleMoves = [];
    var pieceColor = checkersTable[piecePosition.row][piecePosition.column];

    var newPositions = [
        {type: MOVE_PIECE, row: piecePosition.row + 1, column: piecePosition.column + 1},
        {type: MOVE_PIECE, row: piecePosition.row + 1, column: piecePosition.column - 1},
        {type: MOVE_PIECE, row: piecePosition.row - 1, column: piecePosition.column - 1},
        {type: MOVE_PIECE, row: piecePosition.row - 1, column: piecePosition.column + 1}
    ];

    try{
        if(checkersTable[newPositions[0].row][newPositions[0].column] != EMPTY_CELL && checkersTable[newPositions[0].row][newPositions[0].column] != pieceColor)
        {
            var eatPosition = {
                row: newPositions[0].row + 1,
                column: newPositions[0].column + 1
            };

            if(checkersTable[eatPosition.row][eatPosition.column] == EMPTY_CELL)
            {
                var changedTable = copyTable(checkersTable);
                changedTable[eatPosition.row][eatPosition.column] = pieceColor;
                changedTable[newPositions[0].row][newPositions[0].column] = EMPTY_CELL;
                changedTable[piecePosition.row][piecePosition.column] = EMPTY_CELL;

                var changedMovementPositions = copyNodeList(movementPositions);
                changedMovementPositions.push(eatPosition);

                var changedRemovedPiecePositions = copyNodeList(removedPiecesPositions);
                changedRemovedPiecePositions.push(newPositions[0]);

                possibleMoves.push({type: EAT_PIECE, movementPositions:changedMovementPositions,
                    removedPiecesPosition: changedRemovedPiecePositions, table: changedTable, fromRow:initialPiecePosition.row, fromColumn:initialPiecePosition.column});
                concatLists(possibleMoves,
                    getEatActions(changedTable, eatPosition, changedMovementPositions, changedRemovedPiecePositions, initialPiecePosition));
            }
        }
    }catch(error){}

    try{
        if(checkersTable[newPositions[1].row][newPositions[1].column] != EMPTY_CELL && checkersTable[newPositions[1].row][newPositions[1].column] != pieceColor)
        {
            var eatPosition = {
                row: newPositions[1].row + 1,
                column: newPositions[1].column - 1
            };

            if(checkersTable[eatPosition.row][eatPosition.column] == EMPTY_CELL)
            {
                var changedTable = copyTable(checkersTable);
                changedTable[eatPosition.row][eatPosition.column] = pieceColor;
                changedTable[newPositions[1].row][newPositions[1].column] = EMPTY_CELL;
                changedTable[piecePosition.row][piecePosition.column] = EMPTY_CELL;

                var changedMovementPositions = copyNodeList(movementPositions);
                changedMovementPositions.push(eatPosition);

                var changedRemovedPiecePositions = copyNodeList(removedPiecesPositions);
                changedRemovedPiecePositions.push(newPositions[1]);

                possibleMoves.push({type: EAT_PIECE, movementPositions:changedMovementPositions,
                    removedPiecesPosition: changedRemovedPiecePositions, table: changedTable, fromRow:initialPiecePosition.row, fromColumn:initialPiecePosition.column});
                concatLists(possibleMoves,
                    getEatActions(changedTable, eatPosition, changedMovementPositions, changedRemovedPiecePositions, initialPiecePosition));
            }
        }
    }catch(error){}

    try{
        if(checkersTable[newPositions[2].row][newPositions[2].column] != EMPTY_CELL && checkersTable[newPositions[2].row][newPositions[2].column] != pieceColor)
        {
            var eatPosition = {
                row: newPositions[2].row - 1,
                column: newPositions[2].column - 1
            };

            if(checkersTable[eatPosition.row][eatPosition.column] == EMPTY_CELL)
            {
                var changedTable = copyTable(checkersTable);
                changedTable[eatPosition.row][eatPosition.column] = pieceColor;
                changedTable[newPositions[2].row][newPositions[2].column] = EMPTY_CELL;
                changedTable[piecePosition.row][piecePosition.column] = EMPTY_CELL;

                var changedMovementPositions = copyNodeList(movementPositions);
                changedMovementPositions.push(eatPosition);

                var changedRemovedPiecePositions = copyNodeList(removedPiecesPositions);
                changedRemovedPiecePositions.push(newPositions[2]);

                possibleMoves.push({type: EAT_PIECE, movementPositions:changedMovementPositions,
                    removedPiecesPosition: changedRemovedPiecePositions, table: changedTable, fromRow:initialPiecePosition.row, fromColumn:initialPiecePosition.column});
                concatLists(possibleMoves,
                    getEatActions(changedTable, eatPosition, changedMovementPositions, changedRemovedPiecePositions, initialPiecePosition));
            }
        }
    }catch(error){}

    try{
        if(checkersTable[newPositions[3].row][newPositions[3].column] != EMPTY_CELL && checkersTable[newPositions[3].row][newPositions[3].column] != pieceColor)
        {
            var eatPosition = {
                row: newPositions[3].row - 1,
                column: newPositions[3].column + 1
            };

            if(checkersTable[eatPosition.row][eatPosition.column] == EMPTY_CELL)
            {
                var changedTable = copyTable(checkersTable);
                changedTable[eatPosition.row][eatPosition.column] = pieceColor;
                changedTable[newPositions[3].row][newPositions[3].column] = EMPTY_CELL;
                changedTable[piecePosition.row][piecePosition.column] = EMPTY_CELL;

                var changedMovementPositions = copyNodeList(movementPositions);
                changedMovementPositions.push(eatPosition);

                var changedRemovedPiecePositions = copyNodeList(removedPiecesPositions);
                changedRemovedPiecePositions.push(newPositions[3]);

                possibleMoves.push({type: EAT_PIECE, movementPositions:changedMovementPositions,
                    removedPiecesPosition: changedRemovedPiecePositions, table: changedTable, fromRow:initialPiecePosition.row, fromColumn:initialPiecePosition.column});
                concatLists(possibleMoves,
                    getEatActions(changedTable, eatPosition, changedMovementPositions, changedRemovedPiecePositions, initialPiecePosition));
            }
        }
    }catch(error){}

    return possibleMoves;
}

function getDiagonalMoves(player, piecePosition)
{
    piecePosition.row = Number(piecePosition.row);
    piecePosition.column = Number(piecePosition.column);
    if(player == TOP_PLAYER)
    {
        var newPositions = [{type: MOVE_PIECE, row: piecePosition.row + 1, column: piecePosition.column + 1, fromRow: piecePosition.row, fromColumn:piecePosition.column},
            {type: MOVE_PIECE, row: piecePosition.row + 1, column: piecePosition.column -1, fromRow: piecePosition.row, fromColumn:piecePosition.column}];
    }
    else
    {
        var newPositions = [{type: MOVE_PIECE, row: piecePosition.row - 1, column: piecePosition.column + 1, fromRow: piecePosition.row, fromColumn:piecePosition.column},
            {type: MOVE_PIECE, row: piecePosition.row - 1, column: piecePosition.column -1, fromRow: piecePosition.row, fromColumn:piecePosition.column}];
    }

    return newPositions;
}

function hasWinner(table)
{
    var hasTop = false;
    var hasBottom = false;
    for(var i = 0; i < table.length && (!hasTop || !hasBottom); i++)
    {
        for(var j = 0; (j < table[0].length) && (!hasTop || !hasBottom); j++)
        {
            if(table[i][j] == TOP_PLAYER)
            {
                hasTop = true
            }
            else if(table[i][j] == BOTTOM_PLAYER)
            {
                hasBottom = true;
            }
        }
    }

    if(hasTop && !hasBottom)
    {
        return TOP_PLAYER;
    }
    else if(!hasTop && hasBottom)
    {
        return BOTTOM_PLAYER
    }
    else
    {
        return null;
    }
}

function concatLists(list1, list2)
{
    for(var i = 0; i< list2.length; i++)
    {
        list1.push(list2[i]);
    }
}

function copyTable(tableToCopy)
{
    var copiedTable = [];
    for(var i = 0; i < tableToCopy.length ; i++)
    {
        var copiedTableRow = [];
        for(var j = 0; j < tableToCopy[0].length; j++)
        {
            copiedTableRow[j] = tableToCopy[i][j];
        }
        copiedTable[i] = copiedTableRow;
    }
    return copiedTable;
}

function copyNodeList(nodeList)
{
    var copiedNodeList = [];
    for(var i = 0; i < nodeList.length; i++)
    {
        copiedNodeList[i] = {
            row: nodeList[i].row,
            column: nodeList[i].column
        };
    }

    return copiedNodeList;
}

function getPlayerPiecesPosition(table, player)
{
    var positions = [];
    for(var i = 0; i < table.length; i++)
    {
        for(var j = 0; j < table[0].length; j++)
        {
            if(table[i][j] == player)
            {
                positions.push({row: i, column: j});
            }
        }
    }

    return positions;
}

function getPossibleMovements(table, player)
{
    var positions = getPlayerPiecesPosition(table, player);

    var possibleMovementsTotal = [];
    for(var k = 0; k < positions.length; k++)
    {
        var positionObject = positions[k];

        var possibleMoveMovements = getMoveActions(table, positionObject);
        var possibleMovements = getEatActions(table, positionObject, [], [], positionObject);

        concatLists(possibleMovements, possibleMoveMovements);
        concatLists(possibleMovementsTotal, possibleMovements);
    }

    return possibleMovementsTotal;
}

function iaMove()
{
    var movement = minimaxDecision(table);
    console.log(movement);
    console.log(table);
    if(movement.type == MOVE_PIECE)
    {
        movePiece({row:movement.fromRow, column: movement.fromColumn}, [{row:movement.row, column: movement.column}], []);
    }
    else
    {
        movePiece({row:movement.fromRow, column: movement.fromColumn}, movement.movementPositions, movement.removedPiecesPosition);
    }
}