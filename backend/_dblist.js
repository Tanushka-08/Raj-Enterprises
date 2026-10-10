const m=require('mongoose');
(async()=>{
await m.connect('mongodb://127.0.0.1:27017/raj-enterprises',{serverSelectionTimeoutMS:8000});
console.log('connected to', m.connection.name);
const dbs=await m.connection.db.admin().listDatabases();
console.log('ALL DBS:', JSON.stringify(dbs.databases.map(d=>d.name)));
for(const d of dbs.databases){
 const db=m.connection.client.db(d.name);
 const cols=await db.listCollections().toArray();
 console.log('DB',d.name,'cols=',cols.map(c=>c.name).join('|'));
 for(const c of cols) console.log('    ',c.name,await db.collection(c.name).countDocuments());
}
await m.disconnect();
})().catch(e=>{console.error('ERR',e.message);process.exit(1);});
