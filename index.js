//imports
const CLI = require('clui');
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const { map, forEach } = require('lodash');
const files = require('./lib/files');
const inquirer  = require('./lib/inquirer');
const ressources = require("./lib/resources");

const libraries = require('./lib/library');
const ora = require('ora');



//main code
clear();

console.log(
  chalk.yellow(
    figlet.textSync('PENGEN', { horizontalLayout: 'full' })
  )
);
var modelsarray=[];
var attributesMap=[];
var attributesmaparray=[];

const run = async () => {
   
    const credentials = await inquirer.askprojectname();
    console.log(credentials);
    const database_config = await inquirer.askdatabaseconfig();
    console.log(database_config);
    const generate_database_config = await inquirer.generate_db_config(database_config);
    console.log(generate_database_config);
    var generate_model_ask= await inquirer.askgeneratemodel(); 
    while (generate_model_ask.generate_Model.indexOf("yes")>-1){
    const generate_model = await inquirer.generate_model(generate_model_ask);
    console.log(generate_model);
                 modelsarray.push(generate_model.Modelname);

     
        if(generate_model.generate_attributes.indexOf("yes")> -1) {
            var    generate_attribute = await inquirer.generate_attributes(generate_model);
            attributesMap.push(generate_attribute);
    while (generate_attribute.generate_another.indexOf("yes") > -1){
           
            generate_attribute = await inquirer.generate_attributes(generate_model);
            attributesMap.push(generate_attribute);
            console.log(attributesMap);

            

    }

}
attributesmaparray.push([generate_model.Modelname,attributesMap]);
attributesMap=[];
generate_model_ask= await inquirer.askgeneratemodel();
  }
/////functional 
let dir = credentials.projectname;
const spinner = ora('generating project file ... ').start();

setTimeout(() => {
	spinner.color = 'yellow';
  spinner.text = 'generating project file ...';
  libraries.makedir(dir);


libraries.generatebasedirs(dir, "config");

 libraries.generatebasedirs(dir, "controller");

 libraries.generatebasedirs(dir, "routes");

 libraries.generatebasedirs(dir, "models");
 var data = ressources.generatedbconfig(generate_database_config.hostname, generate_database_config.user, generate_database_config.password, generate_database_config.databasename);
 libraries.generateemptyfile(__dirname+`/${dir}`+`/config/db.config.js`);
 libraries.generatefile(__dirname+`/${dir}`+`/config/db.config.js`, data);
  let arraymodels=[]; 
 attributesmaparray.forEach(element => {
  libraries.generateemptyfile(__dirname+`/${dir}`+`/models/${element[0]}.model.js`);
  
  libraries.generatefile(__dirname+`/${dir}`+`/models/${element[0]}.model.js`, ressources.generatemodel(element[0], element[1]));
  libraries.generateemptyfile(__dirname+`/${dir}`+`/controller/${element[0]}.controller.js`);
  libraries.generatefile(__dirname+`/${dir}`+`/controller/${element[0]}.controller.js`, ressources.generate_crud(element[0], element[1]));
  libraries.generateemptyfile(__dirname+`/${dir}`+`/routes/${element[0]}.routes.js`);
  libraries.generatefile(__dirname+`/${dir}`+`/routes/${element[0]}.routes.js`, ressources.generatemodelroutes(element[0]));


  arraymodels.push(element[0]);


});
const indexfile =ressources.generateindexjs(arraymodels);
libraries.generateemptyfile(__dirname+`/${dir}`+`/models/index.js`);
libraries.generatefile(__dirname+`/${dir}`+`/models/index.js`, indexfile);  
libraries.generateemptyfile(__dirname+`/${dir}`+`/app.js`);
  libraries.generatefile(__dirname+`/${dir}`+`/app.js`, ressources.generate_mainjs(attributesmaparray));
libraries.npmin(dir);




 spinner.succeed('done project created enjoy :))! ');
 spinner.stop();
},1000);








  };
  
  run();