const opcua = require("node-opcua");

// Creiamo un'istanza del server OPC UA
const server = new opcua.OPCUAServer({
    port: 4334,
    resourcePath: "/UA/SampleBikeServer",
    buildInfo: {
        productName: "SampleBikeServer",
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
    console.log("Objects folder NodeId:", objectsFolder.nodeId.toString());
    
    try {
        // Creiamo la cartella Bike come oggetto organizzato in Objects
        const bikeFolder = namespace.addObject({
            organizedBy: objectsFolder,
            browseName: "Bike"
        });
        
        console.log("Cartella Bike creata con NodeId:", bikeFolder.nodeId.toString());
        
        // Creiamo MyBike come oggetto nella cartella Bike
        const bike = namespace.addObject({
            organizedBy: bikeFolder,
            browseName: "MyBike"
        });
        
        console.log("Istanza MyBike creata con NodeId:", bike.nodeId.toString());
        
        // Aggiungiamo le variabili come componenti di MyBike
        const makeNode = namespace.addVariable({
            componentOf: bike,
            browseName: "Make",
            dataType: "String",
            value: {
                dataType: opcua.DataType.String,
                value: "Trek"
            }
        });
        
        console.log("Variabile Make creata con NodeId:", makeNode.nodeId.toString());
        
        const modelNode = namespace.addVariable({
            componentOf: bike,
            browseName: "Model",
            dataType: "String",
            value: {
                dataType: opcua.DataType.String,
                value: "Emonda"
            }
        });
        
        console.log("Variabile Model creata con NodeId:", modelNode.nodeId.toString());
        
        const currentSpeedNode = namespace.addVariable({
            componentOf: bike,
            browseName: "CurrentSpeed",
            dataType: "Double",
            value: {
                dataType: opcua.DataType.Double,
                value: 0.0
            }
        });
        
        console.log("Variabile CurrentSpeed creata con NodeId:", currentSpeedNode.nodeId.toString());
        
        // Variabile per tenere traccia della velocità
        let currentSpeed = 0.0;
        
        // Aggiungiamo metodi
        const resetNode = namespace.addMethod(bike, {
            browseName: "Reset",
            inputArguments: [],
            outputArguments: [],
            execute: function(inputArguments, context, callback) {
                currentSpeed = 0.0;
                currentSpeedNode.setValueFromSource({
                    dataType: opcua.DataType.Double,
                    value: currentSpeed
                });
                console.log("Velocità resettata a 0");
                callback(null, {
                    statusCode: opcua.StatusCodes.Good
                });
            }
        });
        
        console.log("Metodo Reset creato con NodeId:", resetNode.nodeId.toString());
        
        const setSpeedNode = namespace.addMethod(bike, {
            browseName: "SetSpeed",
            inputArguments: [{
                name: "Speed",
                description: { text: "La velocità da impostare" },
                dataType: opcua.DataType.Double
            }],
            outputArguments: [],
            execute: function(inputArguments, context, callback) {
                const speed = inputArguments[0].value;
                currentSpeed = speed;
                currentSpeedNode.setValueFromSource({
                    dataType: opcua.DataType.Double,
                    value: currentSpeed
                });
                console.log(`Velocità impostata a ${speed}`);
                callback(null, {
                    statusCode: opcua.StatusCodes.Good
                });
            }
        });
        
        console.log("Metodo SetSpeed creato con NodeId:", setSpeedNode.nodeId.toString());
        
        console.log("Proprietà e metodi aggiunti alla bicicletta");
        
        // Simulazione della velocità
        setInterval(() => {
            const randomDelta = (Math.random() - 0.5) * 1.0;
            currentSpeed = Math.max(0, currentSpeed + randomDelta);
            currentSpeedNode.setValueFromSource({
                dataType: opcua.DataType.Double,
                value: currentSpeed
            });
            
            // Occasionalmente, logga il valore corrente
            if (Math.random() < 0.1) {
                console.log(`Velocità corrente: ${currentSpeed.toFixed(2)}`);
            }
        }, 2000);
        
        // Verifica della struttura trovando i riferimenti degli oggetti
        console.log("\nVerifica della struttura:");
        
        try {
            const bikeRefs = objectsFolder.findReferences("Organizes", true);
            console.log(`Objects ha ${bikeRefs.length} riferimenti Organizes:`);
            bikeRefs.forEach(ref => {
                if (ref.nodeId) {
                    console.log(`- ${ref.nodeId.toString()}`);
                }
            });
        } catch (err) {
            console.error("Errore nel trovare riferimenti di Objects:", err.message);
        }
        
        // Verifica dei componenti di MyBike
        try {
            const myBikeRefs = bike.findReferences("HasComponent", true);
            console.log(`MyBike ha ${myBikeRefs.length} componenti (HasComponent):`);
            myBikeRefs.forEach(ref => {
                if (ref.nodeId) {
                    console.log(`- ${ref.nodeId.toString()}`);
                }
            });
        } catch (err) {
            console.error("Errore nel trovare componenti di MyBike:", err.message);
        }
        
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