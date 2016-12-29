import { Config } from './classes/Config';
import { Creature } from './classes/Creature';
import { Population } from './classes/Population';

let chalk = require('chalk'); // Needed for colored output
let term = require( 'terminal-kit' ).terminal ; 
let fs = require('fs'); // Needed for resume feature

chalk.reset();

let headerData: string[] = [];
headerData[0] = chalk.green.bold("-- ") + "Configuration is valid :)"
headerData[1] = chalk.yellow.bold("::: ") + "Author: 720degreeLotus" + chalk.yellow.bold(" ::: ");
headerData[2] = chalk.yellow.bold("::: ") + "Project: Genetic algorithm to evolve to specific texthprase" + chalk.yellow.bold(" ::: ");
headerData[3] = "";

let config: Config = new Config();

config.target = "project works just great oh yes great just great";
config.mutationRate = 1;
config.charSet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "_", "?", ".", ",", " "];
config.populationLimit = 5000;
config.allowImpossibleToFinish = false;


if(config.validate() == false) {
    process.exit();
}

for(let c of headerData) {
    term(c);
    term.nextLine(1);
}
term("Duration (seconds): ");
term.nextLine(1);
term("Generation: ");
term.nextLine(1);
term("Best score: ");
term.nextLine(1);
term("Best creature: ");

let timer: Date = new Date(Date.now());
let myPopulation = new Population(config.target, config.charSet, config.mutationRate, config.populationLimit, true);
let oldTimer = Math.floor((Date.now() - timer.valueOf())/1000).toString();
let validation = false;
let guiReInit = false;
if (fs.existsSync("resume.txt")) {
    guiReInit = true;
}

while(validation == false) {
    let oldTargetValue: string = myPopulation.bestTarget;
    let oldTargetScore: number = myPopulation.bestScore;
    
    myPopulation.calculateFitness();
        
    if(oldTimer != Math.floor((Date.now() - timer.valueOf())/1000).toString()) {
        term.moveTo(21,headerData.length + 1);
        term(Math.floor((Date.now() - timer.valueOf())/1000).toString());
        oldTimer = Math.floor((Date.now() - timer.valueOf())/1000).toString();
    }
    term.moveTo(13,headerData.length + 2);
    term(myPopulation.generation);
    if((myPopulation.bestScore != oldTargetScore) || (guiReInit == true)) {
        term.moveTo(13,headerData.length + 3);
        let out: string = "";
        let percentage: number = Math.round(myPopulation.bestScore * 100);

        out += percentage + " % ";
        for(let i = 0; i < Math.round(percentage/2); i++) {
            out += chalk.green.bold("#");
        }
        if(percentage != 100) {
            for(let i = 0; i < 50-(Math.round(percentage/2)); i++) {
                out += chalk.yellow.bold("-");
            }
        }
        term(out);
    }
    if((myPopulation.bestTarget != oldTargetValue) || (guiReInit == true)) {
        term.moveTo(16,headerData.length + 4);
        term(myPopulation.outputColoredBestTarget());
    }

    if(myPopulation.validate()) {
        validation = true;
    } else {
        myPopulation.fillMatePool();
        myPopulation.breedNewGeneration(config.charSet, config.mutationRate);
    }
    // resume-test

    myPopulation.generation++;
    if(myPopulation.generation % 500 == 0) {
        term.moveTo(30,headerData.length + 1);
        term('+++ SAVING, DO NOT ABORT OR CLOSE !!! +++');
        myPopulation.saveToFile();
        term.moveTo(30,headerData.length + 1);
        term('                                          ');
        //console.log("wait1");
        //longExecFunc(() => { console.log('done!')}, 3); //5, 6 ... whatever. Higher -- longer
        //console.log("wait2");
        //process.exit();
    }
    
    if(guiReInit) {
        guiReInit = false;
    }
    /*console.log("wait1");
    longExecFunc(() => { console.log('done!')}, 3); //5, 6 ... whatever. Higher -- longer
    console.log("wait2");*/
}

/*function loadFromFile(): boolean {
    // load config and population from file
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
}*/

function longExecFunc(callback, count) {

    for (var j = 0; j < count; j++) {
        for (var i = 1; i < (1 << 30); i++) {
            var q = Math.sqrt(1 << 30);
        }
    }
    callback();
}










