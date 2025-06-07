import {Card,powerToughness} from './cardParent.js'
import {Player} from "../player.js"
import { Colors } from '../manaPool.js'
export class Island extends Card{
    
    public constructor(owner:Player){
        super(
            "Island",
            owner,
            ["Basic","Land","Forest"],
            {w:0,u:0,b:0,r:0,g:0,c:0},
            [Colors.blue],
            true
        )
        this.targetRange = []
    }
    public manaAbility(): void {
        if(this.tapped)return
        this.tap()
        this.owner.manaPool.add(Colors.blue,1)
    }
}