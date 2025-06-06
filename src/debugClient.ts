import * as cards from "./cards/cards.js"
import { Deck } from "./deck.js"
import { ManaPool } from "./manaPool.js"
import { Player } from "./player.js"
import { Stack } from "./stack.js"
import { Trigger,Card,Cards } from "./cards/cardParent.js"
import { Game } from "./game.js"
import * as readline from 'readline'
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
enum GameStates{
    priority,
    choosingTargets,
    specialAction
}
export class Client{
    public state:GameStates = GameStates.priority
    public players:Player[]
    public constructor(public game:Game){
        this.players = [...game.players]
    }
    public loop(){
        let playing = true
        while(playing){
            console.log({
                "playerId": this.game.priority,
                "hand": this.players[this.game.priority].cardsInHand(),
                "phase": this.game.currentPhase
            })
            try{
                let currentPlayer:Player = this.players[this.game.priority]
                rl.question("either type the order(starting from 0) of the spell you want to cast or type 'pass' to pass priority",
                    (answer) =>{
                        let cardID:number = parseInt(answer)
                        if(!Number.isNaN(cardID)){
                            let card:Card =  currentPlayer.hand[cardID]
                            if(card.targetRange.length != 0){
                                
                                this.game.battlefields
                            }
                        }
                        else console.log("Passing priority...")
                    }
                )
            }catch(err){
                console.log(err)
            }   

        }
    }
}