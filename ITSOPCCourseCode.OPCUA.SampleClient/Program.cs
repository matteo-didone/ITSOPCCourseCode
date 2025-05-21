using ITSOPCCourseCode.OPCUA.SampleClient.Services;
using ITSOPCCourseCode.OPCUA.SampleClient.DTO;
using System;
using System.Collections.Generic;

namespace ITSOPCCourseCode.OPCUA.SampleClient
{
    class Program
    {
        static void Main(string[] args)
        {
            try
            {
                var communicationService = new PlcCommunicationService();
               
                // Connessione al server locale SampleBike
                Console.WriteLine("Connessione al server SampleBike...");
                communicationService.StartAsync("opc.tcp://localhost:26543/SampleBike").GetAwaiter().GetResult();
                Console.WriteLine("Connessione stabilita!");
               
                // Lettura del valore corrente di CurrentSpeed
                var currentValue = communicationService.ReadNodeValue("ns=2;i=6001");
                Console.WriteLine($"Valore attuale di CurrentSpeed: {currentValue}");
               
                // Prova con il tipo short (Int16)
                Console.WriteLine("Tentativo di scrittura usando il tipo short...");
                try 
                {
                    communicationService.WriteToNode(new NodeWritingRequest<short>("ns=2;i=6001", (short)100));
                    Console.WriteLine("Scrittura completata con successo!");
                }
                catch (Exception ex) 
                {
                    Console.WriteLine($"Errore nella scrittura: {ex.Message}");
                    Console.WriteLine("Per completare l'esercizio, usa UAExpert per modificare il valore manualmente.");
                }
                
                // Rilettura per conferma
                var updatedValue = communicationService.ReadNodeValue("ns=2;i=6001");
                Console.WriteLine($"Valore di CurrentSpeed dopo il tentativo: {updatedValue}");
                
                Console.WriteLine("\nVerifica in UAExpert se il valore è cambiato.");
                Console.WriteLine("\nPremi Enter per terminare...");
                Console.Read();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Si è verificato un errore: {ex.Message}");
                Console.WriteLine("\nPremi Enter per terminare...");
                Console.Read();
            }
        }
    }
}