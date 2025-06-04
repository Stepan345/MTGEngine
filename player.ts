import * as cards from "./cards/cards"
import { Deck } from "./deck"
import { ManaPool } from "./manaPool"
import { Game } from "./game"
import { Card,Trigger } from "./cards/cardParent"
export class Player{
    public manaPool:ManaPool
    public hand:Card[] = []
    public landsLeft = 1
    public poisonCounters:number
    public constructor(
        public health:number,
        public deck:Deck,
        public game:Game,
        public maxHandSize:number = 7
        
    ){
        this.manaPool = new ManaPool
        this.hand = [...this.hand,...this.deck.draw(maxHandSize)]
    }
    public draw(numberOfCards:number){
        this.hand = [...this.hand,...this.deck.draw(numberOfCards)]
    }
    public takeDamage(amount:number){
        this.health -= amount
    }
    public castSpell(cardID:number,targets:(Card|Player)[] = []){
        let card:Card = this.hand[cardID]
        if(card.types.includes("Land"))throw("Can't cast a Land")
        this.hand.splice(cardID,1)
        card.play(targets)
    }
    public playLand(cardID:number){
        let card:Card = this.hand[cardID]
        if(!card.types.includes("Land"))throw("Can't play a non-land")
        if(this.landsLeft <= 0 )throw("You've already played all your land(s) for turn")
        
        
    }
    public pass(){
        this.game.passPriority()
    }
}