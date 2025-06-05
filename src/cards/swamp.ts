import {Card,powerTougness} from './cardParent.js'
import {Player} from "../player.js"
import { Colors } from '../manaPool.js'
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