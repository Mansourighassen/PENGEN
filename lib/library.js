const { exec } = require('child_process');
var fs = require("fs");

module.exports ={
 makedir:(Dir_name) => {
    exec('mkdir '+Dir_name, (err, stdout, stderr) => {
        if (err) {
          // node couldn't execute the command
          return;
        }
      
        // the *entire* stdout and stderr (buffered)
        // console.log(`please wait ... ${stderr}`);
      });
    
    } ,

 npmin:(Dir_name) =>{

    exec('cd '+Dir_name+' && npm init -y && npm install express sequelize pg pg-hstore body-parser cors --save', (err, stdout, stderr) => {
        if (err) {
          // node couldn't execute the command
          return;
        }
      
        // the *entire* stdout and stderr (buffered)
        // console.log(`success!: ${stdout}`);
        // console.log(`please wait ... ${stderr}`);
      });

},

generateemptyfile:(filepath)=>{
exec('echo >>'+filepath)
return 0;

},

generatebasedirs:(Dir_name,subdir)=>{
    exec('cd '+Dir_name +'&& mkdir '+subdir);
},

 generatefile:(path,data)=>{

    fs.appendFile(path, data, (err) => {

          if (err) console.log(err);
        });

}

}


