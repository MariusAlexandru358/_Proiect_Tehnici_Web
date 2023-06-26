window.addEventListener("load",function() {

    document.getElementById("inp-dimensiune").onchange=function(){
        document.getElementById("info-range").innerHTML=`(${this.value})`
    }

    
    function Paginare(k,n,page){
        let produse = document.getElementsByClassName("paginare");
        let crt=0;
        for(let prod of produse){
            if(crt>=(page-1)*k && crt<=page*k-1){
                prod.style.display="grid";
            }
            else{
                prod.style.display="none";
            }
            crt++;
        }
        let links=document.getElementsByClassName("pagelink");
        if(links) {
            let ll=links.length;
            for(let i=1;i<=ll;i++){
                links[0].remove();
            }
        }
        for(let i=0;i<crt/k;i++){
            var button = document.createElement("button");
            button.classList.add("pagelink");
            button.classList.add("btn");
            button.classList.add("btn-secondary");
            button.innerHTML=i+1;
            button.id="buton-paginare-"+i;
            button.onclick=function(){
                Paginare(k,crt,i+1);
            }
            document.getElementById("divpagelink").appendChild(button);
            // var brneeded = document.createElement("br");
            // document.getElementById("divpagelink").appendChild(brneeded);
        }
    }

    // document.getElementsByClassName("pagelink").onclick=function(){
    //     let produse = document.getElementsByClassName("paginare");
    //     Paginare(4,produse.length,Number(this.innerHTML));
    // }

    document.getElementById("filtrare").onclick= function(){
        let avemproduse=0;

        let val_nume=document.getElementById("inp-nume").value.toLowerCase();
        val_nume=val_nume.replace(/ă/g, "a");
        val_nume=val_nume.replace(/î/g, "i");
        val_nume=val_nume.replace(/â/g, "a");
        val_nume=val_nume.replace(/ș/g, "s");
        val_nume=val_nume.replace(/ț/g, "t");


        let radiobuttons=document.getElementsByName("gr_rad");
        let val_tag;
        for(let r of radiobuttons){
            if(r.checked){
                val_tag=r.value;
                break;
            }
            
        }

        

        // let val_pret=document.getElementById("inp-pret").value;
        let val_pret=Array.from(document.querySelectorAll("#inp-pret :checked")).reduce(function(t, s) { return t + s.value + " "  }, "")
        // let val_pret=document.querySelectorAll("#inp-pret :checked").value;
        var vlp=[], vup=[];
        for(let p of val_pret.split(" ")){
            var lp, up;
            if(p){
                if(p!="oricare")
                {
                    [lp, up]=p.split("-");
                    lp=parseFloat(lp);
                    up=parseFloat(up);
                    vlp.push(lp);
                    vup.push(up);
                }
                else{
                    val_pret=p;
                    break;
                }
            }
        }
        // var lp, up;
        // if(val_pret!="oricare")
        // {
        //     [lp, up]=val_pret.split("-");
        //     lp=parseFloat(lp);
        //     up=parseFloat(up);
        // }



        let val_descriere = document.getElementById("inp-descriere").value.toLowerCase();
        let keywords;
        let c4;
        if(val_descriere){
            keywords = val_descriere.split(" ");
            c4=true;
        }
        else{
            c4=false;
        }
        if(keywords){ for(let kw of keywords){
            kw=kw.replace(/ă/g, "a");
            kw=kw.replace(/î/g, "i");
            kw=kw.replace(/â/g, "a");
            kw=kw.replace(/ș/g, "s");
            kw=kw.replace(/ț/g, "t");
        }}

        let val_garantie;
        let checkbox = document.getElementById("inp-garantie");
        if(checkbox.checked){
            val_garantie=checkbox.value; 
        }

        let val_material=document.getElementById("inp-material").value;

        let val_culoare=document.getElementById("inp-culoare").value.toLowerCase();
        val_culoare=val_culoare.replace(/ă/g, "a");
        val_culoare=val_culoare.replace(/î/g, "i");
        val_culoare=val_culoare.replace(/â/g, "a");
        val_culoare=val_culoare.replace(/ș/g, "s");
        val_culoare=val_culoare.replace(/ț/g, "t");

        let val_dimensiune=document.getElementById("inp-dimensiune").value;




        var produse=document.getElementsByClassName("produs");

        for (let prod of produse){
            prod.style.display="none";
            let nume=prod.getElementsByClassName("val-nume")[0].innerHTML.toLowerCase();
            let cond1= (nume.includes(val_nume));

            // let baterie=prod.getElementsByClassName("val-baterie")[0].innerHTML;
            // // console.log(baterie); console.log(" BATERIE")
            // let cond2= (val_baterie=="toate" || val_baterie==baterie);

            let tag=prod.getElementsByClassName("val-tag")[0].innerHTML;
            let cond2= (val_tag=="toate" || val_tag==tag);

            let pret=parseFloat(prod.getElementsByClassName("val-pret")[0].innerHTML);
            let oklu=false;
            for(let i=0;i<vlp.length;i++){
                if(pret>=vlp[i] && pret<=vup[i]){
                    oklu=true;
                }
            }
            let cond3= (val_pret=="oricare" || (oklu));

            let descriere=prod.getElementsByClassName("val-descriere")[0].innerHTML.toLowerCase();
            let okp=0;  let okn=1;
            if(c4){
                for(kw of keywords){
                    if(kw[0]=='+'){
                        if(descriere.match(kw.substring(1)))
                            okp=1;
                    }
                    if(kw[0]=='-'){
                        if(descriere.match(kw.substring(1)))
                            okn=0;
                    }
                }
            }
            let cond4= (!c4 || (okp==1 && okn==1));


            let garantie=prod.getElementsByClassName("val-garantie")[0].innerHTML;
            let cond5= (!val_garantie || val_garantie==garantie);
            // let categorie=prod.getElementsByClassName("val-categorie")[0].innerHTML;
            // let cond4= ( val_categ=="toate" ||  val_categ==categorie)

            let material=prod.getElementsByClassName("val-material")[0].innerHTML;
            let cond6= (val_material=="oricare" || val_material==material);


            let culori_posibile=prod.getElementsByClassName("val-culori")[0].innerHTML.toLowerCase();
            let okcul=false;
            if(val_culoare=="oricare"){
                okcul=true;
            }
            else{
                for(let cul of culori_posibile.split(",")){
                    if(val_culoare==cul){
                        okcul=true;
                        break;
                    }
                }
            }
            let cond7=(!val_culoare || okcul);


            let dimensiune = Math.floor(prod.getElementsByClassName("val-dimensiune")[0].innerHTML);
            let cond8 = (!val_dimensiune || val_dimensiune >= dimensiune);


            if(cond1 && cond2 && cond3 && cond4 && cond5 && cond6 && cond7 && cond8){
                // prod.style.display="grid";
                prod.classList.add("paginare");
                avemproduse++;
            }
            else{
                prod.classList.remove("paginare");
            }
        }

        if(!avemproduse){
            let myp = document.createElement("p");
            myp.innerHTML="Niciun produs din stocul disponibil la acest moment nu corespunde filtrelor aplicate."
            myp.id="zeroproduse";
            document.getElementById("produse").appendChild(myp);
        }
        else{
            myp=document.getElementById("zeroproduse");
            if(myp){
                myp.remove();
            }
            Paginare(4,document.getElementsByClassName("produs").length,1);
        }
    }




    document.getElementById("resetare").onclick= function(){

        document.getElementById("inp-nume").value="";
        document.getElementById("i_rad6").checked=true;

        // document.getElementById("inp-pret").value=document.getElementById("inp-pret").min;

        // document.getElementById("infoRange").innerHTML=`(10)`;

        var options = document.getElementById("inp-pret").options;
        for (var i=0, iLen=options.length; i<iLen; i++) {
            if (options[i].defaultSelected) {
                document.getElementById("inp-pret").selectedIndex = i;
                break;
            }
        }   
        options = document.getElementById("inp-material").options;
        for (var i=0, iLen=options.length; i<iLen; i++) {
            if (options[i].defaultSelected) {
                document.getElementById("inp-material").selectedIndex = i;
                break;
            }
        } 
        document.getElementById("inp-culoare").value="";

        document.getElementById("inp-dimensiune").value=50;
        document.getElementById("info-range").innerHTML=`(${this.value})`

        document.getElementById("inp-descriere").value="";
        document.getElementById("inp-garantie").checked=false;


        // document.getElementById("inp-categorie").value="toate";
        // var produse=document.getElementsByClassName("produs");
        // document.getElementById("infoRange").innerHTML="(0)";
        // for (let prod of produse){
        //     prod.style.display="block";
        // }
    }
    function sortareHC (semn){
        var produse=document.getElementsByClassName("paginare");
        var v_produse= Array.from(produse);
        v_produse.sort(function (a,b){
            let pret_a=parseFloat(a.getElementsByClassName("val-pret")[0].innerHTML);
            let pret_b=parseFloat(b.getElementsByClassName("val-pret")[0].innerHTML);
            if(pret_a==pret_b){
                let nume_a=a.getElementsByClassName("val-nume")[0].innerHTML;
                let nume_b=b.getElementsByClassName("val-nume")[0].innerHTML;
                return semn*nume_a.localeCompare(nume_b);
            }
            return semn*(pret_a-pret_b);
        });
        for(let prod of v_produse){
            prod.parentElement.appendChild(prod);
        }
        Paginare(4,v_produse.length,1);
    }
    document.getElementById("sortCrescNume").onclick=function(){
        sortareHC(1);
    }
    document.getElementById("sortDescrescNume").onclick=function(){
        sortareHC(-1);
    }
    function sortareCustom (semn,field1,field2,field3){
        var produse=document.getElementsByClassName("paginare");
        var v_produse= Array.from(produse);
        v_produse.sort(function (a,b){
            if(!field1){return 0;}
            let f1_a=a.getElementsByClassName("val-"+field1)[0].innerHTML;
            let f1_b=b.getElementsByClassName("val-"+field1)[0].innerHTML;
            
            if(f1_a==f1_b){
                if(!field2){return semn;}else{
                    let f2_a=a.getElementsByClassName("val-"+field2)[0].innerHTML;
                    let f2_b=b.getElementsByClassName("val-"+field2)[0].innerHTML;
                    if(f2_a==f2_b){
                        if(!field3){return semn;}else{
                            let f3_a=a.getElementsByClassName("val-"+field2)[0].innerHTML;
                            let f3_b=b.getElementsByClassName("val-"+field2)[0].innerHTML;
                            return semn*f3_a.localeCompare(f3_b);
                        }
                    }   
                    return semn*f2_a.localeCompare(f2_b);
                }
            }
            let test = f1_a.localeCompare(f1_b);
            return semn*f1_a.localeCompare(f1_b);
        });
        for(let prod of v_produse){
            prod.parentElement.appendChild(prod);
        }
        Paginare(4,v_produse.length,1);
    }
    document.getElementById("sortCustom").onclick=function(){
        let ordine = document.getElementById("ordine-sortare").value;
        let sgn = 1;
        if(ordine=="descrescator"){
            sgn=-1;
        }

        let vfields = Array.from(document.querySelectorAll("#campuri-sortare :checked")).reduce(function(t, s) { return t + s.value + " "  }, "")
        let varg=[null, null, null];
        let i=0;
        for(let f of vfields.split(" ")){
            varg[i]=f;
            i++;
        }
        
        sortareCustom(sgn,varg[0],varg[1],varg[2]);
    }


   
    
    document.getElementById("average").onclick=function(){
        var produse = document.getElementsByClassName("produs");
        var sum=0;
        var k=0;
        for(let prod of produse){
            if(prod.style.display=="grid" || !prod.style.display){
                sum+=Number(prod.getElementsByClassName("val-pret")[0].innerHTML.split(" ")[0]);
                k++;
            }
        }
        var avg=(sum/k).toFixed(2);

        var d = document.createElement("div");
        d.innerHTML=" "+avg+" RON";
        // alert("Media prețurilor produselor este "+avg+" RON");
        document.getElementById("average").insertBefore(d, document.getElementById("insert-avg"));
        
        const delay = ms => new Promise(res => setTimeout(res, ms));
        const wait = async (t) => {
            await delay(t);
            d.remove();
        };

        wait(2000);
        // d.remove();
    }

    let produse = document.getElementsByClassName("produs")
    for(let prod of produse){
        prod.classList.add("paginare");
    }
    Paginare(4,produse.length,1)
});