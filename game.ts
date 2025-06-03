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
    "End" = 6
}
type phase = () => void
export class Game{
    public phase:Phases
    public turn:number = 0
    public activePlayer = 0
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
        ()=>{//end

        }
    ]
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
        this.phase = Phases.Untap
    }
    public nextPhase(){
        this.phase++
        this.phases[this.phase]
    }
    
}