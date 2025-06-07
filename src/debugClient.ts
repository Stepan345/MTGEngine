import * as cards from "./cards/cards.js"
import { Deck } from "./deck.js"
import { ManaPool,Colors } from "./manaPool.js"
import { Player } from "./player.js"
import { Stack } from "./stack.js"
import { Trigger,Card,Cards } from "./cards/cardParent.js"
import { Game } from "./game.js"
import * as readline from 'readline/promises'
import { parse } from "path"
const chalk = await import('chalk')
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
enum GameStates{
    priority,
    choosingTargets,
    specialAction
}
export class Client{
    public state:GameStates = GameStates.priority
    public players:Player[]
    public constructor(public game:Game){
        this.players = [...game.players]
        console.log("Debug client connected...")
    }
    private async chooseTargets(card:Card):Promise<(Card|Player)[]>{
        let listOfTargets:string[] = []
        let listOfTargetsReferences:(Player|Card)[] = []
        let addToTargets = (name:string,actual:Player|Card) =>{
            listOfTargets.push(name)
            listOfTargetsReferences.push(actual)
        }
        let typesOfTargets:string[] = card.targetablePermanents[2]
        let untargetableColors:Colors[] = card.targetablePermanents[0]
        let targetableColors:Colors[] = card.targetablePermanents[1]


        typesOfTargets.forEach(type => {
            switch(type){
                case "Player":
                    this.game.players.forEach((player,i) => {
                        if(player.protection.includes(this.game.players[this.game.priority]))return
                        for(let j = 0;j<card.colors.length;j++){if(player.protection.includes(card.colors[j])){return}}
                        addToTargets(`${listOfTargets.length}: Player ${i+1}`,player)
                    });
                    break
                case "Opponent":
                    this.game.players.forEach((player,i) => {
                        if(i = this.game.priority)return
                        for(let j = 0;j<card.colors.length;j++){if(player.protection.includes(card.colors[j])){return}}
                        if(player.protection.includes(this.game.players[this.game.priority]))return
                        addToTargets(`${listOfTargets.length}: Opponent ${i+1}`,player)
                    });
                    break
                case "Owner":
                    addToTargets(`${listOfTargets.length}: You`,this.game.players[this.game.priority])
                    break
                case "Graveyard":
                    this.game.graveyards.forEach(graveyard =>{
                        graveyard.forEach(target =>{
                            if(!target.types.includes(type))return
                            addToTargets(`${listOfTargets.length}: ${target.name}`,target)
                        })
                    })
                    break
                case "Your Graveyard":
                    this.game.graveyards[this.game.priority].forEach(target =>{
                        if(!target.types.includes(type))return
                        addToTargets(`${listOfTargets.length}: ${target.name}`,target)
                    })
                    break
                case "Permanent":
                    this.game.battlefields.forEach((battlefield,i) =>{
                        battlefield.forEach(target =>{
                            if(target.permanent)addToTargets(`${listOfTargets.length}: ${target.name}`,target)
                        })
                    })
                    break
                default:
                    this.game.battlefields.forEach((battlefield,i) =>{
                        //if(this.game.players[i].protection.includes(this.game.players[this.game.priority]))return
                        battlefield.forEach(target =>{
                            if(!target.types.includes(type))return
                            for(let j = 0;j<card.colors.length;j++){
                                if(target.modifiers.includes(`Protection from ${card.colors[j]}`)){return}
                            }
                            let containsColor:boolean = (targetableColors.length != 0)?false:true
                            for(let j = 0;j<target.colors.length;j++){
                                if(untargetableColors.includes(target.colors[j]))return
                                if(targetableColors.includes(target.colors[j]))containsColor = true
                            }
                            if(!containsColor)return
                            addToTargets(`${listOfTargets.length}: ${target.name}`,target) 
                        })
                    })
                    break
            }
        });
        let listString:string = ''
        listOfTargets.forEach((target) => {
            listString = listString + target + "\n"
        })
        console.log(listString)
        console.log(
            `Pick ${card.targetRange} ${(card.targetRange.length > 1)?"targets":(card.targetRange[0] > 1)?"targets":"target"} from this list above using their id.
            Once you are done picking targets and there is a valid number of targets selected type ${chalk.default.bold("'done'")}.
            Type ${chalk.default.bold("'back'")} in order to cancel last choice.`)
        let selectedTargets:(Card|Player)[] = []
        
        for(let i = 0;i < card.targetRange[card.targetRange.length-1];i++){
            const answer:string = await rl.question(`${i+1}${(i == 0)?"st":(i == 1)?"nd":(i == 2)?"rd":"th"} target\n> `)
            let targetID:number = parseInt(answer)
            if(!Number.isNaN(targetID)){
                if(!card.canTargetMoreThanOnce && selectedTargets.includes(listOfTargetsReferences[targetID])){
                    console.log("Can't pick the same target more than once")
                    i--
                }
                else selectedTargets.push(listOfTargetsReferences[targetID])
            }else if(answer.toLowerCase() == "back"){
                selectedTargets.pop()
                console.log("Removed last ")
                i-=2
            }
            else if(card.targetRange.includes(selectedTargets.length)){
                return
            }else{
                console.log("Not enough targets were selected\n")
                i--
            }
        }
        console.log("Targets have been picked")
        return selectedTargets
    }
    public async loop(){
        console.log("Starting gameplay loop...")
        let playing = true
        while(playing){
            //playing = false
            let lifeTotals:string = ""
            let allBattlefields:string = ""
            let allGraveyards:string = ""
            this.players.forEach((player,i) => {                                         
                lifeTotals = lifeTotals + `${chalk.default.bold(`Player ${i}`)} - ${player.life}\n              `
                allBattlefields = allBattlefields + `${chalk.default.bold(`Player ${i}`)}:\n${this.game.checkBattlefield(i)}`
                allGraveyards = allGraveyards + `${chalk.default.bold(`Player ${i}`)}:\n${this.game.checkGraveyard(i)}`
            });
            let data = {
                "Your Battlefield": this.game.checkBattlefield(this.game.priority),
                "Player-Id": this.game.priority,
                "ManaPool": this.players[this.game.priority].manaPool.check(),
                "Hand": this.players[this.game.priority].cardsInHand(),
                "Life Totals":lifeTotals,
                "Phase": this.game.currentPhase
                //,"stack": this.game.stack.items
            }
            for(const i in data){
                console.log(`${chalk.default.bold(i)} - ${(typeof data[i] == "string")?data[i]:JSON.stringify(data[i])}`)
            }
            let currentPlayer:Player = this.players[this.game.priority]
        const answer = await rl.question(`
${chalk.default.underline(chalk.default.bold("Commands"))}:
    ${chalk.default.bold("play")} (card number in your hand)
    ${chalk.default.bold("activate")} (permanent number on your battlefield) (ability number only for non-lands)
    ${chalk.default.bold("battlefield")} (if omitted displays the entire battlefield, but only prints one if a player is specified)
    ${chalk.default.bold("graveyard")} (if omitted displays the every graveyard, but only prints one if a player is specified)
    ${chalk.default.bold("inspect")} (playerID) (cardID) *not yet implemented*
    ${chalk.default.bold("pass")} (pass priority)
    ${chalk.default.bold("exit")} (same as Ctrl+C)
    > `)
        console.clear()
        let parsedCommand:string[] = answer.split(" ")
        let cardID:number
        switch(parsedCommand[0].toLowerCase()){
            case "cast":
            case "play":
                cardID = parseInt(parsedCommand[1])
                if(!Number.isNaN(cardID)){
                    if(cardID >= currentPlayer.hand.length){
                        console.log("What the freak dude, that number is too big")
                        continue
                    }else if(cardID < 0){
                        console.log("What the freak dude, that number is too small")
                        continue
                    }
                    let card:Card =  currentPlayer.hand[cardID]
                    let targets:(Player|Card)[] = []
                    if(card.types.includes("Land"))currentPlayer.playLand(cardID)
                    else if(currentPlayer.manaPool.enoughMana(card.manaCost,card.types)){
                        if(card.targetRange.length != 0)targets = await this.chooseTargets(card)
                        currentPlayer.castSpell(cardID,targets)
                    }else{
                        console.log("Not enough mana to cast that spell")
                    }
                    
                    
                    
                }
                else console.log("What the freak dude, that's not a number")
                break;
            case "tap":
            case "activate":
                cardID = parseInt(parsedCommand[1])
                if(!Number.isNaN(cardID)){
                    if(cardID >= this.game.battlefields[this.game.priority].length){
                        console.log("What the freak dude, that number is too big")
                        continue
                    }else if(cardID < 0){
                        console.log("What the freak dude, that number is too small")
                        continue
                    }
                    if(parsedCommand.length > 2){
                        let abilityID:number = parseInt(parsedCommand[2])
                        //need to add logic for cards other than lands
                    }else{
                        this.game.battlefields[this.game.priority][cardID].manaAbility()
                    }
                }else console.log("What the freak dude, that's not a number")
                break;
            case "inspect":
                console.log("Looks like this one is a work in progress...")
                break;
            case "stack":
                console.log(this.game.stack.items)
                break
            case "battlefields":
            case "battlefield":
                    if(
                        parsedCommand.length>1 && 
                        !Number.isNaN(parseInt(parsedCommand[1])) && 
                        parseInt(parsedCommand[1])<this.game.players.length && 
                        parseInt(parsedCommand[1]) > 0
                    ){
                        console.log(this.game.checkBattlefield(parseInt(parsedCommand[1])))
                    }else{
                        console.log(allBattlefields)
                    }
                break;
            case "graveyards":
            case "graveyard":
                    if(
                        parsedCommand.length>1 && 
                        !Number.isNaN(parseInt(parsedCommand[1])) && 
                        parseInt(parsedCommand[1])<this.game.players.length && 
                        parseInt(parsedCommand[1]) > 0
                    ){
                        console.log(this.game.checkGraveyard(parseInt(parsedCommand[1])))
                    }else{
                        console.log(allGraveyards)
                    }
                break;
            case "p":
            case "pass":
                console.log("Passing priority...")
                this.game.passPriority()
                break;
            case "exit":
                playing = false
                break;
            default:
                console.log("That is not a valid command")
                break;
        }
        
        }
        console.log("Exiting loop...")
        return
    }
    
}