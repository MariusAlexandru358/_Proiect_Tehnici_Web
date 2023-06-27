// import { createRequire } from "module";
// const require = createRequire(import.meta.url);
const express=require("express");
const fs=require('fs');
const path=require('path');
const sharp=require('sharp');
const sass=require('sass');
const ejs=require('ejs');
const {Client}=require('pg');
const formidable = require('formidable');

// import * as formidable from 'formidable';
// import express from 'express';
// import * as fs from 'fs';
// import * as path from 'path';
// import * as sharp from 'sharp';
// import * as sass from 'sass';
// import * as ejs from 'ejs';
// import pkg from 'pg';
// const {Client} = pkg;

var client= new Client({database:"_tickertinker",
        user:"alexandru__marius_cristian",
        password:"123456",
        host:"localhost",
        port:5432});
client.connect();

// client.query("select * from test", function(err, rez){
//     console.log("Eroare BD",err);
//     console.log("Rezultat BD",rez);
// });
// client.query("select * from unnest(enum_range(null::categ_prajitura))",function(err, rez){
//     console.log(err);
//     console.log(rez);
// })

app=express();

obGlobal = {
    obErori:null,
    obImagini:null,
    obImaginiFiltered:null,
    folderScss: path.join(__dirname, "resurse/scss"),
    folderCss: path.join(__dirname, "resurse/css"),
    folderBackup: path.join(__dirname, "/backup"),
    optiuniMeniu:[],
    atributeProdus: {material: null}
}



client.query("select * from unnest(enum_range(null::categorie_produs))",function(err, rezTipuri){
    // console.log(err);
    // console.log(rez);
    if(err){
        console.log(err);
    }
    else{
        console.log("\nrezTipuri");
        console.log(rezTipuri);
        console.log("\n\n")
        obGlobal.optiuniMeniu=rezTipuri.rows;

    }
    // app.locals.optiuniMeniu=obGlobal.optiuniMeniu;
})

client.query("select distinct material from ceasuri",function(err, rezMaterial){
    // console.log(err);
    // console.log(rez);
    if(err){
        console.log(err);
    }
    else{
        console.log("\nrezMaterial");
        console.log(rezMaterial);
        console.log("\n\n")
        obGlobal.atributeProdus.material=rezMaterial.rows;

    }
    // app.locals.optiuniMeniu=obGlobal.optiuniMeniu;
})




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
    
    if(!caleCss){
        // let vectorCale=caleScss.split("\\")
        // let numeFisExt=vectorCale[vectorCale.length-1];
        // let numeFis=numeFisExt.split(".")[0]   /// "a.scss"  -> ["a","scss"]
        let numeFis=path.basename(caleScss,'.scss');
        // console.log("basename:",numeFis);
        caleCss=numeFis+".css";
    }
    // console.log("cale:",caleCss);
    if (!path.isAbsolute(caleScss))
        caleScss=path.join(obGlobal.folderScss,caleScss );
    if (!path.isAbsolute(caleCss))
        caleCss=path.join(obGlobal.folderCss,caleCss );
    

    // let vectorCale=caleCss.split("\\");
    // let numeFisCss=vectorCale[vectorCale.length-1];
    // let numex=numeFisCss.split(".")[0]+(new Date()).getTime()+".css";
    let numeFisCss=path.basename(caleCss);
    let numex=path.basename(caleCss,'.css')+"_"+(new Date()).getTime()+".css";

    let caleResBackup=path.join(obGlobal.folderBackup,"resurse/css");
    if(!fs.existsSync(caleResBackup)){
        fs.mkdirSync(caleResBackup,{recursive:true});
    }

    if (fs.existsSync(caleCss)){
        // console.log("cale:",caleCss);
        // console.log("basename:",numeFisCss);
        fs.copyFileSync(caleCss, path.join(obGlobal.folderBackup,"resurse/css",numeFisCss ))// +(new Date()).getTime()
        fs.copyFileSync(caleCss, path.join(obGlobal.folderBackup,"resurse/css",numex ))
    }
    rez=sass.compile(caleScss, {"sourceMap":true});
    fs.writeFileSync(caleCss,rez.css);
    // console.log("\n-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-\nCompilare SCSS\n\n",rez,"\n-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-\n");
}
// compileazaScss("a.scss");


