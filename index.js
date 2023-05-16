const express=require("express");
const fs=require('fs');
const path=require('path');
const sharp=require('sharp');
const sass=require('sass');

app=express();

obGlobal = {
    obErori:null,
    obImagini:null,
    folderScss: path.join(__dirname, "resurse/scss"),
    folderCss: path.join(__dirname, "resurse/css")
}


console.log("Folder proiect", __dirname);
console.log("Cale fisier", __filename);
console.log("Director de lucru", process.cwd());


vectorFodere=["temp","temp1","backup"];
for(let folder of vectorFodere){
    let caleFolder=path.join(__dirname,folder);
    if(!fs.existsSync(caleFolder)){
        fs.mkdirSync(caleFolder);
    }
}




function compileazaScss(caleScss, caleCss){
    console.log("cale:",caleCss);
    if(!caleCss){
        // let vectorCale=caleScss.split("\\")
        // let numeFisExt=vectorCale[vectorCale.length-1];
        // let numeFis=numeFisExt.split(".")[0]   /// "a.scss"  -> ["a","scss"]
        let numeFis=path.basename(toString(caleScss),'.scss');
        caleCss=numeFis+".css";
    }
    
    if (!path.isAbsolute(caleScss))
        caleScss=path.join(obGlobal.folderScss,caleScss );
    if (!path.isAbsolute(caleCss))
        caleCss=path.join(obGlobal.folderCss,caleCss );
    
    // la acest punct avem cai absolute in caleScss si  caleCss

    // let vectorCale=caleCss.split("\\");
    // let numeFisCss=vectorCale[vectorCale.length-1];
    // let numex=numeFisCss.split(".")[0]+(new Date()).getTime()+".css";
    let numeFisCss=path.basename(toString(caleCss));
    let numex=path.basename(toString(caleCss),'.css')+(new Date()).getTime()+".css";
    if (fs.existsSync(caleCss)){
        fs.copyFileSync(caleCss, path.join(obGlobal.folderBackup,numeFisCss ))// +(new Date()).getTime()
        fs.copyFileSync(caleCss, path.join(obGlobal.folderBackup,numex ))
    }
    rez=sass.compile(caleScss, {"sourceMap":true});
    fs.writeFileSync(caleCss,rez.css);
    console.log("\n-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-\nCompilare SCSS\n\n",rez,"\n-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-\n");
}
// compileazaScss("a.scss");


fs.watch(obGlobal.folderScss, function(eveniment, numeFis){
    console.log("\n",eveniment, numeFis,"\n");
    if (eveniment=="change" || eveniment=="rename"){
        let caleCompleta=path.join(obGlobal.folderScss, numeFis);
        if (fs.existsSync(caleCompleta)){
            compileazaScss(caleCompleta);
        }
    }
})


vFis=fs.readdirSync(obGlobal.folderScss)
for(let numefis of vFis){
    if(path.extname(numefis)==".scss")
    compileazaScss(numefis);
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
    res.render("pagini/index",{ip: req.ip, imagini:obGlobal.obImagini.imagini});
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

function Gen_Imagini(){
    var continut= fs.readFileSync(__dirname+"/resurse/json/galerie.json").toString("utf-8");

    obGlobal.obImagini=JSON.parse(continut);
    let vImagini=obGlobal.obImagini.imagini;

    let caleAbs=path.join(__dirname,obGlobal.obImagini.cale_galerie);
    let caleAbsMediu=path.join(__dirname,obGlobal.obImagini.cale_galerie, "mediu");
    if (!fs.existsSync(caleAbsMediu))
        fs.mkdirSync(caleAbsMediu);

    //for (let i=0; i< vErori.length; i++ )
    for (let imag of vImagini){
        [numeFis, ext]=imag.cale_imagine.split(".");
        let caleFisAbs=path.join(caleAbs,imag.cale_imagine);
        let caleFisMediuAbs=path.join(caleAbsMediu, numeFis+".webp");
        sharp(caleFisAbs).resize(400).toFile(caleFisMediuAbs);
        imag.cale_imagine_mediu=path.join("/", obGlobal.obImagini.cale_galerie, "mediu",numeFis+".webp" )
        imag.cale_imagine=path.join("/", obGlobal.obImagini.cale_galerie, imag.cale_imagine )
        //eroare.imagine="/"+obGlobal.obErori.cale_baza+"/"+eroare.imagine;
        console.log("CALE IMAGINE:   "+imag.cale_imagine+"\n")
    }
    console.log("\n"+obGlobal.obImagini.cale_galerie+"\n\n")
}
Gen_Imagini();


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