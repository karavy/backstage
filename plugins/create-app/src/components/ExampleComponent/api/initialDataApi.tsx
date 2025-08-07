import * as semver from 'semver';

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

  let data = await response.json();


  if (data && data.spec) {
  	const newVersion = semver.inc(data.spec.repotag, 'major');
  	data.spec.repotag = newVersion;
	if (data.spec.sveltosapps == null) {
		data.spec.sveltosapps = [];
	}
        return data.spec;
  }

  throw new Error("Dati non validi ricevuti dall'API.");
}
