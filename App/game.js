const testWinner = require('./testWinner');

module.exports = () => ({
    players: [
        {
            index: 0,
            id: '',
            name: '',
            value: 'X',
            winner: false,
        },
        {
            index: 1,
            id: '',
            name: '',
            value: 'O',
            winner: false
        }
    ],

    current_player: 1,

    game_fisished: false,

    test_winner: null, 

    player: null,

    tictactoe: [[null, null, null], [null, null, null], [null, null, null]],

    games: [],

    doMark: function(column, row) {
        if(!!this.tictactoe[column][row])
            return false;

        this.tictactoe[column][row] = this.current_player;

        this.test_winner = testWinner(this.tictactoe);

        if(!!this.test_winner.finished){
            this.game_fisished = true;
            
            this.player = this.players[this.current_player - 1];
        }else if( !this.tictactoe[0].filter( e => !e ).length && !this.tictactoe[1].filter( e => !e ).length && !this.tictactoe[2].filter( e => !e ).length ) {
            console.log('deu velha');
            this.game_fisished = true;
            this.player = null;
        }

        this.current_player = this.current_player == 1? 2 : 1;

        this.renderAll();
        
        return true;
    },

    renderArray: [],

    addRenderFunction: function(fn) {
        this.renderArray.push(fn);
    },

    renderAll: function() {
        let updateData = {
            players: this.players,
            test_winner: this.test_winner,
            player: this.player,
            tictactoe: this.tictactoe,
            current_player: this.current_player,
            game_fisished: this.game_fisished,
        };

        this.renderArray.forEach( fnElement => {
            fnElement.call(null, updateData);
        });
    }
});