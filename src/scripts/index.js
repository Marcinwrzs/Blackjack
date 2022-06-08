import '../styles/index.scss';
import { Deck } from './Deck.js';
import { Player } from './Player.js';
import { Table } from './Table.js';
import { Message } from './Message.js';

class Game {
    constructor({player, playerPoints, dealerPoints,table, hitButton, standButton, newGameButton, messageBox}) {
        this.hitButton = hitButton;
        this.standButton = standButton;
        this.newGameButton = newGameButton;
        this.playerPoints = playerPoints;
        this.dealerPoints = dealerPoints;
        this.messageBox = messageBox;
        this.player = player;
        this.dealer = new Player('Croupier');
        this.table = table;
        this.deck = new Deck();
        this.deck.shuffle();
    }

    run() {
        this.hitButton.addEventListener('click', () => this.hitCard());
        this.standButton.addEventListener('click', () => this.dealerPlays());
        this.newGameButton.addEventListener('click', () => this.newGame());
        this.dealCards();
    }

    newGame() {
        window.location.reload(true);
    }

    hitCard() {
        const card = this.deck.pickOne();
        if (this.player.hand.cards.length > 4) return;
        this.player.hand.addCard(card);

        this.table.showPlayersCard(card);
        this.playerPoints.innerHTML = this.player.calculatePoints();
    }

    dealCards() {
        for(let n = 0; n < 2; n++) {
            let card1 = this.deck.pickOne();
            this.player.hand.addCard(card1);
            this.table.showPlayersCard(card1);

            let card2 = this.deck.pickOne();
            this.dealer.hand.addCard(card2);
            this.table.showDealersCard(card2);
        }

        this.playerPoints.innerHTML = this.player.calculatePoints();
        this.dealerPoints.innerHTML = this.dealer.calculatePoints();
    }

    dealerPlays() {
        while(this.dealer.points <= this.player.points && this.dealer.points <= 21 && this.player.points <= 21) {
            const card = this.deck.pickOne();
            this.dealer.hand.addCard(card);
            this.table.showDealersCard(card);
            this.dealerPoints.innerHTML = this.dealer.calculatePoints();
        }
        this.endGame();
    }

    endGame() {
        this.hitButton.removeEventListener('click', () => this.hitCard());
        this.standButton.removeEventListener('click', () => this.dealerPlays());

        this.hitButton.style.display = 'none';
        this.standButton.style.display = 'none';


        if (this.player.points < 21 && this.player.points == this.dealer.points) {
            this.messageBox.setText('Draw').show();
            return;
        }

        if (this.player.points > 21) {
            this.messageBox.setText('Dealer won').show();
            return;
        }
        if (this.dealer.points >21) {
            this.messageBox.setText('Player won').show();
            return;
        }
        
        if (this.player.points < this.dealer.points) {
            this.messageBox.setText('Dealer won').show();
            return;
        }
    }
}

const table = new Table(
    document.getElementById('dealersCards'),
    document.getElementById('playersCards')
);

const messageBox = new Message(document.querySelector('.message'));

const player = new Player('Marcin');
const game = new Game({
    hitButton: document.getElementById('hit'),
    standButton: document.getElementById('stand'),
    newGameButton: document.getElementById('newGame'),
    dealerPoints: document.getElementById('dealerPoints'),
    playerPoints: document.getElementById('playerPoints'),
    player,
    table,
    messageBox
});
game.run();