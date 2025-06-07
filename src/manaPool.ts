export enum Colors{
    "white" = "w",
    "blue" = "u",
    "black" = "b",
    "red" = "r",
    "green" = "g",
    "colorless" = "c"
}
export class ManaPool{
    private mana:{w:number,u:number,b:number,r:number,g:number,c:number} = {
        w:0,
        u:0,
        b:0,
        r:0,
        g:0,
        c:0
    }
    private otherMana:{w:[number,string[]][],u:[number,string[]][],b:[number,string[]][],r:[number,string[]][],g:[number,string[]][],c:[number,string[]][]} = {
        w:[],
        u:[],
        b:[],
        r:[],
        g:[],
        c:[]
    }
    /**
     * 
     * @param color Mana color: w u b e r g. Always lowercase. 
     * @param amount Amount of mana of that color to add, no negative numbers.
     * @param spellTypes Optional. If the mana can only be spent on a specific type of spell.
     */
    public add(color:Colors,amount:number,spellTypes?:string[]){
        if(amount < 0)throw("Can not add negative mana")
        if(!Object.keys(this.mana).includes(color))throw("Invalid Mana Type")
        if(!spellTypes)this.mana[color]+=amount
        else{
            for(let i = 0;i<this.otherMana[color].length;i++){
                let same:boolean = true
                for(let j = 0;j<spellTypes.length;j++){
                    if(!this.otherMana[color][i][1].includes(spellTypes[j])){
                        same = false
                        break
                    }
                }
                if(same){
                    this.otherMana[color][i][0] += amount
                    return
                }
                
            }
            this.otherMana[color].push([amount,spellTypes])
        }
    }
    public use(values:{w:number,u:number,b:number,r:number,g:number,c:number},types:string[]){
        for(const color in values){
            let amount = values[color]
            if(amount <= 0)continue
            for(let i = 0;i<this.otherMana[color].length;i++){
                let same:boolean = true
                for(let j = 0;j<types.length;j++){
                    if(!this.otherMana[color][i][1].includes(types[j])){
                        same = false
                        break
                    }
                }
                if(same){
                    if(amount > this.otherMana[color][i][0]){
                        amount -= this.otherMana[color][i][0]
                        this.otherMana[color].splice(i,1)
                    }else{
                        this.otherMana[color][i][0]-=amount
                        amount = 0
                    }
                    break
                }
                
            }
            if(amount <= 0)continue
            if(amount > this.mana[color])throw("Not Enough mana to cast this spell")
            this.mana[color] -= amount
        }
    }
    public drain(){
        this.mana = {
            w:0,
            u:0,
            b:0,
            r:0,
            g:0,
            c:0
        }
        this.otherMana = {
            w:[],
            u:[],
            b:[],
            r:[],
            g:[],
            c:[]
        }
    }
    public enoughMana(values:{w:number,u:number,b:number,r:number,g:number,c:number},types:string[]):boolean{
        let mana = {...this.mana}
        let otherMana = JSON.parse(JSON.stringify(this.otherMana))
        for(const color in values){
            let amount = values[color]
            if(amount <= 0)continue
            for(let i = 0;i<otherMana[color].length;i++){
                let same:boolean = true
                for(let j = 0;j<types.length;j++){
                    if(!otherMana[color][i][1].includes(types[j])){
                        same = false
                        break
                    }
                }
                if(same){
                    if(amount > otherMana[color][i][0]){
                        amount -= otherMana[color][i][0]
                        otherMana[color].splice(i,1)
                    }else{
                        otherMana[color][i][0]-=amount
                        amount = 0
                    }
                    break
                }
                
            }
            if(amount <= 0)continue
            if(amount > mana[color])return false
            mana[color] -= amount
            return true
        }
    }
    public check():{w:number,u:number,b:number,r:number,g:number,c:number}{
        return this.mana
    }

}