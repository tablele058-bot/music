require('dotenv').config({path:'C:/Users/user/.aws/Desktop/music/.env.local'});
const mongoose = require('C:/Users/user/.aws/Desktop/music/node_modules/mongoose');
const SongSchema = new mongoose.Schema({ title:String, artist:String, album:String, genre:String, coverUrl:String, audioUrl:String, duration:Number, source:String, createdAt:{type:Date,default:Date.now}});
const Song = mongoose.models.Song || mongoose.model('Song', SongSchema);
async function run(){
  await mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.MONGODB_DB || 'music' });
  await Song.deleteMany({});
  console.log('cleared');
  // curated real artist catalog — audio reuses local /songs/song-*.mp3 (demo). Replace with licensed files later for production.
  const songs = [
    // Lana Del Rey
    { title:'Summertime Sadness', artist:'Lana Del Rey', album:'Born To Die', genre:'Alt Pop', coverUrl:'https://picsum.photos/seed/lana1/500/500', audioUrl:'/songs/song-1.mp3', duration:215 },
    { title:'Video Games', artist:'Lana Del Rey', album:'Born To Die', genre:'Alt Pop', coverUrl:'https://picsum.photos/seed/lana2/500/500', audioUrl:'/songs/song-2.mp3', duration:282 },
    { title:'Born To Die', artist:'Lana Del Rey', album:'Born To Die', genre:'Alt Pop', coverUrl:'https://picsum.photos/seed/lana3/500/500', audioUrl:'/songs/song-3.mp3', duration:286 },
    { title:'Young And Beautiful', artist:'Lana Del Rey', album:'The Great Gatsby', genre:'Alt Pop', coverUrl:'https://picsum.photos/seed/lana4/500/500', audioUrl:'/songs/song-4.mp3', duration:236 },
    { title:'West Coast', artist:'Lana Del Rey', album:'Ultraviolence', genre:'Alt Pop', coverUrl:'https://picsum.photos/seed/lana5/500/500', audioUrl:'/songs/song-5.mp3', duration:260 },
    { title:'Blue Jeans', artist:'Lana Del Rey', album:'Born To Die', genre:'Alt Pop', coverUrl:'https://picsum.photos/seed/lana6/500/500', audioUrl:'/songs/song-6.mp3', duration:210 },
    // The Weeknd
    { title:'Blinding Lights', artist:'The Weeknd', album:'After Hours', genre:'Synth Pop', coverUrl:'https://picsum.photos/seed/weeknd1/500/500', audioUrl:'/songs/song-7.mp3', duration:200 },
    { title:'Save Your Tears', artist:'The Weeknd', album:'After Hours', genre:'Synth Pop', coverUrl:'https://picsum.photos/seed/weeknd2/500/500', audioUrl:'/songs/song-8.mp3', duration:215 },
    { title:'Starboy', artist:'The Weeknd', album:'Starboy', genre:'R&B', coverUrl:'https://picsum.photos/seed/weeknd3/500/500', audioUrl:'/songs/song-9.mp3', duration:230 },
    { title:'Take My Breath', artist:'The Weeknd', album:'Dawn FM', genre:'Synth Pop', coverUrl:'https://picsum.photos/seed/weeknd4/500/500', audioUrl:'/songs/song-10.mp3', duration:340 },
    { title:'Die For You', artist:'The Weeknd', album:'Starboy', genre:'R&B', coverUrl:'https://picsum.photos/seed/weeknd5/500/500', audioUrl:'/songs/song-11.mp3', duration:262 },
    { title:'The Hills', artist:'The Weeknd', album:'Beauty Behind The Madness', genre:'R&B', coverUrl:'https://picsum.photos/seed/weeknd6/500/500', audioUrl:'/songs/song-12.mp3', duration:242 },
    // Billie Eilish
    { title:'bad guy', artist:'Billie Eilish', album:'WHEN WE ALL FALL ASLEEP', genre:'Alt Pop', coverUrl:'https://picsum.photos/seed/billie1/500/500', audioUrl:'/songs/song-1.mp3', duration:194 },
    { title:'ocean eyes', artist:'Billie Eilish', album:'dont smile at me', genre:'Alt Pop', coverUrl:'https://picsum.photos/seed/billie2/500/500', audioUrl:'/songs/song-2.mp3', duration:200 },
    { title:'Happier Than Ever', artist:'Billie Eilish', album:'Happier Than Ever', genre:'Alt Pop', coverUrl:'https://picsum.photos/seed/billie3/500/500', audioUrl:'/songs/song-3.mp3', duration:298 },
    { title:'everything i wanted', artist:'Billie Eilish', album:'Single', genre:'Alt Pop', coverUrl:'https://picsum.photos/seed/billie4/500/500', audioUrl:'/songs/song-4.mp3', duration:245 },
    { title:'lovely', artist:'Billie Eilish & Khalid', album:'Single', genre:'Alt Pop', coverUrl:'https://picsum.photos/seed/billie5/500/500', audioUrl:'/songs/song-5.mp3', duration:200 },
    { title:'when the party\'s over', artist:'Billie Eilish', album:'WHEN WE ALL FALL ASLEEP', genre:'Alt Pop', coverUrl:'https://picsum.photos/seed/billie6/500/500', audioUrl:'/songs/song-6.mp3', duration:196 },
  ];
  const res = await Song.insertMany(songs);
  console.log('inserted', res.length);
  const all = await Song.find().lean();
  console.log('artists:', [...new Set(all.map(s=>s.artist))].join(', '));
  all.forEach(s=> console.log(`- ${s.artist} — ${s.title} -> ${s.audioUrl}`));
  await mongoose.disconnect();
}
run().catch(e=>{ console.error(e); process.exit(1)});
