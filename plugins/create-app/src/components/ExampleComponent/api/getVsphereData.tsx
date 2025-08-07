export async function fetchDatacenterOptions(fetcher, dcUrl: string) {
   const response = await fetcher.fetch("http://localhost:8080/datacenters/" + dcUrl, {});
   
   if (!response.ok) {
     throw new Error(`Errore di rete: ${response.statusText}`);
   }
    
  const data = await response.json();

  return data;
}

export async function fetchFolderOptions(fetcher, selectedTemplate: string, dcUrl: string, filter: string) {
    const response = await fetcher.fetch("http://localhost:8080/folders/vm/" + dcUrl + "/" + encodeURIComponent(selectedTemplate) + "/" + filter, {});

    if (!response.ok) {
        throw new Error(`Errore di rete: ${response.statusText}`);
    }

    const data = await response.json();

    return data;
}

export async function fetchPoolOptions(fetcher, selectedTemplate: string, dcUrl: string, filter: string) {
    const response = await fetcher.fetch("http://localhost:8080/resourcepools/" + dcUrl + "/" + encodeURIComponent(selectedTemplate)+ "/" + filter, {});
      
    if (!response.ok) {
        throw new Error(`Errore di rete: ${response.statusText}`);
    }

    const data = await response.json();

    return data;
}

export async function fetchThumbprintOptions(fetcher, selectedTemplate: string, dcUrl: string, filter: string) {
    const response = await fetcher.fetch("http://localhost:8080/thumbprint/" + dcUrl, {});
      
    if (!response.ok) {
        throw new Error(`Errore di rete: ${response.statusText}`);
    }

    const data = await response.json();

    return data;
}
