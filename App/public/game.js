doMark = function(column, row){};

game = function(){
    this.player = 1;
    this.tictactoe = [[null, null, null], [null, null, null], [null, null, null]];

    this.init = function(){
        let tictactoeForm = document.createElement('form');
        tictactoeForm.id = `container-tictactoe${this.player}`;
        tictactoeForm.classList = 'container-tictactoe';
        tictactoeForm.innerHTML = `
        <div class="tictactoe">
            <div class="boxes">
            </div>

            <span class="winner_reference end_point_00 end_point_02" data-from="0,0" data-to="0,2"></span>
            <span class="winner_reference end_point_10 end_point_12" data-from="1,0" data-to="1,2"></span>
            <span class="winner_reference end_point_20 end_point_22" data-from="2,0" data-to="2,2"></span>

            <span class="winner_reference end_point_00 end_point_20" data-from="0,0" data-to="2,0"></span>
            <span class="winner_reference end_point_01 end_point_21" data-from="0,1" data-to="2,1"></span>
            <span class="winner_reference end_point_02 end_point_22" data-from="0,2" data-to="2,2"></span>

            <span class="winner_reference end_point_00 end_point_22" data-from="0,0" data-to="2,2"></span>
            <span class="winner_reference end_point_02 end_point_20" data-from="0,2" data-to="2,0"></span>
        </div>
        <div class="messages">
            Await the other player to init
        </div>`;

        document.body.innerHTML = '';
        document.body.appendChild(tictactoeForm);
    }

    this.render = function({ players, test_winner, player, tictactoe, current_player, game_fisished }){
        this.tictactoe = tictactoe? tictactoe : this.tictactoe;

        let dinamicHTML = '';
        for(row = 0; row < 3; row++){
            for(column = 0; column < 3; column++){
                if(!this.tictactoe[column][row]){
                    if(current_player != this.player)
                        dinamicHTML += `<label><span></span></label>`;
                    else
                        dinamicHTML += `<label class="open"><input type="checkbox" data-column="${column}" data-row="${row}" name="" id="" /><span></span></label>`;
                }else
                    dinamicHTML += `<label><span>${players[Number(this.tictactoe[column][row]) - 1].value}</span></label>`;
            }
        }
        document.querySelector(`#container-tictactoe${this.player} .boxes`).innerHTML = dinamicHTML;

        if(!!game_fisished){
            let endMessage = '';

            if(!player) {
                endMessage = `No winner!`;
            } else {
                document
                .querySelector(
                    `#container-tictactoe${this.player} .winner_reference.end_point_${ test_winner.position[0].join('') }.end_point_${ test_winner.position[2].join('') }`
                ).classList.toggle('winner')

                endMessage = `${ player.index == this.player - 1? 'You are the big winner' : 'Sorry, the other player was better this time' } ( ${player.value} )`;
            }

            document.querySelector(`#container-tictactoe${this.player} .messages`)
                .innerHTML = endMessage + ` <br/> <button type="button" class="btn-init" onclick="initGame()">Play again<button>`

            alert(endMessage);
        } else {
            if(current_player == this.player)
                document.querySelector(`#container-tictactoe${this.player} .messages`)
                .innerHTML = 'Is your turn'
            else
                document.querySelector(`#container-tictactoe${this.player} .messages`)
                .innerHTML = 'Await your turn'

            let inputs = document.querySelectorAll(`#container-tictactoe${this.player} .boxes input`);
            [...inputs].forEach((element, key) => {
                element.addEventListener('change', (event) => {
                    event = event? event : window.event;

                    let { column, row } = event.target.dataset;
                    this.doMark(column, row);
                });
            });
        }
    }

    this.doMark = function(column, row) {
        let mark = doMark(column, row);
    }
};