import {Card,powerTougness} from './cardParent.ts'
import {Player} from "../player.ts"
import { Colors } from '../manaPool.ts'
export class Mountain extends Card{
    
    public constructor(owner:Player){
        super(
            "Mountain",
            owner,
            ["Basic","Land","Mountain"],
            {w:0,u:0,b:0,r:0,g:0,c:0},
            true
        )
        this.targetRange = [0]
    }
    public manaAbility(): void {
        this.owner.manaPool.add(Colors.red,1)
    }
}