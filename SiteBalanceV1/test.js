const { exec } = require("child_process");

function KillProcess(process){
    exec(`kill ${process}`,(err)=>{
    if(err)
    {
        console.error("Echec du kill");
    }else
    {
        console.log(`Process ${process} tué`);
    }
    });
}

exec("sleep 100", (err) => {
    if (err) {
        console.error("Sleep loupé");
        return;
    }
});

exec(`ps -A -o pid,cmd | grep "sleep 100" | grep -v grep | head -n 1 | awk '{print $1}'`, (err,stdout) => {
    if (err) {
        console.error("Erreur");
        return;
    }
    console.log("Sleep tourne sur",stdout);
    console.log(typeof(stdout));
   KillProcess(stdout);
});