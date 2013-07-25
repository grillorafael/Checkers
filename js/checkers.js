/*
* piecePosition = {row: ?, column: ?}
* TOP_PLAYER = BLUE
* BOTTOM_PLAYER = RED
* */
function getMoveActions(table, piecePosition)
{
    if(pieceIsLady(piecePosition))
    {
        return getLadyPieceMoveActions(table, piecePosition);
    }
    else
    {
        return getNormalPieceMoveActions(table, piecePosition);
    }

}

function pieceIsLady(piecePosition)
{
    return table[piecePosition.row][piecePosition.column] > 1;
}

function isLadyPosition(piecePosition, pieceColor)
{
    return (pieceColor == TOP_PLAYER && piecePosition.row == table.length - 1) || (pieceColor == BOTTOM_PLAYER && piecePosition.row == 0);
}

function getLadyPieceMoveActions(table, piecePosition)
{
    var possibleMoves = [];

    piecePosition.row = Number(piecePosition.row);
    piecePosition.column = Number(piecePosition.column);

    var diagonalMoves =
    [
        {direction:SE, type: MOVE_PIECE, row: piecePosition.row + 1, column: piecePosition.column + 1, fromRow: piecePosition.row, fromColumn:piecePosition.column},
        {direction:SO, type: MOVE_PIECE, row: piecePosition.row + 1, column: piecePosition.column -1, fromRow: piecePosition.row, fromColumn:piecePosition.column},
        {direction:NE, type: MOVE_PIECE, row: piecePosition.row - 1, column: piecePosition.column + 1, fromRow: piecePosition.row, fromColumn:piecePosition.column},
        {direction:NO, type: MOVE_PIECE, row: piecePosition.row - 1, column: piecePosition.column -1, fromRow: piecePosition.row, fromColumn:piecePosition.column}
    ];

    var len;
    for(var i = 0, len = diagonalMoves.length; i < len; i++)
    {
        var newPosition = diagonalMoves[i];
        try
        {
            while(table[newPosition.row][newPosition.column] == EMPTY_CELL)
            {
                var tableAux = copyTable(table);
                tableAux[newPosition.row][newPosition.column] = tableAux[piecePosition.row][piecePosition.column]
                tableAux[piecePosition.row][piecePosition.column] = EMPTY_CELL;
                possibleMoves.push({type: MOVE_PIECE, row: newPosition.row,
                    column: newPosition.column, fromRow: piecePosition.row, fromColumn:piecePosition.column, table: tableAux, direction: newPosition.direction});
                addCoordinates(newPosition, newPosition.direction);
            }
        }
        catch(error){}
    }

    return possibleMoves;
}

