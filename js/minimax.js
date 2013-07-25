var currentMaxIteration = MIN_ITERATION;
var searchedSpace = 0;

function maxValue(table, iteration, alfa, beta, player)
{
    iteration++;
    //var winnerPlayer = hasWinner(table, player);
    var winnerPlayer = hasWinner(table);
    if(winnerPlayer != null)
    {
        return winnerPlayer == player ? Number.MAX_VALUE - iteration : Number.NEGATIVE_INFINITY;
    }
    else if(iteration > currentMaxIteration)
    {
        return utility(table, player);
    }

    var v = Number.NEGATIVE_INFINITY;
    var possibleMovements = getPossibleMovements(table, player);
    var len = possibleMovements.length;
    if(len == 0)
    {
        return v;
    }

    for(var i = 0; i < len; i++)
    {
        searchedSpace++;
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
    //var winnerPlayer = hasWinner(table, player);
    var winnerPlayer = hasWinner(table);
    if(winnerPlayer != null)
    {
        return winnerPlayer == player ? Number.MAX_VALUE - iteration : Number.NEGATIVE_INFINITY;
    }
    else if(iteration > currentMaxIteration)
    {
        return utility(table, player);
    }

    var v = Number.POSITIVE_INFINITY, len;
    var possibleMovements = getPossibleMovements(table, getEnemyPlayer(player));
    len = possibleMovements.length
    if(len == 0)
    {
        return v;
    }
    for(var i = 0; i < len; i++)
    {
        searchedSpace++;
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
    searchedSpace++
    currentMaxIteration = Math.floor(MIN_ITERATION + (1 - (getTotalPieces(table) / maxPieces)) * MAX_ITERATION);
    var date1 = new Date();
    var possibleMovements = getPossibleMovements(table, player);
    var bestMovementValue = Number.NEGATIVE_INFINITY;
    var bestMovementIndex = null;
    var len;
    for(var i = 0, len = possibleMovements.length; i < len; i++)
    {
        searchedSpace++;
        var currentMovementValue = minValue(possibleMovements[i].table, 0, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, player);
        if(currentMovementValue >= bestMovementValue)
        {
            bestMovementValue = currentMovementValue;
            bestMovementIndex = i;
        }
    }

    var date2 = new Date();

    var diff = date2 - date1;

    console.log(diff / 1000);
    console.log(currentMaxIteration);
    console.log(searchedSpace);

    searchedSpace = 0;
    return possibleMovements[bestMovementIndex];
}

function utility(table, player)
{
    var value = utilityBalanced(table, player);
    return value;
}

function utilityGreedy(table, player)
{
    var enemyPieces = 0;
    var playerPieces = 0;
    var len1, len2;
    for(var i = 0, len1 = table.length; i < len1; i++)
    {
        for(var j = 0, len2 = table[0].length; j < len2; j++)
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
    var len1, len2;
    for(var i = 0, len1 = table.length; i < len1; i++)
    {
        for(var j = 0, len2 = table[0].length; j < len2; j++)
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