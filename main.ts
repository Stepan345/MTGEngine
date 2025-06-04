import * as cards from "./cards/cards"
import { Deck } from "./deck"
import { ManaPool } from "./manaPool"
import { Player } from "./player"
import { Stack } from "./stack"
import { Trigger,Card,Cards } from "./cards/cardParent"
import { Game } from "./game"

let game = new Game(2,20,[
    [[4,cards.LightningBolt],],
    []
])