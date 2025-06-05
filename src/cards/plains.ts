import {Card,powerTougness} from './cardParent.js'
import {Player} from "../player.js"
import { Colors } from '../manaPool.js'
export class Plains extends Card{
    
    public constructor(owner:Player){
        super(
            "Plains",
            owner,
            ["Basic","Land","Forest"],
            {w:0,u:0,b:0,r:0,g:0,c:0},
            true
        )
        this.targetRange = [0]
    }
    public manaAbility(): void {
        this.owner.manaPool.add(Colors.white,1)
    }
}