import {Card,powerToughness} from './cardParent.js'
import {Player} from "../player.js"
import { Colors } from '../manaPool.js'
export class Forest extends Card{
    
    public constructor(owner:Player){
        super(
            "Forest",
            owner,
            ["Basic","Land","Forest"],
            {w:0,u:0,b:0,r:0,g:0,c:0},
            [Colors.green],
            true
        )
        this.targetRange = []
    }
    public manaAbility(): void {
        if(this.tapped)return
        this.tap()
        this.owner.manaPool.add(Colors.green,1)
    }
}