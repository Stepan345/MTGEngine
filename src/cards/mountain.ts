import {Card,powerToughness} from './cardParent.js'
import {Player} from "../player.js"
import { Colors } from '../manaPool.js'
export class Mountain extends Card{
    
    public constructor(owner:Player){
        super(
            "Mountain",
            owner,
            ["Basic","Land","Mountain"],
            {w:0,u:0,b:0,r:0,g:0,c:0},
            [Colors.red],
            true
        )
        this.targetRange = []
    }
    public manaAbility(): void {
        if(this.tapped)return
        this.tap()
        this.owner.manaPool.add(Colors.red,1)
    }
}