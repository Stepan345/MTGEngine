import * as cards from "./cards/cards"
export class Deck{
    public constructor(
        private items:cards.Card[]
    ){}

    public draw(numberOfCards:number):cards.Card[]{
        let cards:cards.Card[] = []
        for(let i = 0;i<numberOfCards;i++){
            cards.push(this.pop())
        }
        return cards
    }
    private pop():cards.Card{
        let top:cards.Card | undefined = this.items.shift()
        if(typeof top == "undefined")throw("Top of Deck is Undefined")
        return top
    }
    public scry(numberOfCards:number):cards.Card[]{
        let cards:cards.Card[] = []
        for(let i = 0;i<numberOfCards;i++){
            cards.push(this.items[i])
        }
        return cards
    }
    public reorder(bottom:boolean[]){
        let cards:cards.Card[] = []
        for(let i = 0;bottom.length > i;i++){
            cards.push(this.pop())
        }
        for(let i = 0;bottom.length > i;i++){
            if(bottom[i])this.items.push(cards[i])
            else this.items.unshift(cards[i])
        }

    }

}