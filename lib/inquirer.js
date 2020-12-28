const inquirer = require("inquirer");
const Choice = require("inquirer/lib/objects/choice");
const Choices = require("inquirer/lib/objects/choices");

module.exports = {
  askprojectname: () => {
    const questions = [
      {
        name: "projectname",
        type: "input",
        message: "Enter your project name:",
        validate: function (value) {
          if (value.length) {
            return true;
          } else {
            return "Please enter your project name.";
          }
        },
      },
    ];
    return inquirer.prompt(questions);
  },
  askdatabaseconfig: () => {
    const questions = [
      {
        name: "database_type",
        type: "checkbox",
        message: "choose your database type: ",
        choices: ["POSTGRESQL", "MYSQL", "MONGODB"],
      },
    ];
    return inquirer.prompt(questions);
  },
  askgeneratemodel:()=>{
    const questions = [
        {
            name: "generate_Model", 
            type:"checkbox",
            message:'do you want to generate Models ?',
            choices: ["yes","no"]
        },
        
        
     
    ]
    return inquirer.prompt(questions);

  },
  generate_db_config:(dbtype)=>{
       //
      if(dbtype.database_type.indexOf("POSTGRESQL")>-1){
      const questions=[
          {
           name:"hostname",
           type:"input",
           message:"Enter database hostname :",
           validate: function (value) {
            if (value.length) {
              return true;
            } else {
              return "Please enter your database hostname.";
            }
          }
     
     
          },
          {
            name:"user",
            type:"input",
            message:"Enter database username :",
            validate: function (value) {
             if (value.length) {
               return true;
             } else {
               return "Please enter your database username.";
             }
           }
      
      
           },
           {
            name:"password",
            type:"input",
            message:"Enter database password :",
            validate: function (value) {
             if (value.length) {
               return true;
             } else {
               return "Please enter your database password.";
             }
           }
      
      
           }, 
           {
            name:"databasename",
            type:"input",
            message:"Enter database name :",
            validate: function (value) {
             if (value.length) {
               return true;
             } else {
               return "Please enter your database name.";
             }
           }
      
      
           }

          
      ]
      return inquirer.prompt(questions);

    }
  },
  generate_model:(answer)=>{
      
    if(answer.generate_Model.indexOf("yes")>-1){
    
    const questions=[
        {
            name:"Modelname",
            type:"input",
            message:"Please enter modelname :",
            validate: function (value) {
                if (value.length) {
                  return true;
                } else {
                  return "Please enter model name.";
                }
              }


        },
        
        {
            name: "generate_attributes", 
            type:"checkbox",
               message:'do you want to generate attributes  for this model ?',
               choices: ["yes","no"]
        
        },
        
      ]
      return inquirer.prompt(questions);
    }
  },
  generate_attributes:(answer) => {
      if(answer.generate_attributes.indexOf("yes")>-1){
          const questions=[
        {
            name:"attribname",
            type:"input",
            message:"Please enter attribute name :",
            validate: function (value) {
                if (value.length) {
                  return true;
                } else {
                  return "Please enter attribute name.";
                }
              }


        },
        {
            name:"attributetype", 
            type:"checkbox",
            message:"Please enter attribute type :",
            choices: ["STRING","TEXT","STRING.BINARY","INTEGER","BIGINT","FLOAT","DECIMAL","DATE","BOOLEAN","ENUM","ARRAY","JSON","JSONB","BLOB","UUID"]
            

        },
        {
            name: "generate_another",
            type: "checkbox",
            message: "do you want to generate another attribute ? ",
            choices:["yes","no"]
        }


    ]
    return inquirer.prompt(questions);







      }else{
          return;
      }


  }
  


};
