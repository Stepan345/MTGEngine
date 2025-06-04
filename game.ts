import * as cards from "./cards/cards"
import { Deck } from "./deck"
import { ManaPool } from "./manaPool"
import { Player } from "./player"
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
    
    public currentPhase:Phases
    public turn:number = 0
    public activePlayer:number = 0
    public priority:number = 0
    public players:Player[] = []
    public battlefields:cards.Card[][] = []
    public graveyards:cards.Card[][] = []
    public exile:cards.Card[][] = []
    public constructor(players:number,life:number,decks:cards.Card[][]){
        for(let i = 0; i<players;i++){
            this.players.push(new Player(life,new Deck(decks[i]),this))
            this.battlefields.push([])
            this.graveyards.push([])
            this.exile.push([])
        }
        this.currentPhase = Phases.Untap
    }
    public stack:[cards.Card,string,number]
    public phases:phase[] = [
        ()=>{//untap

        },
        ()=>{//upkeep

        },
        ()=>{//draw
            if(this.turn != 0){
                this.players[this.activePlayer].draw(1)
            }
        },
        ()=>{//precombat

        },
        ()=>{//combat

        },
        ()=>{//postcombat

        },
        ()=>{//end step

        },
        ()=>{//clean up
            //pass turn
            this.activePlayer = (this.activePlayer < this.players.length-1)?this.activePlayer+1:0
        }
    ]

    public nextPhase(){
        this.currentPhase = (this.currentPhase<6)?this.currentPhase+1:0
        this.phases[this.currentPhase]()
    }
    public skipTo(phase:Phases){
        if(phase < this.currentPhase)phase += 6
        let numberOfPhasesSkipped:number = phase - this.currentPhase
        for(let i = 0; i < numberOfPhasesSkipped;i++){
            this.currentPhase = (this.currentPhase<6)?this.currentPhase+1:0
            this.phases[this.currentPhase]()
        }
    }

    public passPriority(){
        this.priority = (this.priority < this.players.length-1)?this.priority+1:0
    }


    //////////////////////
    public spellPlayed(spell:cards.Card,player:Player){
        if(!spell.modifiers.includes("Flash") && !spell.types.includes("Instant"))throw("Can only play this on your turn")
        this.battlefields.forEach(battlefield => {
            battlefield.forEach(card => {
                card.otherSpellCast(spell)
            });
        });
        if(spell.permanent){
            this.battlefields.forEach(battlefield => {
                battlefield.forEach(card => {
                    card.otherETB(spell)
                });
            });
            this.battlefields[this.activePlayer].push(spell)
            
        }
        else{
            this.graveyards[this.activePlayer].push(spell)
        }
    }
    public landPlayed(land:cards.Card){

    }
}