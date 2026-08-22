require('dotenv').config({path:'C:/Users/user/.aws/Desktop/music/.env.local'});
const fs = require('fs');
const path = require('path');
const mongoose = require('C:/Users/user/.aws/Desktop/music/node_modules/mongoose');

const SongSchema = new mongoose.Schema({ title:String, artist:String, album:String, genre:String, coverUrl:String, audioUrl:String, duration:Number, source:String, createdAt:{type:Date,default:Date.now}});
const Song = mongoose.models.Song || mongoose.model('Song', SongSchema);

const catalog = [
  { title:'Summertime Sadness', artist:'Lana Del Rey' },
  { title:'Video Games', artist:'Lana Del Rey' },
  { title:'Born To Die', artist:'Lana Del Rey' },
  { title:'Young And Beautiful', artist:'Lana Del Rey' },
  { title:'West Coast', artist:'Lana Del Rey' },
  { title:'Blue Jeans', artist:'Lana Del Rey' },
  { title:'Blinding Lights', artist:'The Weeknd' },
  { title:'Save Your Tears', artist:'The Weeknd' },
  { title:'Starboy', artist:'The Weeknd' },
  { title:'Take My Breath', artist:'The Weeknd' },
  { title:'Die For You', artist:'The Weeknd' },
  { title:'The Hills', artist:'The Weeknd' },
  { title:'bad guy', artist:'Billie Eilish' },
  { title:'ocean eyes', artist:'Billie Eilish' },
  { title:'Happier Than Ever', artist:'Billie Eilish' },
  { title:'everything i wanted', artist:'Billie Eilish' },
  { title:'lovely', artist:'Billie Eilish' },
  { title:"when the party's over", artist:'Billie Eilish' },
];

function slug(s){ return s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''); }

async function fetchItunes(artist, title){
  const term = encodeURIComponent(artist + ' ' + title);
  const url = `https://itunes.apple.com/search?term=${term}&media=music&entity=song&limit=5`;
  const res = await fetch(url);
  const j = await res.json();
  if(!j.results || j.results.length===0) return null;
  // prefer exact title match
  let best = j.results[0];
  const tlow = title.toLowerCase();
  const found = j.results.find(r=> r.trackName && r.trackName.toLowerCase().includes(tlow));
  if(found) best = found;
  return best;
}

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
  const existing = await Song.find().lean();
  console.log(`Existing DB ${existing.length} songs`);

  for(let i=0;i<catalog.length;i++){
    const {title, artist} = catalog[i];
    const key = `${slug(artist)}-${slug(title)}`;
    console.log(`\n[${i+1}/${catalog.length}] ${artist} — ${title}`);
    let it = null;
    try { it = await fetchItunes(artist, title); } catch(e){ console.log('  itunes fetch fail', e.message); }
    if(!it || !it.previewUrl){
      console.log('  no preview, keep local SoundHelix fallback');
      continue;
    }
    const previewUrl = it.previewUrl;
    const artwork = it.artworkUrl100 ? it.artworkUrl100.replace('100x100bb','600x600bb') : it.artworkUrl100;
    const album = it.collectionName || undefined;
    const duration = it.trackTimeMillis ? Math.round(it.trackTimeMillis/1000) : undefined;
    const genre = it.primaryGenreName || undefined;

    // download files locally
    const audioExt = previewUrl.includes('.m4a') ? 'm4a' : 'mp3';
    const audioDest = path.join('C:/Users/user/.aws/Desktop/music/public/songs', `${key}.${audioExt}`);
    const coverDest = path.join('C:/Users/user/.aws/Desktop/music/public/covers', `${key}.jpg`);
    try {
      console.log('  downloading preview', previewUrl);
      await download(previewUrl, audioDest);
      console.log(`  audio -> ${audioDest} ${ (fs.statSync(audioDest).size/1024).toFixed(1)}KB`);
    } catch(e){ console.log('  audio dl fail', e.message); }
    if(artwork){
      try {
        console.log('  downloading cover', artwork);
        await download(artwork, coverDest);
        console.log(`  cover -> ${coverDest}`);
      } catch(e){ console.log('  cover dl fail', e.message); }
    }
    // update DB: find by title+artist
    const dbSong = await Song.findOne({ title, artist });
    if(dbSong){
      dbSong.coverUrl = `/covers/${key}.jpg`;
      dbSong.audioUrl = `/songs/${key}.${audioExt}`;
      if(album) dbSong.album = album;
      if(duration) dbSong.duration = duration;
      if(genre) dbSong.genre = genre;
      dbSong.source = 'itunes-preview';
      await dbSong.save();
      console.log(`  DB updated ${dbSong._id} -> ${dbSong.audioUrl} / ${dbSong.coverUrl}`);
    } else {
      console.log('  not found in DB, creating');
      await Song.create({ title, artist, album, genre, coverUrl:`/covers/${key}.jpg`, audioUrl:`/songs/${key}.${audioExt}`, duration, source:'itunes-preview' });
    }
    // small delay to avoid rate limit
    await new Promise(r=>setTimeout(r, 400));
  }

  const all = await Song.find().lean();
  console.log(`\nDone. DB now ${all.length} songs. Sample:`);
  all.slice(0,5).forEach(s=> console.log(`- ${s.artist} — ${s.title} | cover:${s.coverUrl} audio:${s.audioUrl}`));
  await mongoose.disconnect();
}
run().catch(e=>{ console.error(e); process.exit(1); });
