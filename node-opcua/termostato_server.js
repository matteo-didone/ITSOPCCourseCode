const opcua = require("node-opcua");
const path = require("path");

// Creiamo un'istanza del server OPC UA
const server = new opcua.OPCUAServer({
    port: 4334, // porta di ascolto del server
    resourcePath: "/UA/TermostatoServer", // questo percorso verrà aggiunto al nome della risorsa endpoint
    buildInfo: {
        productName: "TermostatoServer",
        buildNumber: "1",
        buildDate: new Date(2025, 5, 21)
    },
    nodeset_filename: [
        opcua.nodesets.standard,
        path.join(__dirname, "NodeSet", "TermostatoRidotto.xml")
    ]
});

function post_initialize() {
    console.log("Server inizializzato");
    
    try {
        // Accediamo all'address space
        const addressSpace = server.engine.addressSpace;
        console.log("AddressSpace ottenuto");
        
        // Definiamo i nodeId che vogliamo cercare
        console.log("Tentativo di trovare i nodi...");
        
        // Considerando che NodeId potrebbe variare, prova vari namespace
        for (let ns = 0; ns < 5; ns++) {
            // Tenta di trovare il nodo Termostato
            const termostatoNodeId = `ns=${ns};i=5003`;
            const termostatoNode = addressSpace.findNode(termostatoNodeId);
            
            if (termostatoNode) {
                console.log(`Trovato Termostato con NodeId: ${termostatoNodeId}`);
                
                // Memorizza i NodeId dei componenti
                const accendiMethodId = `ns=${ns};i=7009`;
                const spegniMethodId = `ns=${ns};i=7016`;
                const statoVarId = `ns=${ns};i=6026`;
                const tempCorrenteVarId = `ns=${ns};i=6027`;
                const tempImpostataVarId = `ns=${ns};i=6028`;
                
                // Trova i nodi componenti
                const accendiMethod = addressSpace.findNode(accendiMethodId);
                const spegniMethod = addressSpace.findNode(spegniMethodId);
                const statoVar = addressSpace.findNode(statoVarId);
                const tempCorrenteVar = addressSpace.findNode(tempCorrenteVarId);
                const tempImpostataVar = addressSpace.findNode(tempImpostataVarId);
                
                // Log per i nodi trovati
                console.log(`Accendi: ${accendiMethod ? "TROVATO" : "NON TROVATO"}`);
                console.log(`Spegni: ${spegniMethod ? "TROVATO" : "NON TROVATO"}`);
                console.log(`Stato: ${statoVar ? "TROVATO" : "NON TROVATO"}`);
                console.log(`TempCorrente: ${tempCorrenteVar ? "TROVATO" : "NON TROVATO"}`);
                console.log(`TempImpostata: ${tempImpostataVar ? "TROVATO" : "NON TROVATO"}`);
                
                // Bind dei metodi
                if (accendiMethod) {
                    accendiMethod.bindMethod((inputArguments, context, callback) => {
                        console.log("Metodo Accendi chiamato");
                        if (statoVar) {
                            try {
                                statoVar.setValueFromSource({
                                    dataType: opcua.DataType.Boolean,
                                    value: true
                                });
                                console.log("Stato impostato a true");
                                callback(null, {
                                    statusCode: opcua.StatusCodes.Good
                                });
                            } catch (err) {
                                console.error("Errore nell'impostare Stato:", err.message);
                                callback(err);
                            }
                        } else {
                            console.log("Variabile Stato non disponibile");
                            callback(new Error("Variabile Stato non disponibile"));
                        }
                    });
                    console.log("Metodo Accendi configurato");
                }
                
                if (spegniMethod) {
                    spegniMethod.bindMethod((inputArguments, context, callback) => {
                        console.log("Metodo Spegni chiamato");
                        if (statoVar) {
                            try {
                                statoVar.setValueFromSource({
                                    dataType: opcua.DataType.Boolean,
                                    value: false
                                });
                                console.log("Stato impostato a false");
                                callback(null, {
                                    statusCode: opcua.StatusCodes.Good
                                });
                            } catch (err) {
                                console.error("Errore nell'impostare Stato:", err.message);
                                callback(err);
                            }
                        } else {
                            console.log("Variabile Stato non disponibile");
                            callback(new Error("Variabile Stato non disponibile"));
                        }
                    });
                    console.log("Metodo Spegni configurato");
                }
                
                // Inizializzazione delle variabili
                if (statoVar) {
                    try {
                        statoVar.setValueFromSource({
                            dataType: opcua.DataType.Boolean,
                            value: false
                        });
                        console.log("Stato inizializzato a false");
                    } catch (err) {
                        console.error("Errore nell'inizializzare Stato:", err.message);
                    }
                }
                
                if (tempCorrenteVar) {
                    try {
                        tempCorrenteVar.setValueFromSource({
                            dataType: opcua.DataType.Double,
                            value: 22.5
                        });
                        console.log("TemperaturaCorrente inizializzata a 22.5");
                        
                        // Simulazione temperatura
                        setInterval(() => {
                            try {
                                const val = tempCorrenteVar.readValue().value.value;
                                const randomDelta = (Math.random() - 0.5) * 0.5;
                                tempCorrenteVar.setValueFromSource({
                                    dataType: opcua.DataType.Double,
                                    value: val + randomDelta
                                });
                            } catch (err) {
                                console.error("Errore nella simulazione:", err.message);
                            }
                        }, 2000);
                    } catch (err) {
                        console.error("Errore nell'inizializzare TemperaturaCorrente:", err.message);
                    }
                }
                
                if (tempImpostataVar) {
                    try {
                        tempImpostataVar.setValueFromSource({
                            dataType: opcua.DataType.Float,
                            value: 21.0
                        });
                        console.log("TemperaturaImpostata inizializzata a 21.0");
                    } catch (err) {
                        console.error("Errore nell'inizializzare TemperaturaImpostata:", err.message);
                    }
                }
                
                // Interrompi il ciclo dopo aver trovato il termostato
                break;
            }
        }
    } catch (err) {
        console.error("Errore durante l'inizializzazione:", err);
    }
    
    // Avvia il server
    server.start(function() {
        console.log("Server avviato - premi CTRL+C per terminare");
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