const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
const ffmpegPath = require('ffmpeg-static').path;

function adicionarLegenda() {
  ffmpeg('3.mp4')
    .input('1.srt')  // Substitua '1.srt' pelo nome correto do arquivo de legenda
    .videoCodec('libx264')
    .outputOptions(['-vf subtitles=1.srt'])  // Substitua '1.srt' pelo nome correto do arquivo de legenda
    .on('error', (err) => {
      console.error(err);
    })
    .on('end', () => {
      console.log("Legenda adicionada com sucesso");
    })
    .save('video_com_legenda.mp4');
}

ffmpeg('1.mp4')
  .input('2.mp4')
  .on('error', (err) => {
    console.error(err);
  })
  .on('progress', (progress) => {
    //console.log(progress.frames);
  })
  .on('end', () => {
    console.log("Processamento concluído");
    adicionarLegenda();
  })
  .mergeToFile('3.mp4');
