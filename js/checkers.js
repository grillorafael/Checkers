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
            var position = newPositions[i];
            if(table[position.row][position.column] == EMPTY_CELL)
            {
                possibleMoves.push(position);
            }
        }
        catch(error)
        {

        }
    }

    return possibleMoves;
}

function getEatActions(checkersTable, piecePosition, movementPositions, removedPiecesPositions)
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
                    removedPiecesPosition: changedRemovedPiecePositions, table: changedTable});
                concatLists(possibleMoves,
                    getEatActions(changedTable, eatPosition, changedMovementPositions, changedRemovedPiecePositions));
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
                    removedPiecesPosition: changedRemovedPiecePositions, table: changedTable});
                concatLists(possibleMoves,
                    getEatActions(changedTable, eatPosition, changedMovementPositions, changedRemovedPiecePositions));
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
                    removedPiecesPosition: changedRemovedPiecePositions, table: changedTable});
                concatLists(possibleMoves,
                    getEatActions(changedTable, eatPosition, changedMovementPositions, changedRemovedPiecePositions));
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
                    removedPiecesPosition: changedRemovedPiecePositions, table: changedTable});
                concatLists(possibleMoves,
                    getEatActions(changedTable, eatPosition, changedMovementPositions, changedRemovedPiecePositions));
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
        var newPositions = [{type: MOVE_PIECE, row: piecePosition.row + 1, column: piecePosition.column + 1},
            {type: MOVE_PIECE, row: piecePosition.row + 1, column: piecePosition.column -1}];
    }
    else
    {
        var newPositions = [{type: MOVE_PIECE, row: piecePosition.row - 1, column: piecePosition.column + 1},
            {type: MOVE_PIECE, row: piecePosition.row - 1, column: piecePosition.column -1}];
    }

    return newPositions;
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