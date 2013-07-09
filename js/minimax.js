function maxValue(table, iteration)
{
    iteration++;
    var winnerPlayer = hasWinner(table);
    if(winnerPlayer != null)
    {
        return winnerPlayer == IA_PLAYER ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
    }
    else if(iteration > MAX_ITERATION)
    {
        return utility(table, IA_PLAYER);
    }

    var v = Number.NEGATIVE_INFINITY;
    var possibleMovements = getPossibleMovements(table, IA_PLAYER);
    for(var i = 0; i < possibleMovements.length; i++)
    {
        v = Math.max(v, minValue(possibleMovements[i].table, iteration));
    }

    return v;
}

function minValue(table, iteration)
{
    iteration++;
    var winnerPlayer = hasWinner(table);
    if(winnerPlayer != null)
    {
        return winnerPlayer == IA_PLAYER ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
    }
    else if(iteration > MAX_ITERATION)
    {
        return utility(table, HUMAN_PLAYER);
    }

    var v = Number.POSITIVE_INFINITY;
    var possibleMovements = getPossibleMovements(table, HUMAN_PLAYER);
    for(var i = 0; i < possibleMovements.length; i++)
    {
        v = Math.min(v, maxValue(possibleMovements[i].table, iteration));
    }

    return v;
}

function minimaxDecision(table)
{
    var possibleMovements = getPossibleMovements(table, IA_PLAYER);
    var bestMovementValue = Number.NEGATIVE_INFINITY;
    var bestMovementIndex = null;
    for(var i = 0; i < possibleMovements.length; i++)
    {
        var currentMovementValue = minValue(possibleMovements[i].table, 0);
        if(currentMovementValue > bestMovementValue)
        {
            bestMovementValue = currentMovementValue;
            bestMovementIndex = i;
        }
    }

    return possibleMovements[bestMovementIndex];
}

function utility(table, player)
{
    var enemyPieces = 0;
    var playerPieces = 0;
    for(var i = 0; i < table.length; i++)
    {
        for(var j = 0; j < table[0].length; j++)
        {
            if(table[i][j] != EMPTY_CELL && table[i][j] != player)
            {
                enemyPieces++;
            }
            else if(table[i][j] == player)
            {
                playerPieces++;
            }
        }
    }
    return -enemyPieces;
}