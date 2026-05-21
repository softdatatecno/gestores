import { useState } from "react";

const COLOMBIA = {
  "AMAZONAS":["LETICIA","PUERTO NARIÑO"],
  "ANTIOQUIA":["MEDELLÍN","BELLO","ITAGÜÍ","ENVIGADO","RIONEGRO","APARTADÓ","TURBO","CAUCASIA","YARUMAL","SANTA FE DE ANTIOQUIA"],
  "ARAUCA":["ARAUCA","SARAVENA","TAME","FORTUL"],
  "ATLÁNTICO":["BARRANQUILLA","SOLEDAD","MALAMBO","SABANALARGA","GALAPA"],
  "BOGOTÁ D.C.":["BOGOTÁ"],
  "BOLÍVAR":["CARTAGENA","MAGANGUÉ","MOMPOX","TURBACO","EL CARMEN DE BOLÍVAR"],
  "BOYACÁ":["TUNJA","DUITAMA","SOGAMOSO","CHIQUINQUIRÁ","PAIPA"],
  "CALDAS":["MANIZALES","VILLAMARÍA","LA DORADA","RIOSUCIO","SALAMINA"],
  "CAQUETÁ":["FLORENCIA","SAN VICENTE DEL CAGUÁN","PUERTO RICO"],
  "CASANARE":["YOPAL","AGUAZUL","VILLANUEVA","PAZ DE ARIPORO"],
  "CAUCA":["POPAYÁN","SANTANDER DE QUILICHAO","PATÍA","MIRANDA"],
  "CESAR":["VALLEDUPAR","AGUACHICA","BOSCONIA","LA PAZ"],
  "CHOCÓ":["QUIBDÓ","ISTMINA","RIOSUCIO","BAGADÓ"],
  "CÓRDOBA":["MONTERÍA","LORICA","SAHAGÚN","MONTELÍBANO","CERETÉ"],
  "CUNDINAMARCA":["SOACHA","FACATATIVÁ","ZIPAQUIRÁ","FUSAGASUGÁ","CHÍA","CAJICÁ","MOSQUERA","MADRID","GIRARDOT"],
  "GUAINÍA":["INÍRIDA"],
  "GUAVIARE":["SAN JOSÉ DEL GUAVIARE"],
  "HUILA":["NEIVA","PITALITO","GARZÓN","LA PLATA","CAMPOALEGRE"],
  "LA GUAJIRA":["RIOHACHA","MAICAO","URIBIA","FONSECA"],
  "MAGDALENA":["SANTA MARTA","CIÉNAGA","FUNDACIÓN","PLATO"],
  "META":["VILLAVICENCIO","ACACÍAS","GRANADA","PUERTO LÓPEZ"],
  "NARIÑO":["PASTO","TUMACO","IPIALES","TÚQUERRES"],
  "NORTE DE SANTANDER":["CÚCUTA","OCAÑA","PAMPLONA","VILLA DEL ROSARIO"],
  "PUTUMAYO":["MOCOA","PUERTO ASÍS","ORITO"],
  "QUINDÍO":["ARMENIA","CALARCÁ","MONTENEGRO","QUIMBAYA"],
  "RISARALDA":["PEREIRA","DOSQUEBRADAS","SANTA ROSA DE CABAL","LA VIRGINIA"],
  "SAN ANDRÉS":["SAN ANDRÉS","PROVIDENCIA"],
  "SANTANDER":["BUCARAMANGA","FLORIDABLANCA","GIRÓN","PIEDECUESTA","BARRANCABERMEJA"],
  "SUCRE":["SINCELEJO","COROZAL","SAMPUÉS","TOLÚ"],
  "TOLIMA":["IBAGUÉ","ESPINAL","MELGAR","CHAPARRAL","HONDA"],
  "VALLE DEL CAUCA":["CALI","PALMIRA","BUENAVENTURA","TULUÁ","BUGA","CARTAGO"],
  "VAUPÉS":["MITÚ"],
  "VICHADA":["PUERTO CARREÑO"],
};

const DOC_TYPES = ["CC","NIT","CE","PASAPORTE","RC","TI"];

const AV_COLORS = [
  ["#dceaf5","#1a3f60"],["#d8eedd","#1a3d28"],["#e8d8f0","#2e1a50"],
  ["#f5e8d0","#4a2e10"],["#d8eded","#1a3d3d"],["#ededd8","#3d3d1a"],
  ["#ddd8f0","#24185a"],["#d8eee4","#1a3d30"],
];
const avColor = n => AV_COLORS[(n?.charCodeAt(0)||0) % AV_COLORS.length];
const up  = v => (v||"").toUpperCase();
const low = v => (v||"").toLowerCase();

function completeness(c) {
  const esNit = c.tipoDoc === "NIT";
  const always = ["tipoDoc","numDoc","primerNombre","celular","departamento","ciudad","direccion","email"];
  const personales = esNit ? ["digitoVerificacion"] : ["primerApellido"];
  const fields = [...always, ...personales];
  const pending = fields.filter(f => !c[f]).length;
  return { allFilled: pending === 0, pending };
}

const SEED = [
  // ── CC completos ──────────────────────────────────────────────────────────
  {id:1,  tipoDoc:"CC",       numDoc:"1023456789",  digitoVerificacion:"", primerNombre:"CARLOS",          segundoNombre:"ANDRÉS",   primerApellido:"RAMÍREZ",    segundoApellido:"GÓMEZ",    celular:"3101234567", departamento:"ANTIOQUIA",       ciudad:"MEDELLÍN",     direccion:"CLL 45 # 32-10",         email:"carlos.ramirez@email.com",       nombreCompleto:"CARLOS ANDRÉS RAMÍREZ GÓMEZ"},
  {id:2,  tipoDoc:"CC",       numDoc:"1034567890",  digitoVerificacion:"", primerNombre:"MARÍA",           segundoNombre:"ISABEL",   primerApellido:"TORRES",     segundoApellido:"LÓPEZ",    celular:"3119876543", departamento:"BOGOTÁ D.C.",     ciudad:"BOGOTÁ",       direccion:"KR 15 # 80-22",          email:"maria.torres@email.com",         nombreCompleto:"MARÍA ISABEL TORRES LÓPEZ"},
  {id:3,  tipoDoc:"CC",       numDoc:"1045678901",  digitoVerificacion:"", primerNombre:"JUAN",            segundoNombre:"PABLO",    primerApellido:"HERRERA",    segundoApellido:"MUÑOZ",    celular:"3204567890", departamento:"VALLE DEL CAUCA", ciudad:"CALI",         direccion:"AV 6N # 23-45",          email:"juan.herrera@email.com",         nombreCompleto:"JUAN PABLO HERRERA MUÑOZ"},
  {id:5,  tipoDoc:"CC",       numDoc:"1056789012",  digitoVerificacion:"", primerNombre:"PEDRO",           segundoNombre:"LUIS",     primerApellido:"MORENO",     segundoApellido:"VARGAS",   celular:"3187654321", departamento:"ATLÁNTICO",       ciudad:"BARRANQUILLA", direccion:"CLL 72 # 45-12",         email:"pedro.moreno@email.com",         nombreCompleto:"PEDRO LUIS MORENO VARGAS"},
  {id:7,  tipoDoc:"CC",       numDoc:"1067890123",  digitoVerificacion:"", primerNombre:"SANTIAGO",        segundoNombre:"FELIPE",   primerApellido:"MENDOZA",    segundoApellido:"ORTIZ",    celular:"3223456789", departamento:"RISARALDA",       ciudad:"PEREIRA",      direccion:"KR 8 # 20-15",           email:"santiago.mendoza@email.com",     nombreCompleto:"SANTIAGO FELIPE MENDOZA ORTIZ"},
  {id:10, tipoDoc:"CC",       numDoc:"1089012345",  digitoVerificacion:"", primerNombre:"GABRIELA",        segundoNombre:"PAOLA",    primerApellido:"RINCÓN",     segundoApellido:"MORA",     celular:"3174567890", departamento:"HUILA",           ciudad:"NEIVA",        direccion:"AV CIRCUNVALAR # 10-05", email:"gabriela.rincon@email.com",      nombreCompleto:"GABRIELA PAOLA RINCÓN MORA"},
  {id:11, tipoDoc:"CC",       numDoc:"1090123456",  digitoVerificacion:"", primerNombre:"FELIPE",          segundoNombre:"ANDRÉS",   primerApellido:"OSPINA",     segundoApellido:"BEDOYA",   celular:"3142345678", departamento:"ANTIOQUIA",       ciudad:"ENVIGADO",     direccion:"CLL 30 SUR # 48-20",     email:"felipe.ospina@email.com",        nombreCompleto:"FELIPE ANDRÉS OSPINA BEDOYA"},
  {id:13, tipoDoc:"CC",       numDoc:"1012345678",  digitoVerificacion:"", primerNombre:"ROBERTO",         segundoNombre:"CARLOS",   primerApellido:"GUZMÁN",     segundoApellido:"PEREIRA",  celular:"3209876543", departamento:"TOLIMA",          ciudad:"IBAGUÉ",       direccion:"CLL 14 # 5-32",          email:"roberto.guzman@email.com",       nombreCompleto:"ROBERTO CARLOS GUZMÁN PEREIRA"},
  {id:14, tipoDoc:"CC",       numDoc:"1013456789",  digitoVerificacion:"", primerNombre:"NATALIA",         segundoNombre:"CRISTINA", primerApellido:"PEÑA",       segundoApellido:"ACOSTA",   celular:"3183456789", departamento:"BOYACÁ",          ciudad:"TUNJA",        direccion:"CLL 22 # 10-15",         email:"natalia.pena@email.com",         nombreCompleto:"NATALIA CRISTINA PEÑA ACOSTA"},
  {id:16, tipoDoc:"CC",       numDoc:"1014567890",  digitoVerificacion:"", primerNombre:"CAMILA",          segundoNombre:"ANDREA",   primerApellido:"VARGAS",     segundoApellido:"SUÁREZ",   celular:"3156789012", departamento:"CUNDINAMARCA",    ciudad:"ZIPAQUIRÁ",    direccion:"CLL 8 # 3-20",           email:"camila.vargas@email.com",        nombreCompleto:"CAMILA ANDREA VARGAS SUÁREZ"},
  {id:18, tipoDoc:"CC",       numDoc:"1015678901",  digitoVerificacion:"", primerNombre:"JAVIER",          segundoNombre:"MAURICIO", primerApellido:"SALCEDO",    segundoApellido:"FUENTES",  celular:"3221234567", departamento:"VALLE DEL CAUCA", ciudad:"PALMIRA",      direccion:"AV LAS AMÉRICAS # 5-40", email:"javier.salcedo@email.com",       nombreCompleto:"JAVIER MAURICIO SALCEDO FUENTES"},
  {id:26, tipoDoc:"CC",       numDoc:"1101234567",  digitoVerificacion:"", primerNombre:"DIANA",           segundoNombre:"CAROLINA", primerApellido:"RUEDA",      segundoApellido:"SIERRA",   celular:"3114567890", departamento:"BOGOTÁ D.C.",     ciudad:"BOGOTÁ",       direccion:"AV CHILE # 82-70",       email:"diana.rueda@email.com",          nombreCompleto:"DIANA CAROLINA RUEDA SIERRA"},
  {id:27, tipoDoc:"CC",       numDoc:"1112345678",  digitoVerificacion:"", primerNombre:"ANDRÉS",          segundoNombre:"MAURICIO", primerApellido:"LONDOÑO",    segundoApellido:"VILLA",    celular:"3125678901", departamento:"ANTIOQUIA",       ciudad:"RIONEGRO",     direccion:"CLL 50 # 45-20",         email:"andres.londono@email.com",       nombreCompleto:"ANDRÉS MAURICIO LONDOÑO VILLA"},
  {id:28, tipoDoc:"CC",       numDoc:"1123456789",  digitoVerificacion:"", primerNombre:"LUCIA",           segundoNombre:"FERNANDA", primerApellido:"ARBELÁEZ",   segundoApellido:"MAYA",     celular:"3136789012", departamento:"CALDAS",          ciudad:"MANIZALES",    direccion:"KR 23 # 44-10",          email:"lucia.arbelaez@email.com",       nombreCompleto:"LUCIA FERNANDA ARBELÁEZ MAYA"},
  {id:29, tipoDoc:"CC",       numDoc:"1134567890",  digitoVerificacion:"", primerNombre:"MANUEL",          segundoNombre:"ALEJANDRO",primerApellido:"RÍOS",       segundoApellido:"CARDONA",  celular:"3147890123", departamento:"RISARALDA",       ciudad:"DOSQUEBRADAS", direccion:"CLL 15 # 12-30",         email:"manuel.rios@email.com",          nombreCompleto:"MANUEL ALEJANDRO RÍOS CARDONA"},
  {id:30, tipoDoc:"CC",       numDoc:"1145678901",  digitoVerificacion:"", primerNombre:"PAOLA",           segundoNombre:"ANDREA",   primerApellido:"SUÁREZ",     segundoApellido:"HENAO",    celular:"3158901234", departamento:"ANTIOQUIA",       ciudad:"BELLO",        direccion:"KR 48 # 20-15",          email:"paola.suarez@email.com",         nombreCompleto:"PAOLA ANDREA SUÁREZ HENAO"},
  {id:31, tipoDoc:"CC",       numDoc:"1156789012",  digitoVerificacion:"", primerNombre:"JORGE",           segundoNombre:"IVÁN",     primerApellido:"CASTAÑEDA",  segundoApellido:"MEJÍA",    celular:"3169012345", departamento:"BOGOTÁ D.C.",     ciudad:"BOGOTÁ",       direccion:"AV 68 # 22-45",          email:"jorge.castaneda@email.com",      nombreCompleto:"JORGE IVÁN CASTAÑEDA MEJÍA"},
  {id:32, tipoDoc:"CC",       numDoc:"1167890123",  digitoVerificacion:"", primerNombre:"VALERIA",         segundoNombre:"SOFÍA",    primerApellido:"MORA",       segundoApellido:"PINTO",    celular:"3170123456", departamento:"SANTANDER",       ciudad:"GIRÓN",        direccion:"CLL 45 # 38-22",         email:"valeria.mora@email.com",         nombreCompleto:"VALERIA SOFÍA MORA PINTO"},
  {id:33, tipoDoc:"CC",       numDoc:"1178901234",  digitoVerificacion:"", primerNombre:"SEBASTIÁN",       segundoNombre:"DAVID",    primerApellido:"FRANCO",     segundoApellido:"USECHE",   celular:"3181234567", departamento:"TOLIMA",          ciudad:"ESPINAL",      direccion:"KR 5 # 8-14",            email:"sebastian.franco@email.com",     nombreCompleto:"SEBASTIÁN DAVID FRANCO USECHE"},
  {id:34, tipoDoc:"CC",       numDoc:"1189012345",  digitoVerificacion:"", primerNombre:"CAROLINA",        segundoNombre:"LILIANA",  primerApellido:"PINEDA",     segundoApellido:"GUERRERO", celular:"3192345678", departamento:"NARIÑO",          ciudad:"IPIALES",      direccion:"CLL 7 # 4-20",           email:"carolina.pineda@email.com",      nombreCompleto:"CAROLINA LILIANA PINEDA GUERRERO"},
  {id:35, tipoDoc:"CC",       numDoc:"1190123456",  digitoVerificacion:"", primerNombre:"ALEJANDRO",       segundoNombre:"",         primerApellido:"CASTAÑO",    segundoApellido:"REYES",    celular:"3203456789", departamento:"VALLE DEL CAUCA", ciudad:"BUENAVENTURA", direccion:"AV SIMÓN BOLÍVAR # 3-10",email:"alejandro.castano@email.com",    nombreCompleto:"ALEJANDRO CASTAÑO REYES"},
  // ── NIT completos ─────────────────────────────────────────────────────────
  {id:4,  tipoDoc:"NIT",      numDoc:"900123456",   digitoVerificacion:"5",primerNombre:"TRANSPORTES BOGOTÁ SAS",  segundoNombre:"",primerApellido:"",           segundoApellido:"",         celular:"6017654321", departamento:"BOGOTÁ D.C.",     ciudad:"BOGOTÁ",       direccion:"AV EL DORADO # 68-50",   email:"info@transportesbogota.com",     nombreCompleto:"TRANSPORTES BOGOTÁ SAS"},
  {id:8,  tipoDoc:"NIT",      numDoc:"800456789",   digitoVerificacion:"3",primerNombre:"AUTOS DEL NORTE SAS",    segundoNombre:"",primerApellido:"",           segundoApellido:"",         celular:"6074321987", departamento:"ANTIOQUIA",       ciudad:"MEDELLÍN",     direccion:"CLL 52 # 43-120",        email:"ventas@autosdelnorte.com",       nombreCompleto:"AUTOS DEL NORTE SAS"},
  {id:12, tipoDoc:"NIT",      numDoc:"901234567",   digitoVerificacion:"8",primerNombre:"CALI MOTORS LTDA",       segundoNombre:"",primerApellido:"",           segundoApellido:"",         celular:"6023456789", departamento:"VALLE DEL CAUCA", ciudad:"CALI",         direccion:"AV 3N # 24-15",          email:"gerencia@calimotors.com",        nombreCompleto:"CALI MOTORS LTDA"},
  {id:15, tipoDoc:"NIT",      numDoc:"802345678",   digitoVerificacion:"1",primerNombre:"INVERSIONES JM SAS",     segundoNombre:"",primerApellido:"",           segundoApellido:"",         celular:"3201234567", departamento:"SANTANDER",       ciudad:"BUCARAMANGA",  direccion:"KR 27 # 54-32",          email:"admin@inversionesjm.com",        nombreCompleto:"INVERSIONES JM SAS"},
  {id:20, tipoDoc:"NIT",      numDoc:"830567890",   digitoVerificacion:"7",primerNombre:"MULTIMARCAS DEL SUR",    segundoNombre:"",primerApellido:"",           segundoApellido:"",         celular:"6028901234", departamento:"NARIÑO",          ciudad:"PASTO",        direccion:"AV PANAMERICANA # 12-50",email:"ventas@multimarcassur.com",      nombreCompleto:"MULTIMARCAS DEL SUR"},
  {id:36, tipoDoc:"NIT",      numDoc:"811234567",   digitoVerificacion:"4",primerNombre:"MOTOS ORIENTE SAS",      segundoNombre:"",primerApellido:"",           segundoApellido:"",         celular:"6075432198", departamento:"SANTANDER",       ciudad:"BARRANCABERMEJA",direccion:"CLL 50 # 20-30",        email:"ventas@motosoriente.com",        nombreCompleto:"MOTOS ORIENTE SAS"},
  {id:37, tipoDoc:"NIT",      numDoc:"822345678",   digitoVerificacion:"2",primerNombre:"REPUESTOS LA 80 SAS",    segundoNombre:"",primerApellido:"",           segundoApellido:"",         celular:"6043210987", departamento:"ANTIOQUIA",       ciudad:"MEDELLÍN",     direccion:"KR 80 # 30-45",          email:"info@repuestosla80.com",         nombreCompleto:"REPUESTOS LA 80 SAS"},
  {id:38, tipoDoc:"NIT",      numDoc:"833456789",   digitoVerificacion:"6",primerNombre:"VEHÍCULOS PACIFIC SAS",  segundoNombre:"",primerApellido:"",           segundoApellido:"",         celular:"6022109876", departamento:"VALLE DEL CAUCA", ciudad:"CALI",         direccion:"AV ROOSEVELT # 50-20",   email:"info@vehiculospacific.com",      nombreCompleto:"VEHÍCULOS PACIFIC SAS"},
  {id:39, tipoDoc:"NIT",      numDoc:"844567890",   digitoVerificacion:"9",primerNombre:"AUTOMOTRIZ DEL CARIBE",  segundoNombre:"",primerApellido:"",           segundoApellido:"",         celular:"6053219876", departamento:"ATLÁNTICO",       ciudad:"BARRANQUILLA", direccion:"CLL 84 # 42-30",         email:"ventas@automotrizcaribe.com",    nombreCompleto:"AUTOMOTRIZ DEL CARIBE"},
  // ── CE / PASAPORTE / RC / TI ──────────────────────────────────────────────
  {id:6,  tipoDoc:"CE",       numDoc:"1234567",     digitoVerificacion:"", primerNombre:"VALENTINA",       segundoNombre:"SOFÍA",    primerApellido:"SILVA",      segundoApellido:"REYES",    celular:"3165432109", departamento:"CUNDINAMARCA",    ciudad:"CHÍA",         direccion:"KR 4 # 12-35",           email:"valentina.silva@email.com",      nombreCompleto:"VALENTINA SOFÍA SILVA REYES"},
  {id:17, tipoDoc:"PASAPORTE",numDoc:"AB123456",    digitoVerificacion:"", primerNombre:"JAMES",           segundoNombre:"",         primerApellido:"WILSON",     segundoApellido:"",         celular:"3108765432", departamento:"BOGOTÁ D.C.",     ciudad:"BOGOTÁ",       direccion:"CRA 7 # 72-41",          email:"james.wilson@email.com",         nombreCompleto:"JAMES WILSON"},
  {id:19, tipoDoc:"RC",       numDoc:"1098765432",  digitoVerificacion:"", primerNombre:"SOFÍA",           segundoNombre:"VALENTINA",primerApellido:"CASTRO",     segundoApellido:"NIÑO",     celular:"3172345678", departamento:"NARIÑO",          ciudad:"PASTO",        direccion:"CLL 20 # 34-10",         email:"sofia.castro@email.com",         nombreCompleto:"SOFÍA VALENTINA CASTRO NIÑO"},
  {id:9,  tipoDoc:"TI",       numDoc:"1078901234",  digitoVerificacion:"", primerNombre:"DAVID",           segundoNombre:"ESTEBAN",  primerApellido:"PATIÑO",     segundoApellido:"RUIZ",     celular:"3132345678", departamento:"SANTANDER",       ciudad:"BUCARAMANGA",  direccion:"CLL 35 # 28-10",         email:"david.patino@email.com",         nombreCompleto:"DAVID ESTEBAN PATIÑO RUIZ"},
  {id:40, tipoDoc:"CE",       numDoc:"9876543",     digitoVerificacion:"", primerNombre:"PIERRE",          segundoNombre:"",         primerApellido:"MARTIN",     segundoApellido:"",         celular:"3214567890", departamento:"BOGOTÁ D.C.",     ciudad:"BOGOTÁ",       direccion:"CLL 93 # 11-28",         email:"pierre.martin@email.com",        nombreCompleto:"PIERRE MARTIN"},
  {id:41, tipoDoc:"PASAPORTE",numDoc:"CD789012",    digitoVerificacion:"", primerNombre:"JOHN",            segundoNombre:"",         primerApellido:"SMITH",      segundoApellido:"",         celular:"3225678901", departamento:"ANTIOQUIA",       ciudad:"MEDELLÍN",     direccion:"KR 70 # 44-10",          email:"john.smith@email.com",           nombreCompleto:"JOHN SMITH"},
  {id:42, tipoDoc:"TI",       numDoc:"1109012345",  digitoVerificacion:"", primerNombre:"MIGUEL",          segundoNombre:"ÁNGEL",    primerApellido:"ACOSTA",     segundoApellido:"BERMÚDEZ", celular:"3236789012", departamento:"CUNDINAMARCA",    ciudad:"FUSAGASUGÁ",   direccion:"CLL 12 # 6-40",          email:"miguel.acosta@email.com",        nombreCompleto:"MIGUEL ÁNGEL ACOSTA BERMÚDEZ"},
  {id:43, tipoDoc:"RC",       numDoc:"1120123456",  digitoVerificacion:"", primerNombre:"ISABELLA",        segundoNombre:"",         primerApellido:"VARGAS",     segundoApellido:"",         celular:"3247890123", departamento:"QUINDÍO",         ciudad:"ARMENIA",      direccion:"AV BOLÍVAR # 14-20",     email:"isabella.vargas@email.com",      nombreCompleto:"ISABELLA VARGAS"},
  // ── Con bandera naranja ────────────────────────────────────────────────────
  {id:21, tipoDoc:"CC",       numDoc:"1016789012",  digitoVerificacion:"", primerNombre:"ANDRÉS",          segundoNombre:"",         primerApellido:"MOLINA",     segundoApellido:"",         celular:"",           departamento:"",                ciudad:"",             direccion:"",                       email:"",                               nombreCompleto:"ANDRÉS MOLINA"},
  {id:22, tipoDoc:"CC",       numDoc:"1017890123",  digitoVerificacion:"", primerNombre:"LUCÍA",           segundoNombre:"FERNANDA", primerApellido:"BERMÚDEZ",   segundoApellido:"",         celular:"3194567890", departamento:"CÓRDOBA",         ciudad:"MONTERÍA",     direccion:"",                       email:"",                               nombreCompleto:"LUCÍA FERNANDA BERMÚDEZ"},
  {id:23, tipoDoc:"TI",       numDoc:"1018901234",  digitoVerificacion:"", primerNombre:"MIGUEL",          segundoNombre:"",         primerApellido:"RÍOS",       segundoApellido:"",         celular:"",           departamento:"META",            ciudad:"VILLAVICENCIO",direccion:"CLL 15 # 8-20",          email:"",                               nombreCompleto:"MIGUEL RÍOS"},
  {id:24, tipoDoc:"NIT",      numDoc:"810678901",   digitoVerificacion:"", primerNombre:"REPUESTOS EXPRESS",segundoNombre:"",         primerApellido:"",           segundoApellido:"",         celular:"",           departamento:"ANTIOQUIA",       ciudad:"BELLO",        direccion:"KR 50 # 34-10",          email:"",                               nombreCompleto:"REPUESTOS EXPRESS"},
  {id:25, tipoDoc:"CE",       numDoc:"7654321",     digitoVerificacion:"", primerNombre:"ANNA",            segundoNombre:"",         primerApellido:"SCHMIDT",    segundoApellido:"",         celular:"3209871234", departamento:"BOGOTÁ D.C.",     ciudad:"BOGOTÁ",       direccion:"",                       email:"",                               nombreCompleto:"ANNA SCHMIDT"},
  {id:44, tipoDoc:"CC",       numDoc:"1131234567",  digitoVerificacion:"", primerNombre:"TOMÁS",           segundoNombre:"",         primerApellido:"JIMÉNEZ",    segundoApellido:"",         celular:"",           departamento:"BOYACÁ",          ciudad:"DUITAMA",      direccion:"",                       email:"",                               nombreCompleto:"TOMÁS JIMÉNEZ"},
  {id:45, tipoDoc:"CC",       numDoc:"1142345678",  digitoVerificacion:"", primerNombre:"LAURA",           segundoNombre:"",         primerApellido:"QUINTERO",   segundoApellido:"",         celular:"3258901234", departamento:"CALDAS",          ciudad:"MANIZALES",    direccion:"",                       email:"laura.quintero@email.com",       nombreCompleto:"LAURA QUINTERO"},
  {id:46, tipoDoc:"NIT",      numDoc:"855678901",   digitoVerificacion:"", primerNombre:"COMERCIALIZADORA PÉREZ",segundoNombre:"",  primerApellido:"",           segundoApellido:"",         celular:"",           departamento:"MAGDALENA",       ciudad:"SANTA MARTA",  direccion:"CLL 22 # 3-10",          email:"",                               nombreCompleto:"COMERCIALIZADORA PÉREZ"},
  {id:47, tipoDoc:"CC",       numDoc:"1153456789",  digitoVerificacion:"", primerNombre:"ROSA",            segundoNombre:"ELENA",    primerApellido:"DÍAZ",       segundoApellido:"",         celular:"3269012345", departamento:"SUCRE",           ciudad:"SINCELEJO",    direccion:"",                       email:"rosa.diaz@email.com",            nombreCompleto:"ROSA ELENA DÍAZ"},
  {id:48, tipoDoc:"CC",       numDoc:"1164567890",  digitoVerificacion:"", primerNombre:"HERNÁN",          segundoNombre:"",         primerApellido:"MUÑOZ",      segundoApellido:"",         celular:"",           departamento:"CHOCÓ",           ciudad:"QUIBDÓ",       direccion:"",                       email:"",                               nombreCompleto:"HERNÁN MUÑOZ"},
  {id:49, tipoDoc:"CC",       numDoc:"1175678901",  digitoVerificacion:"", primerNombre:"YOLANDA",         segundoNombre:"PATRICIA", primerApellido:"SALAZAR",    segundoApellido:"",         celular:"3270123456", departamento:"CESAR",           ciudad:"VALLEDUPAR",   direccion:"AV HURTADO # 15-32",     email:"",                               nombreCompleto:"YOLANDA PATRICIA SALAZAR"},
  {id:50, tipoDoc:"CC",       numDoc:"1186789012",  digitoVerificacion:"", primerNombre:"EFRAÍN",          segundoNombre:"",         primerApellido:"MORA",       segundoApellido:"",         celular:"",           departamento:"",                ciudad:"",             direccion:"",                       email:"",                               nombreCompleto:"EFRAÍN MORA"},
];

