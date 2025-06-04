import { Deck } from "./deck"
import * as cards from "./cards/cards"
import { ManaPool } from "./manaPool"
import { Player } from "./player"
import { Game } from "./game"
import { Trigger,Card } from "./cards/cardParent"

export class Stack{//God help us all
    public items:[Card,boolean,Trigger,(Card | Player)[]][] = []
    /*
        Here's how the stack works:
        
        Whenever a spell is cast it goes to the stack which stores 3 things:
        0. The card object 
        1. The thing that is happening(triggered ability or cast)
        2. Key of triggered ability (if it isn't a triggered ability it's "" by default)
        3. Target of the spell/ability (empty array by default)
        
        Then once priority goes around once without anything being added the stack resolves
        If the stack is then empty we move to the next phase or step
     */
    public constructor(
        public game:Game
    ){}
    public isEmpty():boolean{
        if(this.items.length <= 0)return true
        return false
    }
    public addToStack(card:Card,isSpell:boolean,target:(Card | Player)[] = [],triggerType:Trigger = Trigger.none){
        
        this.items.push([card,isSpell,triggerType,target])
    }
    public resolveTop(){
        let effect:[Card,boolean,Trigger,(Card | Player)[]] | undefined = this.items.pop()
        if(!effect)throw("Trying to resolve empty stack")
        let card:Card = effect[0]
        if(effect[1]){
            //spell resolution
            card.spellAbility(effect[3])
            this.game.notifySpellPlayed(card)
        }else{
            //ability resolution
            card.resolveTrigger(effect[2],effect[3])
        }
    }
}