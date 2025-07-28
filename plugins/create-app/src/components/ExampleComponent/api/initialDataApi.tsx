export async function loadInitialFormData(fetcher, owner, entity) {
  const response = await fetcher.fetch("http://localhost:7007/api/get-git-catalog/getrepo/" + owner + "/" + entity, {
  headers: {
      "Authorization": "Bearer 5H2TeAbPTxZx8Jz7svz95zz128XX2V3l",
      "X-Clastix-GitToken": "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",
    }
  });

  if (!response.ok) {
    throw new Error(`Errore di rete: ${response.statusText}`);
  }

  const data = await response.json();

  // 6. Usa reset() per popolare l'intero form con i dati ricevuti
  if (data && data.spec) {
    return data.spec;
  }

  throw new Error("Dati non validi ricevuti dall'API.");
}
