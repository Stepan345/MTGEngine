import {Player} from "../player"
export interface powerTougness{
    power:number,
    tougness:number
}
export class Card{
    public types:string[]
    public name:string
    public legendary:boolean
    public manaCost:{w:number,u:number,b:number,r:number,g:number,c:number}
    public initPowerTougness:powerTougness
    public powerTougness:powerTougness
    public modifiers: string[]
    public originalOwner:Player
    public owner:Player
    public targetRange:number[]
    public constructor(
        name:string,
        owner:Player,
        types:string[],
        manaCost:{w:number,u:number,b:number,r:number,g:number,c:number},
        legendary:boolean = false,
        powerTougness:powerTougness = {power: NaN,tougness:NaN},
        modifiers:string[] = []
        
    ){
        this.name = name
        this.types = [...types]
        this.manaCost = manaCost
        this.powerTougness = powerTougness
        this.initPowerTougness = powerTougness
        this.modifiers = [...modifiers]
        this.legendary = legendary
        this.owner = owner
        this.originalOwner = owner
    }
    public otherETB(){}
    public otherSpellAbility(){}
    public triggeredAbility(number:number,targets:(Card|Player)[] = []){

    }
    public landfall(){}
    public whenAttached(target:(Card|Player)){}
    public enterTheBattlefield(){}
    public spellAbility(targets:(Card|Player)[] = []){}
    public leaveTheBattlefield(){}
    public isDrawn(){}

    public takeDamage(amount:number){
        this.powerTougness.tougness -= amount
    }
}