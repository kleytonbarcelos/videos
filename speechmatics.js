import fs from 'fs';
import pkg from 'speechmatics';
const { Speechmatics } = pkg;

const API_KEY = "mrYjeaQ0izZdaJBMR4fm3Ux2Otfmyn6f";
const PATH_TO_FILE = "./icloaker.mp3";
const OUTPUT_SRT_FILE = "./output.srt"; // Nome do arquivo SRT de saída

const sm = new Speechmatics(API_KEY);
const inputFile = new Blob([
  fs.readFileSync(PATH_TO_FILE),
]);

sm.batch
  .transcribe({ input: inputFile, transcription_config: { language: 'pt' }, format: 'srt' })
  .then((transcriptText) => {
    fs.writeFileSync(OUTPUT_SRT_FILE, transcriptText); // Salve a transcrição como um arquivo SRT
    console.log('Transcrição concluída e salva como SRT.');
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });



// import fs from 'fs';
// import pkg from 'speechmatics';
// const { Speechmatics } = pkg;

// const API_KEY = "mrYjeaQ0izZdaJBMR4fm3Ux2Otfmyn6f";
// const PATH_TO_FILE = "./icloaker.mp3";

// const sm = new Speechmatics(API_KEY);
// const inputFile = new Blob([
//   fs.readFileSync(PATH_TO_FILE),
// ]);

// sm.batch
//   .transcribe({ input: inputFile, transcription_config: { language: 'pt' }, format: 'srt' })
//   .then((transcriptText) => {
//     console.log(transcriptText);
//   })
//   .catch((error) => {
//     console.log(error);
//     process.exit(1);
//   });
