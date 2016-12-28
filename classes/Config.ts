let chalk = require('chalk'); // Needed for colored output

export class Config {
    private _target: string;
    private _mutationRate: number;
    private _populationLimit: number;
    private _charSet: string[];
    private _allowImpossibleToFinish: boolean;

    constructor() {
        this._target = "a";
        this._mutationRate = 1;
        this._populationLimit = 100;
        this._charSet = ["a"];
        this._allowImpossibleToFinish = false;
    }

    get target(): string {
        return this._target;
    }

    set target(v: string) {
        this._target = v;
    }

    get mutationRate(): number {
        return this._mutationRate;
    }

    set mutationRate(v: number) {
        this._mutationRate = v;
    }

    get populationLimit(): number {
        return this._populationLimit;
    }

    set populationLimit(v: number) {
        this._populationLimit = v;
    }

    get charSet(): string[] {
        return this._charSet;
    }

    set charSet(v: string[]) {
        this._charSet = v;
    }

    get allowImpossibleToFinish(): boolean {
        return this._allowImpossibleToFinish;
    }

    set allowImpossibleToFinish(v: boolean) {
        this._allowImpossibleToFinish = v;
    }



    public validate(): boolean {
        let result: boolean = true;
        if(this._target == "") {
            console.log(chalk.red.bold("Error") + " in Config: [" + chalk.cyan.bold("TARGET") + "] is empty string");
            result = false;
        }

        if(this._allowImpossibleToFinish == false) {
            for(let charTarget of this._target.split('')) {
                let found: boolean = false;
                for(let charCharSet of this._charSet) {
                    if(charCharSet == charTarget) {
                        found = true;
                    }
                }
                if(found == false) {
                    console.log(chalk.red.bold("Error") + " in Config: [TARGET] contains symbol " + charTarget + " that is not in charset, so it will never reach 100%");
                    result = false;
                }
            }
        }
        
        if((this._mutationRate < 0) || (this._mutationRate > 100)) {
            console.log(chalk.red.bold("Error") + " in Config: [" + chalk.cyan.bold("MUTATIONRATE") + "] is out of range (0-100 allowed)");
            result = false;
        }

        if(this._populationLimit <= 0) {
            console.log(chalk.red.bold("Error") + " in Config: [" + chalk.cyan.bold("POPULATIONLIMIT") + "] is out of range (0-100 allowed)");
            result = false;
        }
        if(result == false) {
            console.log(chalk.red.bold("Configuration is not valid !!!"));
        }
        return result;
    }
}