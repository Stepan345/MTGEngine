import * as cards from "./cards/cards"
import { Card } from "./cards/cardParent"
export class Deck{
    public constructor(
        private items:Card[],
        private id:number
    ){

    }
    public topCard:Card
    public draw(numberOfCards:number):Card[]{
        let cards:Card[] = []
        for(let i = 0;i<numberOfCards;i++){
            cards.push(this.pop())
        }
        return cards
    }
    private pop():Card{
        let items:Card[] = JSON.parse(localStorage.getItem(this.id.toString())!) as Card[]
        let top:Card | undefined = this.items.shift()
        if(typeof top == "undefined")throw("Top of Deck is Undefined(Probably empty deck)")
        
        return top
    }
    public scry(numberOfCards:number):Card[]{
        let cards:Card[] = []
        for(let i = 0;i<numberOfCards;i++){
            cards.push(this.items[i])
        }
        return cards
    }
    public reorder(bottom:boolean[]){
        let cards:Card[] = []
        for(let i = 0;bottom.length > i;i++){
            cards.push(this.pop())
        }
        for(let i = 0;bottom.length > i;i++){
            if(bottom[i])this.items.push(cards[i])
            else this.items.unshift(cards[i])
        }

    }

}