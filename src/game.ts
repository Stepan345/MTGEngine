import * as cards from "./cards/cards"
import { Deck } from "./deck"
import { ManaPool } from "./manaPool"
import { Player } from "./player"
import { Stack } from "./stack"
import { Trigger,Card,Cards } from "./cards/cardParent"
enum Phases{
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
            player.init(deck)
            this.players.push()
            this.battlefields.push([])
            this.graveyards.push([])
            this.exile.push([])
        }
        this.stack = new Stack(this)
    }
    public startGame(){
        this.turn++
        this.currentPhase = Phases.Untap
        this.phases[this.currentPhase]
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
        },
        ()=>{//precombat
            this.priority = this.activePlayer
        },
        ()=>{//combat
            this.priority = this.activePlayer
        },
        ()=>{//postcombat
            this.priority = this.activePlayer
        },
        ()=>{//end step
            this.priority = this.activePlayer
        },
        ()=>{//clean up
            //pass turn
            this.activePlayer = (this.activePlayer < this.players.length-1)?this.activePlayer+1:0
        }
    ]
    /**Proceeds to the next step or phase incrementing the active player and turn counter*/
    public nextPhase(){
        this.currentPhase = (this.currentPhase<6)?this.currentPhase+1:0
        this.activePlayer = (this.activePlayer < this.players.length-1)?this.activePlayer+1:0
        this.priority = this.activePlayer
        this.turn++
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


    //////////////////////
    public notifySpellPlayed(spell:Card){
        this.battlefields.forEach(battlefield => {
            battlefield.forEach(card => {
                card.trigger(Trigger.otherSpellCast,spell)
            });
        });
        if(spell.permanent){
            this.battlefields.forEach(battlefield => {
                battlefield.forEach(card => {
                    card.trigger(Trigger.otherETB,spell)
                });
            });
            this.battlefields[this.activePlayer].push(spell)
            spell.trigger(Trigger.enterTheBattlefield,spell)
        }
        else{
            this.graveyards[this.activePlayer].push(spell)
        }
    }
    public notifyLandPlayed(land:Card){

    }
}