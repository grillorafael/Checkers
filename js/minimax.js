function maxValue(table, iteration, alfa, beta)
{
    iteration++;
    var winnerPlayer = hasWinner(table);
    if(winnerPlayer != null)
    {
        return winnerPlayer == IA_PLAYER ? Number.POSITIVE_INFINITY - 1 : Number.NEGATIVE_INFINITY + 1;
    }
    else if(iteration > MAX_ITERATION)
    {
        return utility(table, IA_PLAYER);
    }

    var v = Number.NEGATIVE_INFINITY;
    var possibleMovements = getPossibleMovements(table, IA_PLAYER);
    for(var i = 0; i < possibleMovements.length; i++)
    {
        v = Math.max(v, minValue(possibleMovements[i].table, iteration, alfa, beta));
        if(v >= beta)
        {
            return v;
        }
        alfa = Math.max(alfa, v);
    }

    return v;
}

function minValue(table, iteration, alfa, beta)
{
    iteration++;
    var winnerPlayer = hasWinner(table);
    if(winnerPlayer != null)
    {
        return winnerPlayer == IA_PLAYER ? Number.POSITIVE_INFINITY -1 : Number.NEGATIVE_INFINITY + 1;
    }
    else if(iteration > MAX_ITERATION)
    {
        return utility(table, IA_PLAYER);
    }

    var v = Number.POSITIVE_INFINITY;
    var possibleMovements = getPossibleMovements(table, HUMAN_PLAYER);
    for(var i = 0; i < possibleMovements.length; i++)
    {
        v = Math.min(v, maxValue(possibleMovements[i].table, iteration, alfa, beta));
        if(v <= alfa)
        {
            return v;
        }
        beta = Math.min(beta, v);
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
        var currentMovementValue = minValue(possibleMovements[i].table, 0, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
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
    return utilityBalanced(table, player);
}

function utilityGreedy(table, player)
{
    var enemyPieces = 0;
    var playerPieces = 0;
    for(var i = 0; i < table.length; i++)
    {
        for(var j = 0; j < table[0].length; j++)
        {
            if(table[i][j] != EMPTY_CELL && table[i][j] != player)
            {
                if(table[i][j] > 1) enemyPieces += 4;
                enemyPieces++;
            }
            else if(table[i][j] == player)
            {
                if(table[i][j] > 1) playerPieces += 10;
                playerPieces++;
            }
        }
    }
    return -enemyPieces;
}

function utilityBalanced(table, player)
{
    var enemyPieces = 0;
    var playerPieces = 0;
    for(var i = 0; i < table.length; i++)
    {
        for(var j = 0; j < table[0].length; j++)
        {
            if(table[i][j] != EMPTY_CELL && table[i][j] != player)
            {
                if(table[i][j] > 1) enemyPieces += 4;
                enemyPieces++;
            }
            else if(table[i][j] == player)
            {
                if(table[i][j] > 1) playerPieces += 10;
                playerPieces++;
            }
        }
    }
    return playerPieces - enemyPieces;
}