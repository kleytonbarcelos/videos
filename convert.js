import axios from 'axios'
import fs from 'fs-extra'

const ASSEMBLY_API_KEY = '6f9f53e9d334431bb57b64ba05e768a3'; // Substitua com sua chave da API
const FILE_PATH = './icloaker.mp3'; // Substitua com o caminho para o seu arquivo
const OUTPUT_SRT_PATH = './transcription.srt';

async function uploadToAssemblyAI(filePath) {
  const endpoint = 'https://api.assemblyai.com/v2/upload';
  const headers = {
    authorization: ASSEMBLY_API_KEY,
    'content-type': 'application/octet-stream',
  };

  const fileData = fs.readFileSync(filePath);

  const response = await axios.post(endpoint, fileData, { headers });
  return response.data.upload_url;
}


async function transcribeAudio(uploadUrl, languageModel = 'en-US') {
  const endpoint = 'https://api.assemblyai.com/v2/transcript';
  const headers = {
    authorization: ASSEMBLY_API_KEY,
    'content-type': 'application/json',
  };

  const data = {
    audio_url: uploadUrl,
    language_model: languageModel,
  };

  const response = await axios.post(endpoint, data, { headers });
  return response.data.id;
}


async function checkTranscriptionStatus(transcriptId) {
  const endpoint = `https://api.assemblyai.com/v2/transcript/${transcriptId}`;
  const headers = {
    authorization: ASSEMBLY_API_KEY,
    'content-type': 'application/json',
  };

  let response = await axios.get(endpoint, { headers });
  while (response.data.status !== 'completed') {
    console.log('Aguardando a transcrição ser concluída...');
    await new Promise(r => setTimeout(r, 10000)); // Aguarda 10 segundos antes de verificar novamente
    response = await axios.get(endpoint, { headers });
  }

  return response.data.text;
}

function convertToSRT(text) {
  const lines = text.split('\n');
  let srtData = '';
  let counter = 1;

  for (const line of lines) {
    srtData += `${counter}\n`;
    srtData += '00:00:00 --> 00:00:00\n'; 
    srtData += line + '\n\n';
    counter++;
  }

  return srtData;
}



async function main() {
  try {
    const uploadUrl = await uploadToAssemblyAI(FILE_PATH);
    console.log('Upload URL:', uploadUrl);

    const transcriptId = await transcribeAudio(uploadUrl, 'pt-BR');
    console.log('Transcript ID:', transcriptId);

    const transcriptText = await checkTranscriptionStatus(transcriptId);
    // console.log('Transcript Text:', transcriptText);
    // console.log(typeof transcriptText);  // Deve imprimir "string"
    // const srtData = convertToSRT(transcriptText);
    // console.log(typeof srtData);  // Deve imprimir "string"

    fs.writeFileSync(OUTPUT_SRT_PATH, transcriptText);
    console.log('Transcrição concluída e salva em', OUTPUT_SRT_PATH);
  } catch (error) {
    console.error('Erro ao transcrever o áudio:', error);
  }
}


main();
