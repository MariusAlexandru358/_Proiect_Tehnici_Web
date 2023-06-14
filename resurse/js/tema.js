
// localStorage.setItem("tema","light");
let tema = localStorage.getItem("tema");
if (tema)
    document.body.classList.add(tema);

function SetTheme() {
    let radiobuttons = document.getElementsByName("gr_tema");
    let val_tema;
    for (let r of radiobuttons) {
        if (r.checked) {
            val_tema = r.value;
            break;
        }
    }
    if(!val_tema){
        val_tema="light";
    }
    if(val_tema=="light"){
        document.body.classList.add("light");
        document.body.classList.remove("dark");
        document.body.classList.remove("focus");
        localStorage.setItem("tema","light");
    }
    if(val_tema=="dark"){
        document.body.classList.add("dark");
        document.body.classList.remove("light");
        document.body.classList.remove("focus");
        localStorage.setItem("tema","dark");
    }
    if(val_tema=="focus"){
        document.body.classList.add("focus");
        document.body.classList.remove("dark");
        document.body.classList.remove("light");
        localStorage.setItem("tema","focus");
    }


}

window.addEventListener("DOMContentLoaded", function () {

    let radiobuttons = document.getElementsByName("gr_tema");
    let val_tema;
    for (let r of radiobuttons) {
        if (r.checked) {
            val_tema = r.value;
            break;
        }
    }

    if(val_tema=="light"){
        document.body.classList.remove("dark");
        document.body.classList.remove("focus");
        localStorage.setItem("tema","light");
    }
    if(val_tema=="dark"){
        document.body.classList.remove("light");
        document.body.classList.remove("focus");
        localStorage.setItem("tema","dark");
    }
    if(val_tema=="focus"){
        document.body.classList.remove("dark");
        document.body.classList.remove("light");
        localStorage.setItem("tema","focus");
    }

    // let radiobuttons = document.getElementsByName("gr_tema");
    // let val_tema;
    // for (let r of radiobuttons) {
    //     if (r.checked) {
    //         val_tema = r.value;
    //         break;
    //     }
    // }



    // document.getElementById("tema").onclick = function () {
    //     if (document.body.classList.contains("dark")) {
    //         document.body.classList.remove("dark")
    //         localStorage.removeItem("tema");
    //     }
    //     else {
    //         document.body.classList.add("dark")
    //         localStorage.setItem("tema", "dark");
    //     }
    // }
});




