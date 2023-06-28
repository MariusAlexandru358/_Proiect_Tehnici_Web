
/**
 @typedef Drepturi
 @type {Object}
 @property {Symbol} vizualizareUtilizatori Dreptul de a intra pe  pagina cu tabelul de utilizatori.
 @property {Symbol} stergereUtilizatori Dreptul de a sterge un utilizator
 @property {Symbol} cumparareProduse Dreptul de a cumpara

 @property {Symbol} vizualizareGrafice Dreptul de a vizualiza graficele de vanzari
 
 @property	{Symbol} adaugareProduse Dreptul de a adauga produse 
 @property	{Symbol} plasareComenziSpeciale Dreptul de a plasa comenzi speciale, personalizate. 
 @property	{Symbol} managementFiliale Dreptul de a edita paginile filialelor
 */


/**
 * @name module.exports.Drepturi
 * @type Drepturi
 */
const Drepturi = {
	vizualizareUtilizatori: Symbol("vizualizareUtilizatori"),
	stergereUtilizatori: Symbol("stergereUtilizatori"),
	cumparareProduse: Symbol("cumparareProduse"),
	vizualizareGrafice: Symbol("vizualizareGrafice"),
	adaugareProduse: Symbol("adaugareProduse"),
	plasareComenziSpeciale: Symbol("plasareComenziSpeciale"),
	managementFiliale: Symbol("managementFiliale")
}

module.exports=Drepturi;