const SEED_VEHICULOS = [
  {id:1,  placa:"ABC123", marca:"TOYOTA",        linea:"COROLLA",        anio:"2022", cilindraje:"1800", color:"BLANCO",      servicio:"PARTICULAR", clase:"AUTOMÓVIL",   carroceria:"SEDAN",      combustible:"GASOLINA", capacidad:"5",  numMotor:"1ZR2022A",  vin:"1HGBH41JXMN109186", numSerie:"SN001", numChasis:"CH001", fechaMatricula:"2022-03-15", organismoTransito:"SDM - BOGOTÁ D.C.",      blindaje:"SIN BLINDAJE"},
  {id:2,  placa:"DEF456", marca:"CHEVROLET",     linea:"SPARK GT",       anio:"2021", cilindraje:"1200", color:"ROJO",        servicio:"PARTICULAR", clase:"AUTOMÓVIL",   carroceria:"HATCHBACK",  combustible:"GASOLINA", capacidad:"5",  numMotor:"B12D2021",  vin:"2G1WF52E359101234", numSerie:"SN002", numChasis:"CH002", fechaMatricula:"2021-06-20", organismoTransito:"TRANSIT. MEDELLÍN",      blindaje:"SIN BLINDAJE"},
  {id:3,  placa:"GHI789", marca:"RENAULT",       linea:"LOGAN",          anio:"2020", cilindraje:"1600", color:"GRIS OSCURO", servicio:"PARTICULAR", clase:"AUTOMÓVIL",   carroceria:"SEDAN",      combustible:"GASOLINA", capacidad:"5",  numMotor:"K7M2020",   vin:"3N1AB7APXKY312456", numSerie:"SN003", numChasis:"CH003", fechaMatricula:"2020-01-10", organismoTransito:"TRANSIT. CALI",          blindaje:"SIN BLINDAJE"},
  {id:4,  placa:"JKL012", marca:"KIA",           linea:"SPORTAGE",       anio:"2023", cilindraje:"2000", color:"AZUL",        servicio:"PARTICULAR", clase:"CAMPERO",     carroceria:"SUV",        combustible:"GASOLINA", capacidad:"5",  numMotor:"G4NA2023",  vin:"5NPE24AF8FH123456", numSerie:"SN004", numChasis:"CH004", fechaMatricula:"2023-04-05", organismoTransito:"SDM - BOGOTÁ D.C.",      blindaje:"SIN BLINDAJE"},
  {id:5,  placa:"MNO345", marca:"MAZDA",         linea:"CX-5",           anio:"2024", cilindraje:"2500", color:"NEGRO",       servicio:"PARTICULAR", clase:"CAMPERO",     carroceria:"SUV",        combustible:"GASOLINA", capacidad:"5",  numMotor:"PY2024",    vin:"JM3KFBBM5J0123456", numSerie:"SN005", numChasis:"CH005", fechaMatricula:"2024-02-28", organismoTransito:"TRANSIT. BARRANQUILLA",  blindaje:"SIN BLINDAJE"},
  {id:6,  placa:"PQR678", marca:"HONDA",         linea:"CB150R",         anio:"2023", cilindraje:"150",  color:"NEGRO",       servicio:"PARTICULAR", clase:"MOTOCICLETA", carroceria:"OTRO",       combustible:"GASOLINA", capacidad:"2",  numMotor:"CB150R23",  vin:"",                  numSerie:"SN006", numChasis:"CH006", fechaMatricula:"2023-08-12", organismoTransito:"TRANSIT. MEDELLÍN",      blindaje:"SIN BLINDAJE"},
  {id:7,  placa:"STU901", marca:"FORD",          linea:"RANGER XLT",     anio:"2022", cilindraje:"3200", color:"PLATA",       servicio:"PARTICULAR", clase:"CAMIONETA",   carroceria:"PICKUP",     combustible:"DIESEL",   capacidad:"5",  numMotor:"TDCI2022",  vin:"1FTFW1ET5DFA12345", numSerie:"SN007", numChasis:"CH007", fechaMatricula:"2022-11-30", organismoTransito:"SDM - BOGOTÁ D.C.",      blindaje:"SIN BLINDAJE"},
  {id:8,  placa:"VWX234", marca:"NISSAN",        linea:"FRONTIER 4X4",   anio:"2021", cilindraje:"2500", color:"CAFÉ",        servicio:"PARTICULAR", clase:"CAMIONETA",   carroceria:"PICKUP",     combustible:"DIESEL",   capacidad:"5",  numMotor:"YD252021",  vin:"1N6AD0EV5BC123456", numSerie:"SN008", numChasis:"CH008", fechaMatricula:"2021-09-14", organismoTransito:"TRANSIT. BUCARAMANGA",   blindaje:"SIN BLINDAJE"},
  {id:9,  placa:"YZA567", marca:"HYUNDAI",       linea:"TUCSON",         anio:"2024", cilindraje:"2000", color:"VERDE",       servicio:"PARTICULAR", clase:"CAMPERO",     carroceria:"SUV",        combustible:"GASOLINA", capacidad:"5",  numMotor:"G4NA2024H", vin:"KMHFG41BEFB123456", numSerie:"SN009", numChasis:"CH009", fechaMatricula:"2024-07-18", organismoTransito:"TRANSIT. CALI",          blindaje:"SIN BLINDAJE"},
  {id:10, placa:"BCD890", marca:"VOLKSWAGEN",    linea:"POLO",           anio:"2022", cilindraje:"1200", color:"BLANCO",      servicio:"PARTICULAR", clase:"AUTOMÓVIL",   carroceria:"HATCHBACK",  combustible:"GASOLINA", capacidad:"5",  numMotor:"CGPA2022",  vin:"WVWZZZ9NZ2Y123456", numSerie:"SN010", numChasis:"CH010", fechaMatricula:"2022-05-22", organismoTransito:"SDM - BOGOTÁ D.C.",      blindaje:"SIN BLINDAJE"},
  {id:11, placa:"EFG123", marca:"SUZUKI",        linea:"GS150R",         anio:"2023", cilindraje:"150",  color:"AZUL",        servicio:"PARTICULAR", clase:"MOTOCICLETA", carroceria:"OTRO",       combustible:"GASOLINA", capacidad:"2",  numMotor:"GS1502023", vin:"",                  numSerie:"SN011", numChasis:"CH011", fechaMatricula:"2023-12-01", organismoTransito:"TRANSIT. PEREIRA",       blindaje:"SIN BLINDAJE"},
  {id:12, placa:"HIJ456", marca:"BAJAJ",         linea:"PULSAR NS200",   anio:"2024", cilindraje:"200",  color:"NEGRO",       servicio:"PARTICULAR", clase:"MOTOCICLETA", carroceria:"OTRO",       combustible:"GASOLINA", capacidad:"2",  numMotor:"DTS2024",   vin:"",                  numSerie:"SN012", numChasis:"CH012", fechaMatricula:"2024-03-10", organismoTransito:"TRANSIT. MEDELLÍN",      blindaje:"SIN BLINDAJE"},
  {id:13, placa:"KLM789", marca:"MERCEDES BENZ", linea:"SPRINTER 515",   anio:"2021", cilindraje:"2200", color:"BLANCO",      servicio:"PÚBLICO",    clase:"MICROBÚS",    carroceria:"VAN",        combustible:"DIESEL",   capacidad:"19", numMotor:"OM6512021", vin:"WDB9066351S123456", numSerie:"SN013", numChasis:"CH013", fechaMatricula:"2021-07-25", organismoTransito:"TRANSIT. BOGOTÁ",        blindaje:"SIN BLINDAJE"},
  {id:14, placa:"NOP012", marca:"LEXUS",         linea:"LX570",          anio:"2020", cilindraje:"5663", color:"BLANCO",      servicio:"PARTICULAR", clase:"CAMPERO",     carroceria:"WAGON",      combustible:"GASOLINA", capacidad:"8",  numMotor:"3UR2020",   vin:"JTJHY7AX1E4141320", numSerie:"SN014", numChasis:"CH014", fechaMatricula:"2020-04-04", organismoTransito:"SDM - BOGOTÁ D.C.",      blindaje:"SIN BLINDAJE"},
  {id:15, placa:"QRS345", marca:"RENAULT",       linea:"DUSTER 4X4",     anio:"2023", cilindraje:"1600", color:"NARANJA",     servicio:"PARTICULAR", clase:"CAMPERO",     carroceria:"SUV",        combustible:"GASOLINA", capacidad:"5",  numMotor:"H4M2023",   vin:"VF1HSRB0H54123456", numSerie:"SN015", numChasis:"CH015", fechaMatricula:"2023-10-08", organismoTransito:"TRANSIT. IBAGUÉ",        blindaje:"SIN BLINDAJE"},
  {id:16, placa:"TUV678", marca:"YAMAHA",        linea:"FZ25",           anio:"2024", cilindraje:"250",  color:"AZUL",        servicio:"PARTICULAR", clase:"MOTOCICLETA", carroceria:"OTRO",       combustible:"GASOLINA", capacidad:"2",  numMotor:"FZ252024",  vin:"",                  numSerie:"SN016", numChasis:"CH016", fechaMatricula:"2024-01-15", organismoTransito:"TRANSIT. MEDELLÍN",      blindaje:"SIN BLINDAJE"},
  {id:17, placa:"WXY901", marca:"JEEP",          linea:"WRANGLER",       anio:"2022", cilindraje:"3600", color:"VERDE",       servicio:"PARTICULAR", clase:"CAMPERO",     carroceria:"CONVERTIBLE",combustible:"GASOLINA", capacidad:"5",  numMotor:"ERB2022",   vin:"1C4BJWDG5GL123456", numSerie:"SN017", numChasis:"CH017", fechaMatricula:"2022-06-30", organismoTransito:"SDM - BOGOTÁ D.C.",      blindaje:"SIN BLINDAJE"},
  {id:18, placa:"XYZ234", marca:"CHERY",         linea:"TIGGO 5X",       anio:"2023", cilindraje:"1500", color:"ROJO",        servicio:"PARTICULAR", clase:"CAMPERO",     carroceria:"SUV",        combustible:"GASOLINA", capacidad:"5",  numMotor:"SQR2023",   vin:"LVVDB11B4PD123456", numSerie:"SN018", numChasis:"CH018", fechaMatricula:"2023-09-20", organismoTransito:"TRANSIT. CALI",          blindaje:"SIN BLINDAJE"},
  {id:19, placa:"ZAB567", marca:"AKT",           linea:"TTR200",         anio:"2024", cilindraje:"200",  color:"NEGRO",       servicio:"PARTICULAR", clase:"MOTOCICLETA", carroceria:"OTRO",       combustible:"GASOLINA", capacidad:"2",  numMotor:"TTR2024",   vin:"",                  numSerie:"SN019", numChasis:"CH019", fechaMatricula:"2024-02-10", organismoTransito:"TRANSIT. BOGOTÁ",        blindaje:"SIN BLINDAJE"},
  {id:20, placa:"BCA890", marca:"VOLKSWAGEN",    linea:"AMAROK V6",      anio:"2021", cilindraje:"3000", color:"GRIS",        servicio:"PARTICULAR", clase:"CAMIONETA",   carroceria:"PICKUP",     combustible:"DIESEL",   capacidad:"5",  numMotor:"V6TDI2021", vin:"WV1ZZZSM2L4123456", numSerie:"SN020", numChasis:"CH020", fechaMatricula:"2021-11-05", organismoTransito:"TRANSIT. BUCARAMANGA",   blindaje:"SIN BLINDAJE"},
  {id:21, placa:"CBD123", marca:"CHEVROLET",     linea:"CAPTIVA",        anio:"2022", cilindraje:"2400", color:"NEGRO",       servicio:"PARTICULAR", clase:"CAMPERO",     carroceria:"SUV",        combustible:"GASOLINA", capacidad:"7",  numMotor:"Z24XE2022", vin:"2GNALDEK8F6123456", numSerie:"SN021", numChasis:"CH021", fechaMatricula:"2022-08-18", organismoTransito:"SDM - BOGOTÁ D.C.",      blindaje:"SIN BLINDAJE"},
  {id:22, placa:"DCE456", marca:"TOYOTA",        linea:"HILUX 4X4",      anio:"2023", cilindraje:"2700", color:"BLANCO",      servicio:"PARTICULAR", clase:"CAMIONETA",   carroceria:"PICKUP",     combustible:"GASOLINA", capacidad:"5",  numMotor:"2TR2023",   vin:"MR0FX22G402123456", numSerie:"SN022", numChasis:"CH022", fechaMatricula:"2023-05-14", organismoTransito:"TRANSIT. CALI",          blindaje:"SIN BLINDAJE"},
  {id:23, placa:"EDF789", marca:"KIA",           linea:"PICANTO",        anio:"2021", cilindraje:"1000", color:"AMARILLO",    servicio:"PARTICULAR", clase:"AUTOMÓVIL",   carroceria:"HATCHBACK",  combustible:"GASOLINA", capacidad:"4",  numMotor:"G3LA2021",  vin:"KNABE811AK5123456", numSerie:"SN023", numChasis:"CH023", fechaMatricula:"2021-03-22", organismoTransito:"TRANSIT. MEDELLÍN",      blindaje:"SIN BLINDAJE"},
  {id:24, placa:"FEG012", marca:"HONDA",         linea:"CRV",            anio:"2022", cilindraje:"1500", color:"PLATA",       servicio:"PARTICULAR", clase:"CAMPERO",     carroceria:"SUV",        combustible:"GASOLINA", capacidad:"5",  numMotor:"L15BT2022", vin:"2HKRW2H5XNH123456", numSerie:"SN024", numChasis:"CH024", fechaMatricula:"2022-10-30", organismoTransito:"SDM - BOGOTÁ D.C.",      blindaje:"SIN BLINDAJE"},
  {id:25, placa:"GFH345", marca:"RENAULT",       linea:"KWID",           anio:"2023", cilindraje:"1000", color:"NARANJA",     servicio:"PARTICULAR", clase:"AUTOMÓVIL",   carroceria:"HATCHBACK",  combustible:"GASOLINA", capacidad:"5",  numMotor:"SCE2023",   vin:"VF1BAA60B56123456", numSerie:"SN025", numChasis:"CH025", fechaMatricula:"2023-07-11", organismoTransito:"TRANSIT. BARRANQUILLA",  blindaje:"SIN BLINDAJE"},
  {id:26, placa:"HGI678", marca:"SUZUKI",        linea:"VITARA",         anio:"2022", cilindraje:"1600", color:"AZUL",        servicio:"PARTICULAR", clase:"CAMPERO",     carroceria:"SUV",        combustible:"GASOLINA", capacidad:"5",  numMotor:"M16A2022",  vin:"JS3TD341XN4123456", numSerie:"SN026", numChasis:"CH026", fechaMatricula:"2022-04-19", organismoTransito:"TRANSIT. PEREIRA",       blindaje:"SIN BLINDAJE"},
  {id:27, placa:"IHJ901", marca:"MAZDA",         linea:"2",              anio:"2021", cilindraje:"1500", color:"ROJO",        servicio:"PARTICULAR", clase:"AUTOMÓVIL",   carroceria:"SEDAN",      combustible:"GASOLINA", capacidad:"5",  numMotor:"P5VPS2021", vin:"MM8DY10B4L0123456", numSerie:"SN027", numChasis:"CH027", fechaMatricula:"2021-12-08", organismoTransito:"SDM - BOGOTÁ D.C.",      blindaje:"SIN BLINDAJE"},
  {id:28, placa:"JIK234", marca:"FORD",          linea:"ESCAPE",         anio:"2023", cilindraje:"2000", color:"GRIS",        servicio:"PARTICULAR", clase:"CAMPERO",     carroceria:"SUV",        combustible:"GASOLINA", capacidad:"5",  numMotor:"EcoB2023",  vin:"1FMCU0GD9NUB12345", numSerie:"SN028", numChasis:"CH028", fechaMatricula:"2023-02-28", organismoTransito:"TRANSIT. BOGOTÁ",        blindaje:"SIN BLINDAJE"},
  {id:29, placa:"KJL567", marca:"HYUNDAI",       linea:"CRETA",          anio:"2022", cilindraje:"1600", color:"BLANCO",      servicio:"PARTICULAR", clase:"CAMPERO",     carroceria:"SUV",        combustible:"GASOLINA", capacidad:"5",  numMotor:"G4FG2022",  vin:"KMHCR81EBNU123456", numSerie:"SN029", numChasis:"CH029", fechaMatricula:"2022-09-15", organismoTransito:"TRANSIT. MEDELLÍN",      blindaje:"SIN BLINDAJE"},
  {id:30, placa:"LKM890", marca:"NISSAN",        linea:"KICKS",          anio:"2023", cilindraje:"1600", color:"NARANJA",     servicio:"PARTICULAR", clase:"CAMPERO",     carroceria:"SUV",        combustible:"GASOLINA", capacidad:"5",  numMotor:"HR16DE23",  vin:"3N1CP5CUXNL123456", numSerie:"SN030", numChasis:"CH030", fechaMatricula:"2023-06-22", organismoTransito:"TRANSIT. CALI",          blindaje:"SIN BLINDAJE"},
  {id:31, placa:"MLN123", marca:"YAMAHA",        linea:"MT03",           anio:"2024", cilindraje:"300",  color:"NEGRO",       servicio:"PARTICULAR", clase:"MOTOCICLETA", carroceria:"OTRO",       combustible:"GASOLINA", capacidad:"2",  numMotor:"MT032024",  vin:"",                  numSerie:"SN031", numChasis:"CH031", fechaMatricula:"2024-01-30", organismoTransito:"TRANSIT. MEDELLÍN",      blindaje:"SIN BLINDAJE"},
  {id:32, placa:"NMO456", marca:"BMW",           linea:"320I",           anio:"2022", cilindraje:"2000", color:"NEGRO",       servicio:"PARTICULAR", clase:"AUTOMÓVIL",   carroceria:"SEDAN",      combustible:"GASOLINA", capacidad:"5",  numMotor:"B48B20A22", vin:"WBA5X7C5XNA123456", numSerie:"SN032", numChasis:"CH032", fechaMatricula:"2022-07-14", organismoTransito:"SDM - BOGOTÁ D.C.",      blindaje:"SIN BLINDAJE"},
  {id:33, placa:"ONP789", marca:"AUDI",          linea:"Q5",             anio:"2023", cilindraje:"2000", color:"GRIS",        servicio:"PARTICULAR", clase:"CAMPERO",     carroceria:"SUV",        combustible:"GASOLINA", capacidad:"5",  numMotor:"DETA2023",  vin:"WA1BNAFY3N2123456", numSerie:"SN033", numChasis:"CH033", fechaMatricula:"2023-11-05", organismoTransito:"SDM - BOGOTÁ D.C.",      blindaje:"SIN BLINDAJE"},
  {id:34, placa:"POQ012", marca:"CHEVROLET",     linea:"ONIX",           anio:"2021", cilindraje:"1000", color:"BLANCO",      servicio:"PARTICULAR", clase:"AUTOMÓVIL",   carroceria:"HATCHBACK",  combustible:"GASOLINA", capacidad:"5",  numMotor:"ECOTEC21",  vin:"9BWZZZ377VT004251", numSerie:"SN034", numChasis:"CH034", fechaMatricula:"2021-04-17", organismoTransito:"TRANSIT. CALI",          blindaje:"SIN BLINDAJE"},
  {id:35, placa:"QPR345", marca:"BAJAJ",         linea:"DOMINAR 400",    anio:"2023", cilindraje:"400",  color:"NEGRO",       servicio:"PARTICULAR", clase:"MOTOCICLETA", carroceria:"OTRO",       combustible:"GASOLINA", capacidad:"2",  numMotor:"DOM4002023",vin:"",                  numSerie:"SN035", numChasis:"CH035", fechaMatricula:"2023-08-25", organismoTransito:"TRANSIT. BOGOTÁ",        blindaje:"SIN BLINDAJE"},
  {id:36, placa:"RQS678", marca:"TOYOTA",        linea:"RAV4",           anio:"2024", cilindraje:"2500", color:"PLATA",       servicio:"PARTICULAR", clase:"CAMPERO",     carroceria:"SUV",        combustible:"HÍBRIDO",  capacidad:"5",  numMotor:"A25A2024",  vin:"2T3P1RFV0NW123456", numSerie:"SN036", numChasis:"CH036", fechaMatricula:"2024-03-18", organismoTransito:"SDM - BOGOTÁ D.C.",      blindaje:"SIN BLINDAJE"},
  {id:37, placa:"SRT901", marca:"KIA",           linea:"SELTOS",         anio:"2022", cilindraje:"1400", color:"ROJO",        servicio:"PARTICULAR", clase:"CAMPERO",     carroceria:"SUV",        combustible:"GASOLINA", capacidad:"5",  numMotor:"G4LD2022",  vin:"KNDEC3LD9N6123456", numSerie:"SN037", numChasis:"CH037", fechaMatricula:"2022-12-09", organismoTransito:"TRANSIT. BARRANQUILLA",  blindaje:"SIN BLINDAJE"},
  {id:38, placa:"TSU234", marca:"HERO",          linea:"SPLENDOR+",      anio:"2024", cilindraje:"97",   color:"NEGRO",       servicio:"PARTICULAR", clase:"MOTOCICLETA", carroceria:"OTRO",       combustible:"GASOLINA", capacidad:"2",  numMotor:"SPLND2024", vin:"",                  numSerie:"SN038", numChasis:"CH038", fechaMatricula:"2024-04-22", organismoTransito:"TRANSIT. MEDELLÍN",      blindaje:"SIN BLINDAJE"},
  {id:39, placa:"UTV567", marca:"RENAULT",       linea:"STEPWAY",        anio:"2023", cilindraje:"1600", color:"AZUL",        servicio:"PARTICULAR", clase:"AUTOMÓVIL",   carroceria:"HATCHBACK",  combustible:"GASOLINA", capacidad:"5",  numMotor:"K4M2023",   vin:"VF1KSA30H57123456", numSerie:"SN039", numChasis:"CH039", fechaMatricula:"2023-01-28", organismoTransito:"TRANSIT. BOGOTÁ",        blindaje:"SIN BLINDAJE"},
  {id:40, placa:"VUW890", marca:"CHEVROLET",     linea:"TRACKER",        anio:"2022", cilindraje:"1000", color:"VERDE",       servicio:"PARTICULAR", clase:"CAMPERO",     carroceria:"SUV",        combustible:"GASOLINA", capacidad:"5",  numMotor:"LFB2022",   vin:"3GNKBERS3NS123456", numSerie:"SN040", numChasis:"CH040", fechaMatricula:"2022-05-11", organismoTransito:"SDM - BOGOTÁ D.C.",      blindaje:"SIN BLINDAJE"},
  // ── Con campos incompletos (bandera naranja) ──────────────────────────────
  {id:41, placa:"WVX123", marca:"FORD",          linea:"FIESTA",         anio:"2020", cilindraje:"1600", color:"AZUL",        servicio:"PARTICULAR", clase:"AUTOMÓVIL",   carroceria:"HATCHBACK",  combustible:"GASOLINA", capacidad:"",   numMotor:"",          vin:"",                  numSerie:"",      numChasis:"",      fechaMatricula:"",           organismoTransito:"TRANSIT. MEDELLÍN",      blindaje:"SIN BLINDAJE"},
  {id:42, placa:"XWY456", marca:"YAMAHA",        linea:"R3",             anio:"2023", cilindraje:"321",  color:"NEGRO",       servicio:"PARTICULAR", clase:"MOTOCICLETA", carroceria:"OTRO",       combustible:"GASOLINA", capacidad:"",   numMotor:"",          vin:"",                  numSerie:"",      numChasis:"",      fechaMatricula:"2023-06-10", organismoTransito:"",                       blindaje:"SIN BLINDAJE"},
  {id:43, placa:"YXZ789", marca:"HYUNDAI",       linea:"ACCENT",         anio:"2021", cilindraje:"1600", color:"",            servicio:"PARTICULAR", clase:"AUTOMÓVIL",   carroceria:"SEDAN",      combustible:"GASOLINA", capacidad:"",   numMotor:"",          vin:"",                  numSerie:"",      numChasis:"",      fechaMatricula:"",           organismoTransito:"",                       blindaje:"SIN BLINDAJE"},
  {id:44, placa:"ZYA012", marca:"NISSAN",        linea:"SENTRA",         anio:"2022", cilindraje:"1600", color:"BLANCO",      servicio:"",           clase:"AUTOMÓVIL",   carroceria:"SEDAN",      combustible:"GASOLINA", capacidad:"",   numMotor:"",          vin:"",                  numSerie:"",      numChasis:"",      fechaMatricula:"",           organismoTransito:"",                       blindaje:"SIN BLINDAJE"},
  {id:45, placa:"AZB345", marca:"SUZUKI",        linea:"IGNIS",          anio:"2023", cilindraje:"1200", color:"ROJO",        servicio:"PARTICULAR", clase:"",            carroceria:"",           combustible:"GASOLINA", capacidad:"",   numMotor:"",          vin:"",                  numSerie:"",      numChasis:"",      fechaMatricula:"",           organismoTransito:"",                       blindaje:"SIN BLINDAJE"},
  {id:46, placa:"BAC678", marca:"KIA",           linea:"RIO",            anio:"2022", cilindraje:"1400", color:"GRIS",        servicio:"PARTICULAR", clase:"AUTOMÓVIL",   carroceria:"HATCHBACK",  combustible:"GASOLINA", capacidad:"5",  numMotor:"",          vin:"",                  numSerie:"",      numChasis:"",      fechaMatricula:"2022-07-20", organismoTransito:"TRANSIT. CALI",          blindaje:"SIN BLINDAJE"},
  {id:47, placa:"CBF901", marca:"HONDA",         linea:"PILOT",          anio:"2021", cilindraje:"3500", color:"NEGRO",       servicio:"PARTICULAR", clase:"CAMPERO",     carroceria:"SUV",        combustible:"GASOLINA", capacidad:"8",  numMotor:"J35Y52021", vin:"",                  numSerie:"",      numChasis:"",      fechaMatricula:"2021-10-14", organismoTransito:"SDM - BOGOTÁ D.C.",      blindaje:"SIN BLINDAJE"},
  {id:48, placa:"DCG234", marca:"RENAULT",       linea:"SANDERO",        anio:"2020", cilindraje:"1600", color:"BLANCO",      servicio:"PARTICULAR", clase:"AUTOMÓVIL",   carroceria:"HATCHBACK",  combustible:"GASOLINA", capacidad:"5",  numMotor:"K4M2020",   vin:"",                  numSerie:"",      numChasis:"",      fechaMatricula:"",           organismoTransito:"TRANSIT. BOGOTÁ",        blindaje:"SIN BLINDAJE"},
  {id:49, placa:"EDH567", marca:"CHEVROLET",     linea:"SAIL",           anio:"2021", cilindraje:"1400", color:"AZUL",        servicio:"PARTICULAR", clase:"AUTOMÓVIL",   carroceria:"SEDAN",      combustible:"GASOLINA", capacidad:"5",  numMotor:"",          vin:"",                  numSerie:"",      numChasis:"",      fechaMatricula:"2021-08-05", organismoTransito:"",                       blindaje:"SIN BLINDAJE"},
  {id:50, placa:"FEI890", marca:"TOYOTA",        linea:"YARIS",          anio:"2023", cilindraje:"1500", color:"ROJO",        servicio:"PARTICULAR", clase:"AUTOMÓVIL",   carroceria:"HATCHBACK",  combustible:"GASOLINA", capacidad:"5",  numMotor:"",          vin:"",                  numSerie:"",      numChasis:"",      fechaMatricula:"",           organismoTransito:"",                       blindaje:"SIN BLINDAJE"},
];

