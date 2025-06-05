import * as cards from "./cards/cards.js"
import { Deck } from "./deck.js"
import { ManaPool } from "./manaPool.js"
import { Game } from "./game.js"
import { Card,Trigger } from "./cards/cardParent.js"
export class Player{
    public manaPool:ManaPool
    public hand:Card[] = []
    public landsLeft = 1
    public poisonCounters:number
    public deck:Deck
    public constructor(
        public health:number,
        public game:Game,
        public maxHandSize:number = 7
        
    ){
        this.manaPool = new ManaPool
        
    }
    init(deck:Deck){
        this.deck = deck 
        this.deck.shuffle()
        this.hand = [...this.hand,...this.deck.draw(this.maxHandSize)]
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
    /**
     * 
     * @returns The names of all the cards in hand
     */
    public cardsInHand():string[]{
        let hand:string[] = []
        this.hand.forEach(card =>{
            hand.push(card.name)
        })
        return hand
    }
    public pass(){
        this.game.passPriority()
    }
}