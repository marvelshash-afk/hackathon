import { useState, useEffect } from "react";
import { useThreatContext } from "@/context/ThreatContext";

export default function ServerDashboard() {

const { threats } = useThreatContext();

/* SERVER STATES */

const [servers,setServers] = useState({
cs20:"up",
cs30:"up",
cs51:"up",
cs46:"up",
cs52:"up",

cs76:"down",
cs50:"down",
cs23:"down",
cs47:"down",
cs36:"down",
cs49:"down",
cs22:"down",
cs71:"down",
cs29:"down",
cs34:"down",
cs35:"down",
cs32:"down",

cs59:"down",
cs39:"down",
cs33:"down"
});

/* store infection persistence */
const [infectedServers,setInfectedServers] = useState<string[]>([]);
const [ddosServers,setDdosServers] = useState<string[]>([]);

/* AI THREAT DETECTION */

useEffect(()=>{

if(!threats || threats.length===0) return;

const latest = threats[0];
const type = (latest.type || "").toLowerCase();

/* only attack servers that are UP */

const onlineServers = Object.entries(servers)
.filter(([_,status]) => status === "up")
.map(([id]) => id);

if(onlineServers.length===0) return;

const targetServer =
onlineServers[Math.floor(Math.random()*onlineServers.length)];

if(type.includes("ddos")){

setServers(prev=>({
...prev,
[targetServer]:"attacked"
}));

setDdosServers(prev=>[...prev,targetServer]);

}

if(
type.includes("malware") ||
type.includes("sql") ||
type.includes("zero")
){

setServers(prev=>({
...prev,
[targetServer]:"attacked"
}));

setInfectedServers(prev=>[...prev,targetServer]);

}

},[threats]);

/* SERVER CONTROL */

const toggleServer=(id:string)=>{

setServers(prev=>{

const state = prev[id];

if(state==="up") return {...prev,[id]:"down"};

if(state==="down"){

/* if ddos attacked server → restart clean */

if(ddosServers.includes(id)){
return {...prev,[id]:"up"};
}

/* malware/sql/zero-day stay infected */

if(infectedServers.includes(id)){
return {...prev,[id]:"infected"};
}

return {...prev,[id]:"up"};

}

if(state==="attacked") return {...prev,[id]:"down"};

if(state==="infected") return {...prev,[id]:"down"};

return prev;

});

};

const isUp=(id:string)=>servers[id]==="up";

/* SERVER NODE */

const Server=({id,x,y}:{id:string,x:number,y:number})=>{

const state=servers[id];

let color="#ffffff";
let label="DOWN";

if(state==="up"){
color="#22c55e";
label="UP";
}

if(state==="attacked"){
color="#ef4444";
label="ATTACKED";
}

if(state==="infected"){
color="#ef4444";
label="INFECTED";
}

return(
<>
<circle
cx={x}
cy={y}
r="34"
fill={color}
stroke="#00eaff"
strokeWidth="3"
style={{cursor:"pointer"}}
onClick={()=>toggleServer(id)}
/>

<text
x={x}
y={y+4}
textAnchor="middle"
fontSize="11"
fontWeight="bold"
fill="#111"
>
{id}
</text>

<text
x={x}
y={y+48}
textAnchor="middle"
fontSize="11"
fill={
state==="up"
? "#22c55e"
: state==="down"
? "#999"
: "#ff0000"
}
>
{label}
</text>
</>
);

};

/* CONNECTION LINE */

const Line=({x1,y1,x2,y2}:{x1:number,y1:number,x2:number,y2:number})=>(
<line
x1={x1}
y1={y1}
x2={x2}
y2={y2}
stroke="#38bdf8"
strokeWidth="4"
/>
);

/* UI */

return(

<div style={{height:"800px",padding:"20px"}}>

<h2 style={{color:"white",marginBottom:"10px"}}>
Cyber Network Topology
</h2>

<svg width="1200" height="650">

{isUp("cs20") && isUp("cs30") &&
<Line x1={600} y1={130} x2={600} y2={200}/>
}

{isUp("cs30") && isUp("cs51") &&
<Line x1={600} y1={200} x2={520} y2={270}/>
}

{isUp("cs30") && isUp("cs46") &&
<Line x1={600} y1={200} x2={600} y2={270}/>
}

{isUp("cs30") && isUp("cs52") &&
<Line x1={600} y1={200} x2={680} y2={270}/>
}

{(isUp("cs51")||isUp("cs46")||isUp("cs52")) &&
<Line x1={120} y1={330} x2={1040} y2={330}/>
}

{/* Servers */}

<Server id="cs20" x={600} y={100}/>
<Server id="cs30" x={600} y={200}/>

<Server id="cs51" x={520} y={270}/>
<Server id="cs46" x={600} y={270}/>
<Server id="cs52" x={680} y={270}/>

<Server id="cs76" x={140} y={370}/>
<Server id="cs50" x={220} y={370}/>
<Server id="cs23" x={300} y={370}/>
<Server id="cs47" x={380} y={370}/>
<Server id="cs36" x={460} y={370}/>
<Server id="cs49" x={540} y={370}/>
<Server id="cs22" x={620} y={370}/>
<Server id="cs71" x={700} y={370}/>
<Server id="cs29" x={780} y={370}/>
<Server id="cs34" x={860} y={370}/>
<Server id="cs35" x={940} y={370}/>
<Server id="cs32" x={1020} y={370}/>

</svg>

</div>

);
}
