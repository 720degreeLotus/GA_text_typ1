let chalk = require('chalk'); // Needed for colored output
let fs = require('fs'); // Needed for resume feature
let term = require( 'terminal-kit' ).terminal ; 

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
    
    constructor(target: string, charPool: string[], mutationRate: number, maxPopulation: number, init: boolean = false)
    {
        this.target = target;
        this.mutationrate = mutationRate;
        this.finished = false;
        this.maxPopulation = maxPopulation;
        this.charPool = charPool;
        if(init) {
            if (this.loadFromFile() == true) {
                term.moveTo(32,1);
                term(' <== Config was loaded from file !!');
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

    saveToFile(): boolean {
        if (fs.existsSync("resume.txt")) {
            fs.unlinkSync('resume.txt');
        }
        
        let data: string = '';
        data += 'target:' + this.target + '\r\n';
        data += 'mutationrate:' + this.mutationrate + '\r\n';
        data += 'maxPopulation:' + this.maxPopulation + '\r\n';
        data += 'charPool:' + this.charPool.join('') + '\r\n';
        data += 'generation:' + this.generation + '\r\n';
        data += 'bestScore:' + this.bestScore + '\r\n';
        data += 'bestTarget:' + this.bestTarget + '\r\n';

        for(let c of this.population) {
            data += 'creature:' + c.value.join('') + '\r\n';
        }

        fs.appendFileSync('resume.txt', data);
        return true;
    }

    loadFromFile(): boolean {
        if (fs.existsSync("resume.txt")) {
            let content: string[] = fs.readFileSync('resume.txt', 'utf8').split("\r\n");
            for(let c of content) {
                if(c.indexOf('generation:') >= 0) {
                    this.generation = Number(c.substr(11));
                } else if(c.indexOf('target:') >= 0) {
                    this.target = c.substr(7);
                } else if(c.indexOf('mutationrate:') >= 0) {
                    this.mutationrate = Number(c.substr(13));
                } else if(c.indexOf('maxPopulation:') >= 0) {
                    this.maxPopulation = Number(c.substr(14));
                } else if(c.indexOf('charPool:') >= 0) {
                    this.charPool = c.substr(9).split('');
                } else if(c.indexOf('bestScore:') >= 0) {
                    this.bestScore = Number(c.substr(10));
                } else if(c.indexOf('bestTarget:') >= 0) {
                    this.bestTarget = c.substr(11);
                } else if(c.indexOf('creature:') >= 0) {
                    this.population.push(new Creature(this.charPool, this.target.length, c.substr(9).split('')));
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