import { Deck } from "./deck"
import * as cards from "./cards/cards"
import { ManaPool } from "./manaPool"
import { Player } from "./player"
import { Game } from "./game"

export class Stack{//God help us all
    public items:[cards.Card,boolean,number][] = []
    /*
        Here's how the stack works:
        
        Whenever a spell is cast it goes to the stack which stores 3 things:
        1. The card object 
        2. The thing that is happening(triggered ability or cast)
        3. If it is a triggered ability which one is it (if it isn't it's -1 by default)
        
        Then once priority goes around once without anything being added the stack resolves
        If the stack is then empty we move to the next phase or step
     */
    public constructor(
        public game:Game
    ){}
    public addToStack(card:cards.Card,isSpell:boolean,abilityNumber:number = -1){
        this.items.push([card,isSpell,abilityNumber])
    }
    public resolveTop(){
        this.items.pop()
    }
}