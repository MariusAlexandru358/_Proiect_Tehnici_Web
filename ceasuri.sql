drop type categorie_produs;
drop type tag_special;
drop table ceasuri;

create type categorie_produs as enum('ceas_de_mana', 'ceas_desteptator', 'ceas_de_perete', 'ceas_digital');
create type tag_special as enum('pentru copii','editie limitata','oferta','comun','comanda speciala');

create table if not exists ceasuri(
	id serial primary key,
	nume VARCHAR(50) UNIQUE NOT NULL,
   	descriere TEXT,
	imagine VARCHAR(300),
	categ_prod categorie_produs,
	tag tag_special default 'comun',
	material varchar(10),
	tip_baterie varchar(10),
	culori_disponibile varchar [],
   	pret NUMERIC(8,2) NOT NULL,
	dimensiune numeric(5,2),
-- 	latime numeric(5,2),
-- 	inaltime numeric(5,2),
-- 	grosime numeric(4,2),
	data_adaugare TIMESTAMP DEFAULT current_timestamp,
	garantie boolean not null default true
);


insert into ceasuri(nume, descriere, imagine, categ_prod, tag, material, tip_baterie, culori_disponibile, pret, dimensiune) values 
('Ceas de masa desteptator R&B','De acum diminetile iti vor fi mult mai frumoase atunci cand alarma de trezire va fi declansata in stilul clasic de soneria acestui ceas desteptator R&B. Ziua, atunci cand razele soarelui vor patrunde prin fereastra ta, acest ceas dragut va da culoare si viata camerei tale intr-un mod placut.',
 'alarm-clock_01.jpg','ceas_desteptator','comun','metal','AA', '{"negru","rosu","albastru"}',59.99,15),
('Ceas de masa desteptator Vanilla','De acum diminetile iti vor fi mult mai frumoase atunci cand alarma de trezire va fi declansata in stilul clasic de soneria acestui ceas desteptator Vanilla. Ziua, atunci cand razele soarelui vor patrunde prin fereastra ta, acest ceas dragut va da culoare si viata camerei tale intr-un mod placut.',
 'alarm-clock_04.jpg','ceas_desteptator','comun','metal','AA', '{"alb","gri","verde","violet","galben"}',54.99,15),
('Ceas de masa desteptator RT-Gold','De acum diminetile iti vor fi mult mai frumoase atunci cand alarma de trezire va fi declansata in stilul clasic de soneria acestui ceas desteptator RT-Gold. Ziua, atunci cand razele soarelui vor patrunde prin fereastra ta, acest ceas dragut va da culoare si viata camerei tale intr-un mod placut.',
 'alarm-clock_09.png','ceas_desteptator','comun','metal','AA', '{"gold","silver","albastru-regal"}',69.99,15),
('Set ceasuri desteptatoare retro','Un set perfect pentru o pensiune. Fiecare camera trebuie sa aiba printre multe altele si un ceas, atat pentru a construi o atmosfera relaxanta, cat si pentru utilitate practica. Acest set contine 14 ceasuri, cu design retro, ce vor oferi camerelor pentru oaspeti exact ce au nevoie.',
 'alarm-clock_set.png','ceas_desteptator','oferta','metal','AA', '{"maro"}',729.99,15),
('Ceas de masa desteptator KidsLTE','Ceas simplu monocromatic, de dimensiune mica, pentru copii',
 'kids-clock_03.jpg','ceas_desteptator','pentru copii','plastic','AA', '{"albastru","rosu","negru"}',34.99,15), 
 
('Ceas de perete Ingraham','Ceasul de perete Ingraham are o ramă din lemn masiv, frezat, de culoare maro, în care este fixat un cadran alb, cu margine argintie. Ceasul rotund cu un diametru de 300 mm este acționat de un mecanism cu cuarț (baterie) cu funcționare lină, iar ora este afișată cu douăsprezece cifre arabe distincte. Minutele individuale sunt, de asemenea, marcate pe cadran cu indici mai mici, ceea ce contribuie la o citire excelentă a timpului chiar și de la o distanță mai mare.',
 'clock_wall_02.png','ceas_de_perete','comun','lemn','AA', '{"culoare-deschisa","culoare-inchisa"}',279.99,50),
('Ceas de perete ModernClock','Produsul este un ceas de perete al carui design captiveaza pe oricine se uita la el. Ceasul are un cadran clar. Se potriveste perfect in orice interior, nu este doar un ceas, ci un element decorativ potrivit pentru sufragerie sau birou.',
 'clock_wall_01.png','ceas_de_perete','comun','metal','AA', '{"negru","indigo","bej"}',99.99,50),
 
('Ceas de mana HW5D3','Un cadran clasic, finisat elegant este un raspuns la tendintele actuale. O curea durabila din piele. Confortabil de utilizat si arata foarte elegant. Cadranele suplimentare mai mici, pe langa un aspect atractiv, adauga functionalitate ceasului, permitand masurarea precisa a timpului, de exemplu in timpul activitatii fizice.',
 'handwatch_01.jpg','ceas_de_mana','comun','piele','LR44', '{"verde","galben-imperial","indigo"}',289.99,20),
('Ceas de mana ML-Automatic','Fabricat in Elvetia, cu un cadran clasic, finisat elegant si o curea durabila din piele naturala. Este confortabil de utilizat si arata foarte elegant, potrivit pentru un om de succes.',
 'handwatch_02.jpg','ceas_de_mana','comun','piele','LR44', '{"maro","indigo","negru"}',259.99,20),
('Ceas de mana Polex-GMT','Cu un contur ros-albastru vine viitorul cel mai popular ceas Polex. Cadranul acestuia are dimensiuni mai mari decat modelul anterior si acopera intervalul 0-24',
 'handwatch_06.jpg','ceas_de_mana','editie limitata','metal','LR44','{"argintiu","auriu","verde-lime"}',559.99,20),
('Ceas de mana Rider','Gandit cu un model simplu, cadran clasic, finisat elegant si o curea durabila din piele. Este confortabil de utilizat si arata foarte elegant, potrivit pentru un om de succes.',
 'handwatch_07.png','ceas_de_mana','comun','piele','LR44', '{"maro"}',179.99,20);
 
insert into ceasuri(nume, descriere, imagine, categ_prod, tag, material, tip_baterie, culori_disponibile, pret, dimensiune) values 
('Ceas digital simplu','descriere ceas digital cu display simplu',
 'digital-clock_01.jpg','ceas_digital','comun','metal','AA','{"negru","argintiu"}',79.99,15);

update ceasuri
set garantie=false
where tag=='pentru copii';

update ceasuri
set culori_disponibile= '{"argintiu","auriu","verde-lime"}'
where id=10;

update ceasuri
set imagine='handwatch_07.png'
where id=11;


select * from ceasuri
order by id asc, pret asc;

select distinct material from ceasuri;


select * from ceasuri where ((pret>=10 and pret<=90) or ((pret>=91 and pret<=279) or 1=0) and dimensiune<=50 and id>=0;