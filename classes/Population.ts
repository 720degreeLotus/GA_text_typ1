let chalk = require('chalk'); // Needed for colored output
let fs = require('fs'); // Needed for resume feature

import { Config } from './Config';
import { Creature } from './Creature';

export class Population {
    public population: any[] = [];
    public matingPool: any[] = [];
    public generation: number;
    public finished: boolean;
    public target: string;
    public mutationrate: number;
    public maxPopulation: number;
    public bestScore: number;
    public bestTarget: string;
    public charPool: string[] = [];
    
    constructor(target: string, charPool, mutationRate: number, maxPopulation: number, init: boolean = false)
    {
        this.target = target;
        this.mutationrate = mutationRate;
        this.finished = false;
        this.maxPopulation = maxPopulation;
        this.charPool = charPool;
        if(init) {
            if (this.resume() == true) {
                // Do something
            } else {
                this.generation = 0;
                this.bestScore = 0;
                this.bestTarget = "";
                for(let i = 0; i < this.maxPopulation; i++) {
                    this.population[i] = new Creature(this.charPool, this.target.length);
                }
            }
        }
    }

    outputColoredBestTarget() {
        let s: string = "";
        for(let i = 0; i < this.target.length; i++) {
            if(this.target.substr(i, 1) == this.bestTarget.substr(i, 1)) {
                if(this.bestTarget.substr(i, 1) == " ") {
                    s += chalk.bgGreen(" ") + chalk.reset(" "); // richtig
                } else {
                    s += chalk.green.bold(this.bestTarget.substr(i, 1) + " "); // richtig
                }
            } else {
                if(this.bestTarget.substr(i, 1) == " ") {
                    s += chalk.bgRed(" ") + chalk.reset(" "); // richtig
                } else {
                    s += chalk.red.bold(this.bestTarget.substr(i, 1)+ " "); // falsch
                }
            }
        }
        return s;
    }

    resume(): boolean {
        if (fs.existsSync("resume")) {
            let content: string[] = fs.readFileSync('resume', 'utf8').split("\r\n");
            for(let c of content) {
                if(c.indexOf('generation:') >= 0) {
                    this.generation = Number(c.substr(11));
                    console.log("loaded generation = " + this.generation);
                } else if(c.indexOf('target:') >= 0) {
                    this.target = c.substr(7);
                    console.log("loaded target = " + this.target);
                } else if(c.indexOf('mutationrate:') >= 0) {
                    this.mutationrate = Number(c.substr(13));
                    console.log("loaded mutationrate = " + this.mutationrate);
                } else if(c.indexOf('maxPopulation:') >= 0) {
                    this.maxPopulation = Number(c.substr(14));
                    console.log("loaded maxPopulation = " + this.maxPopulation);
                } else if(c.indexOf('charPool:') >= 0) {
                    this.charPool = c.substr(9).split('');
                    console.log("loaded charPool = " + c.substr(9));
                } else if(c.indexOf('creature:') >= 0) {
                    this.population.push(new Creature(this.charPool, this.target.length, c.substr(9).split('')));
                    console.log("loaded creature = " + c.substr(9));
                }
            }
            return true;
        } else {
            return false;
        }
    }

    validate() {
        for(let c of this.population) {
            if(c.fitness == 1) {
                return true;
            }
        }
        return false;
    }

    calculateFitness() {
        for(let c of this.population) {
            c.calculateFitness(this.target);
            if(c.fitness > this.bestScore) {
                this.bestScore = c.fitness;
                this.bestTarget = c.value.join("");
            }
        }
    }

    fillMatePool() {
        this.matingPool = []; // Pool leeren
        for(let c of this.population) {
            for(let i = 0; i < c.fitness*100  ; i++) {
                this.matingPool.push(c);
            }
        }
    }

    breedNewGeneration(charPool: string[], mutationRate: number) {
        let newPopu = [];
        for(let i = 0; i < this.maxPopulation; i++) {
            newPopu.push(new Creature(charPool, mutationRate,this.matingPool[this.getRandom(0, this.matingPool.length-1)].mate(charPool, mutationRate,this.matingPool[this.getRandom(0, this.matingPool.length-1)])));
        }
        this.population = newPopu;
    }

    getRandom(min, max) {
        return Math.floor(Math.random()*(max-min+1)+min);
    }
}