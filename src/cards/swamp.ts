import {Card,powerTougness} from './cardParent'
import {Player} from "../player"
import { Colors } from '../manaPool'
export class Swamp extends Card{
    
    public constructor(owner:Player){
        super(
            "Swamp",
            owner,
            ["Basic","Land","Forest"],
            {w:0,u:0,b:0,r:0,g:0,c:0},
            true
        )
        this.targetRange = [0]
    }
    public manaAbility(): void {
        this.owner.manaPool.add(Colors.black,1)
    }
}