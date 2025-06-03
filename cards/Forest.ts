import {Card,powerTougness} from './cardParent.ts'
import {Player} from "../player.ts"
export class Land extends Card{
    
    public constructor(owner:Player){
        super(
            "Forest",
            owner,
            ["Basic","Land","Forest"],
            {w:0,u:0,b:0,r:0,g:0,c:0}
        )
        this.targetRange = [0]
    }
    public triggeredAbility(number: number, targets?: Card[]): void {
        this.owner.manaPool.add("g",1)
    }
}