const opcua = require("node-opcua");

// Creiamo un'istanza del server OPC UA
const server = new opcua.OPCUAServer({
    port: 4334,
    resourcePath: "/UA/PersonaServer",
    buildInfo: {
        productName: "PersonaServer",
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
        // Step 1: Definire l'ObjectType Indirizzo
        const indirizzoType = namespace.addObjectType({
            browseName: "IndirizzoType"
        });
        
        console.log("IndirizzoType creato con NodeId:", indirizzoType.nodeId.toString());
        
        // Aggiungere proprietà all'ObjectType Indirizzo
        namespace.addVariable({
            componentOf: indirizzoType,
            browseName: "Via",
            dataType: "String",
            modellingRule: "Mandatory",
            value: {
                dataType: opcua.DataType.String,
                value: ""
            }
        });
        
        namespace.addVariable({
            componentOf: indirizzoType,
            browseName: "Città",
            dataType: "String",
            modellingRule: "Mandatory",
            value: {
                dataType: opcua.DataType.String,
                value: ""
            }
        });
        
        namespace.addVariable({
            componentOf: indirizzoType,
            browseName: "CAP",
            dataType: "String",
            modellingRule: "Mandatory",
            value: {
                dataType: opcua.DataType.String,
                value: ""
            }
        });
        
        // Step 2: Definire l'ObjectType Persona
        const personaType = namespace.addObjectType({
            browseName: "PersonaType"
        });
        
        console.log("PersonaType creato con NodeId:", personaType.nodeId.toString());
        
        // Aggiungere proprietà all'ObjectType Persona
        namespace.addVariable({
            componentOf: personaType,
            browseName: "Nome",
            dataType: "String",
            modellingRule: "Mandatory",
            value: {
                dataType: opcua.DataType.String,
                value: ""
            }
        });
        
        namespace.addVariable({
            componentOf: personaType,
            browseName: "Cognome",
            dataType: "String",
            modellingRule: "Mandatory",
            value: {
                dataType: opcua.DataType.String,
                value: ""
            }
        });
        
        namespace.addVariable({
            componentOf: personaType,
            browseName: "Età",
            dataType: "Int32",
            modellingRule: "Mandatory",
            value: {
                dataType: opcua.DataType.Int32,
                value: 0
            }
        });
        
        // Aggiungere un componente Indirizzo all'ObjectType Persona
        namespace.addObject({
            componentOf: personaType,
            browseName: "IndirizzoPersona",
            typeDefinition: indirizzoType,
            modellingRule: "Mandatory"
        });
        
        // Step 3: Creare una cartella per organizzare le persone
        const personeFolder = namespace.addFolder(objectsFolder, {
            browseName: "Persone"
        });
        
        console.log("Cartella Persone creata con NodeId:", personeFolder.nodeId.toString());
        
        // Step 4: Creare istanze di Persona
        
        // Persona 1: Mario Rossi
        const marioRossi = namespace.addObject({
            organizedBy: personeFolder,
            browseName: "MarioRossi",
            typeDefinition: personaType
        });
        
        console.log("Istanza MarioRossi creata con NodeId:", marioRossi.nodeId.toString());
        
        // Impostare le proprietà di Mario Rossi
        const nomeVar1 = marioRossi.getComponentByName("Nome");
        const cognomeVar1 = marioRossi.getComponentByName("Cognome");
        const etàVar1 = marioRossi.getComponentByName("Età");
        
        if (nomeVar1 && cognomeVar1 && etàVar1) {
            nomeVar1.setValueFromSource({
                dataType: opcua.DataType.String,
                value: "Mario"
            });
            
            cognomeVar1.setValueFromSource({
                dataType: opcua.DataType.String,
                value: "Rossi"
            });
            
            etàVar1.setValueFromSource({
                dataType: opcua.DataType.Int32,
                value: 35
            });
        }
        
        // Impostare l'indirizzo di Mario Rossi
        const indirizzoMario = marioRossi.getComponentByName("IndirizzoPersona");
        
        if (indirizzoMario) {
            const viaVar1 = indirizzoMario.getComponentByName("Via");
            const cittàVar1 = indirizzoMario.getComponentByName("Città");
            const capVar1 = indirizzoMario.getComponentByName("CAP");
            
            if (viaVar1 && cittàVar1 && capVar1) {
                viaVar1.setValueFromSource({
                    dataType: opcua.DataType.String,
                    value: "Via Roma 123"
                });
                
                cittàVar1.setValueFromSource({
                    dataType: opcua.DataType.String,
                    value: "Milano"
                });
                
                capVar1.setValueFromSource({
                    dataType: opcua.DataType.String,
                    value: "20100"
                });
            }
        }
        
        // Persona 2: Anna Bianchi
        const annaBianchi = namespace.addObject({
            organizedBy: personeFolder,
            browseName: "AnnaBianchi",
            typeDefinition: personaType
        });
        
        console.log("Istanza AnnaBianchi creata con NodeId:", annaBianchi.nodeId.toString());
        
        // Impostare le proprietà di Anna Bianchi
        const nomeVar2 = annaBianchi.getComponentByName("Nome");
        const cognomeVar2 = annaBianchi.getComponentByName("Cognome");
        const etàVar2 = annaBianchi.getComponentByName("Età");
        
        if (nomeVar2 && cognomeVar2 && etàVar2) {
            nomeVar2.setValueFromSource({
                dataType: opcua.DataType.String,
                value: "Anna"
            });
            
            cognomeVar2.setValueFromSource({
                dataType: opcua.DataType.String,
                value: "Bianchi"
            });
            
            etàVar2.setValueFromSource({
                dataType: opcua.DataType.Int32,
                value: 28
            });
        }
        
        // Impostare l'indirizzo di Anna Bianchi
        const indirizzoAnna = annaBianchi.getComponentByName("IndirizzoPersona");
        
        if (indirizzoAnna) {
            const viaVar2 = indirizzoAnna.getComponentByName("Via");
            const cittàVar2 = indirizzoAnna.getComponentByName("Città");
            const capVar2 = indirizzoAnna.getComponentByName("CAP");
            
            if (viaVar2 && cittàVar2 && capVar2) {
                viaVar2.setValueFromSource({
                    dataType: opcua.DataType.String,
                    value: "Via Verdi 456"
                });
                
                cittàVar2.setValueFromSource({
                    dataType: opcua.DataType.String,
                    value: "Roma"
                });
                
                capVar2.setValueFromSource({
                    dataType: opcua.DataType.String,
                    value: "00100"
                });
            }
        }
        
        // Verifica della struttura
        console.log("\nVerifica della struttura:");
        console.log("ObjectType creati:");
        console.log("- IndirizzoType:", indirizzoType.nodeId.toString());
        console.log("- PersonaType:", personaType.nodeId.toString());
        
        console.log("\nIstanze create:");
        console.log("- MarioRossi:", marioRossi.nodeId.toString());
        console.log("- AnnaBianchi:", annaBianchi.nodeId.toString());
        
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