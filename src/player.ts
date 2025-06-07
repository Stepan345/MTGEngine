import * as cards from "./cards/cards.js"
import { Deck } from "./deck.js"
import { ManaPool,Colors } from "./manaPool.js"
import { Game ,Phases } from "./game.js"
import { Card,Trigger } from "./cards/cardParent.js"
const chalk = await import("chalk")
export class Player{
    public manaPool:ManaPool
    public hand:Card[] = []
    public landsLeft = 1
    public poisonCounters:number
    public deck:Deck
    public otherPlayers:Player[]
    public protection:(Player|Colors)[] = []
    public id:number
    public constructor(
        public life:number,
        public game:Game,
        public maxHandSize:number = 7
        
    ){
        this.manaPool = new ManaPool
        this.otherPlayers = this.game.players
    }
    init(deck:Deck,id:number){
        this.deck = deck 
        this.deck.shuffle()
        this.hand = [...this.hand,...this.deck.draw(this.maxHandSize)]
        this.id = id
    }

    public draw(numberOfCards:number){
        this.hand = [...this.hand,...this.deck.draw(numberOfCards)]
    }
    public takeDamage(amount:number){
        this.life -= amount
    }
    public castSpell(cardID:number,targets:(Card|Player)[] = []){
        let card:Card = this.hand[cardID]
        if(card.types.includes("Land"))throw("Can't cast a Land")
        if(!card.types.includes("Instant") && !card.modifiers.includes("Flash") && (!this.game.stack.isEmpty() || this.game.activePlayer != this.id))return
        this.hand.splice(cardID,1)
        card.play(targets)
    }
    
    public playLand(cardID:number){
        let card:Card = this.hand[cardID]
        if(!card.types.includes("Land"))throw("Can't play a non-land")
        if(this.landsLeft <= 0 )return//throw("You've already played all your land(s) for turn")
        if(this.game.currentPhase != Phases["Pre-combat Main"] && this.game.currentPhase != Phases["Post-combat Main"])return
        if(!this.game.stack.isEmpty() || this.game.activePlayer != this.id)return
        this.hand.splice(cardID,1)
        this.game.putInPlay(card)
    }
    public decide(decision:string){
        if(this.game.playerDecision[0] != this)throw("Wrong player is making decision")
        this.game.playerDecision[1].resolveTrigger[decision]
        this.game.playerIsMakingDecision = false

    }
    /**
     * @returns The names of all the cards in hand
     */
    public cardsInHand():string{
        let hand:string = ""
        this.hand.forEach((card,i) =>{
            //${chalk.default.bold(i.toString(),": ")}
            hand = hand.concat("\n  ",chalk.default.bold(i),": ",card.name)
        })
        return hand
    }
    public pass(){
        this.game.passPriority()
    }
}