function getNormalPieceMoveActions(table, piecePosition)
{
    var possibleMoves = [];
    var pieceColor = table[piecePosition.row][piecePosition.column];

    var newPositions = getDiagonalMoves(pieceColor, piecePosition);

    var len;
    for(var i = 0, len = newPositions.length ; i < len ; i++)
    {
        try
        {
            var tableAux = copyTable(table);
            var position = newPositions[i];
            if(table[position.row][position.column] == EMPTY_CELL)
            {
                tableAux[position.row][position.column] = pieceColor;
                if(isLadyPosition(position, pieceColor) && pieceColor <= 1) tableAux[position.row][position.column] += LADY_ADD_VALUE;
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
    if(pieceIsLady(piecePosition))
    {
        return getLadyEatActions(checkersTable, piecePosition, movementPositions, removedPiecesPositions, initialPiecePosition);
    }
    else
    {
        return getNormalEatActions(checkersTable, piecePosition, movementPositions, removedPiecesPositions, initialPiecePosition);
    }
}

function getLadyEatActions(checkersTable, piecePosition, movementPositions, removedPiecesPositions, initialPiecePosition)
{
    var ladyMovements = getLadyPieceMoveActions(table, piecePosition);
    var possibleLadyMovements = [];

    var len;
    for(var i = 0, len = ladyMovements.length; i < len; i++)
    {
        concatLists(possibleLadyMovements, getLadyEatActionsRecursive(checkersTable, ladyMovements[i], movementPositions, removedPiecesPositions,
            initialPiecePosition, checkersTable[initialPiecePosition.row][initialPiecePosition.column], 0));
    }
    concatLists(possibleLadyMovements, getNormalEatActions(checkersTable, piecePosition, [], [], initialPiecePosition));
    return possibleLadyMovements;
}

function getLadyEatActionsRecursive(checkersTable, piecePosition, movementPositions, removedPiecesPositions, initialPiecePosition, pieceColor, iteration)
{
    var possibleMoves = [];

    if(iteration == 0)
    {
        var pos = {row: piecePosition.row, column: piecePosition.column, type: MOVE_PIECE};
        addCoordinates(pos, piecePosition.direction);
        var newPositions = [pos];
    }
    else
    {
        var newPositions = [
            {type: MOVE_PIECE, row: piecePosition.row + 1, column: piecePosition.column + 1, direction: SE},
            {type: MOVE_PIECE, row: piecePosition.row + 1, column: piecePosition.column - 1, direction: SO},
            {type: MOVE_PIECE, row: piecePosition.row - 1, column: piecePosition.column - 1, direction: NO},
            {type: MOVE_PIECE, row: piecePosition.row - 1, column: piecePosition.column + 1, direction: NE}
        ];
    }

    var len;
    for(var i = 0, len = newPositions.length; i < len; i++)
    {
        try{
            if(checkersTable[newPositions[i].row][newPositions[i].column] != EMPTY_CELL
                && checkersTable[newPositions[i].row][newPositions[i].column] != pieceColor
                && checkersTable[newPositions[i].row][newPositions[i].column] != (pieceColor + LADY_ADD_VALUE)
                && checkersTable[newPositions[i].row][newPositions[i].column] != (pieceColor - LADY_ADD_VALUE))
            {
                var eatPosition = {
                    row: newPositions[i].row,
                    column: newPositions[i].column
                };
                if(iteration == 0)
                {
                    addCoordinates(eatPosition, piecePosition.direction);
                }
                else
                {
                    addCoordinates(eatPosition, newPositions[i].direction);
                }

                if(checkersTable[eatPosition.row][eatPosition.column] == EMPTY_CELL)
                {
                    var changedTable = copyTable(checkersTable);
                    changedTable[eatPosition.row][eatPosition.column] = pieceColor;
                    changedTable[newPositions[i].row][newPositions[i].column] = EMPTY_CELL;
                    changedTable[piecePosition.row][piecePosition.column] = EMPTY_CELL;

                    var changedMovementPositions = copyNodeList(movementPositions);
                    changedMovementPositions.push(eatPosition);

                    var changedRemovedPiecePositions = copyNodeList(removedPiecesPositions);
                    changedRemovedPiecePositions.push(newPositions[i]);

                    var finalMove = {type: EAT_PIECE, movementPositions:changedMovementPositions,
                        removedPiecesPosition: changedRemovedPiecePositions, table: changedTable,
                        fromRow:initialPiecePosition.row, fromColumn:initialPiecePosition.column};

                    iteration++;
                    possibleMoves.push(finalMove);
                    concatLists(possibleMoves,
                        getLadyEatActionsRecursive(changedTable, eatPosition, changedMovementPositions, changedRemovedPiecePositions, initialPiecePosition, pieceColor, iteration));
                }
            }
        }catch(error){}
    }
    return possibleMoves;
}

function getNormalEatActions(checkersTable, piecePosition, movementPositions, removedPiecesPositions, initialPiecePosition)
{
    var possibleMoves = [];
    var pieceColor = checkersTable[piecePosition.row][piecePosition.column];

    var newPositions = [
        {type: MOVE_PIECE, row: piecePosition.row + 1, column: piecePosition.column + 1, direction: SE},
        {type: MOVE_PIECE, row: piecePosition.row + 1, column: piecePosition.column - 1, direction: SO},
        {type: MOVE_PIECE, row: piecePosition.row - 1, column: piecePosition.column - 1, direction: NO},
        {type: MOVE_PIECE, row: piecePosition.row - 1, column: piecePosition.column + 1, direction: NE}
    ];

    var len;
    for(var i = 0, len = newPositions.length; i < len; i++)
    {
        try{
            if(checkersTable[newPositions[i].row][newPositions[i].column] != EMPTY_CELL
                && checkersTable[newPositions[i].row][newPositions[i].column] != pieceColor
                && checkersTable[newPositions[i].row][newPositions[i].column] != (pieceColor + LADY_ADD_VALUE)
                && checkersTable[newPositions[i].row][newPositions[i].column] != (pieceColor - LADY_ADD_VALUE))
            {
                var eatPosition = {
                    row: newPositions[i].row,
                    column: newPositions[i].column
                };
                addCoordinates(eatPosition, newPositions[i].direction);

                if(checkersTable[eatPosition.row][eatPosition.column] == EMPTY_CELL)
                {
                    var changedTable = copyTable(checkersTable);
                    changedTable[eatPosition.row][eatPosition.column] = pieceColor;
                    changedTable[newPositions[i].row][newPositions[i].column] = EMPTY_CELL;
                    changedTable[piecePosition.row][piecePosition.column] = EMPTY_CELL;

                    var changedMovementPositions = copyNodeList(movementPositions);
                    changedMovementPositions.push(eatPosition);

                    var changedRemovedPiecePositions = copyNodeList(removedPiecesPositions);
                    changedRemovedPiecePositions.push(newPositions[i]);

                    var finalMove = {type: EAT_PIECE, movementPositions:changedMovementPositions,
                        removedPiecesPosition: changedRemovedPiecePositions, table: changedTable,
                        fromRow:initialPiecePosition.row, fromColumn:initialPiecePosition.column};
                    if(isLadyPosition(eatPosition, pieceColor))
                    {
                        finalMove.table[eatPosition.row][eatPosition.column] += LADY_ADD_VALUE;
                    }
                    possibleMoves.push(finalMove);
                    concatLists(possibleMoves,
                        getNormalEatActions(changedTable, eatPosition, changedMovementPositions, changedRemovedPiecePositions, initialPiecePosition));
                }
            }
        }catch(error){}
    }
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
    var len;
    for(var i = 0, len = table.length; i < len && (!hasTop || !hasBottom); i++)
    {
        var lenj;
        for(var j = 0, lenj = table[0].length; (j < lenj) && (!hasTop || !hasBottom); j++)
        {
            if(table[i][j] == TOP_PLAYER || table[i][j] == LADY_TOP_PLAYER)
            {
                hasTop = true
            }
            else if(table[i][j] == BOTTOM_PLAYER || table[i][j] == LADY_BOTTOM_PLAYER)
            {
                hasBottom = true;
            }
        }
    }

//    var playerMovements = getPossibleMovements(table, player);
//    if(playerMovements.length == 0)
//    {
//        if(player == TOP_PLAYER)
//        {
//            return BOTTOM_PLAYER;
//        }
//        else
//        {
//            return TOP_PLAYER;
//        }
//    }
//    else
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
    var len;
    for(var i = 0, len = list2.length; i < len; i++)
    {
        list1.push(list2[i]);
    }
}

function copyTable(tableToCopy)
{
    var copiedTable = [];
    var len1, len2;
    for(var i = 0, len1 = tableToCopy.length; i < len1 ; i++)
    {
        var copiedTableRow = [];
        for(var j = 0, len2 = tableToCopy[0].length; j < len2; j++)
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
    var len;
    for(var i = 0, len = nodeList.length; i < len; i++)
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
    var positions = [], len1, len2;
    for(var i = 0, len1 = table.length; i < len1; i++)
    {
        for(var j = 0, len2 = table[0].length; j < len2; j++)
        {
            if(table[i][j] == player || table[i][j] == player + LADY_ADD_VALUE || table[i][j] == player - LADY_ADD_VALUE)
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
    var len = positions.length;
    for(var k = 0; k < len; k++)
    {
        var positionObject = positions[k];

        var possibleMoveMovements = getMoveActions(table, positionObject);
        var possibleMovements = getEatActions(table, positionObject, [], [], positionObject);

        concatLists(possibleMovements, possibleMoveMovements);
        concatLists(possibleMovementsTotal, possibleMovements);
    }

    len = possibleMovementsTotal.length;
    for(var i = 0; i < len; i++)
    {
        possibleMovementsTotal[i].value = utility(possibleMovementsTotal[i].table, player);
    }
    possibleMovementsTotal.sort(function(a, b){
        return b.value - a.value
    });

    return possibleMovementsTotal;
}

function getTotalPieces(table)
{
    var len1, len2, totalCount = 0;
    for(var i = 0, len1 = table.length; i < len1; i++)
    {
        for(var j = 0, len2 = table[0].length; j < len2; j++)
        {
            if(table[i][j] != EMPTY_CELL) totalCount++;
        }
    }

    return totalCount;
}

function iaMove(player)
{
    var movement = minimaxDecision(table, player);
    if(movement.type == MOVE_PIECE)
    {
        movePiece({row:movement.fromRow, column: movement.fromColumn}, [{row:movement.row, column: movement.column}], []);
    }
    else
    {
        movePiece({row:movement.fromRow, column: movement.fromColumn}, movement.movementPositions, movement.removedPiecesPosition);
    }
}

function getEnemyPlayer(player)
{
    if(player == TOP_PLAYER) return BOTTOM_PLAYER;
    return TOP_PLAYER;
}

function addCoordinates(c1, c2)
{
    c1.row = c1.row + c2.row;
    c1.column = c1.column + c2.column;
}
