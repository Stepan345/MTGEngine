import * as cards from "./cards/cards.js"
import { Deck } from "./deck"
import { ManaPool } from "./manaPool"
import { Player } from "./player.js"
import { Stack } from "./stack"
import { Trigger,Card,Cards } from "./cards/cardParent"
import { Game } from "./game.js"

let game = new Game(2,20,[
    [[4,cards.LightningBolt],[4,cards.Mountain]],
    [[4,cards.LightningBolt],[4,cards.Mountain]]
])

let player1:Player = game.players[0]
let player2:Player = game.players[1]
console.log({
    player1Hand: player1.hand,
    player2Hand: player2.hand
})

let counter:number = 0
while(true){
    console.log(counter)
    counter++
}