import {Player} from "../player.js"
import { Colors } from "../manaPool.js"
export interface powerToughness{
    power:number,
    toughness:number
}
export enum Trigger{
    "enterTheBattlefield",
    "otherETB",
    "otherSpellCast",
    "none",
    "phase",
    "untap",
    "upkeep",
    "draw",
    "otherTapped",
    "landfall",
    "decisionRes1",
    "decisionRes2",
    "decisionRes3",
    "decisionRes4",
    "decisionRes5",
    "decisionRes6",
    "spellResolved"
}
export type Cards = new (...args: any[]) =>Card
export class Card{
    public types:string[]
    public tapped:boolean = false
    public name:string
    public legendary:boolean
    public manaCost:{w:number,u:number,b:number,r:number,g:number,c:number}
    public initPowerToughness:powerToughness
    public powerToughness:powerToughness
    public modifiers: string[]
    public originalOwner:Player
    public owner:Player
    public targetRange:number[]
    public permanent:boolean
    public canTargetMoreThanOnce:boolean = false
    public abilities:{
        trigger:Trigger
        ,manaCost:{w:number,u:number,b:number,r:number,g:number,c:number}
        ,canTargetMoreThanOnce:boolean
        ,targetRange:number[]
        ,/**
         * **0**: Untargetable Colors(Use when you can't target cards of a certain color)  
         * **1**: Targetable Colors(Use when you can only target cards of a certain color)  
         * **2**: Card types that can be targeted  
         */
        targetablePermanents:[Colors[],Colors[],string[]]
    }[] = []
    /**
     * **0**: Untargetable Colors(Use when you can't target cards of a certain color)  
     * **1**: Targetable Colors(Use when you can only target cards of a certain color)  
     * **2**: Card types that can be targeted  
     */
    public targetablePermanents:[Colors[],Colors[],string[]] = [[],[],[]]
    public colors:Colors[]

    public constructor(
        name:string,
        owner:Player,
        types:string[],
        manaCost:{w:number,u:number,b:number,r:number,g:number,c:number},
        colors:Colors[],
        permanent:boolean,
        legendary:boolean = false,
        powerToughness:powerToughness = {power: NaN,toughness:NaN},
        modifiers:string[] = []
        
    ){
        this.name = name
        this.types = [...types]
        this.manaCost = manaCost
        this.powerToughness = powerToughness
        this.initPowerToughness = powerToughness
        this.modifiers = [...modifiers]
        this.legendary = legendary
        this.permanent = permanent
        this.owner = owner
        this.originalOwner = owner
        this.colors = [...colors]
    }
    public trigger(key:Trigger,source:Player|Card,targets:(Card|Player)[] = []){
        
    }
    /**
     * 
     * @param key Type of trigger
     * @param source The player or card that caused the trigger
     * @param targets The targets for the trigger if any
     */
    private addTriggerToStack(key:Trigger,source:Player|Card,targets:(Card|Player)[] = []){
        this.owner.game.stack.addToStack(this,true,targets,key)
    }
    public resolveTrigger(trigger:Trigger,targets:(Card|Player)[] = []){

    }
    public manaAbility(color?:Colors | undefined){

    }
    public spellAbility(targets:(Card|Player)[] = []){
        this.owner.game.putInGraveyard(this)
        this.owner = this.originalOwner
    }
    public isDrawn(){}
    public tap(){
        this.owner.game.notify(this,Trigger.otherTapped)
        this.tapped = true
    }
    public play(targets:(Card|Player)[] = []){
        this.owner.game.stack.addToStack(this,true,targets)
    }

    public takeDamage(amount:number){
        this.powerToughness.toughness -= amount
    }
}