/*t = tictactoe array object = 
[
    Colum01[Row01(null, 1, 2), Row02(null, 1, 2), Row03(null, 1, 2)],
    Colum02[Row01(null, 1, 2), Row02(null, 1, 2), Row03(null, 1, 2)],
    Colum03[Row01(null, 1, 2), Row02(null, 1, 2), Row03(null, 1, 2)]
]
*/
/*
returns
{
    finished: ( true | false ), 
    winner: ( 1 | 2 | null ), 
    position: ( [[column01, row01], [column02, row02], [column03, row03]] )
}
*/
module.exports = function(t){
    let have_winner = false;
    let row_winner = [true, true, true];
    let aux = [null, null, null];
    let position_winner = [null, null, null]
    for(x=0; x < t.length; x++){
        if(x == 0)
        aux = t[0];
        else{
        if(t[x][0] != aux[0] || aux[0] == null) row_winner[0] = false;
        if(t[x][1] != aux[1] || aux[1] == null) row_winner[1] = false;
        if(t[x][2] != aux[2] || aux[2] == null) row_winner[2] = false;
        }
        if(t[x][0] == t[x][1] && t[x][1] == t[x][2] && !!t[x][2]){ position_winner = [[x,0],[x,1],[x,2]]; have_winner = true };
    }
    if(!!row_winner[0]){ position_winner = [[0,0],[1,0],[2,0]], have_winner = true; }
    if(!!row_winner[1]){ position_winner = [[0,1],[1,1],[2,1]], have_winner = true; }
    if(!!row_winner[2]){ position_winner = [[0,2],[1,2],[2,2]], have_winner = true; }

    if(t[0][0] == t[1][1] && t[1][1] == t[2][2] && !!t[2][2]){ position_winner = [[0,0],[1,1],[2,2]]; have_winner = true; }

    if(t[2][0] == t[1][1] && t[1][1] == t[0][2] && !!t[0][2]){ position_winner = [[2,0],[1,1],[0,2]]; have_winner = true; }
    return {
        finished: have_winner, 
        winner: have_winner? t[position_winner[0][0]][position_winner[0][1]] : null, 
        position: position_winner
    };
}