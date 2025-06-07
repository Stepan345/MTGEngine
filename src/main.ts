import * as cards from "./cards/cards.js"
import { Deck } from "./deck.js"
import { ManaPool } from "./manaPool.js"
import { Player } from "./player.js"
import { Stack } from "./stack.js"
import { Trigger,Card,Cards } from "./cards/cardParent.js"
import { Game } from "./game.js"
import { Client } from "./debugClient.js"
const chalk = await import('chalk')

let game = new Game(2,20,[
    [[4,cards.LightningBolt],[4,cards.Mountain]],
    [[4,cards.LightningBolt],[4,cards.Mountain]]
])

let player1:Player = game.players[0]
let player2:Player = game.players[1]

game.startGame()
let debugClient = new Client(game)
debugClient.loop()