// ── Field ──────────────────────────────────────────────────────────────────────
function Field({ label, required, error, children }) {
  return (
    <div className={error ? "fg fg-err" : "fg"}>
      <label className="flabel">{label}</label>
      {children}
      {error && <span className="emsg">{error}</span>}
    </div>
  );
}

// ── ClientForm ─────────────────────────────────────────────────────────────────
function ClientForm({ initial, onSave, onCancel }) {
  const blank = {tipoDoc:"",numDoc:"",digitoVerificacion:"",primerNombre:"",segundoNombre:"",
                 primerApellido:"",segundoApellido:"",celular:"",
                 departamento:"",ciudad:"",direccion:"",email:""};
  const [form, setForm] = useState(initial ? {...initial} : blank);
  const [errors, setErrors] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);

  const original = initial || blank;
  const isDirty = JSON.stringify({...blank,...form}) !== JSON.stringify({...blank,...original});
  const esNit = form.tipoDoc === "NIT";

  const set = (field, raw) => {
    if (field === "celular")      { setForm(f => ({...f, celular: raw.replace(/\D/g,"")})); return; }
    if (field === "email")        { setForm(f => ({...f, email: low(raw)})); return; }
    if (field === "departamento") { setForm(f => ({...f, departamento: up(raw), ciudad: ""})); return; }
    if (field === "numDoc") {
      const val = (form.tipoDoc === "PASAPORTE") ? up(raw) : raw.replace(/\D/g,"");
      setForm(f => ({...f, numDoc: val}));
      if (errors.numDoc) setErrors(e => ({...e, numDoc:""}));
      return;
    }
    if (field === "tipoDoc") {
      setForm(f => ({...f, tipoDoc: raw, numDoc:"", segundoNombre:"", primerApellido:"", segundoApellido:"", digitoVerificacion:""}));
      if (errors[field]) setErrors(e => ({...e, [field]:""}));
      return;
    }
    setForm(f => ({...f, [field]: up(raw)}));
    if (errors[field]) setErrors(e => ({...e, [field]: ""}));
  };

  const blockTab = field => e => {
    if (e.key === "Tab" && !form[field]) {
      e.preventDefault();
      setErrors(p => ({...p, [field]: "CAMPO OBLIGATORIO"}));
    }
  };

  const nc = esNit
    ? form.primerNombre
    : [form.primerNombre, form.segundoNombre, form.primerApellido, form.segundoApellido].filter(Boolean).join(" ");

  const cities = form.departamento ? (COLOMBIA[form.departamento] || []) : [];

  const handleSave = () => {
    const e = {};
    if (!form.tipoDoc) e.tipoDoc = "REQUERIDO";
    if (!form.numDoc)  e.numDoc  = "REQUERIDO";
    else if (form.tipoDoc !== "PASAPORTE" && /[^0-9]/.test(form.numDoc))
      e.numDoc = "SOLO NÚMEROS PARA ESTE TIPO DE DOCUMENTO";
    if (esNit && !form.digitoVerificacion) e.digitoVerificacion = "REQUERIDO";
    if (!form.primerNombre) e.primerNombre = "REQUERIDO";
    if (!esNit && !form.primerApellido) e.primerApellido = "REQUERIDO";
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave({...form, nombreCompleto: nc});
  };

  const handleCancel = () => {
    if (isDirty) { setShowConfirm(true); }
    else         { onCancel(); }
  };

  return (
    <div className="overlay">
      <div className="modal">
        <div className="mhead">
          <div className="mhead-l">
            <div className="mico">{initial ? "✏" : "+"}</div>
            <div>
              <div className="mtitle">{initial ? initial.nombreCompleto : "NUEVO CLIENTE"}</div>
              <div className="msub">LOS CAMPOS * SON OBLIGATORIOS</div>
            </div>
          </div>
          <div style={{display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4}}>
            {initial?.fechaCreacion && (
              <div className="mhead-fecha">📅 {initial.fechaCreacion}</div>
            )}
            <button className="mclose" onClick={handleCancel}>x</button>
          </div>
        </div>

        <div className="mbody">
          <div className="sec-head"><span>IDENTIFICACIÓN</span></div>
          <div className="frow">
            <Field label="TIPO DE DOCUMENTO" required error={errors.tipoDoc}>
              <select className={errors.tipoDoc ? "fi fi-err" : "fi"} value={form.tipoDoc}
                onChange={e => set("tipoDoc", e.target.value)} onKeyDown={blockTab("tipoDoc")}>
                <option value="">SELECCIONE...</option>
                {DOC_TYPES.map(d => <option key={d}>{d}</option>)}
              </select>
            </Field>
            <Field label="N° DE DOCUMENTO" required error={errors.numDoc}>
              <input className={errors.numDoc ? "fi fi-err" : "fi"} value={form.numDoc}
                onChange={e => set("numDoc", e.target.value)} onKeyDown={blockTab("numDoc")} />
            </Field>
          </div>
          {esNit && (
            <div className="frow">
              <Field label="DÍGITO DE VERIFICACIÓN" required error={errors.digitoVerificacion}>
                <select className={errors.digitoVerificacion ? "fi fi-err" : "fi"} value={form.digitoVerificacion}
                  onChange={e => set("digitoVerificacion", e.target.value)}>
                  <option value="">SELECCIONE...</option>
                  {[0,1,2,3,4,5,6,7,8,9].map(n => <option key={n}>{n}</option>)}
                </select>
              </Field>
              <div className="fg" />
            </div>
          )}

          <div className="sec-head"><span>{esNit ? "NOMBRE DE LA EMPRESA" : "NOMBRES Y APELLIDOS"}</span></div>
          {esNit ? (
            <div className="frow">
              <Field label="NOMBRE DE LA EMPRESA" required error={errors.primerNombre}>
                <input className={errors.primerNombre ? "fi fi-err" : "fi"} value={form.primerNombre}
                  onChange={e => set("primerNombre", e.target.value)} onKeyDown={blockTab("primerNombre")} />
              </Field>
              <div className="fg" />
            </div>
          ) : (
            <>
              <div className="frow">
                <Field label="PRIMER NOMBRE" required error={errors.primerNombre}>
                  <input className={errors.primerNombre ? "fi fi-err" : "fi"} value={form.primerNombre}
                    onChange={e => set("primerNombre", e.target.value)} onKeyDown={blockTab("primerNombre")} />
                </Field>
                <Field label="SEGUNDO NOMBRE">
                  <input className="fi fi-opt" value={form.segundoNombre}
                    onChange={e => set("segundoNombre", e.target.value)} placeholder="OPCIONAL" />
                </Field>
              </div>
              <div className="frow">
                <Field label="PRIMER APELLIDO" required error={errors.primerApellido}>
                  <input className={errors.primerApellido ? "fi fi-err" : "fi"} value={form.primerApellido}
                    onChange={e => set("primerApellido", e.target.value)} onKeyDown={blockTab("primerApellido")} />
                </Field>
                <Field label="SEGUNDO APELLIDO">
                  <input className="fi fi-opt" value={form.segundoApellido}
                    onChange={e => set("segundoApellido", e.target.value)} placeholder="OPCIONAL" />
                </Field>
              </div>
            </>
          )}
          <div className="frow">
            <Field label={esNit ? "NOMBRE EMPRESA (AUTOMÁTICO)" : "NOMBRE COMPLETO (AUTOMÁTICO)"}>
              <input className="fi fi-ro" value={nc} readOnly tabIndex={-1} />
            </Field>
            <div className="fg" />
          </div>

          <div className="sec-head"><span>CONTACTO Y UBICACIÓN</span></div>
          <div className="frow">
            <Field label="NÚMERO DE CELULAR">
              <input className="fi fi-opt" value={form.celular}
                onChange={e => set("celular", e.target.value)} inputMode="numeric" maxLength={10} placeholder="OPCIONAL" />
            </Field>
            <Field label="CORREO ELECTRÓNICO">
              <input className="fi fi-opt" type="email" value={form.email}
                onChange={e => set("email", e.target.value)} placeholder="correo@ejemplo.com" />
            </Field>
          </div>
          <div className="frow">
            <Field label="DEPARTAMENTO DE RESIDENCIA">
              <select className="fi fi-opt" value={form.departamento}
                onChange={e => set("departamento", e.target.value)}>
                <option value="">SELECCIONE...</option>
                {Object.keys(COLOMBIA).sort().map(d => <option key={d}>{d}</option>)}
              </select>
            </Field>
            <Field label="CIUDAD DE RESIDENCIA">
              <select className="fi fi-opt" value={form.ciudad}
                onChange={e => set("ciudad", e.target.value)} disabled={!form.departamento}>
                <option value="">SELECCIONE...</option>
                {cities.map(c => <option key={c}>{c}</option>)}
              </select>
            </Field>
          </div>
          <div className="frow">
            <Field label="DIRECCIÓN DE RESIDENCIA">
              <input className="fi fi-opt" value={form.direccion}
                onChange={e => set("direccion", e.target.value)} placeholder="OPCIONAL" />
            </Field>
            <div className="fg" />
          </div>
        </div>

        <div className="mfoot">
          <button className="btn-cancel" onClick={handleCancel}>CANCELAR</button>
          <button className={isDirty ? "btn-save" : "btn-save btn-save-disabled"}
            onClick={handleSave} disabled={!isDirty}>
            GUARDAR CLIENTE
          </button>
        </div>
      </div>

      {showConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <div className="confirm-icon">(!)</div>
            <div className="confirm-title">CAMBIOS SIN GUARDAR</div>
            <div className="confirm-msg">¿DESEA GUARDAR LOS CAMBIOS ANTES DE SALIR?</div>
            <div className="confirm-actions">
              <button className="btn-cancel" onClick={() => { setShowConfirm(false); onCancel(); }}>DESCARTAR</button>
              <button className="btn-save"   onClick={() => { setShowConfirm(false); handleSave(); }}>GUARDAR</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// ── ClientCard ─────────────────────────────────────────────────────────────────
function ClientCard({ client, onEdit }) {
  const { allFilled } = completeness(client);
  const [bg, fg] = avColor(client.primerNombre);
  const initials = ((client.primerNombre?.[0]||"") + (client.primerApellido?.[0]||"")).toUpperCase();
  return (
    <div className="ccard" onClick={() => onEdit(client)}>
      <div className="ccard-bar" style={{background: bg}} />
      <div className="ccard-av" style={{background: bg, color: fg}}>{initials || "?"}</div>
      <div className="ccard-info">
        <div className="ccard-name">{client.nombreCompleto}</div>
        <div className="ccard-meta">
          <span className="dbadge">{client.tipoDoc}</span>
          <span className="dnum">{client.numDoc}</span>
          {client.celular && <><span className="cdot">-</span><span className="cmeta">{client.celular}</span></>}
          {client.ciudad  && <><span className="cdot">-</span><span className="cmeta">{client.ciudad}</span></>}
        </div>
      </div>
      <div className="ccard-right">
        {client.fechaCreacion && <span className="ccard-fecha">{client.fechaCreacion}</span>}
        {allFilled
          ? <span className="flag-ok">[F]</span>
          : <span className="flag-pend">[F]</span>
        }
      </div>
    </div>
  );
}

// ── ClientesView ───────────────────────────────────────────────────────────────
function ClientesView({ clients, setClients, onBack }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState(null);
  const [search, setSearch]     = useState("");

  const save = data => {
    if (editing) setClients(cs => cs.map(c => c.id === editing.id ? {...data, id: c.id, fechaCreacion: c.fechaCreacion} : c));
    else         setClients(cs => [{...data, id: Date.now(), fechaCreacion: new Date().toLocaleDateString("es-CO")}, ...cs]);
    setShowForm(false);
    setEditing(null);
  };

  const filtered = clients.filter(c => {
    const q = search.toUpperCase();
    return !q || c.nombreCompleto?.includes(q) || c.numDoc?.includes(q);
  });

  const complete = clients.filter(c => completeness(c).allFilled).length;

  return (
    <div className="view">
      <div className="clientes-hero">
        <button className="btn-back-hero" onClick={onBack}>ATRAS</button>
        <div className="clientes-hero-center">
          <svg className="clientes-hero-avatar" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="40" cy="28" r="18" fill="rgba(255,255,255,0.9)"/>
            <ellipse cx="40" cy="70" rx="28" ry="18" fill="rgba(255,255,255,0.9)"/>
          </svg>
          <div className="clientes-hero-title">CLIENTES</div>
        </div>
        <button className="btn-primary-hero" onClick={() => { setEditing(null); setShowForm(true); }}>
          + NUEVO
        </button>
      </div>
      <div className="srch-wrap">
        <span className="srch-ico">[BUSCAR]</span>
        <input className="srch" placeholder="BUSCAR POR NOMBRE O DOCUMENTO..."
          value={search} onChange={e => setSearch(e.target.value)} />
        {search && <button className="srch-clr" onClick={() => setSearch("")}>x</button>}
      </div>
      <div className="clist">
        {filtered.length === 0
          ? <div className="empty">SIN REGISTROS</div>
          : filtered.map(c => (
              <ClientCard key={c.id} client={c}
                onEdit={cl => { setEditing(cl); setShowForm(true); }} />
            ))
        }
      </div>
      {showForm && (
        <ClientForm initial={editing} onSave={save}
          onCancel={() => { setShowForm(false); setEditing(null); }} />
      )}
    </div>
  );
}

// ── Vehículos data ─────────────────────────────────────────────────────────────
const CLASES = ["AUTOMÓVIL","CAMIONETA","CAMPERO","MICROBÚS","BUS","BUSETA","CAMIÓN","VOLQUETA",
  "MOTOCICLETA","MOTOTRICICLO","CUATRIMOTO","TRACTOCAMIÓN","MOTOCARRO","OTRO"];

const CARROCERIAS = ["SEDAN","HATCHBACK","WAGON","SUV","PICKUP","COUPE","CONVERTIBLE","VAN",
  "MINIVAN","FURGÓN","PLATAFORMA","CISTERNA","VOLTEO","OTRO"];

const COMBUSTIBLES = ["GASOLINA","DIESEL","GAS","MIXTO","ELÉCTRICO","HIDRÓGENO","ETANOL","BIODIÉSEL"];

const SERVICIO = ["PARTICULAR","PÚBLICO","OFICIAL","DIPLOMÁTICO","ESPECIAL","OTRO"];


const BLINDAJES = ["SIN BLINDAJE","I","II","III","IV","V","VI","VII","VIII","IX","X"];

const currentYear = new Date().getFullYear();
const YEAR_MIN = 1900;
const YEAR_MAX = currentYear + 1;

// Campos obligatorios: placa, marca, linea, anio, servicio, organismoTransito
// Opcionales: todo lo demás
function vComleteness(v) {
  const all = ["placa","marca","linea","anio","cilindraje","color","servicio","clase",
               "carroceria","combustible","capacidad","numMotor","vin","numSerie","numChasis",
               "fechaMatricula","organismoTransito","blindaje"];
  const pending = all.filter(f => !v[f] || v[f]==="SIN BLINDAJE" && f==="blindaje" ? false : !v[f]).length;
  // blindaje siempre tiene valor por defecto, no cuenta como pendiente
  const realPending = ["placa","marca","linea","anio","cilindraje","color","servicio","clase",
    "carroceria","combustible","capacidad","numMotor","vin","numSerie","numChasis",
    "fechaMatricula","organismoTransito"].filter(f => !v[f]).length;
  return { allFilled: realPending === 0, pending: realPending };
}

// ── VehiculoForm ───────────────────────────────────────────────────────────────
function VehiculoForm({ initial, onSave, onCancel }) {
  const blank = {
    placa:"", marca:"", linea:"", anio:"", cilindraje:"", color:"", servicio:"",
    clase:"", carroceria:"", combustible:"", capacidad:"",
    numMotor:"", vin:"", numSerie:"", numChasis:"",
    fechaMatricula:"", organismoTransito:"", blindaje:"SIN BLINDAJE"
  };
  const [form, setForm] = useState(initial ? {...initial} : blank);
  const [errors, setErrors] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);

  const original = initial || blank;
  const isDirty = Object.keys(original).some(k => (form[k]||"") !== (original[k]||""));

  const set = (field, raw) => {
    const val = field === "placa" ? up(raw).replace(/[^A-Z0-9]/g,"") : up(raw);
    setForm(f => ({...f, [field]: val}));
    if (errors[field]) setErrors(e => ({...e, [field]: ""}));
  };

  const setRaw = (field, val) => {
    setForm(f => ({...f, [field]: val}));
    if (errors[field]) setErrors(e => ({...e, [field]: ""}));
  };

  const blockTab = field => e => {
    if (e.key === "Tab" && !form[field]) {
      e.preventDefault();
      setErrors(p => ({...p, [field]: "CAMPO OBLIGATORIO"}));
    }
  };

  const handleSave = () => {
    const e = {};
    if (!form.placa)             e.placa = "REQUERIDO";
    else if (!/^[A-Z0-9]{3,7}$/.test(form.placa)) e.placa = "PLACA INVÁLIDA";
    if (!form.marca)             e.marca = "REQUERIDO";
    if (!form.linea)             e.linea = "REQUERIDO";
    if (!form.anio)              e.anio  = "REQUERIDO";
    else if (parseInt(form.anio,10) < 1900)      e.anio = "MÍNIMO 1900";
    else if (parseInt(form.anio,10) > YEAR_MAX)  e.anio = "MÁXIMO " + YEAR_MAX;
    if (!form.servicio)          e.servicio = "REQUERIDO";
    if (!form.organismoTransito) e.organismoTransito = "REQUERIDO";
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave({...form});
  };

  const handleCancel = () => {
    if (isDirty) setShowConfirm(true);
    else onCancel();
  };

  return (
    <div className="overlay">
      <div className="modal">
        <div className="mhead">
          <div className="mhead-l">
            <div className="mico">{initial ? "✏" : "+"}</div>
            <div>
              <div className="mtitle">{initial ? (initial.placa + " - " + initial.marca) : "NUEVO VEHÍCULO"}</div>
              <div className="msub">LOS CAMPOS * SON OBLIGATORIOS</div>
            </div>
          </div>
          <div style={{display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4}}>
            {initial?.fechaCreacion && (
              <div className="mhead-fecha">📅 {initial.fechaCreacion}</div>
            )}
            <button className="mclose" onClick={handleCancel}>x</button>
          </div>
        </div>

        <div className="mbody">

          {/* ── CARA DELANTERA ── */}
          <div className="sec-head"><span>IDENTIFICACIÓN PRINCIPAL</span></div>
          <div className="frow">
            <Field label="PLACA" required error={errors.placa}>
              <input className={errors.placa ? "fi fi-err" : "fi"} value={form.placa}
                onChange={e => set("placa", e.target.value)} onKeyDown={blockTab("placa")}
                maxLength={7} placeholder="ABC123" />
            </Field>
            <Field label="MARCA" required error={errors.marca}>
              <input className={errors.marca ? "fi fi-err" : "fi"} value={form.marca}
                onChange={e => set("marca", e.target.value)} onKeyDown={blockTab("marca")}
                placeholder="EJ: TOYOTA" />
            </Field>
          </div>
          <div className="frow">
            <Field label="LÍNEA" required error={errors.linea}>
              <input className={errors.linea ? "fi fi-err" : "fi"} value={form.linea}
                onChange={e => set("linea", e.target.value)} onKeyDown={blockTab("linea")}
                placeholder="EJ: COROLLA" />
            </Field>
            <Field label="MODELO (AÑO)" required error={errors.anio}>
              <input
                className={errors.anio ? "fi fi-err" : "fi"}
                value={form.anio}
                onChange={e => {
                  const v = e.target.value.replace(/\D/g,"").slice(0,4);
                  const num = parseInt(v, 10);
                  if (v.length === 4 && num > YEAR_MAX) return;
                  setForm(f=>({...f, anio:v}));
                  if(errors.anio) setErrors(er=>({...er,anio:""}));
                }}
                onKeyDown={blockTab("anio")}
                inputMode="numeric" maxLength={4}
                placeholder={"1900 - " + YEAR_MAX}
              />
            </Field>
          </div>
          <div className="frow">
            <Field label="CILINDRAJE CC">
              <input className="fi fi-opt" value={form.cilindraje}
                onChange={e => {
                  const v = e.target.value.replace(/\D/g,"");
                  setForm(f=>({...f, cilindraje:v}));
                }}
                inputMode="numeric" placeholder="EJ: 5663" />
            </Field>
            <Field label="COLOR">
              <input className="fi fi-opt" value={form.color}
                onChange={e => set("color", e.target.value)} placeholder="EJ: BLANCO" />
            </Field>
          </div>
          <div className="frow">
            <Field label="SERVICIO" required error={errors.servicio}>
              <select className={errors.servicio ? "fi fi-err" : "fi"} value={form.servicio}
                onChange={e => set("servicio", e.target.value)} onKeyDown={blockTab("servicio")}>
                <option value="">SELECCIONE...</option>
                {SERVICIO.map(s => <option key={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="CLASE DE VEHÍCULO">
              <select className="fi fi-opt" value={form.clase}
                onChange={e => set("clase", e.target.value)}>
                <option value="">SELECCIONE...</option>
                {CLASES.map(c => <option key={c}>{c}</option>)}
              </select>
            </Field>
          </div>
          <div className="frow">
            <Field label="TIPO CARROCERÍA">
              <select className="fi fi-opt" value={form.carroceria}
                onChange={e => set("carroceria", e.target.value)}>
                <option value="">SELECCIONE...</option>
                {CARROCERIAS.map(c => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="COMBUSTIBLE">
              <select className="fi fi-opt" value={form.combustible}
                onChange={e => set("combustible", e.target.value)}>
                <option value="">SELECCIONE...</option>
                {COMBUSTIBLES.map(c => <option key={c}>{c}</option>)}
              </select>
            </Field>
          </div>
          <div className="frow">
            <Field label="CAPACIDAD KG/PSJ">
              <input className="fi fi-opt" value={form.capacidad}
                onChange={e => set("capacidad", e.target.value)} placeholder="OPCIONAL" />
            </Field>
            <div className="fg" />
          </div>

          <div className="sec-head"><span>NÚMEROS DE IDENTIFICACIÓN</span></div>
          <div className="frow">
            <Field label="NÚMERO DE MOTOR">
              <input className="fi fi-opt" value={form.numMotor}
                onChange={e => set("numMotor", e.target.value)} placeholder="OPCIONAL" />
            </Field>
            <Field label="VIN">
              <input className="fi fi-opt" value={form.vin}
                onChange={e => set("vin", e.target.value)} placeholder="OPCIONAL" />
            </Field>
          </div>
          <div className="frow">
            <Field label="NÚMERO DE SERIE">
              <input className="fi fi-opt" value={form.numSerie}
                onChange={e => set("numSerie", e.target.value)} placeholder="OPCIONAL" />
            </Field>
            <Field label="NÚMERO DE CHASIS">
              <input className="fi fi-opt" value={form.numChasis}
                onChange={e => set("numChasis", e.target.value)} placeholder="OPCIONAL" />
            </Field>
          </div>

          {/* ── CARA TRASERA ── */}
          <div className="sec-head"><span>INFORMACIÓN ADICIONAL</span></div>
          <div className="frow">
            <Field label="FECHA MATRÍCULA">
              <input className="fi fi-opt" type="date" value={form.fechaMatricula}
                onChange={e => setRaw("fechaMatricula", e.target.value)} />
            </Field>
            <Field label="BLINDAJE">
              <select className="fi fi-opt" value={form.blindaje}
                onChange={e => set("blindaje", e.target.value)}>
                {BLINDAJES.map(b => <option key={b}>{b}</option>)}
              </select>
            </Field>
          </div>
          <div className="frow">
            <Field label="MATRICULADO EN (ORGANISMO DE TRÁNSITO)" required error={errors.organismoTransito}>
              <input className={errors.organismoTransito ? "fi fi-err" : "fi"} value={form.organismoTransito}
                onChange={e => set("organismoTransito", e.target.value)}
                onKeyDown={blockTab("organismoTransito")}
                placeholder="EJ: SDM - BOGOTÁ D.C." />
            </Field>
            <div className="fg" />
          </div>

        </div>

        <div className="mfoot">
          <button className="btn-cancel" onClick={handleCancel}>CANCELAR</button>
          <button className={isDirty ? "btn-save" : "btn-save btn-save-disabled"}
            onClick={handleSave} disabled={!isDirty}>
            GUARDAR VEHÍCULO
          </button>
        </div>
      </div>

      {showConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <div className="confirm-icon">(!)</div>
            <div className="confirm-title">CAMBIOS SIN GUARDAR</div>
            <div className="confirm-msg">¿DESEA GUARDAR LOS CAMBIOS ANTES DE SALIR?</div>
            <div className="confirm-actions">
              <button className="btn-cancel" onClick={() => { setShowConfirm(false); onCancel(); }}>DESCARTAR</button>
              <button className="btn-save"   onClick={() => { setShowConfirm(false); handleSave(); }}>GUARDAR</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── VehiculoCard ───────────────────────────────────────────────────────────────
function VehiculoCard({ vehiculo, onEdit }) {
  const { allFilled } = vComleteness(vehiculo);
  return (
    <div className="ccard" onClick={() => onEdit(vehiculo)}>
      <div className="ccard-bar" style={{background: "#4a7ab5"}} />
      <div className="ccard-av" style={{background: "#dceaf5", color: "#1a3f60", fontSize: "18px"}}>🚗</div>
      <div className="ccard-info">
        <div className="ccard-name">{vehiculo.placa} - {vehiculo.marca} {vehiculo.linea}</div>
        <div className="ccard-meta">
          <span className="dbadge">{vehiculo.anio}</span>
          {vehiculo.color  && <><span className="cdot">-</span><span className="cmeta">{vehiculo.color}</span></>}
          {vehiculo.clase  && <><span className="cdot">-</span><span className="cmeta">{vehiculo.clase}</span></>}
        </div>
      </div>
      <div className="ccard-right">
        {vehiculo.fechaCreacion && <span className="ccard-fecha">{vehiculo.fechaCreacion}</span>}
        {allFilled ? <span className="flag-ok">[F]</span> : <span className="flag-pend">[F]</span>}
      </div>
    </div>
  );
}

// ── VehiculosView ──────────────────────────────────────────────────────────────
function VehiculosView({ vehiculos, setVehiculos, onBack }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState(null);
  const [search, setSearch]     = useState("");

  const save = data => {
    if (editing) setVehiculos(vs => vs.map(v => v.id === editing.id ? {...data, id: v.id, fechaCreacion: v.fechaCreacion} : v));
    else         setVehiculos(vs => [{...data, id: Date.now(), fechaCreacion: new Date().toLocaleDateString("es-CO")}, ...vs]);
    setShowForm(false);
    setEditing(null);
  };

  const filtered = vehiculos.filter(v => {
    const q = search.toUpperCase();
    return !q || v.placa?.includes(q) || v.marca?.includes(q) || v.linea?.includes(q);
  });

  return (
    <div className="view">
      <div className="clientes-hero">
        <button className="btn-back-hero" onClick={onBack}>ATRAS</button>
        <div className="clientes-hero-center">
          <svg className="clientes-hero-avatar" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 32 L25 16 Q28 12 34 12 L66 12 Q72 12 75 16 L85 32 L90 34 Q94 36 94 40 L94 46 Q94 48 92 48 L82 48 Q82 52 78 52 Q74 52 74 48 L26 48 Q26 52 22 52 Q18 52 18 48 L8 48 Q6 48 6 46 L6 40 Q6 36 10 34 Z" fill="rgba(255,255,255,0.92)"/>
            <path d="M28 18 L35 18 L35 30 L18 30 L22 20 Z" fill="#2c5f8a" opacity="0.5"/>
            <path d="M40 18 L60 18 L60 30 L40 30 Z" fill="#2c5f8a" opacity="0.5"/>
            <path d="M65 18 L72 18 L78 30 L65 30 Z" fill="#2c5f8a" opacity="0.5"/>
            <circle cx="26" cy="48" r="7" fill="#2c5f8a"/>
            <circle cx="26" cy="48" r="3.5" fill="rgba(255,255,255,0.6)"/>
            <circle cx="74" cy="48" r="7" fill="#2c5f8a"/>
            <circle cx="74" cy="48" r="3.5" fill="rgba(255,255,255,0.6)"/>
            <rect x="7" y="34" width="8" height="5" rx="1" fill="#f5c842" opacity="0.9"/>
            <rect x="85" y="34" width="8" height="5" rx="1" fill="#f5c842" opacity="0.9"/>
          </svg>
          <div className="clientes-hero-title">VEHÍCULOS</div>
        </div>
        <button className="btn-primary-hero" onClick={() => { setEditing(null); setShowForm(true); }}>
          + NUEVO
        </button>
      </div>

      <div className="srch-wrap">
        <span className="srch-ico">[BUSCAR]</span>
        <input className="srch" placeholder="BUSCAR POR PLACA, MARCA O LÍNEA..."
          value={search} onChange={e => setSearch(e.target.value)} />
        {search && <button className="srch-clr" onClick={() => setSearch("")}>x</button>}
      </div>

      <div className="clist">
        {filtered.length === 0
          ? <div className="empty">SIN REGISTROS</div>
          : filtered.map(v => (
              <VehiculoCard key={v.id} vehiculo={v}
                onEdit={veh => { setEditing(veh); setShowForm(true); }} />
            ))
        }
      </div>

      {showForm && (
        <VehiculoForm initial={editing} onSave={save}
          onCancel={() => { setShowForm(false); setEditing(null); }} />
      )}
    </div>
  );
}

// ── LiquidacionesView ──────────────────────────────────────────────────────────
const TRAMITES_LIQ = [
  "Matricula / Registro","Traspaso","Translado Matricula / Registro",
  "Radicado Matricula / Registro","Cambio de Color","Cambio de Servicio",
  "Regrabar Motor","Regrabar Chasis","Transformacion",
  "Duplicado Licencia Transito","Inscripcion Prenda","Levantamiento Prenda",
  "Cancelacion Matricula / Registro","Cambio de Placas","Duplicado de Placas",
  "Rematricula","Cambio de Carroceria","Otros",
];
const anioActual = new Date().getFullYear();
function fmt(n) {
  const num = Number(n||0);
  return num.toLocaleString("es-CO", {style:"currency", currency:"COP", minimumFractionDigits:0, maximumFractionDigits:0});
}

function NuevaLiquidacionForm({ clients, vehiculos, onGuardar, onCancel, initial }) {
  const [dirigida, setDirigida] = useState(initial?.dirigida || "interese");
  const [clienteId, setClienteId] = useState(initial?.cliente?.id || null);
  const [searchCliente, setSearchCliente] = useState("");
  const [vehiculoId, setVehiculoId] = useState(initial?.vehiculo?.id || null);
  const [searchVehiculo, setSearchVehiculo] = useState("");
  const [tramites, setTramites] = useState(() => {
    if (!initial) return {};
    const t = {};
    (initial.tramites||[]).forEach(x => { t[x] = true; });
    return t;
  });
  const [valores, setValores] = useState(initial?.valores || {});
  const [imp, setImpState] = useState(initial?.imp || {
    impTransAnt:"",impGobAnt:"",
    impTransAct:"",impGobAct:"",
    impTransActPagado:false,impGobActPagado:false,
    comparendos:"",multas:"",
    retencion:"",derechos:"",
    gestoria:"0",envios:"0",otrosGastos:"0",
  });
  const [showConfirm, setShowConfirm] = useState(false);

  const hayTraspaso = tramites["Traspaso"];
  const setImp = (k,v) => setImpState(p=>({...p,[k]:v}));
  const setValor = (k,v) => setValores(p=>({...p,[k]:v.replace(/\D/g,"")}));
  const fmtInput = (v) => {
    if (!v) return "";
    const n = Number(v);
    if (isNaN(n)) return v;
    return n.toLocaleString("es-CO");
  };
  const parseFmt = (v) => v.replace(/\D/g,"");
  const toggleT = (t) => setTramites(p=>({...p,[t]:!p[t]}));

  const cFilt = clients.filter(c => {
    const q = searchCliente.toUpperCase();
    return !q || c.nombreCompleto?.includes(q) || c.numDoc?.includes(q);
  });
  const vFilt = vehiculos.filter(v => {
    const q = searchVehiculo.toUpperCase();
    return !q || v.placa?.includes(q) || v.marca?.includes(q);
  });
  const cSel = clienteId ? clients.find(c=>c.id===clienteId) : null;
  const vSel = vehiculoId ? vehiculos.find(v=>v.id===vehiculoId) : null;
  const tSel = TRAMITES_LIQ.filter(t=>tramites[t]);

  const calcTotal = () => {
    let t = 0;
    tSel.forEach(x => {
      if (x !== "Traspaso") t += Number(valores[x]||0);
    });
    t += Number(imp.impTransAnt||0) + Number(imp.impGobAnt||0);
    if (!imp.impTransActPagado) t += Number(imp.impTransAct||0);
    if (!imp.impGobActPagado)   t += Number(imp.impGobAct||0);
    t += Number(imp.multas||0);
    t += Number(imp.gestoria||0);
    t += Number(imp.envios||0);
    t += Number(imp.otrosGastos||0);
    if (hayTraspaso) {
      t += Number(imp.retencion||0);
      t += Number(imp.derechos||0);
    }
    return t;
  };

  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const handleCancel = () => {
    const hayDatos = dirigida === "cliente" ? clienteId !== null : false;
    const hayAlgo = hayDatos || vehiculoId !== null || tSel.length > 0;
    if (hayAlgo) setShowCancelConfirm(true);
    else onCancel();
  };
  const valoresValidos = tSel.every(t => {
    if (t === "Traspaso") return Number(imp.retencion||0) >= 10000 && Number(imp.derechos||0) >= 10000;
    return Number(valores[t]||0) >= 10000;
  });
  const dirigidaLista = dirigida === "interese" || (dirigida === "cliente" && clienteId !== null);
  const vehiculoListo = dirigidaLista && vehiculoId !== null;
  const tramitesListos = vehiculoListo && tSel.length > 0 && valoresValidos;
  const puedeGuardar = tramitesListos;

  return (
    <div className="overlay">
      <div className="modal" style={{maxHeight:"92vh"}}>
        <div className="mhead" style={{background:"linear-gradient(135deg,#12151e,#1a1f2e)"}}>
          <div className="mhead-l"><div>
            <div className="mtitle" style={{color:"#fff"}}>{initial ? "EDITAR LIQUIDACION" : "NUEVA LIQUIDACION"}</div>
            <div className="msub" style={{color:"#f5a623"}}>Complete los campos requeridos</div>
          </div></div>
          <button className="mclose" onClick={onCancel}>x</button>
        </div>
        <div className="mbody">

          <div className="sec-head"><span>DIRIGIDA A</span></div>
          <div className="liq-radio-group">
            <label className={"liq-radio"+(dirigida==="interese"?" liq-radio-active":"")}>
              <input type="radio" checked={dirigida==="interese"} onChange={()=>{setDirigida("interese");setClienteId(null);}} /> A QUIEN INTERESE
            </label>
            <label className={"liq-radio"+(dirigida==="cliente"?" liq-radio-active":"")}>
              <input type="radio" checked={dirigida==="cliente"} onChange={()=>setDirigida("cliente")} /> CLIENTE ESPECIFICO
            </label>
          </div>
          {dirigida==="cliente" && (
            <div className="liq-search-box">
              {cSel ? (
                <div className="liq-sel-pill">{cSel.nombreCompleto} - {cSel.tipoDoc} {cSel.numDoc}
                  <button className="liq-sel-clear" onClick={()=>{setClienteId(null);setSearchCliente("");}}>x</button>
                </div>
              ) : (
                <>
                  <input className="fi fi-opt" value={searchCliente} onChange={e=>setSearchCliente(e.target.value)} placeholder="BUSCAR POR NOMBRE O CEDULA..." />
                  <div className="cselector-list" style={{maxHeight:160,border:"1px solid var(--bd)",borderRadius:7}}>
                    {cFilt.slice(0,8).map(c=>(
                      <div key={c.id} className="cselector-item" onClick={()=>{setClienteId(c.id);setSearchCliente("");}}>
                        <div className="cselector-name">{c.nombreCompleto}</div>
                        <div className="cselector-doc">{c.tipoDoc} {c.numDoc}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          <div className="sec-head"><span>VEHICULO *</span></div>
          {!dirigidaLista ? (
            <div className="liq-locked">Complete la sección anterior primero</div>
          ) : (
          <div className="liq-search-box">
            {vSel ? (
              <div className="liq-sel-pill">{vSel.placa} - {vSel.marca} {vSel.linea} {vSel.anio}
                <button className="liq-sel-clear" onClick={()=>{setVehiculoId(null);setSearchVehiculo("");}}>x</button>
              </div>
            ) : (
              <>
                <input className="fi fi-opt" value={searchVehiculo} onChange={e=>setSearchVehiculo(e.target.value)} placeholder="BUSCAR POR PLACA O MARCA..." />
                <div className="cselector-list" style={{maxHeight:160,border:"1px solid var(--bd)",borderRadius:7}}>
                  {vFilt.slice(0,8).map(v=>(
                    <div key={v.id} className="cselector-item" onClick={()=>{setVehiculoId(v.id);setSearchVehiculo("");}}>
                      <div className="cselector-name">{v.placa} - {v.marca} {v.linea}</div>
                      <div className="cselector-doc">{v.anio} - {v.color}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
          )}

          <div className="sec-head"><span>TRAMITES * (min. 1)</span></div>
          {!vehiculoListo ? (
            <div className="liq-locked">Seleccione un vehiculo primero</div>
          ) : (
            <div className="liq-tramites">
              {TRAMITES_LIQ.map(t=>(
                <div key={t} className={"liq-tramite"+(tramites[t]?" liq-tramite-active":"")}>
                  <label className="liq-check-label">
                    <input type="checkbox" checked={!!tramites[t]} onChange={()=>toggleT(t)} />
                    <span>{t}</span>
                  </label>
                  {tramites[t] && t !== "Traspaso" && (
                    <div>
                      <input className="fi fi-opt liq-valor-input"
                        value={valores[t] ? ("$ "+fmtInput(valores[t])) : ""} onChange={e=>setValor(t,parseFmt(e.target.value))}
                        inputMode="numeric" placeholder="$ VALOR (min. 5 cifras)" />
                      {valores[t] && Number(valores[t])<10000 && (
                        <div style={{fontSize:10,color:"var(--red)",marginTop:3}}>El valor debe tener al menos 5 cifras</div>
                      )}
                    </div>
                  )}
                  {tramites[t] && t === "Traspaso" && (
                    <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:8}}>
                      <div>
                        <div style={{fontSize:10,fontWeight:600,color:"var(--tx3)",marginBottom:3}}>RETENCION EN LA FUENTE</div>
                        <input className="fi fi-opt liq-valor-input"
                          value={imp.retencion ? ("$ "+fmtInput(imp.retencion)) : ""} onChange={e=>setImp("retencion",parseFmt(e.target.value))}
                          inputMode="numeric" placeholder="$ VALOR (min. 5 cifras)" />
                        {imp.retencion && Number(imp.retencion)<10000 && (
                          <div style={{fontSize:10,color:"var(--red)",marginTop:3}}>El valor debe tener al menos 5 cifras</div>
                        )}
                      </div>
                      <div>
                        <div style={{fontSize:10,fontWeight:600,color:"var(--tx3)",marginBottom:3}}>DERECHOS DE TRASPASO</div>
                        <input className="fi fi-opt liq-valor-input"
                          value={imp.derechos ? ("$ "+fmtInput(imp.derechos)) : ""} onChange={e=>setImp("derechos",parseFmt(e.target.value))}
                          inputMode="numeric" placeholder="$ VALOR (min. 5 cifras)" />
                        {imp.derechos && Number(imp.derechos)<10000 && (
                          <div style={{fontSize:10,color:"var(--red)",marginTop:3}}>El valor debe tener al menos 5 cifras</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="sec-head"><span>IMPUESTOS Y GASTOS</span></div>
          {!tramitesListos ? (
            <div className="liq-locked">Complete y valore los tramites primero</div>
          ) : (
            <>
              {[{k:"impTransAnt",label:"Impuesto de Transito Anteriores al "+anioActual},{k:"impGobAnt",label:"Impuesto de Gobernacion Anteriores al "+anioActual}].map(({k,label})=>(
                <div key={k} className="liq-imp-row">
                  <span className="liq-imp-label">{label}</span>
                  <input className="fi fi-opt liq-valor-input" value={imp[k] ? ("$ "+fmtInput(imp[k])) : ""} onChange={e=>setImp(k,parseFmt(e.target.value))} inputMode="numeric" placeholder="$ 0" />
                </div>
              ))}
              {[{k:"impTransAct",pk:"impTransActPagado",label:"Impuesto de Transito "+anioActual},{k:"impGobAct",pk:"impGobActPagado",label:"Impuesto de Gobernacion "+anioActual}].map(({k,pk,label})=>(
                <div key={k} className="liq-imp-row" style={{flexDirection:"column",alignItems:"flex-start",gap:6}}>
                  <span className="liq-imp-label">{label}</span>
                  <div style={{display:"flex",gap:10,alignItems:"center",width:"100%"}}>
                    <label className="liq-pagado-check">
                      <input type="checkbox" checked={imp[pk]} onChange={e=>setImp(pk,e.target.checked)} /> YA PAGADO
                    </label>
                    <input className="fi fi-opt liq-valor-input" style={{flex:1}} value={imp[k] ? ("$ "+fmtInput(imp[k])) : ""} onChange={e=>setImp(k,parseFmt(e.target.value))} inputMode="numeric" placeholder={imp[pk]?"$ Valor pagado":"$ 0"} />
                  </div>
                </div>
              ))}
              <div className="liq-imp-row">
                <span className="liq-imp-label">Comparendos <span style={{fontSize:10,color:"var(--tx3)"}}>no suma</span></span>
                <input className="fi fi-opt liq-valor-input" value={imp.comparendos ? ("$ "+fmtInput(imp.comparendos)) : ""} onChange={e=>setImp("comparendos",parseFmt(e.target.value))} inputMode="numeric" placeholder="$ 0" />
              </div>
              <div className="liq-imp-row">
                <span className="liq-imp-label">Multas <span style={{fontSize:10,color:"var(--red)"}}>suma</span></span>
                <input className="fi fi-opt liq-valor-input" value={imp.multas ? ("$ "+fmtInput(imp.multas)) : ""} onChange={e=>setImp("multas",parseFmt(e.target.value))} inputMode="numeric" placeholder="$ 0" />
              </div>
              <div className="liq-imp-row">
                <span className="liq-imp-label">Gestoria</span>
                <input className="fi fi-opt liq-valor-input" value={imp.gestoria ? ("$ "+fmtInput(imp.gestoria)) : ""} onChange={e=>setImp("gestoria",parseFmt(e.target.value))} inputMode="numeric" placeholder="$ 0" />
              </div>
              <div className="liq-imp-row">
                <span className="liq-imp-label">Correspondencia</span>
                <input className="fi fi-opt liq-valor-input" value={imp.envios ? ("$ "+fmtInput(imp.envios)) : ""} onChange={e=>setImp("envios",parseFmt(e.target.value))} inputMode="numeric" placeholder="$ 0" />
              </div>
              <div className="liq-imp-row">
                <span className="liq-imp-label">Otros Gastos</span>
                <input className="fi fi-opt liq-valor-input" value={imp.otrosGastos ? ("$ "+fmtInput(imp.otrosGastos)) : ""} onChange={e=>setImp("otrosGastos",parseFmt(e.target.value))} inputMode="numeric" placeholder="$ 0" />
              </div>
            </>
          )}

          <div className="liq-total-box">
            <span className="liq-total-label">TOTAL LIQUIDACION</span>
            <span className="liq-total-valor">{fmt(calcTotal())}</span>
          </div>
        </div>
        <div className="mfoot" style={{flexDirection:"column",gap:8}}>
          <button className={puedeGuardar?"btn-save":"btn-save btn-save-disabled"} disabled={!puedeGuardar} onClick={()=>setShowConfirm(true)} style={{width:"100%"}}>GUARDAR LIQUIDACION</button>
          <button className="btn-cancel" style={{width:"100%",textAlign:"center"}} onClick={handleCancel}>CANCELAR</button>
        </div>
      </div>
      {showCancelConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <div className="confirm-icon">(!)</div>
            <div className="confirm-title">CANCELAR LIQUIDACION</div>
            <div className="confirm-msg">Si cancela perdera la informacion ingresada. ¿Desea continuar?</div>
            <div className="confirm-actions">
              <button className="btn-cancel" onClick={()=>setShowCancelConfirm(false)}>VOLVER</button>
              <button className="btn-save" style={{background:"var(--red)"}} onClick={()=>{setShowCancelConfirm(false);onCancel();}}>SI, CANCELAR</button>
            </div>
          </div>
        </div>
      )}
      {showConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <div className="confirm-title">CONFIRMAR LIQUIDACION</div>
            <div className="confirm-msg" style={{textAlign:"left"}}>
              <div className="resumen-row"><span className="resumen-label">DIRIGIDA A</span><div className="resumen-val">{dirigida==="interese"?"A QUIEN INTERESE":(cSel?cSel.nombreCompleto:"")}</div></div>
              <div className="resumen-row"><span className="resumen-label">VEHICULO</span><div className="resumen-val">{vSel?(vSel.placa+" - "+vSel.marca+" "+vSel.linea):""}</div></div>
              <div className="resumen-row"><span className="resumen-label">TRAMITES</span><div className="resumen-val">{tSel.join(", ")}</div></div>
              <div className="resumen-row"><span className="resumen-label">TOTAL</span><div className="resumen-val" style={{fontSize:16,fontWeight:800,color:"var(--acc)"}}>{fmt(calcTotal())}</div></div>
            </div>
            <div className="confirm-actions">
              <button className="btn-cancel" onClick={()=>setShowConfirm(false)}>CANCELAR</button>
              <button className="btn-save" onClick={()=>{
                onGuardar({id:Date.now(),fecha:new Date().toLocaleDateString("es-CO"),hora:new Date().toLocaleTimeString("es-CO",{hour:"2-digit",minute:"2-digit"}),dirigida,cliente:cSel,vehiculo:vSel,tramites:tSel,valores,imp,total:calcTotal()});
                setShowConfirm(false);
              }}>CONFIRMAR</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetalleLiquidacion({ liq, onClose, onEditar }) {
  const hayTraspaso = liq.tramites.includes("Traspaso");
  const imp = liq.imp || {};
  const veh = liq.vehiculo;

  const filas = [];
  liq.tramites.forEach(t => {
    if (t !== "Traspaso") filas.push({ label: t, valor: Number(liq.valores?.[t]||0), tipo:"tramite" });
  });
  if (Number(imp.impTransAnt||0)>0) filas.push({ label:"Impuesto de Transito Anteriores al "+anioActual, valor: Number(imp.impTransAnt), tipo:"impuesto" });
  if (Number(imp.impGobAnt||0)>0)  filas.push({ label:"Impuesto de Gobernacion Anteriores al "+anioActual, valor: Number(imp.impGobAnt), tipo:"impuesto" });
  filas.push({ label:"Impuesto de Transito "+anioActual, valor: Number(imp.impTransAct||0), tipo: imp.impTransActPagado?"pagado":"impuesto" });
  filas.push({ label:"Impuesto de Gobernacion "+anioActual, valor: Number(imp.impGobAct||0), tipo: imp.impGobActPagado?"pagado":"impuesto" });
  if (Number(imp.multas||0)>0)  filas.push({ label:"Multas del Propietario", valor: Number(imp.multas), tipo:"multa" });
  if (hayTraspaso && Number(imp.retencion||0)>0) filas.push({ label:"Retencion en la Fuente", valor: Number(imp.retencion), tipo:"tramite" });
  if (hayTraspaso && Number(imp.derechos||0)>0)  filas.push({ label:"Derechos de Traspaso", valor: Number(imp.derechos), tipo:"tramite" });
  if (Number(imp.gestoria||0)>0)    filas.push({ label:"Gestoria", valor: Number(imp.gestoria), tipo:"tramite" });
  if (Number(imp.envios||0)>0)      filas.push({ label:"Correspondencia", valor: Number(imp.envios), tipo:"tramite" });
  if (Number(imp.otrosGastos||0)>0) filas.push({ label:"Otros Gastos", valor: Number(imp.otrosGastos), tipo:"tramite" });

  const colorFila = (tipo) => {
    if (tipo==="pagado")   return {bg:"#f0fff4", color:"#276749", badge:"YA PAGADO"};
    if (tipo==="multa")    return {bg:"#fff5f5", color:"#9b3030", badge:"AFECTA EL TRAMITE"};
    if (tipo==="impuesto") return {bg:"#f8faff", color:"#2c5f8a", badge:null};
    return {bg:"#fff", color:"var(--tx)", badge:null};
  };

  return (
    <div className="overlay">
      <div className="modal">
        <div className="mhead" style={{background:"linear-gradient(135deg,#12151e,#1a1f2e)"}}>
          <div className="mhead-l"><div>
            <div className="mtitle" style={{color:"#fff"}}>LIQUIDACION</div>
            <div className="msub" style={{color:"#f5a623"}}>{liq.fecha} - {liq.hora}</div>
          </div></div>
          <button className="mclose" onClick={onClose}>x</button>
        </div>

        <div className="mbody" style={{padding:0}}>
          <div style={{background:"linear-gradient(135deg,#1a1f2e,#2c3550)",padding:"16px 20px"}}>
            <div style={{color:"#f5a623",fontSize:9,fontWeight:700,letterSpacing:3,marginBottom:6}}>LIQUIDACION DE TRAMITE</div>
            <div style={{color:"rgba(255,255,255,0.7)",fontSize:11,marginBottom:12}}>
              {liq.dirigida==="interese" ? "A QUIEN INTERESE" : (liq.cliente ? liq.cliente.nombreCompleto+" - "+liq.cliente.tipoDoc+" "+liq.cliente.numDoc : "")}
            </div>
            {veh && (
              <div style={{background:"rgba(255,255,255,0.07)",borderRadius:8,padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{color:"#f5a623",fontSize:20,fontWeight:900,letterSpacing:4}}>{veh.placa}</div>
                  <div style={{color:"#fff",fontSize:12,fontWeight:600,marginTop:2}}>{veh.marca} {veh.linea} {veh.anio}</div>
                  <div style={{color:"rgba(255,255,255,0.45)",fontSize:10,marginTop:2}}>{veh.color} - {veh.servicio}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{color:"rgba(255,255,255,0.4)",fontSize:9,letterSpacing:1}}>CLASE</div>
                  <div style={{color:"#fff",fontSize:11,fontWeight:600}}>{veh.clase||"-"}</div>
                  <div style={{color:"rgba(255,255,255,0.4)",fontSize:9,letterSpacing:1,marginTop:6}}>MATRICULADO EN</div>
                  <div style={{color:"#fff",fontSize:10}}>{veh.organismoTransito||"-"}</div>
                </div>
              </div>
            )}
          </div>

          <div style={{padding:"0 16px 16px"}}>
            <div style={{fontSize:9,fontWeight:700,letterSpacing:2,color:"#8896a5",margin:"16px 0 8px"}}>DETALLE DE GASTOS</div>
            <div style={{border:"1px solid var(--bd)",borderRadius:10,overflow:"hidden"}}>
              {filas.map((f,i) => {
                const st = colorFila(f.tipo);
                return (
                  <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 14px",borderBottom:i<filas.length-1?"1px solid var(--bd)":"none",background:st.bg}}>
                    <div>
                      <div style={{fontSize:12,fontWeight:500,color:st.color}}>{f.label}</div>
                      {st.badge && <div style={{fontSize:9,color:st.color,fontWeight:700,letterSpacing:1,marginTop:1}}>{st.badge}</div>}
                    </div>
                    <div style={{fontSize:13,fontWeight:700,color:st.color}}>{fmt(f.valor)}</div>
                  </div>
                );
              })}
            </div>

            {Number(imp.comparendos||0)>0 && (
              <div style={{background:"#fff8e1",border:"1px solid #f5c842",borderRadius:8,padding:"10px 14px",marginTop:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontSize:12,fontWeight:600,color:"#7a5200"}}>Comparendos del Propietario</div>
                  <div style={{fontSize:9,color:"#7a5200",marginTop:2}}>NO INTERFIEREN EN EL TRAMITE - SOLO INFORMATIVO</div>
                </div>
                <div style={{fontSize:13,fontWeight:700,color:"#7a5200"}}>{fmt(Number(imp.comparendos))}</div>
              </div>
            )}

            <div style={{background:"linear-gradient(135deg,#12151e,#1a1f2e)",borderRadius:10,padding:"16px 18px",marginTop:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontSize:9,fontWeight:700,letterSpacing:3,color:"#8896a5"}}>TOTAL A PAGAR</div>
                <div style={{fontSize:9,color:"rgba(255,255,255,0.3)",marginTop:3}}>{liq.tramites.join(" - ")}</div>
              </div>
              <div style={{fontSize:26,fontWeight:900,color:"#f5a623"}}>{fmt(liq.total)}</div>
            </div>
          </div>
        </div>

        <div className="mfoot" style={{gap:8}}>
          <button className="btn-save" style={{flex:1}} onClick={onEditar}>EDITAR</button>
          <button className="btn-cancel" style={{flex:1,textAlign:"center"}} onClick={onClose}>CERRAR</button>
        </div>
      </div>
    </div>
  );
}

function LiquidacionesView({ clients, vehiculos, onBack }) {
  const [liquidaciones, setLiquidaciones] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState(null);
  const [liqSel, setLiqSel] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  const filtradas = liquidaciones.filter(l => {
    const q = busqueda.toUpperCase();
    if (!q) return true;
    const dirigidaStr = l.dirigida === "interese" ? "A QUIEN INTERESE" : (l.cliente ? l.cliente.nombreCompleto + " " + l.cliente.numDoc : "");
    return dirigidaStr.toUpperCase().includes(q) || l.vehiculo?.placa?.includes(q);
  });

  const handleGuardar = (liq) => {
    if (editando) {
      setLiquidaciones(ls => ls.map(l => l.id === editando.id ? {...liq, id: editando.id, fecha: editando.fecha, hora: editando.hora} : l));
      setEditando(null);
    } else {
      setLiquidaciones(ls => [liq, ...ls]);
    }
    setShowForm(false);
  };

  return (
    <div className="view">
      <div className="clientes-hero">
        <button className="btn-back-hero" onClick={onBack}>ATRAS</button>
        <div className="clientes-hero-center">
          <svg className="clientes-hero-avatar" viewBox="0 0 80 80" fill="none">
            <rect x="10" y="15" width="60" height="50" rx="4" fill="rgba(255,255,255,0.9)"/>
            <rect x="20" y="26" width="25" height="3" rx="1" fill="#4a7fa5"/>
            <rect x="20" y="33" width="35" height="3" rx="1" fill="#4a7fa5"/>
            <rect x="20" y="40" width="30" height="3" rx="1" fill="#4a7fa5"/>
            <rect x="20" y="47" width="20" height="3" rx="1" fill="#f5a623"/>
          </svg>
          <div className="clientes-hero-title">LIQUIDACIONES</div>
        </div>
        <button className="btn-primary-hero" onClick={() => { setEditando(null); setShowForm(true); }}>+ NUEVO</button>
      </div>

      {liquidaciones.length === 0 ? (
        <div className="empty">SIN LIQUIDACIONES REGISTRADAS</div>
      ) : (
        <div className="formularios-registros">
          <div className="srch-wrap" style={{marginBottom:12}}>
            <span className="srch-ico">[BUSCAR]</span>
            <input className="srch" placeholder="BUSCAR POR PLACA O A QUIEN VA DIRIGIDA..."
              value={busqueda} onChange={e => setBusqueda(e.target.value)} />
            {busqueda && <button className="srch-clr" onClick={() => setBusqueda("")}>x</button>}
          </div>
          {filtradas.length === 0
            ? <div className="empty" style={{marginBottom:8}}>SIN RESULTADOS</div>
            : filtradas.map(l => (
              <div key={l.id} className="formato-card formato-card-clickable" onClick={() => setLiqSel(l)}>
                <div className="formato-card-head">
                  <span className="formato-card-fecha">{l.fecha} - {l.hora}</span>
                  <span className="formato-card-arrow">{">"}</span>
                </div>
                <div className="formato-card-body">
                  <div className="formato-row"><span className="formato-label">DIRIGIDA A</span><span className="formato-val">{l.dirigida==="interese"?"A QUIEN INTERESE":(l.cliente?l.cliente.nombreCompleto:"")}</span></div>
                  <div className="formato-row"><span className="formato-label">VEHICULO</span><span className="formato-val">{l.vehiculo?(l.vehiculo.placa+" - "+l.vehiculo.marca+" "+l.vehiculo.linea):""}</span></div>
                  <div className="formato-row"><span className="formato-label">TOTAL</span><span className="formato-val" style={{color:"var(--acc)",fontWeight:700}}>{fmt(l.total)}</span></div>
                </div>
              </div>
            ))
          }
        </div>
      )}

      {showForm && (
        <NuevaLiquidacionForm
          clients={clients} vehiculos={vehiculos}
          initial={editando}
          onGuardar={handleGuardar}
          onCancel={() => { setShowForm(false); setEditando(null); }}
        />
      )}
      {liqSel && (
        <DetalleLiquidacion
          liq={liqSel}
          onClose={() => setLiqSel(null)}
          onEditar={() => { setEditando(liqSel); setLiqSel(null); setShowForm(true); }}
        />
      )}
    </div>
  );
}


// ── Helpers para Formularios ──────────────────────────────────────────────────────
function clienteElegible(c) {
  if (!c.tipoDoc || !c.numDoc || !c.primerNombre) return false;
  if (c.tipoDoc !== "NIT" && !c.primerApellido) return false;
  return true;
}

function vehiculoCompleto(v) {
  return vComleteness(v).allFilled;
}

// Para Formularios: no se exigen VIN, numSerie, numChasis, numMotor
function vehiculoElegibleFormatos(v) {
  const required = ["placa","marca","linea","anio","cilindraje","color","servicio",
    "clase","carroceria","combustible","fechaMatricula","organismoTransito"];
  return required.every(f => !!v[f]);
}

// ── Selector de cliente ────────────────────────────────────────────────────────
function ClienteSelector({ clients, value, onChange, label, onCrear, excludedIds = [] }) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(true);
  const [pendingClient, setPendingClient] = useState(null);

  const elegibles = clients.filter(c => clienteElegible(c) && !excludedIds.includes(c.id));
  const filtered = elegibles.filter(c => {
    const q = search.toUpperCase();
    return !q || c.nombreCompleto?.includes(q) || c.numDoc?.includes(q);
  });

  const selected = value ? clients.find(c => c.id === value) : null;

  const handleSelect = (c) => {
    const pending = getPendingFields(c);
    if (pending.length > 0) {
      setPendingClient({...c, pendingFields: pending});
    } else {
      onChange(c.id); setOpen(false); setSearch("");
    }
  };

  const confirmPending = () => {
    onChange(pendingClient.id); setOpen(false); setSearch(""); setPendingClient(null);
  };

  const FIELD_LABELS = {
    tipoDoc:"Tipo de Documento", numDoc:"N° de Documento", primerNombre:"Primer Nombre",
    segundoNombre:"Segundo Nombre", primerApellido:"Primer Apellido",
    segundoApellido:"Segundo Apellido", celular:"Celular", departamento:"Departamento",
    ciudad:"Ciudad", direccion:"Dirección", email:"Correo Electrónico",
    digitoVerificacion:"Dígito de Verificación"
  };

  const getPendingFields = (c) => {
    const esNit = c.tipoDoc === "NIT";
    const fields = ["tipoDoc","numDoc","primerNombre","celular","departamento","ciudad","direccion","email"];
    if (esNit) {
      fields.push("digitoVerificacion");
    } else {
      fields.push("primerApellido","segundoNombre","segundoApellido");
    }
    return fields.filter(f => !c[f]).map(f => FIELD_LABELS[f] || f);
  };

  return (
    <div className="cselector">
      <div className="cselector-label">{label}</div>

      {selected && !open ? (
        <div className="cselector-selected-pill" onClick={() => setOpen(true)}>
          <div className="csp-info">
            <div className="csp-name">{selected.nombreCompleto}</div>
            <div className="csp-doc">{selected.tipoDoc} {selected.numDoc}</div>
          </div>
          <div className="csp-right">
            {completeness(selected).allFilled
              ? <span className="flag-ok" style={{fontSize:18}}>[F]</span>
              : <span className="flag-pend" style={{fontSize:18}}>[F]</span>
            }
            <button className="csp-change">CAMBIAR</button>
          </div>
        </div>
      ) : (
        <div className="cselector-open">
          <div className="cselector-search-wrap">
            <span className="srch-ico">[BUSCAR]</span>
            <input className="cselector-search" placeholder="BUSCAR POR NOMBRE O DOCUMENTO..."
              value={search} onChange={e => setSearch(e.target.value)} />
            {search && <button className="srch-clr" onClick={() => setSearch("")}>x</button>}
          </div>
          <div className="cselector-list">
            {filtered.length === 0 && <div className="cselector-empty">SIN CLIENTES DISPONIBLES</div>}
            {filtered.map(c => {
              const { allFilled } = completeness(c);
              return (
                <div key={c.id}
                  className={`cselector-item${value===c.id?" cselector-active":""}`}
                  onClick={() => handleSelect(c)}>
                  <div className="cselector-item-row">
                    <div>
                      <div className="cselector-name">{c.nombreCompleto}</div>
                      <div className="cselector-doc">{c.tipoDoc} {c.numDoc}</div>
                    </div>
                    <span style={{fontSize:16, marginLeft:8}}>
                      {allFilled ? <span className="flag-ok">[F]</span> : <span className="flag-pend">[F]</span>}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <button className="cselector-crear" onClick={() => onCrear && onCrear()}>
            + CREAR NUEVO CLIENTE
          </button>
        </div>
      )}

      {/* Diálogo campos pendientes */}
      {pendingClient && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <div className="confirm-icon">(!)</div>
            <div className="confirm-title">CAMPOS PENDIENTES</div>
            <div className="confirm-msg">
              <strong>{pendingClient.nombreCompleto}</strong> tiene campos sin llenar:
              <ul className="pending-list">
                {pendingClient.pendingFields.map(f => <li key={f}>- {f}</li>)}
              </ul>
              ¿DESEA SELECCIONARLO DE TODAS FORMAS?
            </div>
            <div className="confirm-actions">
              <button className="btn-cancel" onClick={() => setPendingClient(null)}>CANCELAR</button>
              <button className="btn-save" onClick={confirmPending}>SÍ, CONTINUAR</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Selector de vehículo ───────────────────────────────────────────────────────
function VehiculoSelector({ vehiculos, value, onChange }) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(true);
  const [pendingVehiculo, setPendingVehiculo] = useState(null);

  const filtered = vehiculos.filter(v => {
    const q = search.toUpperCase();
    return !q || v.placa?.includes(q) || v.marca?.includes(q) || v.linea?.includes(q);
  });

  const selected = value ? vehiculos.find(v => v.id === value) : null;

  const VFIELD_LABELS = {
    placa:"Placa", marca:"Marca", linea:"Línea", anio:"Modelo",
    servicio:"Servicio", organismoTransito:"Matriculado en",
    cilindraje:"Cilindraje", color:"Color", clase:"Clase",
    carroceria:"Carrocería", combustible:"Combustible", capacidad:"Capacidad",
    numMotor:"N° Motor", vin:"VIN", numSerie:"N° Serie", numChasis:"N° Chasis",
    fechaMatricula:"Fecha Matrícula",
  };

  const getVPendingFields = (v) => {
    const fields = ["placa","marca","linea","anio","cilindraje","color","servicio","clase",
      "carroceria","combustible","capacidad","numMotor","vin","numSerie","numChasis",
      "fechaMatricula","organismoTransito"];
    return fields.filter(f => !v[f]).map(f => VFIELD_LABELS[f] || f);
  };

  const handleSelect = (v) => {
    const pending = getVPendingFields(v);
    if (pending.length > 0) {
      setPendingVehiculo({...v, pendingFields: pending});
    } else {
      onChange(v.id); setOpen(false); setSearch("");
    }
  };

  const confirmPendingV = () => {
    onChange(pendingVehiculo.id); setOpen(false); setSearch(""); setPendingVehiculo(null);
  };

  const isCompleto = (v) => getVPendingFields(v).length === 0;

  return (
    <div className="cselector">
      <div className="cselector-label">VEHÍCULO</div>

      {selected && !open ? (
        <div className="cselector-selected-pill" onClick={() => setOpen(true)}>
          <div className="csp-info">
            <div className="csp-name">{selected.placa} - {selected.marca} {selected.linea}</div>
            <div className="csp-doc">{selected.anio} - {selected.color} - {selected.servicio}</div>
          </div>
          <div className="csp-right">
            {isCompleto(selected)
              ? <span className="flag-ok" style={{fontSize:18}}>[F]</span>
              : <span className="flag-pend" style={{fontSize:18}}>[F]</span>
            }
            <button className="csp-change">CAMBIAR</button>
          </div>
        </div>
      ) : (
        <div className="cselector-open">
          <div className="cselector-search-wrap">
            <span className="srch-ico">[BUSCAR]</span>
            <input className="cselector-search" placeholder="BUSCAR POR PLACA, MARCA O LÍNEA..."
              value={search} onChange={e => setSearch(e.target.value)} />
            {search && <button className="srch-clr" onClick={() => setSearch("")}>x</button>}
          </div>
          <div className="cselector-list">
            {filtered.length === 0 && <div className="cselector-empty">SIN VEHÍCULOS</div>}
            {filtered.map(v => {
              const completo = isCompleto(v);
              return (
                <div key={v.id}
                  className={`cselector-item${value===v.id?" cselector-active":""}`}
                  onClick={() => handleSelect(v)}>
                  <div className="cselector-item-row">
                    <div>
                      <div className="cselector-name">{v.placa} - {v.marca} {v.linea}</div>
                      <div className="cselector-doc">{v.anio} - {v.color} - {v.servicio}</div>
                    </div>
                    <span style={{fontSize:16, marginLeft:8}}>
                      {completo ? <span className="flag-ok">[F]</span> : <span className="flag-pend">[F]</span>}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Diálogo campos pendientes - permite continuar */}
      {pendingVehiculo && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <div className="confirm-icon">(!)</div>
            <div className="confirm-title">CAMPOS PENDIENTES</div>
            <div className="confirm-msg">
              <strong>{pendingVehiculo.placa} - {pendingVehiculo.marca} {pendingVehiculo.linea}</strong> tiene campos sin llenar:
              <ul className="pending-list">
                {pendingVehiculo.pendingFields.map(f => <li key={f}>- {f}</li>)}
              </ul>
              ¿DESEA SELECCIONARLO DE TODAS FORMAS?
            </div>
            <div className="confirm-actions">
              <button className="btn-cancel" onClick={() => setPendingVehiculo(null)}>CANCELAR</button>
              <button className="btn-save" onClick={confirmPendingV}>SÍ, CONTINUAR</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Paleta (Vendedor / Comprador) ──────────────────────────────────────────────
function Paleta({ titulo, opciones, selected, onSelect, clients, vendedores, compradores, onClienteChange, onCrear, color, excludedIds }) {
  return (
    <div className="paleta" style={{"--pcolor": color}}>
      <div className="paleta-header">
        <span className="paleta-title">{titulo}</span>
      </div>
      <div className="paleta-opciones">
        {opciones.map(n => (
          <button key={n}
            className={`paleta-opt${selected===n?" paleta-opt-active":""}`}
            onClick={() => onSelect(n)}>
            {n}
          </button>
        ))}
      </div>

      {selected !== null && selected !== 0 && (
        <div className="paleta-slots">
          {Array.from({length: selected}, (_, i) => {
            // IDs ya usados en este mismo grupo (otros slots) + los del grupo opuesto
            const siblingIds = (titulo === "VENDEDOR" ? vendedores : compradores)
              .filter((id, idx) => idx !== i && id !== null);
            const blocked = [...(excludedIds||[]), ...siblingIds];
            return (
              <ClienteSelector key={i}
                clients={clients}
                label={selected > 1 ? ("CLIENTE " + (i+1)) : "CLIENTE"}
                value={titulo === "VENDEDOR" ? vendedores[i] : compradores[i]}
                onChange={id => onClienteChange(i, id)}
                onCrear={onCrear}
                excludedIds={blocked}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── FormulariosView ───────────────────────────────────────────────────────────────
function FormulariosView({ clients, vehiculos, onBack }) {

  const mkReg = (id, fecha, hora, vends, comps, vid) => ({
    id,
    fecha,
    hora,
    vendedores: vends.map(sid => SEED.find(c=>c.id===sid)).filter(Boolean),
    compradores: comps.map(sid => SEED.find(c=>c.id===sid)).filter(Boolean),
    vehiculo: SEED_VEHICULOS.find(v=>v.id===vid),
  });

  const REGISTROS_INICIALES = [
    mkReg(1,  "5/1/2026",  "09:15 a.m.", [1],    [5],     1),
    mkReg(2,  "5/2/2026",  "10:30 a.m.", [2],    [7],     3),
    mkReg(3,  "5/2/2026",  "11:45 a.m.", [3, 4], [5, 10], 4),
    mkReg(4,  "5/3/2026",  "02:00 p.m.", [6],    [],      6),
    mkReg(5,  "5/4/2026",  "09:00 a.m.", [8],    [11],    7),
    mkReg(6,  "5/5/2026",  "03:20 p.m.", [13],   [14],    9),
    mkReg(7,  "5/6/2026",  "10:10 a.m.", [16],   [17],    10),
    mkReg(8,  "5/7/2026",  "08:45 a.m.", [18],   [],      13),
    mkReg(9,  "5/8/2026",  "04:05 p.m.", [26, 27],[28],   15),
    mkReg(10, "5/9/2026",  "11:30 a.m.", [29],   [30],    17),
  ].reverse();

  const [registros, setRegistros] = useState(REGISTROS_INICIALES);
  const [showForm, setShowForm] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [registroSel, setRegistroSel] = useState(null);

  const filtrados = registros.filter(r => {
    const q = busqueda.toUpperCase();
    if (!q) return true;
    const enVendedores = r.vendedores.some(c => c?.nombreCompleto?.includes(q) || c?.numDoc?.includes(q));
    const enCompradores = r.compradores.some(c => c?.nombreCompleto?.includes(q) || c?.numDoc?.includes(q));
    const enPlaca = r.vehiculo?.placa?.includes(q);
    return enVendedores || enCompradores || enPlaca;
  });

  return (
    <div className="view">
      {/* HERO */}
      <div className="clientes-hero">
        <button className="btn-back-hero" onClick={onBack}>ATRAS</button>
        <div className="clientes-hero-center">
          <svg className="clientes-hero-avatar" viewBox="0 0 80 80" fill="none">
            <rect x="10" y="20" width="60" height="45" rx="4" fill="rgba(255,255,255,0.9)"/>
            <rect x="18" y="30" width="20" height="3" rx="1" fill="#4a7fa5"/>
            <rect x="18" y="37" width="30" height="3" rx="1" fill="#4a7fa5"/>
            <rect x="18" y="44" width="25" height="3" rx="1" fill="#4a7fa5"/>
            <rect x="55" y="10" width="18" height="22" rx="3" fill="#f5a623"/>
            <rect x="59" y="15" width="10" height="2" rx="1" fill="white"/>
            <rect x="59" y="19" width="10" height="2" rx="1" fill="white"/>
            <rect x="59" y="23" width="6" height="2" rx="1" fill="white"/>
          </svg>
          <div className="clientes-hero-title">FORMULARIOS</div>
        </div>
        <button className="btn-primary-hero" onClick={() => setShowForm(true)}>+ NUEVO</button>
      </div>

      {/* HISTORIAL */}
      {registros.length === 0 ? (
        <div className="empty">HISTORIAL DE FORMULARIOS</div>
      ) : (
        <div className="formularios-registros">
          <div className="srch-wrap" style={{marginBottom:12}}>
            <span className="srch-ico">[BUSCAR]</span>
            <input className="srch" placeholder="BUSCAR POR NOMBRE, CÉDULA O PLACA..."
              value={busqueda} onChange={e => setBusqueda(e.target.value)} />
            {busqueda && <button className="srch-clr" onClick={() => setBusqueda("")}>x</button>}
          </div>
          {filtrados.length === 0
            ? <div className="empty" style={{marginBottom:8}}>SIN RESULTADOS</div>
            : filtrados.map(r => (
            <div key={r.id} className="formato-card formato-card-clickable" onClick={() => setRegistroSel(r)}>
              <div className="formato-card-head">
                <span className="formato-card-fecha">{r.fecha} - {r.hora}</span>
                <span className="formato-card-arrow">></span>
              </div>
              <div className="formato-card-body">
                <div className="formato-row">
                  <span className="formato-label">VENDEDOR{r.vendedores.length > 1 ? "ES" : ""}</span>
                  {r.vendedores.map((c,i) => (
                    <span key={i} className="formato-val">{c?.nombreCompleto} - {c?.tipoDoc} {c?.numDoc}</span>
                  ))}
                </div>
                <div className="formato-row">
                  <span className="formato-label">COMPRADOR{r.compradores.length > 1 ? "ES" : ""}</span>
                  {r.compradores.length === 0
                    ? <span className="formato-val formato-val-none">TRASPASO ABIERTO</span>
                    : r.compradores.map((c,i) => (
                        <span key={i} className="formato-val">{c?.nombreCompleto} - {c?.tipoDoc} {c?.numDoc}</span>
                      ))
                  }
                </div>
                <div className="formato-row">
                  <span className="formato-label">VEHÍCULO</span>
                  <span className="formato-val">{r.vehiculo?.marca} {r.vehiculo?.linea} {r.vehiculo?.anio} - {r.vehiculo?.placa}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* NUEVO FORMULARIO */}
      {showForm && (
        <NuevoFormatoForm
          clients={clients}
          vehiculos={vehiculos}
          onGuardar={registro => { setRegistros(rs => [registro, ...rs]); setShowForm(false); }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* DETALLE */}
      {registroSel && (
        <DetalleFormulario registro={registroSel} onClose={() => setRegistroSel(null)} />
      )}
    </div>
  );
}

// ── Lógica de generación de formularios ───────────────────────────────────────
function esNIT(c) { return c?.tipoDoc === "NIT"; }
function esNatural(c) { return c && !esNIT(c); }

function determinarFormularios(r) {
  const vends = r.vendedores;
  const comps = r.compradores;
  const nv = vends.length;
  const nc = comps.length;
  const hayNITvend = vends.some(esNIT);
  const hayNITcomp = comps.some(esNIT);
  const hayNIT = hayNITvend || hayNITcomp;

  // Funal
  let funal;
  if (!hayNIT) {
    // FN
    if      (nv===1 && nc===0) funal = "FN11";
    else if (nv===1 && nc===1) funal = "FN11";
    else if (nv===1 && nc===2) funal = "FN12";
    else if (nv===2 && nc===0) funal = "FN21";
    else if (nv===2 && nc===1) funal = "FN21";
    else if (nv===2 && nc===2) funal = "FN22";
  } else {
    // FJ
    const v0NIT = esNIT(vends[0]);
    const c0NIT = nc > 0 && esNIT(comps[0]);
    if      (nv===1 && nc===0  && v0NIT)              funal = "FJ11A";
    else if (nv===1 && nc===1  && v0NIT && !c0NIT)    funal = "FJ11A";
    else if (nv===1 && nc===1  && v0NIT && c0NIT)     funal = "FJ11C";
    else if (nv===1 && nc===2  && v0NIT)               funal = "FJ12";
    else if (nv===1 && nc===1  && !v0NIT && c0NIT)    funal = "FJ11B";
    else if (nv===2 && nc===1  && c0NIT)               funal = "FN21"; // 2 naturales 1 NIT
    else if (nv===2 && nc===0)                          funal = "FN21";
    else funal = hayNIT ? "FJ11A" : "FN11";
  }

  // Contrato
  let contrato;
  if (!hayNIT) {
    if      (nv===1 && nc<=1) contrato = "CN11";
    else if (nv===1 && nc===2) contrato = "CN12";
    else if (nv===2 && nc<=1) contrato = "CN21";
    else                       contrato = "CN22";
  } else {
    contrato = "CN11"; // base, se ajusta según caso
    if (nc===2) contrato = "CN12";
    if (nv===2) contrato = nc===2 ? "CN22" : "CN21";
  }

  // Mandatos: uno por cada persona
  const mandatos = [];
  vends.forEach((c,i) => {
    mandatos.push({ tipo: esNIT(c) ? "MJ" : "MN", persona: c, rol: "VENDEDOR", idx: i+1 });
  });
  comps.forEach((c,i) => {
    mandatos.push({ tipo: esNIT(c) ? "MJ" : "MN", persona: c, rol: "COMPRADOR", idx: i+1 });
  });

  // Responsabilidad: siempre
  // Desembolso: solo si nc === 0
  const desembolso = nc === 0;

  return { funal, contrato, mandatos, desembolso };
}

// ── Generadores de documentos HTML (fieles a los originales) ────────────────
const BASE_CSS = "body{font-family:Arial,sans-serif;font-size:10pt;margin:20px;color:#000;line-height:1.4}"
  + "table{width:100%;border-collapse:collapse;font-size:9.5pt;margin-bottom:4px}"
  + "td,th{border:1px solid #000;padding:3px 5px;vertical-align:middle}"
  + ".val{text-align:center;font-weight:bold}"
  + ".lbl{text-align:left;font-size:8.5pt;color:#333}"
  + ".nb{border:none!important}"
  + ".hdr{background:#000;color:#fff;text-align:center;font-weight:bold;font-size:9pt;padding:3px 5px;letter-spacing:.5px}"
  + ".subhdr{background:#1a1f2e;color:#f5a623;text-align:center;font-weight:bold;font-size:9pt;padding:4px;letter-spacing:1px}"
  + "h1{font-size:13pt;text-align:center;font-weight:bold;text-transform:uppercase;margin:10px 0;border-bottom:2px solid #000;padding-bottom:6px}"
  + "h2{font-size:11pt;text-align:center;font-weight:bold;margin:8px 0}"
  + ".p{margin:7px 0;text-align:justify;font-size:9.5pt}"
  + ".firma-row{display:flex;justify-content:space-around;margin-top:50px;gap:20px}"
  + ".firma-box{text-align:center;flex:1}"
  + ".firma-line{border-top:2px solid #000;padding-top:5px;margin-top:40px;font-size:9pt}"
  + ".dato-row td{padding:4px 6px}"
  + ".dato-lbl{font-size:8pt;color:#555;text-transform:uppercase;display:block;margin-bottom:1px}"
  + ".dato-val{font-size:10pt;font-weight:bold;border-bottom:1px solid #000;min-height:16px;display:block;text-align:center;padding:1px 3px}"
  + ".check-box{display:inline-block;width:12px;height:12px;border:1px solid #000;text-align:center;line-height:11px;font-size:9pt;margin-right:2px}";

function wrapDoc(body) {
  return "<!DOCTYPE html><html lang='es'><head><meta charset='UTF-8'><style>" + BASE_CSS + "</style></head><body>" + body + "</body></html>";
}
function fl(val) {
  return "<span class='dato-val' style='display:inline-block;min-width:180px'>" + (val||"&nbsp;") + "</span>";
}
function flw(val) {
  return "<span class='dato-val' style='display:block'>" + (val||"&nbsp;") + "</span>";
}
function td(content, attrs) {
  return "<td " + (attrs||"") + ">" + (content||"") + "</td>";
}

// ── FUNAL (Formulario Nacional Automotor) ─────────────────────────────────────
function genFunal(r, tipo) {
  var v = r.vendedores[0]; var v2 = r.vendedores[1];
  var c = r.compradores[0]; var c2 = r.compradores[1];
  var veh = r.vehiculo;
  var esNitV = v && v.tipoDoc === "NIT";
  var esNitC = c && c.tipoDoc === "NIT";

  function tipoDocCode(t) {
    var m = {CC:"C",NIT:"N",PASAPORTE:"X",CE:"P","TI":"E","RC":"C"};
    return m[t]||"C";
  }
  function nombresVend(cli) {
    if (!cli) return {ap1:"",ap2:"",nombres:""};
    if (cli.tipoDoc==="NIT") return {ap1:"",ap2:"",nombres:cli.primerNombre};
    return {ap1:cli.primerApellido||"",ap2:cli.segundoApellido||"",nombres:[cli.primerNombre,cli.segundoNombre].filter(Boolean).join(" ")};
  }
  var nv = nombresVend(v);
  var nv2 = nombresVend(v2);
  var nc = nombresVend(c);
  var nc2 = nombresVend(c2);

  var body = "<table style='font-size:8pt;margin-bottom:4px'>"
    + "<tr>"
    + "<td style='width:30%;border:1px solid #000'><b>MINISTERIO DE TRANSPORTE</b><br><small>FORMULARIO DE SOLICITUD DE TRAMITES DEL REGISTRO NACIONAL AUTOMOTOR</small></td>"
    + "<td style='width:40%;border:1px solid #000;text-align:center;font-size:8pt'><b>1. ORGANISMO DE TRANSITO</b><br>NOMBRE: " + flw(veh&&veh.organismoTransito) + "<br>CIUDAD: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; CODIGO: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; FECHA DE TRAMITE: " + flw("") + "</td>"
    + "<td style='width:30%;border:1px solid #000;text-align:center'><b>2. PLACA</b><br><div style='font-size:18pt;font-weight:bold;letter-spacing:4px;text-align:center;padding:4px'>" + (veh&&veh.placa||"") + "</div></td>"
    + "</tr></table>";

  // Tramite marcado: TRASPASO
  body += "<table style='font-size:8pt;margin-bottom:3px'><tr><td class='hdr' colspan='18'>3. TRAMITE SOLICITADO</td></tr>"
    + "<tr><td>1 MATRICULA/REGISTRO</td><td style='border:2px solid #000;background:#000;color:#fff'>2 TRASPASO</td><td>3 TRANSLADO</td><td>4 RADICADO</td><td>5 CAMBIO COLOR</td><td>6 CAMBIO SERVICIO</td></tr>"
    + "<tr><td>7 REGRABAR MOTOR</td><td>8 REGRABAR CHASIS</td><td>9 TRANSFORMACION</td><td>10 DUPLICADO LICENCIA</td><td>11 INSCRIPC. PRENDA</td><td>12 LEVANTA. PRENDA</td></tr>"
    + "<tr><td>13 CANCELACION MATRICULA</td><td>14 CAMBIO DE PLACAS</td><td>15 DUPLICADO DE PLACAS</td><td>16 REMATRICULA</td><td>17 CAMBIO CARROCERIA</td><td>18 OTROS</td></tr>"
    + "</table>";

  // Datos del vehículo
  body += "<table style='font-size:8pt;margin-bottom:3px'>"
    + "<tr><td class='hdr'>5. MARCA</td><td>" + (veh&&veh.marca||"") + "</td>"
    + "<td class='hdr'>6. LINEA</td><td>" + (veh&&veh.linea||"") + "</td>"
    + "<td class='hdr'>7. COMBUSTIBLE</td><td>" + (veh&&veh.combustible||"") + "</td></tr>"
    + "<tr><td class='hdr'>8. COLORES</td><td>" + (veh&&veh.color||"") + "</td>"
    + "<td class='hdr'>9. MODELO</td><td>" + (veh&&veh.anio||"") + "</td>"
    + "<td class='hdr'>10. CILINDRADA</td><td>" + (veh&&veh.cilindraje||"") + "</td></tr>"
    + "<tr><td class='hdr'>11. CAPACIDAD Kg/Psj</td><td>" + (veh&&veh.capacidad||"") + "</td>"
    + "<td class='hdr'>12. BLINDAJE</td><td>" + (veh&&veh.blindaje||"") + "</td>"
    + "<td class='hdr'>14. POTENCIA/HP</td><td></td></tr>"
    + "</table>";

  // Clase de vehiculo
  function claseCheck(nombre) {
    return (veh&&veh.clase===nombre) ? "<b>[X]</b>" : "[ ]";
  }
  body += "<table style='font-size:8pt;margin-bottom:3px'>"
    + "<tr><td class='hdr' colspan='8'>4. CLASE DE VEHICULO</td><td class='hdr' colspan='4'>15. CARROCERIA</td><td class='hdr' colspan='4'>16. IDENTIFICACION INTERNA</td></tr>"
    + "<tr>"
    + "<td>" + claseCheck("AUTOMOVIL") + " AUTOMOVIL</td><td>" + claseCheck("BUS") + " BUS</td><td>" + claseCheck("BUSETA") + " BUSETA</td><td>" + claseCheck("CAMION") + " CAMION</td>"
    + "<td>" + claseCheck("CAMPERO") + " CAMPERO</td><td>" + claseCheck("MICROBUS") + " MICROBUS</td><td>" + claseCheck("CAMIONETA") + " CAMIONETA</td><td>" + claseCheck("OTRO") + " OTRO</td>"
    + "<td colspan='4'>TIPO: " + flw(veh&&veh.carroceria) + "</td>"
    + "<td>No. DE MOTOR: " + flw(veh&&veh.numMotor) + "</td><td>No. CHASIS: " + flw(veh&&veh.numChasis) + "</td><td>No. SERIE: " + flw(veh&&veh.numSerie) + "</td><td>VIN: " + flw(veh&&veh.vin) + "</td>"
    + "</tr>"
    + "<tr><td>" + claseCheck("TRACTOCAMION") + " TRACTOCAMION</td><td>" + claseCheck("MOTOCICLETA") + " MOTOCICLETA</td><td>" + claseCheck("MOTOCARRO") + " MOTOCARRO</td><td>" + claseCheck("MOTOTRICICLO") + " MOTOTRICICLO</td>"
    + "<td>" + claseCheck("CUATRIMOTO") + " CUATRIMOTO</td><td>" + claseCheck("VOLQUETA") + " VOLQUETA</td><td colspan='2'></td>"
    + "<td colspan='8'></td></tr>"
    + "</table>";

  // Datos propietario (vendedor)
  function bloqProp(cli, n, titulo) {
    if (!cli) return "";
    var nm = nombresVend(cli);
    var esN = cli.tipoDoc === "NIT";
    return "<table style='font-size:8pt;margin-bottom:3px'>"
      + "<tr><td class='hdr' colspan='8'>" + titulo + "</td></tr>"
      + "<tr><td>PRIMER APELLIDO</td><td>" + flw(nm.ap1) + "</td><td>SEGUNDO APELLIDO</td><td>" + flw(nm.ap2) + "</td><td colspan='4'>NOMBRES: " + flw(nm.nombres) + "</td></tr>"
      + "<tr>"
      + "<td>TIPO DOC: <b>" + tipoDocCode(cli.tipoDoc) + "</b></td>"
      + (esN ? "<td><b>NIT</b></td>" : "<td>C.C</td>")
      + "<td colspan='2'>No. DOCUMENTO: " + flw(cli.numDoc) + "</td>"
      + "<td colspan='2'>DIRECCION: " + flw(cli.direccion) + "</td>"
      + "<td>CIUDAD: " + flw(cli.ciudad) + "</td>"
      + "<td>TELEFONO: " + flw(cli.celular) + "</td>"
      + "</tr>"
      + "<tr><td colspan='8'>FIRMA DEL " + (titulo.includes("COMPRADOR") ? "COMPRADOR" : "PROPIETARIO") + ": <div style='height:30px;border-bottom:1px solid #000'></div></td></tr>"
      + "</table>";
  }

  body += bloqProp(v, 1, "21. DATOS DEL PROPIETARIO (VENDEDOR 1)");
  if (v2) body += bloqProp(v2, 2, "21B. DATOS DEL PROPIETARIO (VENDEDOR 2)");

  if (c) {
    body += bloqProp(c, 1, "22. DATOS DEL COMPRADOR (TRASPASO)");
    if (c2) body += bloqProp(c2, 2, "22B. DATOS DEL COMPRADOR 2 (TRASPASO)");
  } else {
    body += "<table style='font-size:8pt;margin-bottom:3px'>"
      + "<tr><td class='hdr' colspan='8'>22. DATOS DEL COMPRADOR (TRASPASO)</td></tr>"
      + "<tr><td>PRIMER APELLIDO</td><td>" + flw("") + "</td><td>SEGUNDO APELLIDO</td><td>" + flw("") + "</td><td colspan='4'>NOMBRES: " + flw("") + "</td></tr>"
      + "<tr><td colspan='2'>TIPO DOC / No. DOCUMENTO: " + flw("") + "</td><td colspan='2'>DIRECCION: " + flw("") + "</td><td>CIUDAD: " + flw("") + "</td><td>TELEFONO: " + flw("") + "</td></tr>"
      + "<tr><td colspan='8'>FIRMA DEL COMPRADOR: <div style='height:30px'></div></td></tr>"
      + "</table>";
  }

  body += "<table style='font-size:8pt'><tr><td class='hdr'>23. OBSERVACIONES</td></tr><tr><td style='height:40px'></td></tr></table>";
  body += "<p style='font-size:7.5pt;margin-top:6px'>TIPO: <b>" + tipo + "</b> &nbsp;&nbsp; Fecha: " + r.fecha + "</p>";

  return wrapDoc(body);
}

// ── CONTRATO DE COMPRAVENTA ───────────────────────────────────────────────────
function genContrato(r, tipo) {
  var v = r.vendedores[0]; var v2 = r.vendedores[1];
  var c = r.compradores[0]; var c2 = r.compradores[1];
  var veh = r.vehiculo;

  var body = "<table style='border:1px solid #000;margin-bottom:0'>"
    + "<tr><td class='center bold' colspan='2' style='font-size:14pt;border-bottom:1px solid #000;padding:8px'>CONTRATO DE COMPRA VENTA DE VEHICULO</td>"
    + "<td style='border:1px solid #000;text-align:right;width:120px'><b>Fecha:</b> " + flw(r.fecha) + "</td></tr></table>";

  // Vendedor y valores
  body += "<table style='border:1px solid #000'>"
    + "<tr>"
    + "<td style='width:50%;border-right:1px solid #000;border-bottom:1px solid #000'><div class='subhdr'>V E N D E D O R</div>"
    + "<br><b>Nombre:</b>" + flw(v?v.nombreCompleto:"")
    + (v2 ? "<br><b>Nombre 2:</b>" + flw(v2.nombreCompleto) : "")
    + "<br><b>No de Identificacion:</b>" + flw(v?(v.tipoDoc+" "+v.numDoc):"")
    + (v2 ? "<br><b>Identificacion 2:</b>" + flw(v2.tipoDoc+" "+v2.numDoc) : "")
    + "<br><b>Direccion:</b>" + flw(v?v.direccion:"")
    + "<br><b>Telefono:</b>" + flw(v?v.celular:"")
    + "</td>"
    + "<td style='width:50%;border-bottom:1px solid #000'><div class='subhdr'>V A L O R E S Y G A S T O S D E L C O N T R A T O</div>"
    + "<br><b>Valor de la Venta:</b>" + flw("")
    + "<br><b>Valor de la Venta en letras:</b>" + flw("")
    + "<br><b>Forma de Pago:</b>" + flw("")
    + "<br><br><b>Gastos del Tramite:</b>" + flw("")
    + "</td>"
    + "</tr></table>";

  // Comprador
  body += "<table style='border:1px solid #000'>"
    + "<tr><td style='border-bottom:1px solid #000'><div class='subhdr'>C O M P R A D O R</div>"
    + "<br><b>Nombre:</b>" + flw(c?c.nombreCompleto:"")
    + (c2 ? "<br><b>Nombre 2:</b>" + flw(c2.nombreCompleto) : "")
    + "<br><b>No de Identificacion:</b>" + flw(c?(c.tipoDoc+" "+c.numDoc):"")
    + (c2 ? "<br><b>Identificacion 2:</b>" + flw(c2.tipoDoc+" "+c2.numDoc) : "")
    + "<br><b>Direccion:</b>" + flw(c?c.direccion:"")
    + "<br><b>Telefono:</b>" + flw(c?c.celular:"")
    + "</td></tr></table>";

  // Clausulas y datos del vehiculo en 2 columnas
  var clausulas = "<div class='p'>Las partes convienen celebrar el presente contrato de compraventa que se regira por las anteriores estipulaciones, las normas legales aplicables a la materia y en especial por las siguientes clausulas: <b>PRIMERA. OBJETO DEL CONTRATO.</b> Mediante el presente contrato, EL VENDEDOR transfiere a titulo de venta y EL COMPRADOR adquiere la propiedad del vehiculo automotor que a continuacion se identifica:</div>";
  var datosVeh = "<table><tr><td class='subhdr' colspan='2'>D A T O S D E L V E H I C U L O</td></tr>"
    + "<tr><td><b>Placa</b></td><td>" + flw(veh?veh.placa:"") + "</td></tr>"
    + "<tr><td><b>Clase</b></td><td>" + flw(veh?veh.clase:"") + "</td></tr>"
    + "<tr><td><b>Marca:</b></td><td>" + flw(veh?veh.marca:"") + "</td></tr>"
    + "<tr><td><b>Linea:</b></td><td>" + flw(veh?veh.linea:"") + "</td></tr>"
    + "<tr><td><b>Modelo:</b></td><td>" + flw(veh?veh.anio:"") + "</td></tr>"
    + "<tr><td><b>Carroceria:</b></td><td>" + flw(veh?veh.carroceria:"") + "</td></tr>"
    + "<tr><td><b>Color:</b></td><td>" + flw(veh?veh.color:"") + "</td></tr>"
    + "<tr><td><b>Servicio:</b></td><td>" + flw(veh?veh.servicio:"") + "</td></tr>"
    + "<tr><td><b>No Motor:</b></td><td>" + flw(veh?veh.numMotor:"") + "</td></tr>"
    + "<tr><td><b>No Chasis:</b></td><td>" + flw(veh?veh.numChasis:"") + "</td></tr>"
    + "</table>";

  var obligaciones = "<div class='p'><b>SEGUNDA. OBLIGACIONES DEL VENDEDOR.</b> EL VENDEDOR se compromete a entregar el vehiculo materia de este contrato, libre de multas, sanciones e infracciones, expedientes, embargos, pignoraciones y demas gravamenes y limitaciones de propiedad, hasta la fecha del presente contrato y los impuestos al dia hasta el año _______, y de esta fecha en adelante corre por cuenta y riesgo del COMPRADOR.</div>"
    + "<div class='p'><b>TERCERA.</b> El COMPRADOR manifiesta que recibe el vehiculo en las condiciones actuales de uso, previa revision efectuada sobre el mismo, y se hace cargo a partir de la fecha de recibido del automotor de cualquier dano o averia que se presente en el vehiculo. El VENDEDOR y el COMPRADOR se comprometen a realizar el traspaso a nombre DEL COMPRADOR o a quien este designe, en un plazo no mayor a _______ dias habiles contados a partir de la fecha de firma del presente contrato.</div>"
    + "<table style='border:1px solid #000;margin-top:6px'><tr><td class='subhdr' colspan='2'>C L A U S U L A P E N A L</td></tr>"
    + "<tr><td colspan='2' style='font-size:10pt'>Cualquiera de las partes que incumpla lo pactado pagara a la otra parte el _______ del valor total de este contrato como multa o clausula penal</td></tr></table>";

  body += "<table><tr>"
    + "<td style='width:50%;border-right:1px solid #000'>" + clausulas + datosVeh + "</td>"
    + "<td style='width:50%;padding-left:8px'>" + obligaciones + "</td>"
    + "</tr></table>";

  // Firmas
  body += "<table style='margin-top:20px'><tr>"
    + "<td class='subhdr center' style='width:50%'>V E N D E D O R</td>"
    + "<td class='subhdr center' style='width:50%'>C O M P R A D O R</td>"
    + "</tr><tr style='height:50px'>"
    + "<td style='border-top:1px solid #000;text-align:center'>" + (v?v.nombreCompleto:"") + "</td>"
    + "<td style='border-top:1px solid #000;text-align:center'>" + (c?c.nombreCompleto:"TRASPASO ABIERTO") + "</td>"
    + "</tr></table>";

  return wrapDoc(body);
}

// ── MANDATO ───────────────────────────────────────────────────────────────────
function genMandato(persona, esJuridica) {
  var p = persona;
  var nombre = p ? p.nombreCompleto : "________________________________";
  var tipod = p ? p.tipoDoc : "____________";
  var numd = p ? p.numDoc : "________________";
  var empresa = (esJuridica && p) ? p.primerNombre : "";

  var clausJ = esJuridica
    ? ", mayor de edad, identificado con " + fl(tipod) + " No " + fl(numd) + ", quien para los efectos del presente contrato se denominara <b>EL MANDANTE</b>, y actuando en calidad de Representante legal de la Empresa " + fl(empresa) + " identificada con Nit No " + fl(numd) + ", y de otra parte"
    : ", mayor de edad, identificado con " + fl(tipod) + " No " + fl(numd) + ", quien para los efectos del presente contrato se denominara <b>EL MANDANTE</b>, y de otra parte";

  var body = "<h1>CONTRATO DE MANDATO</h1>"
    + "<div class='p'>Entre los suscritos a saber: " + fl(nombre) + clausJ + " "
    + fl("____________________________") + ", tambien mayor de edad, identificado con " + fl("____________") + " No " + fl("________________") + ", quien para los efectos del presente contrato se denominara <b>EL MANDATARIO</b>, hemos acordado suscribir el siguiente <b>Contrato de Mandato</b> que se regira por las siguientes <b>CLAUSULAS</b> y en lo previsto de ellas, por las disposiciones del <b>Codigo de Comercio y del Codigo Civil</b> aplicables a la materia de que se ocupa este contrato.</div>"
    + "<div class='p'><b>Primero: Objeto del Contrato</b>: <b>EL MANDANTE</b> faculta <b>AL MANDATARIO</b> la gestion de realizar los tramites a que haya lugar para radicar y reclamar ante el organismo de transito los tramites de " + fl("________________________________________") + " del vehiculo de su propiedad que se identifica con las siguientes caracteristicas:</div>"
    + "<br><table style='width:60%;border:none'><tr>"
    + "<td class='nb'><b>Placas:</b> " + fl("") + "</td>"
    + "<td class='nb'><b>Marca:</b> " + fl("") + "</td>"
    + "<td class='nb'><b>Modelo:</b> " + fl("") + "</td>"
    + "</tr></table><br>"
    + "<div class='p'><b>Paragrafo Primero:</b> Como consecuencia, <b>EL MANDATARIO</b> queda facultado para representar <b>AL MANDANTE</b> para todos los efectos como son: RADICAR, GESTIONAR Y RECIBIR EL RESULTADO del tramite que de cumplimiento a la resolucion No 12379 del 28 de diciembre de 2012 - Art 5 del Ministerio de Transporte. De igual forma <b>El MANDATARIO</b> tiene la facultad de sustituir el presente <b>CONTRATO DE MANDATO</b> sin que en ningun momento el presente <b>MANDATO</b> quede sin representacion alguna ante el Organismo de Transito, en lo que tiene que ver con las facultades conferidas por este <b>MANDATO</b></div>"
    + "<div class='p'><b>Paragrafo Segundo:</b> Los encargos realizados por <b>EL MANDATARIO</b> seran por cuenta y riesgo <b>DEL MANDANTE</b></div>"
    + "<div class='p'><b>SEGUNDO. DURACION DEL CONTRATO:</b> El contrato tendra su cumplimiento una vez que el Organismo de Transito competente haga entrega de la gestion final, para lo cual le fue otorgado dicho contrato</div>"
    + "<div class='p'>Tanto <b>MANDATARIO</b> como <b>MANDANTE</b> aceptan las condiciones de dicho contrato y para su efecto se firma en la Ciudad de " + fl("________________________") + " a los " + fl("__________") + " dias del mes de " + fl("____________________") + " del ano " + fl("_________") + "</div>"
    + "<div class='firma-row'>"
    + "<div class='firma-box'><div class='firma-line'><b>EL MANDANTE:</b><br>" + nombre + "<br>No: " + numd + "</div></div>"
    + "<div class='firma-box'><div class='firma-line'><b>EL MANDATARIO:</b><br><br>No: ________________</div></div>"
    + "</div>";

  return wrapDoc(body);
}

// ── RESPONSABILIDAD CIVIL ─────────────────────────────────────────────────────
function genResponsabilidad(r) {
  var comp = r.compradores[0];
  var vend = r.vendedores[0];
  var veh = r.vehiculo;

  var body = "<div style='font-style:italic;font-weight:bold;margin-bottom:16px'>Ref: CARTA DE RESPONSABILIDAD CIVIL</div>"
    + "<div class='p'>Yo, " + fl(comp?comp.nombreCompleto:"") + " identificado con " + fl(comp?comp.tipoDoc:"") + " No " + fl(comp?comp.numDoc:"") + " , en mi calidad de comprador, manifiesto expresamente que en la fecha de la firma del presente documento, he recibido a mi entera satisfaccion, el vehiculo descrito a continuacion:</div>"
    + "<br>"
    + "<table style='width:70%;border:none'>"
    + "<tr><td class='nb'><b>Placa:</b></td><td class='nb'>" + flw(veh?veh.placa:"") + "</td></tr>"
    + "<tr><td class='nb'><b>Clase:</b></td><td class='nb'>" + flw(veh?veh.clase:"") + "</td></tr>"
    + "<tr><td class='nb'><b>Marca:</b></td><td class='nb'>" + flw(veh?veh.marca:"") + "</td></tr>"
    + "<tr><td class='nb'><b>Linea:</b></td><td class='nb'>" + flw(veh?veh.linea:"") + "</td></tr>"
    + "<tr><td class='nb'><b>Modelo:</b></td><td class='nb'>" + flw(veh?veh.anio:"") + "</td></tr>"
    + "<tr><td class='nb'><b>Color:</b></td><td class='nb'>" + flw(veh?veh.color:"") + "</td></tr>"
    + "<tr><td class='nb'><b>Servicio:</b></td><td class='nb'>" + flw(veh?veh.servicio:"") + "</td></tr>"
    + "<tr><td class='nb'><b>No de Motor:</b></td><td class='nb'>" + flw(veh?veh.numMotor:"") + "</td></tr>"
    + "<tr><td class='nb'><b>No de Chasis:</b></td><td class='nb'>" + flw(veh?veh.numChasis:"") + "</td></tr>"
    + "<tr><td class='nb'><b>Matriculado en:</b></td><td class='nb'>" + flw(veh?veh.organismoTransito:"") + "</td></tr>"
    + "</table>"
    + "<br>"
    + "<div class='p'>Matriculado a nombre de " + fl(vend?vend.nombreCompleto:"") + " identificado con " + fl(vend?vend.tipoDoc:"") + " No " + fl(vend?vend.numDoc:"") + "</div>"
    + "<br>"
    + "<div class='p'>Declaro que a partir de la fecha de la firma del presente documento asumo toda responsabilidad por danos y perjuicios patrimoniales (dano emergente, lucro cesante, multas y foto multas de transporte y transito) y extra patrimoniales a terceros en sus bienes o personas que pueda causar o que cause cualquier otra persona a quien autorice conducir el vehiculo descrito de manera anterior.</div>"
    + "<br>"
    + "<div class='p'>Para constancia se firma en la Ciudad de " + fl("____________________") + " a los " + fl("______") + " dias del mes de " + fl("_________________") + " del ano " + fl("__________") + " a las " + fl("______________") + "</div>"
    + "<div class='firma-row'>"
    + "<div class='firma-box'><div class='firma-line'>Firma Vendedor<br><small>" + (vend?vend.nombreCompleto:"") + "</small></div></div>"
    + "<div class='firma-box'><div class='firma-line'>Firma Comprador<br><small>" + (comp?comp.nombreCompleto:"(Espacio para firma)") + "</small></div></div>"
    + "</div>";

  return wrapDoc(body);
}

// ── DESEMBOLSO ────────────────────────────────────────────────────────────────
function genDesembolso(r) {
  var vend = r.vendedores[0];
  var veh = r.vehiculo;

  var body = "<div style='font-style:italic;margin-bottom:16px'>Ref: Autorizacion Desembolso a Terceros</div>"
    + "<div class='p'>Yo, " + fl(vend?vend.nombreCompleto:"") + " identificado con " + fl(vend?vend.tipoDoc:"") + " No " + fl(vend?vend.numDoc:"") + " por medio del presente documento AUTORIZO de manera voluntaria e irrevocable, que el valor de la venta del vehiculo que se describe a continuacion:</div>"
    + "<br>"
    + "<table style='width:70%;border:none'>"
    + "<tr><td class='nb'><b>Placa:</b></td><td class='nb'>" + flw(veh?veh.placa:"") + "</td></tr>"
    + "<tr><td class='nb'><b>Clase:</b></td><td class='nb'>" + flw(veh?veh.clase:"") + "</td></tr>"
    + "<tr><td class='nb'><b>Marca:</b></td><td class='nb'>" + flw(veh?veh.marca:"") + "</td></tr>"
    + "<tr><td class='nb'><b>Linea:</b></td><td class='nb'>" + flw(veh?veh.linea:"") + "</td></tr>"
    + "<tr><td class='nb'><b>Modelo:</b></td><td class='nb'>" + flw(veh?veh.anio:"") + "</td></tr>"
    + "<tr><td class='nb'><b>Color:</b></td><td class='nb'>" + flw(veh?veh.color:"") + "</td></tr>"
    + "<tr><td class='nb'><b>Servicio:</b></td><td class='nb'>" + flw(veh?veh.servicio:"") + "</td></tr>"
    + "<tr><td class='nb'><b>No de Motor:</b></td><td class='nb'>" + flw(veh?veh.numMotor:"") + "</td></tr>"
    + "<tr><td class='nb'><b>No de Chasis:</b></td><td class='nb'>" + flw(veh?veh.numChasis:"") + "</td></tr>"
    + "<tr><td class='nb'><b>Matriculado en:</b></td><td class='nb'>" + flw(veh?veh.organismoTransito:"") + "</td></tr>"
    + "</table>"
    + "<br>"
    + "<div class='p'>Y que figura a mi nombre segun Licencia de Transito No " + fl("______________________") + "</div>"
    + "<div class='p'>Sea desembolsado a " + fl("____________________________________________") + " Identificado con " + fl("____________") + " No " + fl("__________________") + " a la " + fl("_________________________") + " de " + fl("________________________") + " No " + fl("_______________________________") + "</div>"
    + "<br>"
    + "<div class='p'>La anterior autorizacion la emito en calidad de propietario(s) del vehiculo, objeto de la transaccion indicada, asumiendo en consecuencia toda responsabilidad que se genere por cualquier reclamacion presentada por parte de terceros en razon a esta autorizacion y a los datos por mi (nosotros) consignados en el presente documento</div>"
    + "<br>"
    + "<div class='p'>Para constancia se firma en la Ciudad de " + fl("____________________") + " a los " + fl("______") + " dias del mes de " + fl("_________________") + " del ano " + fl("__________") + " a las " + fl("______________") + "</div>"
    + "<div style='text-align:center;margin-top:50px'>"
    + "<div style='display:inline-block;border-top:1px solid #000;min-width:200px;padding-top:4px'>Firma<br><small>" + (vend?vend.nombreCompleto:"") + "</small></div>"
    + "</div>";

  return wrapDoc(body);
}



function DetalleFormulario({ registro: r, onClose }) {
  const [viendoDoc, setViendoDoc] = useState(null);
  const { funal, contrato, mandatos, desembolso } = determinarFormularios(r);
  const docs = [
    { nombre: "Funal",          html: genFunal(r, funal) },
    { nombre: "Contrato",       html: genContrato(r, contrato) },
    ...mandatos.map((m) => ({
      nombre: ("Mandato " + m.rol + (mandatos.filter(x=>x.rol===m.rol).length>1 ? (" "+m.idx) : "")).trim(),
      html: genMandato(m.persona, m.tipo==="MJ")
    })),
    { nombre: "Responsabilidad", html: genResponsabilidad(r) },
    ...(desembolso ? [{ nombre: "Desembolso", html: genDesembolso(r) }] : []),
  ];

  if (viendoDoc) {
    return (
      <div className="overlay">
        <div className="modal" style={{maxWidth:700}}>
          <div className="mhead" style={{background:"linear-gradient(135deg,#12151e,#1a1f2e)"}}>
            <div className="mhead-l">
              <div className="mico" style={{color:"#f5a623",background:"#f5a62320",border:"1px solid #f5a62340"}}>[DOC]</div>
              <div>
                <div className="mtitle" style={{color:"#fff"}}>{viendoDoc.nombre.toUpperCase()}</div>
                <div className="msub" style={{color:"#f5a623"}}>{r.vehiculo ? r.vehiculo.placa : ""} - {r.fecha}</div>
              </div>
            </div>
            <button className="mclose" onClick={() => setViendoDoc(null)}>x</button>
          </div>
          <div className="mbody" style={{padding:16, maxHeight:"65vh", overflowY:"auto"}}>
            <div style={{background:"#fff",borderRadius:6,padding:16,fontSize:12,color:"#000"}}
              dangerouslySetInnerHTML={{__html: viendoDoc.html}} />
          </div>
          <div className="mfoot" style={{flexDirection:"column",gap:8}}>
            <button className="btn-generar-formularios" onClick={() => {
              var w = window.open("", "_blank");
              if (w) { w.document.open(); w.document.write(viendoDoc.html); w.document.close(); setTimeout(function(){ w.print(); }, 500); }
              else { alert("Permite las ventanas emergentes en tu navegador y vuelve a intentarlo."); }
            }}>
              GENERAR PDF
            </button>
            <button className="btn-cancel" style={{width:"100%",textAlign:"center"}} onClick={() => setViendoDoc(null)}>
              CERRAR
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overlay">
      <div className="modal">
        <div className="mhead" style={{background:"linear-gradient(135deg,#12151e,#1a1f2e)"}}>
          <div className="mhead-l">
            
            <div>
              <div className="mtitle" style={{color:"#fff"}}>DETALLE FORMULARIO</div>
              <div className="msub" style={{color:"#f5a623"}}>{r.fecha} - {r.hora}</div>
            </div>
          </div>
          <button className="mclose" onClick={onClose}>x</button>
        </div>
        <div className="mbody">
          <div className="sec-head"><span>VENDEDOR{r.vendedores.length > 1 ? "ES" : ""}</span></div>
          {r.vendedores.map((c,i) => (
            <div key={i} className="detalle-cliente-card">
              <div className="detalle-cliente-nombre">{c ? c.nombreCompleto : ""}</div>
              <div className="detalle-cliente-doc">{c ? c.tipoDoc : ""} {c ? c.numDoc : ""}</div>
              {c && c.celular && <div className="detalle-cliente-extra">Cel: {c.celular}</div>}
              {c && c.email && <div className="detalle-cliente-extra">Email: {c.email}</div>}
              {c && c.direccion && <div className="detalle-cliente-extra">Dir: {c.direccion}{c.ciudad ? (", " + c.ciudad) : ""}</div>}
            </div>
          ))}
          <div className="sec-head"><span>COMPRADOR{r.compradores.length > 1 ? "ES" : ""}</span></div>
          {r.compradores.length === 0
            ? <div className="detalle-cliente-card" style={{color:"var(--tx3)",fontStyle:"italic"}}>TRASPASO ABIERTO</div>
            : r.compradores.map((c,i) => (
                <div key={i} className="detalle-cliente-card">
                  <div className="detalle-cliente-nombre">{c ? c.nombreCompleto : ""}</div>
                  <div className="detalle-cliente-doc">{c ? c.tipoDoc : ""} {c ? c.numDoc : ""}</div>
                  {c && c.celular && <div className="detalle-cliente-extra">Cel: {c.celular}</div>}
                  {c && c.email && <div className="detalle-cliente-extra">Email: {c.email}</div>}
                  {c && c.direccion && <div className="detalle-cliente-extra">Dir: {c.direccion}{c.ciudad ? (", " + c.ciudad) : ""}</div>}
                </div>
              ))
          }
          <div className="sec-head"><span>VEHICULO</span></div>
          <div className="detalle-vehiculo-card">
            <div className="detalle-v-placa">{r.vehiculo ? r.vehiculo.placa : ""}</div>
            <div className="detalle-v-nombre">{r.vehiculo ? (r.vehiculo.marca + " " + r.vehiculo.linea + " " + r.vehiculo.anio) : ""}</div>
            <div className="detalle-v-grid">
              {r.vehiculo && r.vehiculo.color && <span className="detalle-v-item"><b>Color:</b> {r.vehiculo.color}</span>}
              {r.vehiculo && r.vehiculo.servicio && <span className="detalle-v-item"><b>Servicio:</b> {r.vehiculo.servicio}</span>}
              {r.vehiculo && r.vehiculo.organismoTransito && <span className="detalle-v-item"><b>Matriculado en:</b> {r.vehiculo.organismoTransito}</span>}
            </div>
          </div>
          <div className="sec-head"><span>DOCUMENTOS ({docs.length})</span></div>
          <div className="docs-list">
            {docs.map((d,i) => (
              <button key={i} className="doc-item" onClick={() => setViendoDoc(d)}>
                <span className="doc-ico">[DOC]</span>
                <span className="doc-nombre">{d.nombre}</span>
                <span className="doc-ver">VER</span>
              </button>
            ))}
          </div>
        </div>
        <div className="mfoot">
          <button className="btn-cancel" style={{width:"100%",textAlign:"center"}} onClick={onClose}>CERRAR</button>
        </div>
      </div>
    </div>
  );
}

// ── NuevoFormatoForm ───────────────────────────────────────────────────────────
function NuevoFormatoForm({ clients, vehiculos, onGuardar, onCancel }) {
  const [numVendedores, setNumVendedores] = useState(null);
  const [numCompradores, setNumCompradores] = useState(null);
  const [vendedores, setVendedores] = useState([null, null]);
  const [compradores, setCompradores] = useState([null, null]);
  const [vehiculoId, setVehiculoId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const handleCancel = () => {
    const hayAlgo = numVendedores !== null || vehiculoId !== null;
    if (hayAlgo) setShowCancelConfirm(true);
    else onCancel();
  }; 
  const handleVendedorChange = (i, id) => { const v=[...vendedores]; v[i]=id; setVendedores(v); };
  const handleCompradorChange = (i, id) => { const c=[...compradores]; c[i]=id; setCompradores(c); };
  const vendedorListo = numVendedores !== null && vendedores.slice(0,numVendedores).every(id=>id!==null);
  const compradorListo = numCompradores !== null && (numCompradores===0 || compradores.slice(0,numCompradores).every(id=>id!==null));
  const todosListos = vendedorListo && compradorListo && vehiculoId !== null;
  const getCliente = id => clients.find(c=>c.id===id);
  const veh = vehiculoId ? vehiculos.find(v=>v.id===vehiculoId) : null;
  const handleGuardar = () => {
    onGuardar({
      id: Date.now(),
      fecha: new Date().toLocaleDateString("es-CO"),
      hora: new Date().toLocaleTimeString("es-CO",{hour:"2-digit",minute:"2-digit"}),
      vendedores: vendedores.slice(0,numVendedores).map(id=>getCliente(id)),
      compradores: numCompradores===0 ? [] : compradores.slice(0,numCompradores).map(id=>getCliente(id)),
      vehiculo: veh,
    });
  };
  return (
    <div className="overlay">
      <div className="modal">
        <div className="mhead">
          <div className="mhead-l">
            
            <div><div className="mtitle">NUEVO FORMULARIO</div><div className="msub">SELECCIONE VENDEDOR, COMPRADOR Y VEHICULO</div></div>
          </div>
          <button className="mclose" onClick={onCancel}>x</button>
        </div>
        <div className="mbody" style={{padding:"12px 16px"}}>
          <Paleta titulo="VENDEDOR" opciones={[1,2]} selected={numVendedores}
            onSelect={n=>{setNumVendedores(n);setVendedores([null,null]);setNumCompradores(null);setCompradores([null,null]);setVehiculoId(null);}}
            clients={clients} vendedores={vendedores} compradores={compradores}
            onClienteChange={handleVendedorChange} color="#2c5f8a" excludedIds={compradores.filter(Boolean)} />
          {vendedorListo ? (
            <Paleta titulo="COMPRADOR" opciones={[0,1,2]} selected={numCompradores}
              onSelect={n=>{setNumCompradores(n);setCompradores([null,null]);setVehiculoId(null);}}
              clients={clients} vendedores={vendedores} compradores={compradores}
              onClienteChange={handleCompradorChange} color="#f5a623" excludedIds={vendedores.filter(Boolean)} />
          ) : (
            <div className="paleta paleta-locked" style={{"--pcolor":"#c8cdd8"}}>
              <div className="paleta-header"><span className="paleta-title" style={{color:"var(--tx3)"}}>COMPRADOR</span><span className="paleta-lock-msg">COMPLETE EL VENDEDOR PRIMERO</span></div>
            </div>
          )}
          {compradorListo && vendedorListo ? (
            <div className="paleta" style={{"--pcolor":"#276749"}}>
              <div className="paleta-header"><span className="paleta-title">VEHICULO</span></div>
              <div className="paleta-slots"><VehiculoSelector vehiculos={vehiculos} value={vehiculoId} onChange={setVehiculoId} /></div>
            </div>
          ) : (
            <div className="paleta paleta-locked" style={{"--pcolor":"#c8cdd8"}}>
              <div className="paleta-header"><span className="paleta-title" style={{color:"var(--tx3)"}}>VEHICULO</span><span className="paleta-lock-msg">{!vendedorListo?"COMPLETE EL VENDEDOR PRIMERO":"COMPLETE EL COMPRADOR PRIMERO"}</span></div>
            </div>
          )}
        </div>
        <div className="mfoot">
          <button className="btn-cancel" onClick={handleCancel}>CANCELAR</button>
          <button className={todosListos?"btn-save":"btn-save btn-save-disabled"} disabled={!todosListos} onClick={()=>setShowConfirm(true)}>GUARDAR FORMULARIO</button>
        </div>
      </div>
      {showCancelConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <div className="confirm-icon">(!)</div>
            <div className="confirm-title">CANCELAR FORMULARIO</div>
            <div className="confirm-msg">Si cancela perdera la informacion ingresada. ¿Desea continuar?</div>
            <div className="confirm-actions">
              <button className="btn-cancel" onClick={()=>setShowCancelConfirm(false)}>VOLVER</button>
              <button className="btn-save" style={{background:"var(--red)"}} onClick={()=>{setShowCancelConfirm(false);onCancel();}}>SI, CANCELAR</button>
            </div>
          </div>
        </div>
      )}
      {showConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <div className="confirm-icon">(!)</div>
            <div className="confirm-title">CONFIRMAR FORMULARIO</div>
            <div className="confirm-msg" style={{textAlign:"left"}}>
              <div className="resumen-row"><span className="resumen-label">VENDEDOR{numVendedores>1?"ES":""}</span>
                {vendedores.slice(0,numVendedores).map(id=>{const c=getCliente(id);return <div key={id} className="resumen-val">{c?c.nombreCompleto:""} - {c?c.tipoDoc:""} {c?c.numDoc:""}</div>;})}
              </div>
              <div className="resumen-row"><span className="resumen-label">COMPRADOR{numCompradores>1?"ES":""}</span>
                {numCompradores===0
                  ? <div className="resumen-val" style={{color:"var(--tx3)"}}>TRASPASO ABIERTO</div>
                  : compradores.slice(0,numCompradores).map(id=>{const c=getCliente(id);return <div key={id} className="resumen-val">{c?c.nombreCompleto:""} - {c?c.tipoDoc:""} {c?c.numDoc:""}</div>;})
                }
              </div>
              <div className="resumen-row"><span className="resumen-label">VEHICULO</span>
                <div className="resumen-val">{veh?(veh.marca+" "+veh.linea+" "+veh.anio+" - "+veh.placa):""}</div>
              </div>
            </div>
            <div className="confirm-actions">
              <button className="btn-cancel" onClick={()=>setShowConfirm(false)}>CANCELAR</button>
              <button className="btn-save" onClick={handleGuardar}>CONFIRMAR Y GUARDAR</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Home ───────────────────────────────────────────────────────────────────────
function Home({ onNav, miInfo }) {
  const [showBubble, setShowBubble] = React.useState(!miInfo);

  React.useEffect(() => {
    if (!miInfo) {
      setShowBubble(true);
      const t = setTimeout(() => setShowBubble(false), 15000);
      return () => clearTimeout(t);
    } else {
      setShowBubble(false);
    }
  }, [miInfo]);

  const nombreNegocio = miInfo
    ? (miInfo.tipoDoc === "NIT"
        ? miInfo.primerNombre
        : [miInfo.primerNombre, miInfo.primerApellido].filter(Boolean).join(" "))
    : "NEGOCIO";

  return (
    <div className="home">
      <div className="home-brand">
        <div className="home-brand-name">{nombreNegocio.toUpperCase()}</div>
        <div className="home-brand-sub">COMPRAVENTA</div>
      </div>

      <div className="tile-miinfo" onClick={() => onNav("miinfo")}>
        <span className="t-label">Mi Info</span>
        <span className="t-arrow">></span>
      </div>

      {showBubble && (
        <div className="miinfo-bubble" onClick={() => onNav("miinfo")}>
          <span>Completa tu informacion en Mi Info para que tus datos aparezcan en las liquidaciones</span>
          <button className="miinfo-bubble-close" onClick={e => { e.stopPropagation(); setShowBubble(false); }}>x</button>
        </div>
      )}
      <div className="group-box">
        <div className="group-label">GESTION</div>
        <div className="group-col">
          <div className="tile" onClick={() => onNav("clientes")}>
            <span className="t-ico">👤</span>
            <span className="t-label">CLIENTES</span>
            <span className="t-arrow">></span>
          </div>
          <div className="tile" onClick={() => onNav("vehiculos")}>
            <span className="t-ico">🚗</span>
            <span className="t-label">VEHICULOS</span>
            <span className="t-arrow">></span>
          </div>
        </div>
      </div>
      <div className="group-box">
        <div className="group-label">TRANSACCIONES</div>
        <div className="group-col">
          <div className="tile" onClick={() => onNav("formularios")}>
            <span className="t-ico">📋</span>
            <span className="t-label">FORMULARIOS</span>
            <span className="t-arrow">></span>
          </div>
          <div className="tile" onClick={() => onNav("liquidaciones")}>
            <span className="t-ico">💰</span>
            <span className="t-label">LIQUIDACIONES</span>
            <span className="t-arrow">></span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── App ────────────────────────────────────────────────────────────────────────
// ── MiInfoView ─────────────────────────────────────────────────────────────────
const BANCOS_MI = ["BANCOLOMBIA","DAVIVIENDA","BANCO DE BOGOTA","BANCO POPULAR","BBVA","BANCO DE OCCIDENTE","BANCO CAJA SOCIAL","COLPATRIA","ITAU","SCOTIABANK COLPATRIA","BANCO FALABELLA","BANCO PICHINCHA","NEQUI","DAVIPLATA","RAPPIPAY","MOVII","UALA","LLAVE","OTRO"];
const TIPO_CUENTA = ["AHORROS","CORRIENTE"];

function MiInfoView({ miInfo, setMiInfo, onBack }) {
  const blank = {tipoDoc:"",numDoc:"",digitoVerificacion:"",primerNombre:"",segundoNombre:"",primerApellido:"",segundoApellido:"",celular:"",departamento:"",ciudad:"",direccion:"",email:"",foto:null,cuentas:[],observaciones:""};
  const [form, setForm] = useState(miInfo ? {...miInfo} : {...blank});
  const [errors, setErrors] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const isDirty = JSON.stringify(form) !== JSON.stringify(miInfo || blank);
  const esNit = form.tipoDoc === "NIT";

  const set = (k,v) => setForm(p=>({...p,[k]:v}));

  const validate = () => {
    const e = {};
    if (!form.tipoDoc) e.tipoDoc = "REQUERIDO";
    if (!form.numDoc) e.numDoc = "REQUERIDO";
    if (!form.primerNombre) e.primerNombre = esNit ? "NOMBRE DE EMPRESA REQUERIDO" : "REQUERIDO";
    if (!esNit && !form.primerApellido) e.primerApellido = "REQUERIDO";
    if (esNit && !form.digitoVerificacion) e.digitoVerificacion = "REQUERIDO";
    if (!form.celular) e.celular = "REQUERIDO";
    if (!form.departamento) e.departamento = "REQUERIDO";
    if (!form.ciudad) e.ciudad = "REQUERIDO";
    if (!form.direccion) e.direccion = "REQUERIDO";
    if (!form.email) e.email = "REQUERIDO";
    if (!form.cuentas || form.cuentas.length === 0) {
      e.cuentas = "MINIMO 1 CUENTA BANCARIA";
    } else {
      form.cuentas.forEach((c, i) => {
        if (!c.banco) e["cuenta_banco_"+i] = "REQUERIDO";
        const noTipo = ["NEQUI","DAVIPLATA","LLAVE","RAPPIPAY","MOVII","UALA"];
        if (c.banco && !noTipo.includes(c.banco) && !c.tipoCuenta) e["cuenta_tipo_"+i] = "REQUERIDO";
        if (!c.numCuenta) e["cuenta_num_"+i] = "REQUERIDO";
      });
    }
    return e;
  };

  const esPrimerRegistro = !miInfo;
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    if (esPrimerRegistro) {
      setMiInfo({...form});
      setErrors({});
      onBack();
    } else {
      setShowSaveConfirm(true);
    }
  };

  const confirmarGuardar = () => {
    setMiInfo({...form});
    setErrors({});
    setShowSaveConfirm(false);
    onBack();
  };

  const handleBack = () => {
    if (isDirty) {
      const e = validate();
      if (Object.keys(e).length > 0) {
        setShowConfirm(true); // show discard/fix dialog
      } else {
        setShowConfirm(true);
      }
    } else {
      onBack();
    }
  };

  const addCuenta = () => {
    if ((form.cuentas||[]).length >= 5) return;
    set("cuentas", [...(form.cuentas||[]), {banco:"",tipoCuenta:"",numCuenta:""}]);
  };
  const updCuenta = (i,k,v) => {
    const cs = [...(form.cuentas||[])];
    cs[i] = {...cs[i],[k]:v};
    set("cuentas", cs);
  };
  const delCuenta = (i) => {
    const cs = [...(form.cuentas||[])];
    cs.splice(i,1);
    set("cuentas", cs);
  };

  return (
    <div className="view">
      <div className="clientes-hero">
        <button className="btn-back-hero" onClick={handleBack}>ATRAS</button>
        <div className="clientes-hero-center">
          <svg className="clientes-hero-avatar" viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="28" r="18" fill="rgba(255,255,255,0.9)"/>
            <ellipse cx="40" cy="70" rx="28" ry="18" fill="rgba(255,255,255,0.9)"/>
          </svg>
          <div className="clientes-hero-title">MI INFO</div>
        </div>
        <button className={isDirty ? "btn-primary-hero" : "btn-primary-hero btn-primary-hero-dis"} onClick={handleSave} disabled={!isDirty}>GUARDAR</button>
      </div>

      <div className="miinfo-card">
        {/* FOTO */}
        <div style={{display:"flex",justifyContent:"center",margin:"16px 0"}}>
          <div style={{position:"relative",width:90,height:90}}>
            <div style={{width:90,height:90,borderRadius:"50%",background:"var(--s3)",border:"2px solid var(--bd)",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center"}}>
              {form.foto
                ? <img src={form.foto} style={{width:"100%",height:"100%",objectFit:"cover"}} alt="foto" />
                : <span style={{fontSize:32,color:"var(--tx3)"}}>?</span>
              }
            </div>
            <label style={{position:"absolute",bottom:0,right:0,background:"#f5a623",borderRadius:"50%",width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",border:"2px solid white"}}>
              <span style={{fontSize:14}}>+</span>
              <input type="file" accept="image/*" style={{display:"none"}} onChange={e=>{
                const f=e.target.files[0]; if(!f) return;
                const r=new FileReader(); r.onload=ev=>set("foto",ev.target.result); r.readAsDataURL(f);
              }}/>
            </label>
          </div>
        </div>

        <Field label="TIPO DE DOCUMENTO *" error={errors.tipoDoc}>
          <select className={errors.tipoDoc?"fi fi-err":"fi"} value={form.tipoDoc} onChange={e=>{
            setForm({...blank, tipoDoc: e.target.value});
            setErrors({});
          }}>
            <option value="">SELECCIONE</option>
            {["CC","NIT","CE","PASAPORTE","RC","TI"].map(t=><option key={t}>{t}</option>)}
          </select>
        </Field>

        {/* Campos que solo aparecen si se seleccionó tipo de documento */}
        {form.tipoDoc && (esNit ? (
          <>
            <Field label="NOMBRE DE EMPRESA *" error={errors.primerNombre}>
              <input className={errors.primerNombre?"fi fi-err":"fi"} value={form.primerNombre} onChange={e=>set("primerNombre",e.target.value.toUpperCase())} />
            </Field>
            <Field label="No. DOCUMENTO *" error={errors.numDoc}>
              <input className={errors.numDoc?"fi fi-err":"fi"} className={errors.numDoc?"fi fi-err":"fi"} value={form.numDoc} onChange={e=>set("numDoc",e.target.value.replace(/\D/g,""))} inputMode="numeric" />
            </Field>
            <Field label="DIGITO DE VERIFICACION *" error={errors.digitoVerificacion}>
              <input className={errors.digitoVerificacion?"fi fi-err":"fi"} value={form.digitoVerificacion} onChange={e=>set("digitoVerificacion",e.target.value.replace(/\D/g,"").slice(0,1))} inputMode="numeric" maxLength={1} />
            </Field>
          </>
        ) : (
          <>
            <Field label="PRIMER NOMBRE *" error={errors.primerNombre}>
              <input className={errors.primerNombre?"fi fi-err":"fi"} value={form.primerNombre} onChange={e=>set("primerNombre",e.target.value.toUpperCase())} />
            </Field>
            <Field label="SEGUNDO NOMBRE (opcional)">
              <input className="fi fi-opt" value={form.segundoNombre} onChange={e=>set("segundoNombre",e.target.value.toUpperCase())} />
            </Field>
            <Field label="PRIMER APELLIDO *" error={errors.primerApellido}>
              <input className={errors.primerApellido?"fi fi-err":"fi"} value={form.primerApellido} onChange={e=>set("primerApellido",e.target.value.toUpperCase())} />
            </Field>
            <Field label="SEGUNDO APELLIDO (opcional)">
              <input className="fi fi-opt" value={form.segundoApellido} onChange={e=>set("segundoApellido",e.target.value.toUpperCase())} />
            </Field>
            <Field label="No. DOCUMENTO *" error={errors.numDoc}>
              <input className={errors.numDoc?"fi fi-err":"fi"} value={form.numDoc} onChange={e=>set("numDoc",["PASAPORTE","CE"].includes(form.tipoDoc)?e.target.value.toUpperCase():e.target.value.replace(/\D/g,""))} inputMode={["PASAPORTE","CE"].includes(form.tipoDoc)?"text":"numeric"} />
            </Field>
          </>
        ))}

        {form.tipoDoc && (
          <>
        <Field label="CELULAR *" error={errors.celular}><input className={errors.celular?"fi fi-err":"fi"} value={form.celular} onChange={e=>set("celular",e.target.value.replace(/\D/g,""))} inputMode="numeric" /></Field>
        <Field label="EMAIL *" error={errors.email}><input type="email" className={errors.email?"fi fi-err":"fi"} value={form.email} onChange={e=>set("email",e.target.value.toLowerCase())} inputMode="email" autoCapitalize="none" autoCorrect="off" /></Field>
        <Field label="DEPARTAMENTO *" error={errors.departamento}>
          <select className={errors.departamento?"fi fi-err":"fi"} value={form.departamento} onChange={e=>{set("departamento",e.target.value);set("ciudad","");}}>
            <option value="">SELECCIONE</option>
            {Object.keys(COLOMBIA).map(d=><option key={d}>{d}</option>)}
          </select>
        </Field>
        {form.departamento && (
          <Field label="CIUDAD *" error={errors.ciudad}>
            <select className={errors.ciudad?"fi fi-err":"fi"} value={form.ciudad} onChange={e=>set("ciudad",e.target.value)}>
              <option value="">SELECCIONE</option>
              {(COLOMBIA[form.departamento]||[]).map(c=><option key={c}>{c}</option>)}
            </select>
          </Field>
        )}
        <Field label="DIRECCION *" error={errors.direccion}>
          <input className={errors.direccion?"fi fi-err":"fi"} value={form.direccion} onChange={e=>set("direccion",e.target.value.toUpperCase())} />
        </Field>

        {/* CUENTAS BANCARIAS */}
        <div className="sec-head" style={{marginTop:16}}><span>CUENTAS BANCARIAS *</span></div>
        {errors.cuentas && <div style={{color:"var(--red)",fontSize:11,marginBottom:8}}>{errors.cuentas}</div>}
        {(form.cuentas||[]).map((c,i)=>(
          <div key={i} style={{background:"var(--s2)",border:"1px solid var(--bd)",borderRadius:8,padding:"12px",marginBottom:8}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
              <span style={{fontSize:11,fontWeight:700,color:"var(--tx3)"}}>CUENTA {i+1}</span>
              <button style={{background:"none",border:"none",color:"var(--red)",cursor:"pointer",fontSize:13}} onClick={()=>delCuenta(i)}>ELIMINAR</button>
            </div>
            <Field label="BANCO *" error={errors["cuenta_banco_"+i]}>
              <select className={errors["cuenta_banco_"+i]?"fi fi-err":"fi"} value={c.banco} onChange={e=>updCuenta(i,"banco",e.target.value)}>
                <option value="">SELECCIONE</option>
                {BANCOS_MI.map(b=><option key={b}>{b}</option>)}
              </select>
            </Field>
            {!["NEQUI","DAVIPLATA","LLAVE","RAPPIPAY","MOVII","UALA"].includes(c.banco) && c.banco && (
              <Field label="TIPO DE CUENTA *" error={errors["cuenta_tipo_"+i]}>
                <select className={errors["cuenta_tipo_"+i]?"fi fi-err":"fi"} value={c.tipoCuenta} onChange={e=>updCuenta(i,"tipoCuenta",e.target.value)}>
                  <option value="">SELECCIONE</option>
                  {TIPO_CUENTA.map(t=><option key={t}>{t}</option>)}
                </select>
              </Field>
            )}
            <Field label="No. CUENTA *" error={errors["cuenta_num_"+i]}>
              <input className={errors["cuenta_num_"+i]?"fi fi-err":"fi"} value={c.numCuenta} onChange={e=>updCuenta(i,"numCuenta",e.target.value.replace(/\D/g,""))} inputMode="numeric" />
            </Field>
          </div>
        ))}
        {(form.cuentas||[]).length < 5 && (
          <button className="btn-add" onClick={addCuenta}>+ AGREGAR CUENTA {(form.cuentas||[]).length > 0 ? ("("+form.cuentas.length+"/5)") : ""}</button>
        )}

        <Field label="OBSERVACIONES"><textarea className="fi fi-opt" rows={3} value={form.observaciones} onChange={e=>set("observaciones",e.target.value)} style={{resize:"none"}} /></Field>

        <button className={isDirty?"btn-save-full":"btn-save-full btn-save-full-dis"} onClick={handleSave} disabled={!isDirty} style={{marginTop:16}}>GUARDAR</button>
          </>
        )}
      </div>

      {showConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <div className="confirm-title">CAMBIOS SIN GUARDAR</div>
            <div className="confirm-msg">Tiene cambios sin guardar. Si descarta perdera los cambios realizados.</div>
            <div className="confirm-actions">
              <button className="btn-save" onClick={() => setShowConfirm(false)}>CANCELAR</button>
              <button className="btn-cancel" style={{background:"var(--red)",color:"#fff"}} onClick={() => { setShowConfirm(false); onBack(); }}>DESCARTAR</button>
            </div>
          </div>
        </div>
      )}

      {showSaveConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <div className="confirm-title">CONFIRMAR CAMBIOS</div>
            <div className="confirm-msg">Desea guardar los cambios realizados en Mi Info?</div>
            <div className="confirm-actions">
              <button className="btn-cancel" onClick={() => setShowSaveConfirm(false)}>CANCELAR</button>
              <button className="btn-save" onClick={confirmarGuardar}>GUARDAR</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [screen, setScreen]       = useState("home");
  const [clients, setClients]     = useState(SEED);
  const [vehiculos, setVehiculos] = useState(SEED_VEHICULOS);
  const [miInfo, setMiInfo]       = useState(null);

  return (
    <div className="app">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #f0f2f5; --s1: #ffffff; --s2: #f7f8fa; --s3: #eef0f4;
          --bd: #dde1e8; --bd2: #c8cdd8; --tx: #1a2030; --tx2: #4a5568; --tx3: #8896a8;
          --acc: #2c5f8a; --ac2: #1e4a6f; --grn: #276749; --red: #9b3030;
        }
        body, .app { font-family: 'Inter', sans-serif; background: var(--bg); min-height: 100vh; }
        .app { max-width: 480px; margin: 0 auto; padding: 16px; }
        .view { display: flex; flex-direction: column; gap: 0; position: relative; }
        .empty { background: var(--s1); border: 1px solid var(--bd); border-radius: 10px; padding: 40px; text-align: center; font-size: 12px; font-weight: 600; letter-spacing: 2px; color: var(--tx3); }
        /* HOME */
        .home { max-width: 680px; margin: 0 auto; display: flex; flex-direction: column; gap: 14px; background: #12151e; border-radius: 16px; padding: 28px 20px; box-shadow: 0 8px 32px #00000030; }
        .home-brand { display: flex; flex-direction: column; align-items: center; gap: 4px; margin-bottom: 8px; }
        .home-brand-name { font-size: 22px; font-weight: 900; letter-spacing: 4px; color: #f5a623; }
        .home-brand-sub { font-size: 10px; font-weight: 600; letter-spacing: 3px; color: #4a5578; }
        .miinfo-bubble {
          background: #f5a623; color: #12151e;
          border-radius: 10px; padding: 12px 36px 12px 14px;
          font-size: 12px; font-weight: 600; line-height: 1.5;
          cursor: pointer; position: relative;
          box-shadow: 0 4px 16px #00000040;
          animation: fadeInDown .3s ease;
          margin-top: 6px;
        }
        .miinfo-bubble::before {
          content: ''; position: absolute; top: -8px; left: 24px;
          width: 0; height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-bottom: 8px solid #f5a623;
        }
        .miinfo-bubble-close {
          position: absolute; top: 8px; right: 10px;
          background: none; border: none; font-size: 14px;
          color: #12151e; cursor: pointer; font-weight: 700; line-height: 1;
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .tile, .tile-miinfo { background: #1a1f2e; border: 1px solid #252d45; border-radius: 10px; padding: 22px 20px; cursor: pointer; display: flex; align-items: center; gap: 16px; box-shadow: 0 2px 8px #00000020; transition: all .18s; position: relative; overflow: hidden; }
        .tile::after, .tile-miinfo::after { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: #f5a623; opacity: 0; transition: opacity .18s; }
        .tile:hover, .tile-miinfo:hover { background: #1f2638; border-color: #f5a62340; box-shadow: 0 4px 20px #00000030; transform: translateY(-1px); }
        .tile:hover::after, .tile-miinfo:hover::after { opacity: 1; }
        .t-ico { font-size: 18px; font-weight: 800; color: #f5a623; flex-shrink: 0; min-width: 28px; }
        .t-label { font-size: 14px; font-weight: 700; letter-spacing: 2px; flex: 1; color: #c8d0e0; }
        .t-arrow { font-size: 16px; color: #2d3a55; transition: all .18s; }
        .tile:hover .t-arrow, .tile-miinfo:hover .t-arrow { color: #f5a623; transform: translateX(4px); }
        .tile-miinfo .t-label { color: #f5a623; }
        .group-box { background: #151929; border: 1px solid #1e2640; border-radius: 12px; padding: 14px; display: flex; flex-direction: column; gap: 10px; }
        .group-label { font-size: 10px; font-weight: 700; letter-spacing: 2.5px; color: #2d3a55; padding: 0 4px; }
        .group-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .group-col  { display: flex; flex-direction: column; gap: 10px; }
        /* HERO */
        .clientes-hero { display: flex; align-items: center; justify-content: space-between; background: linear-gradient(135deg,#12151e,#1a1f2e); border: 1px solid #252d45; border-radius: 12px; padding: 18px 20px; margin-bottom: 18px; box-shadow: 0 4px 20px #00000025; position: sticky; top: 0; z-index: 10; }
        .btn-back-hero { background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.15); color: #c8d0e0; font-family: 'Inter',sans-serif; font-size: 12px; font-weight: 600; letter-spacing: .5px; padding: 8px 16px; border-radius: 6px; cursor: pointer; transition: all .15s; white-space: nowrap; }
        .btn-back-hero:hover { background: rgba(255,255,255,.14); color: #fff; }
        .clientes-hero-center { display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .clientes-hero-avatar { width: 64px; height: 64px; }
        .clientes-hero-title { font-size: 18px; font-weight: 800; letter-spacing: 4px; color: #fff; line-height: 1; }
        .btn-primary-hero { background: #f5a623; border: none; color: #1a1200; font-family: 'Inter',sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 1px; padding: 8px 16px; border-radius: 6px; cursor: pointer; transition: all .15s; white-space: nowrap; box-shadow: 0 2px 10px #f5a62330; }
        .btn-primary-hero:hover { background: #e8920a; }
        .btn-hero-disabled { background: #2d3a55 !important; color: #4a5578 !important; cursor: not-allowed !important; box-shadow: none !important; }
        /* CARDS */
        .clist { display: flex; flex-direction: column; gap: 5px; }
        .ccard { display: flex; align-items: center; background: var(--s1); border: 1px solid var(--bd); border-radius: 7px; padding: 10px 0; cursor: pointer; transition: all .15s; }
        .ccard:hover { box-shadow: 0 2px 10px #00000010; border-color: var(--bd2); }
        .ccard-info { flex: 1; padding: 0 12px; }
        .ccard-name { font-size: 14px; font-weight: 600; color: var(--tx); }
        .ccard-meta { display: flex; align-items: center; gap: 6px; margin-top: 2px; flex-wrap: wrap; }
        .dbadge { background: var(--acc); color: #fff; font-size: 9px; font-weight: 700; padding: 1px 5px; border-radius: 3px; }
        .dnum { font-size: 11px; color: var(--tx2); }
        .cdot { color: var(--bd2); font-size: 10px; }
        .cmeta { font-size: 11px; color: var(--tx3); }
        .ccard-right { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; padding: 0 12px; }
        .ccard-fecha { font-size: 9px; color: var(--tx3); font-weight: 500; letter-spacing: .3px; white-space: nowrap; }
        .flag-ok { font-size: 22px; color: #276749; line-height: 1; }
        .flag-pend { font-size: 22px; color: #b86e00; line-height: 1; }
        /* SEARCH */
        .srch-wrap { display: flex; align-items: center; gap: 8px; background: var(--s1); border: 1px solid var(--bd); border-radius: 8px; padding: 8px 12px; margin-bottom: 10px; }
        .srch { flex: 1; border: none; background: transparent; font-family: 'Inter',sans-serif; font-size: 16px; color: var(--tx); outline: none; }
        .srch-ico { color: var(--tx3); font-size: 14px; }
        .srch-clr { background: none; border: none; color: var(--tx3); cursor: pointer; font-size: 12px; }
        /* FORMS */
        .overlay { position: fixed; inset: 0; background: rgba(0,0,0,.6); display: flex; align-items: flex-end; justify-content: center; z-index: 9999; }
        .modal { background: var(--s1); border-radius: 16px 16px 0 0; width: 100%; max-height: 90vh; display: flex; flex-direction: column; }
        .mhead { display: flex; align-items: center; justify-content: space-between; padding: 16px; border-bottom: 1px solid var(--bd); }
        .mhead-l { display: flex; align-items: center; gap: 10px; }
        .mico { width: 36px; height: 36px; border-radius: 8px; background: var(--s2); border: 1px solid var(--bd); display: flex; align-items: center; justify-content: center; font-size: 16px; }
        .mtitle { font-size: 14px; font-weight: 700; color: var(--tx); }
        .msub { font-size: 11px; color: var(--tx3); margin-top: 2px; }
        .mhead-fecha { font-size: 10px; color: var(--tx3); font-weight: 600; letter-spacing: .5px; }
        .mclose { background: none; border: none; font-size: 18px; cursor: pointer; color: var(--tx3); padding: 4px; }
        .mbody { flex: 1; overflow-y: auto; padding: 16px; }
        .mfoot { padding: 12px 16px; border-top: 1px solid var(--bd); display: flex; gap: 10px; position: sticky; bottom: 0; background: var(--s1); z-index: 5; }
        .sec-head { display: flex; align-items: center; margin: 16px 0 8px; }
        .sec-head span { font-size: 9px; font-weight: 700; letter-spacing: 2px; color: var(--tx3); background: var(--bg); padding: 0 8px; }
        .sec-head::before, .sec-head::after { content: ''; flex: 1; height: 1px; background: var(--bd); }
        .fg { flex: 1; }
        .frow { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 6px; }
        .flabel { font-size: 9px; font-weight: 700; letter-spacing: 1px; color: var(--tx3); display: block; margin-bottom: 3px; text-transform: uppercase; }
        .opc { font-weight: 400; color: var(--tx3); font-size: 8px; }
        .fi { background: var(--s2); border: 1px solid var(--bd); border-radius: 6px; padding: 8px 10px; color: var(--tx); font-family: 'Inter',sans-serif; font-size: 16px; outline: none; width: 100%; transition: border-color .15s, box-shadow .15s; }
        .fi:focus { border-color: var(--acc); box-shadow: 0 0 0 2px rgba(44,95,138,.12); }
        .fi-opt { background: var(--s3); color: var(--tx2); }
        .fi-dis { background: var(--s3); color: var(--tx3); opacity: 0.5; cursor: not-allowed; }
        .fi-err { border-color: var(--red) !important; }
        .fi-ro { background: var(--bg); color: var(--tx3); cursor: default; }
        .fi option { background: var(--s1); }
        .fi-textarea { resize: vertical; min-height: 72px; line-height: 1.5; font-family: 'Inter',sans-serif; }
        .emsg { font-size: 10px; color: var(--red); font-weight: 600; letter-spacing: .5px; margin-top: 2px; }
        .btn-cancel { background: var(--s2); border: 1px solid var(--bd); color: var(--tx2); font-family: 'Inter',sans-serif; font-size: 13px; font-weight: 600; padding: 10px 18px; border-radius: 7px; cursor: pointer; flex: 1; }
        .btn-save { background: var(--acc); border: none; color: #fff; font-family: 'Inter',sans-serif; font-size: 13px; font-weight: 700; padding: 10px 18px; border-radius: 7px; cursor: pointer; flex: 2; }
        .btn-save:hover { background: var(--ac2); }
        .btn-save-disabled { background: var(--bd2) !important; color: var(--tx3) !important; cursor: not-allowed !important; }
        .confirm-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.6); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 20px; }
        .confirm-box { background: var(--s1); border-radius: 12px; padding: 24px; max-width: 340px; width: 100%; }
        .confirm-icon { font-size: 28px; text-align: center; margin-bottom: 8px; }
        .confirm-title { font-size: 15px; font-weight: 700; text-align: center; color: var(--tx); margin-bottom: 8px; }
        .confirm-msg { font-size: 12px; color: var(--tx2); text-align: center; margin-bottom: 16px; line-height: 1.5; }
        .confirm-actions { display: flex; gap: 10px; }
        /* VIEW HEAD */
        .view-head { display: flex; align-items: center; justify-content: space-between; padding: 12px 0; margin-bottom: 10px; }
        .view-head-l { display: flex; align-items: center; gap: 10px; }
        .btn-back { background: var(--s2); border: 1px solid var(--bd); color: var(--tx2); font-family: 'Inter',sans-serif; font-size: 12px; font-weight: 600; padding: 6px 12px; border-radius: 6px; cursor: pointer; }
        .view-title { font-size: 16px; font-weight: 700; color: var(--tx); letter-spacing: 1px; }
        /* MIINFO */
        .miinfo-card { background: var(--s1); border: 1px solid var(--bd); border-radius: 10px; padding: 4px 22px 16px; box-shadow: 0 1px 4px #0000000a; }
        .foto-section { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 16px 0 20px; }
        .foto-circle { width: 110px; height: 110px; border-radius: 50%; position: relative; cursor: pointer; display: block; overflow: hidden; flex-shrink: 0; background: #cfd8dc; box-shadow: 0 2px 12px #00000018; transition: filter .15s; }
        .foto-circle:hover { filter: brightness(.88); }
        .foto-img { width: 110px; height: 110px; object-fit: cover; display: block; border-radius: 50%; }
        .foto-default { width: 110px; height: 110px; display: flex; align-items: center; justify-content: center; background: #cfd8dc; }
        .foto-cam-badge { position: absolute; bottom: 6px; right: 6px; width: 28px; height: 28px; border-radius: 50%; background: var(--acc); display: flex; align-items: center; justify-content: center; box-shadow: 0 1px 4px #00000030; }
        .foto-hint-text { font-size: 10px; font-weight: 700; letter-spacing: 1.5px; color: var(--tx3); }
        .btn-save-full { width: 100%; background: var(--acc); border: none; color: #fff; font-family: 'Inter',sans-serif; font-size: 14px; font-weight: 700; letter-spacing: 1.5px; padding: 14px; border-radius: 8px; cursor: pointer; transition: background .15s; box-shadow: 0 2px 8px #2c5f8a22; }
        .btn-save-full:hover { background: var(--ac2); }
        .btn-save-full-disabled { background: var(--bd2) !important; color: var(--tx3) !important; cursor: not-allowed !important; box-shadow: none !important; }
        /* CUENTA */
        .cuenta-row { background: var(--s2); border: 1px solid var(--bd); border-radius: 8px; padding: 12px 14px; margin-bottom: 10px; }
        .cuenta-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
        .cuenta-num { font-size: 10px; font-weight: 700; letter-spacing: 1.5px; color: var(--acc); }
        .cuenta-remove { background: none; border: none; color: var(--tx3); cursor: pointer; font-size: 13px; transition: color .15s; }
        .cuenta-remove:hover { color: var(--red); }
        .btn-add-cuenta { width: 100%; background: var(--s2); border: 1px dashed var(--bd2); border-radius: 7px; padding: 10px; color: var(--acc); font-family: 'Inter',sans-serif; font-size: 12px; font-weight: 600; letter-spacing: 1px; cursor: pointer; transition: all .15s; margin-top: 4px; }
        .btn-add-cuenta:hover { background: var(--s3); border-color: var(--acc); }
        .cuenta-max { text-align: center; font-size: 10px; font-weight: 600; letter-spacing: 1px; color: var(--tx3); padding: 8px; }
        /* PALETA FORMULARIOS */
        /* ── LIQUIDACIONES ── */
        .liq-radio-group { display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px; }
        .liq-radio { display: flex; align-items: center; gap: 10px; background: var(--s2); border: 1px solid var(--bd); border-radius: 8px; padding: 12px 14px; cursor: pointer; font-size: 13px; font-weight: 600; color: var(--tx2); transition: all .15s; }
        .liq-radio-active { border-color: var(--acc); background: var(--s3); color: var(--acc); }
        .liq-radio input { accent-color: var(--acc); width: 16px; height: 16px; }
        .liq-search-box { display: flex; flex-direction: column; gap: 6px; margin-bottom: 8px; }
        .liq-sel-pill { display: flex; align-items: center; justify-content: space-between; background: var(--s3); border: 1px solid var(--acc); border-radius: 7px; padding: 10px 12px; font-size: 13px; font-weight: 600; color: var(--tx); }
        .liq-sel-clear { background: none; border: none; color: var(--tx3); cursor: pointer; font-size: 14px; padding: 0 4px; }
        .liq-tramites { display: flex; flex-direction: column; gap: 6px; margin-bottom: 8px; }
        .liq-tramite { background: var(--s2); border: 1px solid var(--bd); border-radius: 8px; padding: 10px 12px; transition: all .15s; }
        .liq-tramite-active { border-color: var(--acc); background: var(--s3); }
        .liq-check-label { display: flex; align-items: center; gap: 10px; cursor: pointer; font-size: 13px; color: var(--tx); }
        .liq-check-label input { accent-color: var(--acc); width: 16px; height: 16px; flex-shrink: 0; }
        .liq-valor-input { margin-top: 8px; font-size: 16px; }
        .liq-imp-row { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 8px 0; border-bottom: 1px solid var(--bd); flex-wrap: wrap; }
        .liq-imp-label { font-size: 12px; font-weight: 600; color: var(--tx); flex: 1; min-width: 140px; }
        .liq-pagado-check { display: flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 700; color: var(--grn); white-space: nowrap; cursor: pointer; }
        .liq-pagado-check input { accent-color: var(--grn); }
        .liq-total-box { display: flex; align-items: center; justify-content: space-between; background: linear-gradient(135deg,#12151e,#1a1f2e); border-radius: 10px; padding: 16px 18px; margin-top: 16px; }
        .liq-total-label { font-size: 11px; font-weight: 700; letter-spacing: 2px; color: #c8d0e0; }
        .liq-total-valor { font-size: 20px; font-weight: 900; color: #f5a623; }
        .liq-detalle-tabla { display: flex; flex-direction: column; border: 1px solid var(--bd); border-radius: 8px; overflow: hidden; margin-bottom: 12px; }
        .liq-det-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; border-bottom: 1px solid var(--bd); font-size: 13px; }
        .liq-det-row:last-child { border-bottom: none; }
        .liq-det-val { font-weight: 700; color: var(--tx); }
        .liq-aviso { background: #fff8e1; border: 1px solid #f5a623; border-radius: 8px; padding: 10px 14px; font-size: 11px; color: #7a5200; margin-bottom: 12px; line-height: 1.5; }
        .liq-locked { background: var(--s2); border: 1px dashed var(--bd2); border-radius: 8px; padding: 14px; font-size: 12px; font-weight: 600; color: var(--tx3); text-align: center; letter-spacing: .5px; margin-bottom: 8px; }

        .paleta { background: var(--s1); border: 1px solid var(--bd); border-left: 4px solid var(--pcolor); border-radius: 10px; margin-bottom: 14px; overflow: hidden; box-shadow: 0 1px 4px #0000000a; }
        .paleta-header { display: flex; align-items: center; padding: 12px 16px; background: var(--s2); border-bottom: 1px solid var(--bd); }
        .paleta-title { font-size: 12px; font-weight: 800; letter-spacing: 2.5px; color: var(--pcolor); }
        .paleta-opciones { display: flex; gap: 10px; padding: 14px 16px 10px; }
        .paleta-opt { width: 48px; height: 48px; border-radius: 10px; border: 2px solid var(--bd2); background: var(--s2); font-size: 18px; font-weight: 800; color: var(--tx2); cursor: pointer; transition: all .15s; display: flex; align-items: center; justify-content: center; }
        .paleta-opt:hover { border-color: var(--pcolor); color: var(--pcolor); background: var(--s3); }
        .paleta-opt-active { border-color: var(--pcolor) !important; background: var(--s3) !important; color: var(--pcolor) !important; box-shadow: 0 2px 8px #00000015; }
        .paleta-slots { padding: 4px 16px 14px; display: flex; flex-direction: column; gap: 10px; }
        .paleta-cero { padding: 10px 16px 14px; font-size: 11px; font-weight: 600; letter-spacing: 1px; color: var(--tx3); }
        .paleta-locked { opacity: .6; }
        .paleta-lock-msg { font-size: 10px; font-weight: 600; letter-spacing: 1px; color: var(--tx3); margin-left: 12px; }
        /* SELECTOR */
        .cselector { position: relative; }
        .cselector-label { font-size: 9px; font-weight: 700; letter-spacing: 1.5px; color: var(--tx3); margin-bottom: 6px; }
        .cselector-open { background: var(--s1); border: 1px solid var(--bd); border-radius: 8px; overflow: hidden; }
        .cselector-search-wrap { display: flex; align-items: center; gap: 6px; padding: 8px 10px; border-bottom: 1px solid var(--bd); background: var(--s2); }
        .cselector-search { flex: 1; background: transparent; border: none; color: var(--tx); font-family: 'Inter',sans-serif; font-size: 16px; outline: none; }
        .cselector-search::placeholder { color: var(--tx3); font-size: 12px; }
        .cselector-list { max-height: 240px; overflow-y: auto; }
        .cselector-list::-webkit-scrollbar { width: 3px; }
        .cselector-list::-webkit-scrollbar-thumb { background: var(--bd2); border-radius: 3px; }
        .cselector-item { padding: 13px 14px; cursor: pointer; border-bottom: 1px solid var(--bd); transition: background .12s; }
        .cselector-item:last-child { border-bottom: none; }
        .cselector-item:hover { background: var(--s2); }
        .cselector-active { background: var(--s3) !important; border-left: 3px solid var(--acc); }
        .cselector-name { font-size: 14px; font-weight: 600; color: var(--tx); }
        .cselector-doc { font-size: 11px; color: var(--tx3); margin-top: 4px; }
        .cselector-empty { padding: 20px; text-align: center; font-size: 11px; color: var(--tx3); letter-spacing: 1px; }
        .cselector-crear { width: 100%; padding: 12px; background: var(--s2); border: none; border-top: 1px solid var(--bd); color: var(--acc); font-family: 'Inter',sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 1px; cursor: pointer; transition: background .15s; text-align: center; }
        .cselector-crear:hover { background: var(--s3); }
        .cselector-selected-pill { display: flex; align-items: center; justify-content: space-between; background: var(--s2); border: 1px solid var(--acc); border-radius: 8px; padding: 12px 14px; cursor: pointer; transition: background .15s; }
        .cselector-selected-pill:hover { background: var(--s3); }
        .csp-info { display: flex; flex-direction: column; gap: 3px; }
        .csp-name { font-size: 14px; font-weight: 600; color: var(--tx); }
        .csp-doc { font-size: 11px; color: var(--tx3); }
        .csp-right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
        .csp-change { background: var(--acc); border: none; color: #fff; font-family: 'Inter',sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 1px; padding: 5px 12px; border-radius: 5px; cursor: pointer; white-space: nowrap; }
        .cselector-item-row { display: flex; align-items: center; justify-content: space-between; }
        .pending-list { text-align: left; margin: 8px 0 10px; padding-left: 4px; list-style: none; font-size: 12px; color: var(--tx2); line-height: 1.8; }
        /* FORMULARIOS */
        .formularios-registros { margin-top: 8px; display: flex; flex-direction: column; gap: 10px; }
        .formato-card { background: var(--s1); border: 1px solid var(--bd); border-radius: 10px; overflow: hidden; box-shadow: 0 1px 4px #0000000a; border-left: 4px solid var(--acc); }
        .formato-card-clickable { cursor: pointer; transition: box-shadow .15s, transform .15s; }
        .formato-card-clickable:hover { box-shadow: 0 4px 16px #00000018; transform: translateY(-1px); }
        .formato-card-arrow { color: #f5a623; font-size: 20px; font-weight: 700; }
        .formato-card-head { background: linear-gradient(135deg,#12151e,#1a1f2e); padding: 8px 14px; border-bottom: 1px solid #252d45; display: flex; align-items: center; justify-content: space-between; }
        .formato-card-fecha { font-size: 11px; font-weight: 600; color: #f5a623; letter-spacing: .5px; }
        .formato-card-body { padding: 12px 14px; display: flex; flex-direction: column; gap: 8px; }
        .formato-row { display: flex; flex-direction: column; gap: 2px; }
        .formato-label { font-size: 9px; font-weight: 700; letter-spacing: 2px; color: var(--tx3); }
        .formato-val { font-size: 14px; font-weight: 600; color: var(--tx); }
        .formato-val-none { color: var(--tx3); font-style: italic; font-weight: 400; }
        .resumen-row { margin-bottom: 12px; }
        .resumen-label { font-size: 9px; font-weight: 700; letter-spacing: 2px; color: var(--tx3); display: block; margin-bottom: 4px; }
        .resumen-val { font-size: 14px; font-weight: 600; color: var(--tx); padding: 2px 0; }
        .docs-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 8px; }
        .doc-item { display: flex; align-items: center; gap: 12px; background: var(--s2); border: 1px solid var(--bd); border-radius: 8px; padding: 12px 14px; cursor: pointer; transition: all .15s; font-family: 'Inter',sans-serif; text-align: left; width: 100%; }
        .doc-item:hover { background: var(--s3); border-color: var(--acc); }
        .doc-ico { font-size: 18px; flex-shrink: 0; }
        .doc-nombre { flex: 1; font-size: 13px; font-weight: 600; color: var(--tx); letter-spacing: .5px; }
        .doc-ver { font-size: 11px; font-weight: 700; color: var(--acc); flex-shrink: 0; }
        .btn-generar-formularios { width: 100%; padding: 16px; background: linear-gradient(135deg,#12151e,#1a1f2e); border: 1px solid #f5a62340; border-radius: 10px; color: #f5a623; font-family: 'Inter',sans-serif; font-size: 15px; font-weight: 800; letter-spacing: 2px; cursor: pointer; transition: all .2s; box-shadow: 0 4px 20px #00000030; text-align: center; }
        .btn-generar-formularios:hover:not(:disabled) { border-color: #f5a623; background: linear-gradient(135deg,#1a1f2e,#242b40); }
        .btn-formato-guardar { width: 100%; background: var(--acc); border: none; color: #fff; font-family: 'Inter',sans-serif; font-size: 14px; font-weight: 700; letter-spacing: 1.5px; padding: 14px; border-radius: 8px; cursor: pointer; transition: background .15s; margin-top: 4px; }
        /* DETALLE */
        .detalle-cliente-card { background: var(--s2); border: 1px solid var(--bd); border-radius: 8px; padding: 12px 14px; margin-bottom: 8px; }
        .detalle-cliente-nombre { font-size: 14px; font-weight: 700; color: var(--tx); margin-bottom: 3px; }
        .detalle-cliente-doc { font-size: 11px; font-weight: 600; color: var(--acc); letter-spacing: .5px; margin-bottom: 6px; }
        .detalle-cliente-extra { font-size: 12px; color: var(--tx2); margin-top: 3px; }
        .detalle-vehiculo-card { background: var(--s2); border: 1px solid var(--bd); border-radius: 8px; padding: 14px; margin-bottom: 8px; }
        .detalle-v-placa { font-size: 20px; font-weight: 900; letter-spacing: 3px; color: var(--acc); margin-bottom: 4px; }
        .detalle-v-nombre { font-size: 15px; font-weight: 700; color: var(--tx); margin-bottom: 10px; }
        .detalle-v-grid { display: flex; flex-direction: column; gap: 4px; }
        .detalle-v-item { font-size: 12px; color: var(--tx2); }
        .detalle-v-item b { color: var(--tx); font-weight: 600; }
        /* SELECTOR VEHICULO */
        .cselector-incomplete { opacity: .65; }
        /* MISC */
        @media (max-width: 600px) {
          .frow { grid-template-columns: 1fr; }
          .group-row { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      {screen === "home"          && <Home onNav={setScreen} miInfo={miInfo} />}
      {screen === "miinfo" && <MiInfoView key={JSON.stringify(miInfo)} miInfo={miInfo} setMiInfo={setMiInfo} onBack={() => setScreen("home")} />}
      {screen === "clientes"      && <ClientesView clients={clients} setClients={setClients} onBack={() => setScreen("home")} />}
      {screen === "vehiculos"     && <VehiculosView vehiculos={vehiculos} setVehiculos={setVehiculos} onBack={() => setScreen("home")} />}
      {screen === "liquidaciones" && <LiquidacionesView clients={clients} vehiculos={vehiculos} onBack={() => setScreen("home")} />}
      {screen === "formularios"   && <FormulariosView clients={clients} vehiculos={vehiculos} onBack={() => setScreen("home")} />}
    </div>
  );
}
