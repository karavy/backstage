export async function fetchDatacenterOptions(fetcher: string, dcUrl: string) {
  // Qui la tua logica per recuperare le opzioni, anche con una vera chiamata API
//  if (requestedType == "DATACENTER") {
//   if (dcUrl === "10.19.6.1") {
      const response = await fetcher.fetch("http://localhost:7007/api/vsphere-utils/datacenter/" + dcUrl, {
        headers: {
            "Authorization": "Bearer 5H2TeAbPTxZx8Jz7svz95zz128XX2V3l",
        }
      });
      
      if (!response.ok) {
        throw new Error(`Errore di rete: ${response.statusText}`);
      }
    
      //throw new Error("Dati non validi ricevuti dall'API.");
//    }
//  }
  const data = await response.json();

  return data;
}

export async function fetchFolderOptions(fetcher, selectedTemplate, dcUrl) {

}

export async function fetchPoolOptions(fetcher, selectedTemplate: string, dcUrl: string) {
    const response = await fetcher.fetch("http://localhost:8080/resourcepools/" + dcUrl + "/" + selectedTemplate, {});
      
    if (!response.ok) {
        throw new Error(`Errore di rete: ${response.statusText}`);
    }

    const data = await response.json();

    return data;
}