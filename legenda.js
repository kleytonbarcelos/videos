import axios from 'axios'
import fs from 'fs-extra'

// Substitua com seu token de API
const YOUR_API_TOKEN = "6f9f53e9d334431bb57b64ba05e768a3";

// URL do arquivo a ser transcrito
const FILE_URL = "./icloaker.mp3";

// Endpoint de transcrição do AssemblyAI (onde enviamos o arquivo)
const transcriptEndpoint = "https://api.assemblyai.com/v2/upload";

// Parâmetros da requisição
const data = {
  url: FILE_URL, // Você pode usar um URL para um arquivo de áudio ou vídeo na web
};

// Cabeçalhos da requisição HTTP
const headers = {
  "Authorization": YOUR_API_TOKEN,
  "Content-Type": "application/json"
};

// Enviar o arquivo para transcrição via requisição HTTP
async function submitFileForTranscription() {
  try {
    const response = await axios.post(transcriptEndpoint, data, { headers: headers });
    const jobId = response.data.id;
    await pollForTranscriptionCompletion(jobId);
  } catch (error) {
    console.error("Erro ao enviar o arquivo para transcrição:", error);
  }
}

// Polling para verificar a conclusão da transcrição
async function pollForTranscriptionCompletion(jobId) {
  const pollingEndpoint = `https://api.assemblyai.com/v2/transcript/${jobId}`;

  while (true) {
    try {
      const pollingResponse = await axios.get(pollingEndpoint, { headers: headers });
      const transcriptionResult = pollingResponse.data;

      if (transcriptionResult.status === 'completed') {
        // As legendas estão prontas. Você pode salvá-las localmente.
        const subtitles = transcriptionResult.text;
        saveSubtitlesToFile(subtitles);
        console.log("Legendas geradas com sucesso.");
        break;
      } else if (transcriptionResult.status === 'failed') {
        console.error("Transcrição falhou:", transcriptionResult.error);
        break;
      } else {
        await new Promise((resolve) => setTimeout(resolve, 3000)); // Aguarde 3 segundos antes de verificar novamente
      }
    } catch (error) {
      console.error("Erro ao verificar o status da transcrição:", error);
      break;
    }
  }
}

// Salvar as legendas em um arquivo local
function saveSubtitlesToFile(subtitles) {
  try {
    fs.writeFileSync('legendas.srt', subtitles);
    console.log("Legendas salvas com sucesso em 'legendas.srt'.");
  } catch (error) {
    console.error("Erro ao salvar as legendas:", error);
  }
}

// Iniciar o processo de transcrição
submitFileForTranscription();
