import {Player} from "../player"
import { Colors } from "../manaPool"
export interface powerTougness{
    power:number,
    tougness:number
}
export enum Trigger{
    "enterTheBattlefield",
    "otherETB",
    "otherSpellCast",
    "none"
}
export type Cards = new (...args: any[]) =>Card
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
    public permanent:boolean
    public constructor(
        name:string,
        owner:Player,
        types:string[],
        manaCost:{w:number,u:number,b:number,r:number,g:number,c:number},
        permanent:boolean,
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
        this.permanent = permanent
        this.owner = owner
        this.originalOwner = owner
    }
    public otherETB(creature:Card){}
    public otherSpellCast(spell:Card){}
    public trigger(key:Trigger,source:Player|Card,targets:(Card|Player)[] = []){
        
    }
    /**
     * 
     * @param key Type of trigger
     * @param source The player that caused the trigger
     * @param targets The targets for the trigger if any
     */
    private addTriggerToStack(key:Trigger,source:Player|Card,targets:(Card|Player)[] = []){
        this.owner.game.stack.addToStack(this,true,targets,key)
    }
    public resolveTrigger(trigger:Trigger,targets:(Card|Player)[] = []){

    }
    public manaAbility(color?:Colors | undefined){

    }
    public spellAbility(targets:(Card|Player)[] = []){}
    public isDrawn(){}
    public play(targets:(Card|Player)[] = []){
        this.owner.game.stack.addToStack(this,true,targets)
    }

    public takeDamage(amount:number){
        this.powerTougness.tougness -= amount
    }
}