import {Card,powerTougness} from './cardParent.ts'
import {Player} from "../player.ts"

export class LightningBolt extends Card{
    public constructor(owner:Player){
        super(
            "Lightning Bolt",
            owner,
            ["Instant"],
            {w:0,u:0,b:0,r:1,g:0,c:0}
        )
        this.targetRange = [1]
    }
    public spellAbility(targets:(Card|Player)[]): void {
        if(!this.targetRange.includes(targets.length))throw("Too Many or Too Few Targets")
        targets[0].takeDamage(3)
    }
}