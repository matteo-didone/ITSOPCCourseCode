// client-subscription.js
const { OPCUAClient, AttributeIds, TimestampsToReturn, ClientSubscription } = require("node-opcua");

(async () => {
  let client = null;
  let session = null;
  
  try {
    client = OPCUAClient.create({
      endpointMustExist: false
    });
    
    const endpointUrl = "opc.tcp://localhost:4335/UA/TermostatoServer";
    console.log("Connessione a", endpointUrl);
    
    await client.connect(endpointUrl);
    console.log("Connesso!");
    
    session = await client.createSession();
    console.log("Sessione creata");
    
    // NodeId della TemperaturaCorrente
    const nodeId = "ns=1;i=1006";
    
    // Leggiamo prima il valore attuale
    const dataValue = await session.read({
      nodeId: nodeId,
      attributeId: AttributeIds.Value
    });
    
    console.log(`Valore attuale di TemperaturaCorrente: ${dataValue.value.value}`);
    
    // Approccio a basso livello: eseguiamo un polling periodico
    console.log("Avvio polling ogni secondo per monitorare i cambiamenti...");
    
    const intervalId = setInterval(async () => {
      try {
        const dataValue = await session.read({
          nodeId: nodeId,
          attributeId: AttributeIds.Value
        });
        
        console.log(`TemperaturaCorrente: ${dataValue.value.value.toFixed(2)}°C (${new Date().toISOString()})`);
      } catch (err) {
        console.error("Errore nella lettura:", err.message);
      }
    }, 1000);
    
    console.log("Polling avviato. Premi CTRL+C per terminare.");
    
    // Gestione CTRL+C
    process.on("SIGINT", async () => {
      console.log("\nChiusura della connessione...");
      clearInterval(intervalId);
      
      try {
        if (session) {
          await session.close();
        }
        
        if (client && client.connected) {
          await client.disconnect();
        }
        
        console.log("Disconnessione completata.");
      } catch (err) {
        console.error("Errore durante la disconnessione:", err.message);
      }
      
      process.exit(0);
    });
    
  } catch (err) {
    console.error("Errore:", err.message);
    
    try {
      if (session) {
        await session.close();
      }
      
      if (client && client.connected) {
        await client.disconnect();
      }
    } catch (e) {
      console.error("Errore durante la chiusura dopo eccezione:", e.message);
    }
    
    process.exit(1);
  }
})();