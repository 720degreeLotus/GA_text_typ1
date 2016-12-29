# Project: _GA_text_typ1_
### Description
This small project is a genetic algorithm, which evolves a random text-string.

The fitness/score is based on a predefined target-string. The more a string resembles the target-string, the better the score.

### Config
- Target-string: `project works just great`
- Mutationrate: `1%`
- Population-limit: `5000`
- Charset: `abcdefghijklmnopqrstuvwxyz_?., `

Config can be changed in main.ts and will be checked for errors on start. If `allowImpossibleToFinish` is `FALSE` (default), the programm will throw an error and stop if the target-string can never be reached with the given charset.

### Usage
The whole project is only tested in windows.
- Requires `NodeJS` to be installed
- Copy/Clone repository to harddrive
- open cmd
- change directory to project folder
- run `npm install` to install all needed NPM modules
- run `npm start` to compile and run project

### Screenshot
![Alt text](/res/screenshot.png?raw=true "Screenshot")
