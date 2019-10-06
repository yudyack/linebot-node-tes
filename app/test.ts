let a = []
a[0] = '*Emak gw* \
Pas belom nikah : \"anak cewe jangan pulang malem2\" \
Pas udah nikah : \"lagi hamil, jgn pulang malem2\" \
Pas p… https://t.co/F23eXxO0Ty'

a[1] = 'Dek ga pengen cfd an ta? neng loh pengen, yuk. \
EMO \
\
Satu kata mengambyarkan semuanya, gapapa dek aku tetep sayang,… https://t.co/bbHan89HwT'

a[2] = 'Wah ini parah\
\
Bisa bisanya saya ngerasa sedih di unfoll\
\
Padahal tidak berteman disosial media bukan berarti tidak… https://t.co/MY0zrhPfYv'

import rpn = require("request-promise-native");
import cheerio = require("cheerio")
let match = a[0].match(/[\s\S]*… (?<link>[\s\S]*?)$/)
let link = match ? 
  match.groups ?
    match.groups.link ?
      match.groups.link
      : ""
    : null
  : null;
console.log(link)
if (link){
  rpn.get(link)
    .then(res => {
      let query = cheerio.load(res, { decodeEntities: false })
      let parsed = query(".tweet-text").html();
      console.log(parsed)
    })
}