fs.watch(obGlobal.folderScss, function(eveniment, numeFis){
    // console.log("\n",eveniment, numeFis,"\n");
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

app.use("/*",function(req,res,next){
    res.locals.optiuniMeniu = obGlobal.optiuniMeniu;
    res.locals.materialProdus = obGlobal.atributeProdus.material;
    // console.log("\n\n\n MATERIAL \n\n");
    // console.log(res.locals.materialProdus);
    next();
});

app.use(/^\/resurse(\/[a-zA-Z0-9]*(?!\.)[a-zA-Z0-9]*)*$/, function(req,res){
    Afis_Eroare(res,403);

});


app.get("/favicon.ico", function(req,res){
    res.sendFile(__dirname+"/resurse/ico/favicon.ico");
})

app.get(["/","/index","/home"],function(req,res){
    res.render("pagini/index",{ip: req.ip, imagini:obGlobal.obImaginiFiltered.imagini});
})

app.get("/despre",function(req,res){
    res.render("pagini/despre");
})

app.get("/evenimente",function(req,res){
    res.render("pagini/evenimente",{imagini:obGlobal.obImaginiFiltered.imagini, imaginiAll:obGlobal.obImagini.imagini});
})

app.get("/ceva", function(req, res){
    //console.log("cale:",req.url)
    res.send("<h1>altceva</h1> ip:"+req.ip);
})











// app.get("/produse",function(req, res){
//     //TO DO query pentru a selecta toate produsele
//     //TO DO se adauaga filtrarea dupa tipul produsului
//     //TO DO se selecteaza si toate valorile din enum-ul categ_prajitura
//     client.query("select * from unnest(enum_range(null::categ_prajitura))",function(err, rezCategorie){
//         console.log(req.query);
//         let wherecond="";
//         if(req.query.tip)
//             wherecond = ` where tip_produs='${req.query.tip}'`
//         client.query("select * from prajituri"+wherecond , function( err, rez){
//             console.log(300)
//             if(err){
//                 console.log(err);
//                 Afis_Eroare(res, 2);
//             }
//             else{
//                 console.log(rez);
//                 res.render("pagini/produse", {produse:rez.rows, optiuni:rezCategorie.rows});
//             }  
//         });
//     }) 
// });



app.get("/produse",function(req, res){
    //TO DO query pentru a selecta toate produsele
    //TO DO se adauaga filtrarea dupa tipul produsului
    //TO DO se selecteaza si toate valorile din enum-ul categ_prajitura
    client.query("select * from unnest(enum_range(null::tag_special))",function(err, rezCategorie){
        console.log(req.query);
        let wherecond="";
        if(req.query.tip)
            wherecond = ` where categ_prod='${req.query.tip}'`
        client.query("select * from ceasuri"+wherecond , function( err, rez){
            console.log(300)
            if(err){
                console.log(err);
                console.log(" EROARE");
                Afis_Eroare(res, 2);
            }
            else{
                // console.log(rez);
                
                rez.rows.forEach(function (element) {
                    const days = ["Duminică", "Luni", "Marți", "Miercuri", "Joi", "Vineri", "Sâmbătă"];
                    const months = ["Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie", "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"];
                    let zi = days[element.data_adaugare.getDay()]
                            + ", " + element.data_adaugare.getDate() 
                            + "-" + months[element.data_adaugare.getMonth()]
                            + "-" + element.data_adaugare.getFullYear();
                element.data_adaugare=zi;

                }, this);

                res.render("pagini/produse", {produse:rez.rows, optiuni:rezCategorie.rows});
            }  
        });
    }) 
});





app.get("/produs/:id",function(req, res){
    console.log(req.params);
   
    client.query(`select * from ceasuri where id=${req.params.id}`, function( err, rezultat){
        if(err){
            console.log(err);
            Afis_Eroare(res, 2);
        }
        else{
            rezultat.rows.forEach(function (element) {
                const days = ["Duminică", "Luni", "Marți", "Miercuri", "Joi", "Vineri", "Sâmbătă"];
                const months = ["Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie", "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"];
                let zi = days[element.data_adaugare.getDay()]
                        + ", " + element.data_adaugare.getDate() 
                        + "-" + months[element.data_adaugare.getMonth()]
                        + "-" + element.data_adaugare.getFullYear();
            element.data_adaugare=zi;

            }, this);

            res.render("pagini/produs", {prod:rezultat.rows[0]});
        }
    });
});

// client.query("select * from unnest(enum_range(null::categ_prajitura))",function(err, rez){
//     console.log(err);
//     console.log(rez);
// })



app.get("/produseServer",function(req, res){
    //TO DO query pentru a selecta toate produsele
    //TO DO se adauaga filtrarea dupa tipul produsului
    //TO DO se selecteaza si toate valorile din enum-ul categ_prajitura
    client.query("select * from unnest(enum_range(null::tag_special))",function(err, rezCategorie){
        console.log(req.query);
        let wherecond="";
        if(req.query.tip)
            wherecond = ` where categ_prod='${req.query.tip}'`
        client.query("select * from ceasuri"+wherecond , function( err, rez){
            console.log(300)
            if(err){
                console.log(err);
                console.log(" EROARE");
                Afis_Eroare(res, 2);
            }
            else{
                // console.log(rez);
                
                rez.rows.forEach(function (element) {
                    const days = ["Duminică", "Luni", "Marți", "Miercuri", "Joi", "Vineri", "Sâmbătă"];
                    const months = ["Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie", "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"];
                    let zi = days[element.data_adaugare.getDay()]
                            + ", " + element.data_adaugare.getDate() 
                            + "-" + months[element.data_adaugare.getMonth()]
                            + "-" + element.data_adaugare.getFullYear();
                element.data_adaugare=zi;

                }, this);
                console.log("\n\nxxxxxxxxxxxxxxxxxxx\n\n"); console.log(rez.rows); console.log("\n\nxxxxxxxxxxxxxxxxxxx\n\n");
                res.render("pagini/produseServer", {produse:rez.rows, optiuni:rezCategorie.rows});
            }  
        });
    }) 
});

app.post("/sortateServer", function (req, res) {
    var form = new formidable.IncomingForm();
    // const form = formidable(options);
    console.log(form);
    form.parse(req, function (err, fields, files) {

        

        client.query("select * from unnest(enum_range(null::tag_special))",function(err, rezCategorie){
            // console.log(req.query);

            var sql_query = "select * from ceasuri where ";
            
            let nume = fields.inp_nume.toLocaleLowerCase(); let oknume=0;
            if(nume){
                nume=nume.replace(/ă/g, "a"); nume=nume.replace(/î/g, "i"); nume=nume.replace(/â/g, "a"); nume=nume.replace(/ș/g, "s"); nume=nume.replace(/ț/g, "t");
                oknume=1;
                console.log("\nNUME: "); console.log(nume);
                sql_query=sql_query+"nume='"+nume+"' and ";
            }

            let tag = fields.gr_rad; let oktag=0;
            if(tag && tag!="toate"){
                oktag=1;
                sql_query=sql_query+"tag='"+tag+"' and ";
                console.log("\nTAG: "); console.log(tag);
            }

            let pret = fields.inp_pret;
            console.log("\n\n\nFIELDS.PRET\n\n"); console.log(pret); console.log("\n\n"); 
            let okpret=0; 
            var vlp=[], vup=[];
            if(pret){
                console.log(typeof pret);
                if(typeof pret=="string" && pret!="oricare"){
                    [lp, up]=pret.split("-");
                    console.log("\nlp up: "); console.log(lp,up);
                    lp=parseFloat(lp);
                    up=parseFloat(up);
                    sql_query=sql_query+"pret>="+lp+" and "+"pret<="+up+" and ";
                }else if(typeof pret=="string" && pret=="oricare"){}
                else{
                    if(pret[0]!="oricare"){
                        sql_query=sql_query+"(";
                    }
                for(let p of pret){
                    okpret=1; var lp, up;
                            [lp, up]=p.split("-");
                            console.log("\nlp up: "); console.log(lp,up);
                            lp=parseFloat(lp);
                            up=parseFloat(up);
                            sql_query=sql_query+"(pret>="+lp+" and "+"pret<="+up+") or ";
                }

                if(okpret==1){sql_query=sql_query+"1=0) and ";}
                }
                
                    
                console.log("\nPRET: "); console.log(vlp,vup);
            }

            let material = fields.inp_material; let okmaterial=0;
            if(material && material!="oricare"){
                okmaterial=1;
                sql_query=sql_query+"material='"+material+"' and ";
                console.log("\nMATERIAL: "); console.log(material);
            }

            let culoare = fields.inp_culoare.toLocaleLowerCase(); let okculoare=0;
            if(culoare){
                culoare=culoare.replace(/ă/g, "a"); culoare=culoare.replace(/î/g, "i"); culoare=culoare.replace(/â/g, "a"); culoare=culoare.replace(/ș/g, "s"); culoare=culoare.replace(/ț/g, "t");
                okculoare=1;
                // sql_query=sql_query+"culoare='"+culoare+"' ";
                console.log("\nCULOARE: "); console.log(culoare);
            }

            let dimensiune = fields.inp_dimensiune; let okdimensiune=0;
            if(dimensiune){
                okdimensiune=1;
                sql_query=sql_query+"dimensiune<="+dimensiune+" and ";
                console.log("\nDIMENSIUNE: "); console.log(dimensiune);
            }

            let garantie = fields.inp_garantie; let okgarantie=0;
            if(garantie){
                okgarantie=1;
                sql_query=sql_query+"garantie='"+garantie+"' and ";
                console.log("\nGARANTIE: "); console.log(garantie);
            }

            let keywords = fields.inp_descriere.toLocaleLowerCase();
            if(keywords){
                keywords=keywords.replace(/ă/g, "a"); keywords=keywords.replace(/î/g, "i"); keywords=keywords.replace(/â/g, "a"); keywords=keywords.replace(/ș/g, "s"); keywords=keywords.replace(/ț/g, "t");
                let vkw=keywords.split(" ");
                for(let kw of vkw){
                    if(kw[0]=='+'){
                        sql_query=sql_query+"lower(descriere) like '%"+kw.substring(1)+"%' and "
                    }
                    if(kw[0]=='-'){
                        sql_query=sql_query+"lower(descriere) not like '%"+kw.substring(1)+"%' and "
                    }
                }
            }

            sql_query = sql_query+" 1=1";

            let ordineSort = fields.ordine_sortare;
            let ordinesql;
            if(ordineSort=="crescator"){
                ordinesql="asc";
            }
            else{
                ordinesql="desc";
            }
            let campuriSort = fields.campuri_sortare;
            if(campuriSort){
                sql_query = sql_query+" order by ";
                for(let f of campuriSort){
                    sql_query = sql_query+f+" "+ordinesql+", ";
                }
                sql_query=sql_query+"id asc";
            }

            console.log("\n\n\nSQL\n\n"); console.log(sql_query); console.log("\n\n"); 
            // let wherecond="";
            // if(req.query.tip)
            //     wherecond = ` where categ_prod='${req.query.tip}'`



            client.query(sql_query, function( err, rez){
                console.log(300)
                if(err){
                    console.log(err);
                    console.log(" EROARE");
                    Afis_Eroare(res, 2);
                }
                else{
                    // console.log(rez);
                    rez.rows.forEach(function (element) {
                        const days = ["Duminică", "Luni", "Marți", "Miercuri", "Joi", "Vineri", "Sâmbătă"];
                        const months = ["Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie", "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"];
                        let zi = days[element.data_adaugare.getDay()]
                                + ", " + element.data_adaugare.getDate() 
                                + "-" + months[element.data_adaugare.getMonth()]
                                + "-" + element.data_adaugare.getFullYear();
                        element.data_adaugare=zi;
                    }, this);

                    res.render("pagini/produseServer", {produse:rez.rows, optiuni:rezCategorie.rows});
                }  
            });
        }) 




        // oracledb.getConnection(connectionProperties, function (err, connection) {
        //     if (err) {
        //         console.error(err.message);
        //         res.status(500).send("Error connecting to DB");
        //         return;
        //     }

        //     console.log("After connection post",fields.etapa);


        //     var sql_query = "with aux as (\
        //         select unique liga.nume, nr_etapa, cod_meci, ziua, cod_echipa_acasa, nr_goluri_acasa, nr_goluri_deplasare, cod_echipa_deplasare\
        //         from club join istoric_club using(cod_club) join liga using(cod_liga) join meci on(cod_club=cod_echipa_acasa or cod_club=cod_echipa_deplasare)\
        //         where end_date > to_date('1-JAN-2023') and end_date < to_date('1-JAN-2024') and tip_competitie='liga' \
        //     ) \
        //     select cod_meci, ziua, cod_echipa_acasa \"ACASA\", nr_goluri_acasa || '-' || nr_goluri_deplasare \"SCOR\", cod_echipa_deplasare \"DEPLASARE\" \
        //     from aux\
        //     where nr_etapa=" + fields.etapa + "and nume=INITCAP('" + fields.liga + "')";
            
        //     console.log("\n\n"+sql_query+"\n\n");
        //     connection.execute(sql_query, {}, { outFormat: oracledb.OBJECT },
        //         function (error, result) {
        //             if (error) {
        //                 console.error(error.message);
        //                 res.status(500).send("Error getting data from DB");
        //                 doRelease(connection);
        //                 return;
        //             }
        //             console.log(result);
        //             var rezsql = [];

        //             result.rows.forEach(function (element) {
        //                 const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        //                 const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        //                 let zi = days[element.ZIUA.getDay()]
        //                         + ", " + element.ZIUA.getDate() 
        //                         + " " + months[element.ZIUA.getMonth()]
        //                         + " " + element.ZIUA.getFullYear();
        //                 rezsql.push({
                            
        //                     Ziua: zi,
        //                     Acasa: element.ACASA,
        //                     Scor: element.SCOR,
        //                     Deplasare: element.DEPLASARE
        //                 });

        //             }, this);

        //             doRelease(connection);
                    
        //             console.log("Got rezsql data"); console.log(rezsql);

        //             res.render("html/stats", { ui_meci: rezsql, ui_puncte: [], ui_goluri: [], ui_viz: [] });
        //         });
            
                
        // });
    });
});






app.get("/jucarii",function(req,res){
    client.query("select * from unnest(enum_range(null::tag_special))",function(err, rezCategorie){
        console.log(req.query);
        let wherecond="";
        if(req.query.tip)
            wherecond = ` where categ_prod='${req.query.tip}'`
        client.query("select * from jucarii"+wherecond , function( err, rez){
            console.log(300)
            if(err){
                console.log(err);
                console.log(" EROARE");
                Afis_Eroare(res, 2);
            }
            else{
                // console.log(rez);
                function addZero(i) {
                    if (i < 10) {i = "0" + i}
                    return i;
                  }
                  
                rez.rows.forEach(function (element) {
                    const days = ["Duminică", "Luni", "Marți", "Miercuri", "Joi", "Vineri", "Sâmbătă"];
                    const months = ["Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie", "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"];
                    
                    let h = addZero(element.data_adaugare.getHours());
                    let m = addZero(element.data_adaugare.getMinutes());
                    let s = addZero(element.data_adaugare.getSeconds());
                    let time = h + ":" + m + ":" + s;
                    let zi = days[element.data_adaugare.getDay()]
                            + "(" + element.data_adaugare.getDate() 
                            + "/" + element.data_adaugare.getMonth()
                            + "/" + element.data_adaugare.getFullYear()
                            + ", " + time
                            + ")";
                    element.data_adaugare=zi;

                    // element.culori.sort(function (a,b){
                    //     return a.length-b.length;
                    // });

                }, this);



                res.render("pagini/jucarii", {produse:rez.rows, optiuni:rezCategorie.rows});
            }  
        });
    }) 
});

















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
        
        
    }
    d=new Date();
    console.log(d.getHours,"   ",d.getMinutes);
    var timeFiltered = vImagini.filter(function(imgg){
        
        return (d.getHours()>Number(imgg.timp.substr(0,2)) && d.getHours()<Number(imgg.timp.substr(6,2)))    ||  
            (d.getHours()==Number(imgg.timp.substr(0,2)) && d.getHours()<Number(imgg.timp.substr(6,2)) && d.getMinutes()>=Number(imgg.timp.substr(3,2)))   ||
            (d.getHours()==Number(imgg.timp.substr(6,2)) && d.getHours()>Number(imgg.timp.substr(0,2)) && d.getMinutes()<=Number(imgg.timp.substr(9,2)))
    })

    for(let imgg of timeFiltered)
        console.log("CALE IMAGINE:   "+imgg.cale_imagine+"\n");
    console.log("img in filtru ^^\n");
    obGlobal.obImaginiFiltered=JSON.parse(JSON.stringify(obGlobal.obImagini));
    obGlobal.obImaginiFiltered.imagini=timeFiltered;

    for(let imgg of obGlobal.obImaginiFiltered.imagini)
        console.log("CALE IMAGINE:   "+imgg.cale_imagine+"\n");
    console.log("img filtrate ^^\n");
    for(let imgg of obGlobal.obImagini.imagini)
        console.log("CALE IMAGINE:   "+imgg.cale_imagine+"\n");

    console.log("\n"+obGlobal.obImagini.cale_galerie+"\n\n");
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