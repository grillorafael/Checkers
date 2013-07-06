function maxValue(table)
{
    if(gameIsFinished(table))
    {
        return utility(table, TOP_PLAYER);
    }
    var v = Number.NEGATIVE_INFINITY;

    var positions = getPlayerPiecesPosition(table, TOP_PLAYER);

    for(var k = 0; k < positions.length; k++)
    {
        var positionObject = positions[k];

        var possibleMoveMovements = getMoveActions(table, positionObject);
        var possibleEatMovements = getEatActions(table, positionObject, [], []);

        if(possibleMoveMovements.length > 0)
        {
            for(var i = 0; i < possibleMoveMovements.length; i++)
            {
                v = Math.max(v, utility(possibleMoveMovements[i].table, TOP_PLAYER));
            }
        }

        //TODO PERCORRER O EAT MOVEMENTS
    }

    return v;
}

function minValue(table)
{
    if(gameIsFinished(table))
    {
        return utility(table, BOTTOM_PLAYER);
    }
    var v = Number.POSITIVE_INFINITY;

    var positions = getPlayerPiecesPosition(table, BOTTOM_PLAYER);

    for(var k = 0; k < positions.length; k++)
    {
        var positionObject = positions[k];

        var possibleMoveMovements = getMoveActions(table, positionObject);
        var possibleEatMovements = getEatActions(table, positionObject, [], []);

        if(possibleMoveMovements.length > 0)
        {
            for(var i = 0; i < possibleMoveMovements.length; i++)
            {
                v = Math.min(v, utility(possibleMoveMovements[i].table, BOTTOM_PLAYER));
            }
        }

        //TODO PERCORRER O EAT MOVEMENTS
    }

    return v;
}

function minimaxDecision(table)
{

}

//This function returns the amount of pieces the enemy has
function utility(table, player)
{
    var count = 0;
    for(var i = 0; i < table.length; i++)
    {
        for(var j = 0; j < table[0].length; j++)
        {
            if(table[i][j] != EMPTY_CELL && table[i][j] != player)
            {
                count++;
            }
        }
    }
    return count;
}