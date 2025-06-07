import * as cards from "./cards/cards.js"
import { Deck } from "./deck.js"
import { ManaPool } from "./manaPool.js"
import { Player } from "./player.js"
import { Stack } from "./stack.js"
import { Trigger,Card,Cards } from "./cards/cardParent.js"
export enum Phases{
    "Untap" = 0,
    "Up-keep" = 1,
    "Draw" = 2,
    "Pre-combat Main" = 3,
    "Combat" = 4,
    "Post-combat Main" = 5,
    "End Step" = 6,
    "Clean-up" = 7
}
type phase = () => void
export class Game{
    /**The current phase or step*/
    public currentPhase:Phases
    /**Turn number which increments every time the turn is passed */
    public turn:number = -1
    /**Player who's turn it is */
    public activePlayer:number = 0
    /** Player who can play spells and activate abilities */
    public priority:number = 0
    //** Keeps track of the last time an effect has gone on the stack in order to know when to resolve it */
    public lastEffectOnStack:number = 0
    public players:Player[] = []
    public battlefields:Card[][] = []
    public graveyards:Card[][] = []
    public exile:Card[][] = []
    public stack:Stack
    public playerIsMakingDecision = false
    /**
     * **0**: Player that is making the decision  
     * **1**: The card that this decision is about  
     * **2**: Options corresponding to their respective resolveTrigger key  
     */
    public playerDecision:[Player,Card,Trigger[]]

    public constructor(players:number,life:number,decks:[number,Cards][][]){
        for(let i = 0; i<players;i++){
            let player:Player = new Player(life,this)
            let cards:Card[] = []
            decks[i].forEach(card => {
                for(let j = 0;j < card[0];j++){
                    cards.push(new card[1](player))
                }
            });
            let deck:Deck = new Deck(cards)
            player.init(deck,i)
            this.players.push(player)
            this.battlefields.push([])
            this.graveyards.push([])
            this.exile.push([])
        }
        this.stack = new Stack(this)
    }
    public startGame(){
        this.turn++
        this.currentPhase = Phases.Untap
        this.phases[this.currentPhase]()
    }
    
    /**An array containing the functions that are called at the start of each step or phase*/
    public phases:phase[] = [
        ()=>{//untap
            this.battlefields[this.activePlayer].forEach(permanent => {
                //phasing and untapping doesn't use the stack so it uses the resolveTrigger() method instead of trigger()
                permanent.trigger(Trigger.phase,this.players[this.activePlayer])
                permanent.trigger(Trigger.untap,this.players[this.activePlayer])
            })
            this.nextPhase()
        },
        ()=>{//upkeep
            this.battlefields.forEach(battlefield =>{
                battlefield.forEach(permanent => {
                    permanent.trigger(Trigger.upkeep,this.players[this.activePlayer])
                })
            })
            //add a special action for ordering triggers if there are any
            this.priority = this.activePlayer
            this.lastEffectOnStack = this.activePlayer
        },
        ()=>{//draw
            if(this.turn != 0){
                this.players[this.activePlayer].draw(1)
            }
            this.battlefields.forEach(battlefield =>{
                battlefield.forEach(permanent => {
                    permanent.trigger(Trigger.draw,this.players[this.activePlayer])
                })
            })
            //add a special action for ordering triggers if there are any
            this.priority = this.activePlayer
            this.lastEffectOnStack = this.activePlayer
        },
        ()=>{//precombat
            this.priority = this.activePlayer
            this.lastEffectOnStack = this.activePlayer
        },
        ()=>{//combat
            this.priority = this.activePlayer
            this.lastEffectOnStack = this.activePlayer
        },
        ()=>{//postcombat
            this.priority = this.activePlayer
            this.lastEffectOnStack = this.activePlayer
        },
        ()=>{//end step
            this.priority = this.activePlayer
            this.lastEffectOnStack = this.activePlayer
        },
        ()=>{//clean up
            //pass turn
            this.activePlayer = (this.activePlayer < this.players.length-1)?this.activePlayer+1:0
            this.lastEffectOnStack = this.activePlayer
            this.turn++
        }
    ]
    /**Proceeds to the next step or phase incrementing the active player and turn counter*/
    public nextPhase(){
        this.currentPhase = (this.currentPhase<7)?this.currentPhase+1:0
        this.priority = this.activePlayer
        this.phases[this.currentPhase]()
    }

    public passPriority(){
        this.priority = (this.priority < this.players.length-1)?this.priority+1:0
        if(this.lastEffectOnStack == this.priority){
            if(this.stack.isEmpty()){
                this.nextPhase()
            }else{
                this.stack.resolveTop()
                this.priority = this.activePlayer
            }
        }
    }

    public checkBattlefield(playerID:number):string{
        let permanents:string = "\n"
        this.battlefields[playerID].forEach((permanent, i) =>{
            permanents = permanents + `${i}: ${permanent.name}. ${(permanent.tapped)?"Tapped":"Untapped"}\n`
        })
        return permanents
    }
    public checkGraveyard(playerID:number):string{
        let permanents:string = "\n"
        this.graveyards[playerID].forEach((permanent, i) =>{
            permanents = permanents + `${i}: ${permanent.name}.\n`
        })
        return permanents
    }

    public putInPlay(card:Card){
        this.battlefields[card.owner.id].push(card)
    }
    public putInGraveyard(card:Card){
        this.graveyards[card.originalOwner.id].push(card)
        
    }
    //////////////////////
    public notify(spell:Card,trigger:Trigger){
        this.battlefields.forEach(battlefield => {
            battlefield.forEach(card => {
                card.trigger(trigger,spell)
            })
        })
    }
}