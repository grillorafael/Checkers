function maxValue(table, iteration, alfa, beta, player)
{
    iteration++;
    var winnerPlayer = hasWinner(table);
    if(winnerPlayer != null)
    {
        return winnerPlayer == player ? Number.POSITIVE_INFINITY - 1 : Number.NEGATIVE_INFINITY + 1;
    }
    else if(iteration > MAX_ITERATION)
    {
        return utility(table, player);
    }

    var v = Number.NEGATIVE_INFINITY;
    var possibleMovements = getPossibleMovements(table, player);
    if(possibleMovements.length == 0)
    {
        return Number.POSITIVE_INFINITY - 1;
    }

    for(var i = 0; i < possibleMovements.length; i++)
    {
        v = Math.max(v, minValue(possibleMovements[i].table, iteration, alfa, beta, player));
        if(v >= beta)
        {
            return v;
        }
        alfa = Math.max(alfa, v);
    }

    return v;
}

function minValue(table, iteration, alfa, beta, player)
{
    iteration++;
    var winnerPlayer = hasWinner(table);
    if(winnerPlayer != null)
    {
        return winnerPlayer == player ? Number.POSITIVE_INFINITY -1 : Number.NEGATIVE_INFINITY + 1;
    }
    else if(iteration > MAX_ITERATION)
    {
        return utility(table, player);
    }

    var v = Number.POSITIVE_INFINITY;
    var possibleMovements = getPossibleMovements(table, player);
    if(possibleMovements.length == 0)
    {
        return Number.POSITIVE_INFINITY - 1;
    }
    for(var i = 0; i < possibleMovements.length; i++)
    {
        v = Math.min(v, maxValue(possibleMovements[i].table, iteration, alfa, beta, player));
        if(v <= alfa)
        {
            return v;
        }
        beta = Math.min(beta, v);
    }

    return v;
}

function minimaxDecision(table, player)
{
    var possibleMovements = getPossibleMovements(table, player);
    var bestMovementValue = Number.NEGATIVE_INFINITY;
    var bestMovementIndex = null;
    for(var i = 0; i < possibleMovements.length; i++)
    {
        var currentMovementValue = minValue(possibleMovements[i].table, 0, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, player);
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
    return utilityGreedy(table, player);
}

function utilityGreedy(table, player)
{
    var enemyPieces = 0;
    var playerPieces = 0;
    for(var i = 0; i < table.length; i++)
    {
        for(var j = 0; j < table[0].length; j++)
        {

            if(table[i][j] == player || table[i][j] == player + LADY_ADD_VALUE || table[i][j] == player - LADY_ADD_VALUE)
            {
                if(table[i][j] > 1) playerPieces += 10;
                playerPieces++;
            }
            else if(table[i][j] != EMPTY_CELL)
            {
                if(table[i][j] > 1) enemyPieces += 4;
                enemyPieces++;
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
            if(table[i][j] == player || table[i][j] == player + LADY_ADD_VALUE || table[i][j] == player - LADY_ADD_VALUE)
            {
                if(table[i][j] > 1) playerPieces += 10;
                playerPieces++;
            }
            else if(table[i][j] != EMPTY_CELL)
            {
                if(table[i][j] > 1) enemyPieces += 4;
                enemyPieces++;
            }
        }
    }
    return playerPieces - enemyPieces;
}