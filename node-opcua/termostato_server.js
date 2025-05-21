const opcua = require("node-opcua");

// Creiamo un'istanza del server OPC UA
const server = new opcua.OPCUAServer({
    port: 4335,  // Porta diversa per non interferire con l'altro server
    resourcePath: "/UA/TermostatoServer",
    buildInfo: {
        productName: "TermostatoServer",
        buildNumber: "1",
        buildDate: new Date(2025, 5, 21)
    }
});

function post_initialize() {
    console.log("Server inizializzato");
    
    // Otteniamo riferimenti all'address space e al namespace
    const addressSpace = server.engine.addressSpace;
    const namespace = addressSpace.getOwnNamespace();
    
    // Otteniamo il riferimento alla cartella Objects
    const objectsFolder = addressSpace.rootFolder.objects;
    
    console.log("Namespace URI:", namespace.namespaceUri);
    console.log("Namespace Index:", namespace.index);
    
    try {
        // Step 1: Definire un tipo di dato enum per la modalità del termostato
        const modalitàTermostatoEnum = namespace.addVariableType({
            browseName: "ModalitàTermostatoType",
            dataType: "Int32",
            value: {
                dataType: opcua.DataType.Int32,
                value: 0  // Default: Manuale
            }
        });
        
        // Aggiungere le proprietà EnumStrings (servono per i client che vogliono visualizzare i nomi delle enum)
        namespace.addVariable({
            propertyOf: modalitàTermostatoEnum,
            browseName: "EnumStrings",
            dataType: "LocalizedText",
            value: {
                dataType: opcua.DataType.LocalizedText,
                arrayType: opcua.VariantArrayType.Array,
                value: [
                    { text: "Manuale" },
                    { text: "Automatico" }
                ]
            }
        });
        
        console.log("ModalitàTermostatoType creato con NodeId:", modalitàTermostatoEnum.nodeId.toString());
        
        // Step 2: Definire un tipo di dato enum per la velocità delle ventole
        const velocitàVentoleEnum = namespace.addVariableType({
            browseName: "VelocitàVentoleType",
            dataType: "Int32",
            value: {
                dataType: opcua.DataType.Int32,
                value: 0  // Default: Bassa
            }
        });
        
        // Aggiungere le proprietà EnumStrings
        namespace.addVariable({
            propertyOf: velocitàVentoleEnum,
            browseName: "EnumStrings",
            dataType: "LocalizedText",
            value: {
                dataType: opcua.DataType.LocalizedText,
                arrayType: opcua.VariantArrayType.Array,
                value: [
                    { text: "Bassa" },
                    { text: "Media-Bassa" },
                    { text: "Media" },
                    { text: "Media-Alta" },
                    { text: "Alta" }
                ]
            }
        });
        
        console.log("VelocitàVentoleType creato con NodeId:", velocitàVentoleEnum.nodeId.toString());
        
        // Step 3: Definire l'ObjectType Termostato
        const termostatoType = namespace.addObjectType({
            browseName: "TermostatoType"
        });
        
        console.log("TermostatoType creato con NodeId:", termostatoType.nodeId.toString());
        
        // Step 4: Aggiungere le variabili all'ObjectType Termostato
        namespace.addVariable({
            componentOf: termostatoType,
            browseName: "Stato",
            dataType: "Boolean",
            modellingRule: "Mandatory",
            value: {
                dataType: opcua.DataType.Boolean,
                value: false  // Spento di default
            }
        });
        
        namespace.addVariable({
            componentOf: termostatoType,
            browseName: "TemperaturaCorrente",
            dataType: "Double",
            modellingRule: "Mandatory",
            value: {
                dataType: opcua.DataType.Double,
                value: 22.0  // Temperatura di default
            }
        });
        
        namespace.addVariable({
            componentOf: termostatoType,
            browseName: "TemperaturaImpostata",
            dataType: "Float",
            modellingRule: "Mandatory",
            value: {
                dataType: opcua.DataType.Float,
                value: 21.0  // Temperatura di default
            }
        });
        
        // Variabile enum per la modalità
        namespace.addVariable({
            componentOf: termostatoType,
            browseName: "Modalità",
            dataType: "Int32",  // Usiamo Int32 per l'enumerazione
            modellingRule: "Mandatory",
            value: {
                dataType: opcua.DataType.Int32,
                value: 0  // 0 = Manuale
            }
        });
        
        // Variabile enum per la velocità delle ventole
        namespace.addVariable({
            componentOf: termostatoType,
            browseName: "VelocitàVentole",
            dataType: "Int32",  // Usiamo Int32 per l'enumerazione
            modellingRule: "Mandatory",
            value: {
                dataType: opcua.DataType.Int32,
                value: 0  // 0 = Bassa
            }
        });
        
        // Step 5: Aggiungere i metodi all'ObjectType Termostato
        
        // Metodo Accendi
        namespace.addMethod(termostatoType, {
            browseName: "Accendi",
            modellingRule: "Mandatory",
            inputArguments: [],
            outputArguments: [],
            execute: function(inputArguments, context, callback) {
                // Implementazione fornita nell'istanza
                callback(null, {
                    statusCode: opcua.StatusCodes.Good
                });
            }
        });
        
        // Metodo Spegni
        namespace.addMethod(termostatoType, {
            browseName: "Spegni",
            modellingRule: "Mandatory",
            inputArguments: [],
            outputArguments: [],
            execute: function(inputArguments, context, callback) {
                // Implementazione fornita nell'istanza
                callback(null, {
                    statusCode: opcua.StatusCodes.Good
                });
            }
        });
        
        // Metodo ImpostaTemperatura
        namespace.addMethod(termostatoType, {
            browseName: "ImpostaTemperatura",
            modellingRule: "Mandatory",
            inputArguments: [{
                name: "Temperatura",
                description: { text: "La temperatura da impostare" },
                dataType: opcua.DataType.Double
            }],
            outputArguments: [],
            execute: function(inputArguments, context, callback) {
                // Implementazione fornita nell'istanza
                callback(null, {
                    statusCode: opcua.StatusCodes.Good
                });
            }
        });
        
        // Metodo ImpostaModalità
        namespace.addMethod(termostatoType, {
            browseName: "ImpostaModalità",
            modellingRule: "Mandatory",
            inputArguments: [{
                name: "Modalità",
                description: { text: "La modalità da impostare (0=Manuale, 1=Automatico)" },
                dataType: opcua.DataType.Int32
            }],
            outputArguments: [],
            execute: function(inputArguments, context, callback) {
                // Implementazione fornita nell'istanza
                callback(null, {
                    statusCode: opcua.StatusCodes.Good
                });
            }
        });
        
        // Step 6: Creare un'istanza del Termostato
        const termostato = namespace.addObject({
            organizedBy: objectsFolder,
            browseName: "Termostato",
            typeDefinition: termostatoType
        });
        
        console.log("Istanza Termostato creata con NodeId:", termostato.nodeId.toString());
        
        // Otteniamo i riferimenti alle variabili e ai metodi dell'istanza
        const statoVar = termostato.getComponentByName("Stato");
        const tempCorrenteVar = termostato.getComponentByName("TemperaturaCorrente");
        const tempImpostataVar = termostato.getComponentByName("TemperaturaImpostata");
        const modalitàVar = termostato.getComponentByName("Modalità");
        const velocitàVar = termostato.getComponentByName("VelocitàVentole");
        
        const accendiMethod = termostato.getComponentByName("Accendi");
        const spegniMethod = termostato.getComponentByName("Spegni");
        const impostaTempMethod = termostato.getComponentByName("ImpostaTemperatura");
        const impostaModalitàMethod = termostato.getComponentByName("ImpostaModalità");
        
        // Step 7: Implementare la logica dei metodi per l'istanza
        
        // Implementazione Accendi
        if (accendiMethod) {
            accendiMethod.bindMethod((inputArguments, context, callback) => {
                console.log("Metodo Accendi chiamato");
                if (statoVar) {
                    statoVar.setValueFromSource({
                        dataType: opcua.DataType.Boolean,
                        value: true
                    });
                    console.log("Termostato acceso");
                }
                callback(null, {
                    statusCode: opcua.StatusCodes.Good
                });
            });
        }
        
        // Implementazione Spegni
        if (spegniMethod) {
            spegniMethod.bindMethod((inputArguments, context, callback) => {
                console.log("Metodo Spegni chiamato");
                if (statoVar) {
                    statoVar.setValueFromSource({
                        dataType: opcua.DataType.Boolean,
                        value: false
                    });
                    console.log("Termostato spento");
                }
                callback(null, {
                    statusCode: opcua.StatusCodes.Good
                });
            });
        }
        
        // Implementazione ImpostaTemperatura
        if (impostaTempMethod) {
            impostaTempMethod.bindMethod((inputArguments, context, callback) => {
                const temperatura = inputArguments[0].value;
                console.log(`Metodo ImpostaTemperatura chiamato con valore: ${temperatura}`);
                
                if (tempImpostataVar) {
                    tempImpostataVar.setValueFromSource({
                        dataType: opcua.DataType.Float,
                        value: temperatura
                    });
                    console.log(`Temperatura impostata a ${temperatura}`);
                }
                
                callback(null, {
                    statusCode: opcua.StatusCodes.Good
                });
            });
        }
        
        // Implementazione ImpostaModalità
        if (impostaModalitàMethod) {
            impostaModalitàMethod.bindMethod((inputArguments, context, callback) => {
                const modalità = inputArguments[0].value;
                console.log(`Metodo ImpostaModalità chiamato con valore: ${modalità}`);
                
                if (modalitàVar) {
                    modalitàVar.setValueFromSource({
                        dataType: opcua.DataType.Int32,
                        value: modalità
                    });
                    console.log(`Modalità impostata a ${modalità} (${modalità === 0 ? "Manuale" : "Automatico"})`);
                }
                
                callback(null, {
                    statusCode: opcua.StatusCodes.Good
                });
            });
        }
        
        // Step 8: Aggiungere una simulazione per aggiornare la temperatura corrente
        setInterval(() => {
            if (tempCorrenteVar && tempImpostataVar && statoVar) {
                // Leggi i valori attuali
                const stato = statoVar.readValue().value.value;
                const tempImpostata = tempImpostataVar.readValue().value.value;
                const tempCorrente = tempCorrenteVar.readValue().value.value;
                
                if (stato) {  // Termostato acceso
                    // Simulazione semplice: la temperatura si avvicina gradualmente alla temperatura impostata
                    let nuovaTempCorrente = tempCorrente;
                    
                    if (tempCorrente < tempImpostata) {
                        // Riscaldamento
                        nuovaTempCorrente = Math.min(tempImpostata, tempCorrente + 0.1);
                    } else if (tempCorrente > tempImpostata) {
                        // Raffreddamento
                        nuovaTempCorrente = Math.max(tempImpostata, tempCorrente - 0.1);
                    }
                    
                    // Aggiungi una piccola fluttuazione casuale
                    const randomDelta = (Math.random() - 0.5) * 0.2;
                    nuovaTempCorrente += randomDelta;
                    
                    // Aggiorna la temperatura corrente
                    tempCorrenteVar.setValueFromSource({
                        dataType: opcua.DataType.Double,
                        value: nuovaTempCorrente
                    });
                    
                    // Log occasionale
                    if (Math.random() < 0.1) {
                        console.log(`Temperatura corrente: ${nuovaTempCorrente.toFixed(2)}°C (Obiettivo: ${tempImpostata}°C)`);
                    }
                } else {
                    // Termostato spento: la temperatura diminuisce lentamente verso la temperatura ambiente (20°C)
                    const tempAmbiente = 20.0;
                    let nuovaTempCorrente = tempCorrente;
                    
                    if (tempCorrente > tempAmbiente) {
                        nuovaTempCorrente = Math.max(tempAmbiente, tempCorrente - 0.05);
                    } else if (tempCorrente < tempAmbiente) {
                        nuovaTempCorrente = Math.min(tempAmbiente, tempCorrente + 0.05);
                    }
                    
                    // Aggiungi una piccola fluttuazione casuale
                    const randomDelta = (Math.random() - 0.5) * 0.1;
                    nuovaTempCorrente += randomDelta;
                    
                    // Aggiorna la temperatura corrente
                    tempCorrenteVar.setValueFromSource({
                        dataType: opcua.DataType.Double,
                        value: nuovaTempCorrente
                    });
                }
            }
        }, 1000);  // Aggiorna ogni secondo
        
        // Verifica della struttura
        console.log("\nVerifica della struttura:");
        console.log("Types creati:");
        console.log("- ModalitàTermostatoType:", modalitàTermostatoEnum.nodeId.toString());
        console.log("- VelocitàVentoleType:", velocitàVentoleEnum.nodeId.toString());
        console.log("- TermostatoType:", termostatoType.nodeId.toString());
        
        console.log("\nIstanza creata:");
        console.log("- Termostato:", termostato.nodeId.toString());
        
    } catch (err) {
        console.error("Errore durante la creazione dell'address space:", err);
    }
    
    // Avvia il server
    server.start(function() {
        console.log("\nServer avviato - premi CTRL+C per terminare");
        try {
            const endpointUrl = server.endpoints[0].endpointDescriptions()[0].endpointUrl;
            console.log("Endpoint URL: ", endpointUrl);
        } catch (err) {
            console.error("Errore nel recuperare l'endpoint URL:", err.message);
        }
    });
}

// Inizializza il server
server.initialize(post_initialize);

// Gestione dell'interruzione
process.on("SIGINT", function() {
    console.log("Arresto del server...");
    server.shutdown(function() {
        console.log("Server arrestato");
        process.exit(0);
    });
});