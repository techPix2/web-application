var ambiente_processo = 'producao';
// var ambiente_processo = 'desenvolvimento';

var caminho_env = ambiente_processo === 'producao' ? '.env' : '.env.dev';

require("dotenv").config({ path: caminho_env });

var express = require("express");
var cors = require("cors");
var path = require("path");
var PORTA_APP = process.env.APP_PORT;
var HOST_APP = process.env.APP_HOST;


var app = express();

var indexRouter = require("./src/routes/index");
var jiraRouter = require("./src/routes/jiraRoute");
var s3Router = require("./src/routes/s3.route.js");
var s3RouterFelipe = require("./src/routes/s3.js");
var machineRouter = require("./src/routes/machine.route.js")
var realtimeRouter = require("./src/routes/realtime.route.js")
var processRouter = require("./src/routes/process.route.js")
var userRouter = require("./src/routes/user.route.js")
var companyRouter = require("./src/routes/company.route.js")

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());

app.use("/", indexRouter);
app.use("/s3", s3Router);
app.use("/apiJira", jiraRouter);
app.use("/api/s3", s3RouterFelipe)
app.use("/realtime", realtimeRouter)
app.use("/machine", machineRouter)
app.use("/process", processRouter)
app.use("/user", userRouter);
app.use("/company", companyRouter)

app.listen(PORTA_APP, function () {
    console.log(`
    ##   ##  ######   #####             ####       ##     ######     ##              ##  ##    ####    ######  
    ##   ##  ##       ##  ##            ## ##     ####      ##      ####             ##  ##     ##         ##  
    ##   ##  ##       ##  ##            ##  ##   ##  ##     ##     ##  ##            ##  ##     ##        ##   
    ## # ##  ####     #####    ######   ##  ##   ######     ##     ######   ######   ##  ##     ##       ##    
    #######  ##       ##  ##            ##  ##   ##  ##     ##     ##  ##            ##  ##     ##      ##     
    ### ###  ##       ##  ##            ## ##    ##  ##     ##     ##  ##             ####      ##     ##      
    ##   ##  ######   #####             ####     ##  ##     ##     ##  ##              ##      ####    ######  
    \n\n\n                                                                                                 
    Servidor do seu site já está rodando! Acesse o caminho a seguir para visualizar .: http://${HOST_APP}:${PORTA_APP} :. \n\n
    Você está rodando sua aplicação em ambiente de .:${process.env.AMBIENTE_PROCESSO}:. \n\n
    \tSe .:desenvolvimento:. você está se conectando ao banco local. \n
    \tSe .:producao:. você está se conectando ao banco remoto. \n\n
    \t\tPara alterar o ambiente, comente ou descomente as linhas 1 ou 2 no arquivo 'app.js'\n\n`);
});