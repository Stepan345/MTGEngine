import {Card,powerToughness} from './cardParent.js'
import {Player} from "../player.js"
import { Colors } from '../manaPool.js'
export class Plains extends Card{
    
    public constructor(owner:Player){
        super(
            "Plains",
            owner,
            ["Basic","Land","Forest"],
            {w:0,u:0,b:0,r:0,g:0,c:0},
            [Colors.white],
            true
        )
        this.targetRange = []
    }
    public manaAbility(): void {
        if(this.tapped)return
        this.tap()
        this.owner.manaPool.add(Colors.white,1)
    }
}