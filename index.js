const express=require("express");
const fs=require('fs');
const path=require('path');
app=express();

obGlobal = {
    obErori:null,
    obImagini:null
}


console.log("Folder proiect", __dirname);
console.log("Cale fisier", __filename);
console.log("Director de lucru", process.cwd());


vectorFodere=["temp","temp1"];
for(let folder of vectorFodere){
    let caleFolder=path.join(__dirname,folder);
    if(!fs.existsSync(caleFolder)){
        fs.mkdirSync(caleFolder);
    }
}


app.set("view engine","ejs");

app.use("/resurse", express.static(__dirname+"/resurse"));
app.use("/node_modules", express.static(__dirname+"/node_modules"));

app.use(/^\/resurse(\/[a-zA-Z0-9]*(?!\.)[a-zA-Z0-9]*)*$/, function(req,res){
    Afis_Eroare(res,403);

});


app.get("/favicon.ico", function(req,res){
    res.sendFile(__dirname+"/resurse/ico/favicon.ico");
})

app.get(["/","/index","/home"],function(req,res){
    res.render("pagini/index",{ip: req.ip});
})

app.get("/despre",function(req,res){
    res.render("pagini/despre");
})

app.get("/ceva", function(req, res){
    //console.log("cale:",req.url)
    res.send("<h1>altceva</h1> ip:"+req.ip);
})

app.get("/*.ejs",function(req, res){
    Afis_Eroare(res,400);
})

app.get("/*",function(req,res){
    console.log("\ncale req.url: ",req.url);
    try{
        res.render("pagini" + req.url, function (err, rezRandare) {
            
            if (err) {
                console.log("\n_Eroare: ", err);
                if (err.message.startsWith("Failed to lookup view ")) {
                    //console.log(err);
                    Afis_Eroare(res, 404);
                }
                else {
                    Afis_Eroare(res);
                }
            }
            else {
                console.log("\n_Rezultat randare: ", rezRandare);
                res.send(rezRandare);
            }
        });
    }
    catch(err){
        console.log(err);
        if(err.message.startsWith("Cannot find module")){
            Afis_Eroare(res,404,"Fisier resursa negasit");
        }
        else
            afisareEroare(res);
    }
})

function Gen_Erori(){
    var continut = fs.readFileSync(__dirname+"/resurse/json/erori.json").toString("utf-8");
    console.log(continut);
    var obErori = JSON.parse(continut);
    for(let eroare of obErori.info_erori){
        eroare.imagine="/"+obErori.cale_baza+"/"+eroare.imagine;
    }
    obErori.eroare_default.imagine="/"+obErori.cale_baza+"/"+obErori.eroare_default.imagine;
    obGlobal.obErori=obErori;
}
Gen_Erori();


function Afis_Eroare(res, identificator, _titlu="Titlul default", _text, _imagine){
    let eroare = obGlobal.obErori.info_erori.find(function(elemErr){return elemErr.identificator==identificator});
    if(eroare){
        let titlu = _titlu=="Titlul default" ? (eroare.titlu || _titlu) : _titlu;
        let text = _text || eroare.text;
        let imagine = _imagine || eroare.imagine;
        if(eroare.status){
            res.status(eroare.identificator).render("pagini/eroare",{titlu:titlu, text:text, imagine:imagine});
        }
        else{
            res.render("pagini/eroare",{titlu:titlu, text:text, imagine:imagine});
        }
    }
    else{
        // console.log("\n\nimg   :    ",obGlobal.obErori.cale_baza,"/",obGlobal.obErori.eroare_default.eroare);
        res.render("pagini/eroare",{titlu:obGlobal.obErori.eroare_default.titlu, text:obGlobal.obErori.eroare_default.text, imagine:obGlobal.obErori.eroare_default.imagine});
    }
}


app.listen(8080);
console.log("Serverul a pornit");