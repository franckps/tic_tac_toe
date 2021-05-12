const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const generateGame = require('./game');
var games = [generateGame()];

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use( cors() );

app.use( '/', express.static(path.join(__dirname, 'public')) );

let server_path = process.env.SERVER_PATH? process.env.SERVER_PATH : 'http://127.0.0.1:3000';

app.get('/', (request, response) => {
    return response.send(`
        <!DOCTYPE html>
        <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>TIC TAC TOE game</title>
                <link rel="stylesheet" href="/style.css">
            </head>
            <body>
                <h1>Play the classic Tic Tac Toe game with other person</h1>
                <p>Maybe you'll wait until an other people connect to play with you</p>
                <button class="btn-init" onclick="initGame()">Play</button>
            </body>
            <script src="/testWinner.js"></script>
            <script src="/game.js"></script>
            <script src="/socket.io.js"></script>
            <script>
                let myGame = new game();

                var socket = null;

                function initGame() {
                    socket = io('${ server_path }');

                    socket.on('init', function(data) {
                        myGame.player = data.id;
                        myGame.init();
                    }); 

                    socket.on('update', function(data) {
                        myGame.render(data);
                    }); 
                }

                doMark = function(column, row){
                    socket.emit('mark', { column, row });
                };
            </script>
        </html>
    `);
});

io.on('connection', (socket) => {
    let game = null;
    games.forEach( element => {
        if(element.players[0].id == '' || element.players[1].id == '')
            game = element
    } );

    if(!game) {
        game = generateGame();
        games.push( game );
    }

    let updateData = {
        players: game.players,
        test_winner: game.test_winner,
        player: game.players[game.current_player - 1],
        tictactoe: game.tictactoe,
        current_player: game.current_player, 
        game_fisished: game.game_fisished,
    };

    if(game.players[0].id == ''){
        game.players[0].id = socket.id;
        io.to(game.players[0].id).emit("init", { ...updateData, id: 1 });

        console.log('Waiting an other user to play...');
    }else if(game.players[1].id == ''){
        game.players[1].id = socket.id;
        io.to(game.players[1].id).emit("init", { ...updateData, id: 2 });

        io.to(game.players[0].id).emit("update", updateData);
        io.to(game.players[1].id).emit("update", updateData);
        console.log('You can start the game now!');

        game.addRenderFunction((updateData) => io.to(game.players[0].id).emit("update", updateData) );
        game.addRenderFunction((updateData) => io.to(game.players[1].id).emit("update", updateData) );
    }else
        return false;

    socket.on('mark', ({ column, row }) => {
        if( !String(column) || !String(row) )
            return false;

        let game = games.filter( element => ( element.players[0].id == socket.id || element.players[1].id == socket.id ) )[0];

        if(!!game)
            game.doMark(column, row);

        if(game.players[game.current_player - 1].id == 'disconected' && !game.game_fisished) {
            for(let column = 0; column < 3; column++){
                for(let row = 0; row < 3; row++){
                    if(game.doMark(column, row))
                        column = row = 3;
                }
            }
        }
    });

    socket.on('disconnect', () => {
        console.log('user disconnected!')
        games.forEach((game, key) => {

            if( game.players[0].id == socket.id || game.players[1].id == socket.id ) {
                if(game.game_fisished)
                    return games = games.filter( element => element != game );
                
                game.players = game.players.map( element => {
                    if(element.id == socket.id) {
                        if(game.current_player == element.index + 1){
                            for(let column = 0; column < 3; column++){
                                for(let row = 0; row < 3; row++){
                                    if(game.doMark(column, row))
                                        column = row = 3;
                                }
                            }
                        }
                        return { ...element, id: 'disconected' }
                    }else if(element.id == 'disconected')
                        return games = games.filter( element => element != game );
                    else
                        return element;
                });
            }
        });
    });
});

http.listen(process.env.PORT? process.env.PORT : '3000', () => {
    console.log(`Listen on ${process.env.PORT? process.env.PORT : '3000'}`);
});
