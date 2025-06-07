import {Card,powerToughness} from './cardParent.js'
import {Player} from "../player.js"
import { Colors } from '../manaPool.js'

export class LightningBolt extends Card{
    public constructor(owner:Player){
        super(
            "Lightning Bolt",
            owner,
            ["Instant"],
            {w:0,u:0,b:0,r:1,g:0,c:0},
            [Colors.red],
            false
        )
        this.targetRange = [1]
        this.targetablePermanents[2] = ["Player","Creature","Planeswalker"]
    }
    public spellAbility(targets:(Card|Player)[]): void {
        if(!this.targetRange.includes(targets.length))throw("Too Many or Too Few Targets")
        targets[0].takeDamage(3)
        super.spellAbility()
    }
}