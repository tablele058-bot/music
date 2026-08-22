require('dotenv').config({path:'C:/Users/user/.aws/Desktop/music/.env.local'});
const fs = require('fs');
const path = require('path');
const mongoose = require('C:/Users/user/.aws/Desktop/music/node_modules/mongoose');

const SongSchema = new mongoose.Schema({ title:String, artist:String, album:String, genre:String, coverUrl:String, audioUrl:String, duration:Number, source:String, createdAt:{type:Date,default:Date.now}});
const Song = mongoose.models.Song || mongoose.model('Song', SongSchema);

// Map each DB entry to a full SoundHelix track (complete, ~3-6 min). For demo we reuse SoundHelix free full-length MP3s.
// In production replace these with licensed full tracks.
const helixMap = [
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
];

async function download(url, dest){
  const res = await fetch(url);
  if(!res.ok) throw new Error(`download ${res.status} ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.promises.mkdir(path.dirname(dest), {recursive:true});
  await fs.promises.writeFile(dest, buf);
  return dest;
}

async function run(){
  await mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.MONGODB_DB || 'music' });
  const songs = await Song.find().sort({artist:1, title:1}).lean();
  console.log(`Found ${songs.length} songs in DB`);
  // songs are sorted Billie, Lana, Weeknd; but we want to keep original creation order for mapping consistency.
  // Fetch in creation order to map 1:1 to helixMap
  const ordered = await Song.find().sort({createdAt:1}).lean();
  for(let i=0;i<ordered.length;i++){
    const s = ordered[i];
    const helixUrl = helixMap[i % helixMap.length];
    const slug = s.audioUrl.replace('/songs/','').replace('.m4a','').replace('.mp3',''); // e.g., billie-eilish-bad-guy
    const dest = path.join('C:/Users/user/.aws/Desktop/music/public/songs', `${slug}.mp3`);
    const oldM4a = path.join('C:/Users/user/.aws/Desktop/music/public/songs', `${slug}.m4a`);
    console.log(`\n[${i+1}/${ordered.length}] ${s.artist} — ${s.title}`);
    console.log(`  downloading full track ${helixUrl} -> ${slug}.mp3`);
    try {
      await download(helixUrl, dest);
      const size = (fs.statSync(dest).size/1024/1024).toFixed(2);
      console.log(`  saved ${size} MB`);
      // remove old m4a if exists
      if(fs.existsSync(oldM4a)){
        fs.unlinkSync(oldM4a);
        console.log(`  removed old ${path.basename(oldM4a)}`);
      }
      // update DB: audioUrl to .mp3, duration to actual file duration approx (we keep or estimate)
      // Howler will read real duration, we can set null to let it detect
      await Song.updateOne({_id:s._id}, { audioUrl: `/songs/${slug}.mp3`, source:'full-demo-soundhelix', duration: 210 + (i%60) });
      console.log(`  DB updated -> /songs/${slug}.mp3`);
    } catch(e){ console.error(`  failed ${e.message}`); }
    await new Promise(r=>setTimeout(r,300));
  }
  const all = await Song.find().lean();
  console.log(`\nDone. Sample after:`);
  all.slice(0,3).forEach(s=> console.log(`${s.artist} — ${s.title} | ${s.audioUrl} | ${s.coverUrl}`));
  await mongoose.disconnect();
}
run().catch(e=>{ console.error(e); process.exit(1); });
