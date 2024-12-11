var cvs = document.getElementById('thisisacanvas');
var scale;
cvs.width = (window.innerWidth-17);
scale = cvs.width / 384;
cvs.height = 216*scale;
var ctx = cvs.getContext('2d');


function save() {
  let Save = [
    Stats,
    people,
    provinces,
    countries
  ];
  localStorage.setItem('save', JSON.stringify(Save));
  console.log('saved')
}
function load() {
  let Save = JSON.parse(localStorage.getItem('save'));
  Stats = Save[0];
  people = Save[1];
  provinces = Save[2];
  countries = Save[3];
  update();
  console.log('loaded')
}

var borders = [];
class border {
  constructor(mtn,type,provinces) {
    this.mtn = mtn;   // mountain?
    this.type = type; // l-l, l-w, w-w, land/water
    this.provinces = provinces;
  }
}

const img = new Image();
img.src = "Ref.png";

var bool = true;
function Bool() {
  bool = !bool;
}
var map = true;
function Mapp() {
  map = !map;
}
function deSel() {
  prev_i = -1;
  pName = NaN;
  overlap = false;
  document.getElementById('selected').innerHTML = '';
}


function newCity(i) {
  if (provinces[i].cities.length < 5) {
  provinces[i].cities.push(prompt('City Name: '))
  } else {
    alert('Max Cities Reached on Province ' + provinces[i].name)
  }
  document.getElementById('selected').innerHTML = provinces[i].name;
  if (provinces[i].capital) {
    document.getElementById('selected').innerHTML += ' (Capital)';
  }
  document.getElementById('selected').innerHTML += '<br>' + `<span style='color: ${provinces[i].country.color};'>${provinces[i].country.name}</span>`;
  for (let j = 0; j < provinces[i].cities.length; j++) {
    document.getElementById('selected').innerHTML += '<br> - ' + provinces[i].cities[j];
  }
  document.getElementById('selected').innerHTML += `<br><button onClick="newCity(${i})">Add City</button>`;
  prev_i = i
  pName = NaN;
}

function InputMousePos(event) {
    let rect = cvs.getBoundingClientRect();
    let x = (event.clientX - rect.left)/scale;
    let y = (event.clientY - rect.top)/scale;
    return [x,y];
}


function inside(point, vs) {
  var x = point[0], y = point[1];
  
  var inside = false;
  for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    var xi = vs[i][0], yi = vs[i][1];
    var xj = vs[j][0], yj = vs[j][1];
    
    var intersect = ((yi > y) != (yj > y))
      && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  
  return inside;
};
var pName = NaN;
var prev_i = NaN;
var overlap = false;
cvs.addEventListener("mousedown", function (event) {
  for (let i = 0; i < provinces.length; i++) {
    if (inside(InputMousePos(event), provinces[i].vertexPositions)) {
      if (prev_i != i) {
        overlap = false;
        document.getElementById('selected').innerHTML = provinces[i].name;
        if (provinces[i].capital) {
          document.getElementById('selected').innerHTML += ' (Capital)';
        }
        document.getElementById('selected').innerHTML += '<br>' + `<span style='color: ${provinces[i].country.color};'>${provinces[i].country.name}</span>`;
        for (let j = 0; j < provinces[i].cities.length; j++) {
          document.getElementById('selected').innerHTML += '<br> - ' + provinces[i].cities[j];
        }
        document.getElementById('selected').innerHTML += `<br><button onClick="newCity(${i})">Add City</button>`;
        prev_i = i
        pName = NaN;
      } else {
        pName = provinces[i].country.name;
        overlap = true;
        prev_i = -1;
        document.getElementById('selected').innerHTML = `<span style='color: ${provinces[i].country.color};'>${provinces[i].country.name}</span>`;
        document.getElementById('selected').innerHTML += '<br>'+ provinces[i].country.ruler.title + ' ' + provinces[i].country.ruler.name + ' ' + provinces[i].country.ruler.Title;
      }
    }
  }
});

function findPerson(identifier, object) {
  let found = [];
  if (identifier == 'name') {
    console.log('searching name');
    for (let count = 0; count < people.length; count++) {
       if (people[count].name == object) {
         found.push(people[count]);
       }
    }
  } else if (identifier == 'rule') {
    console.log('searching rule');
    for (let count = 0; count < people.length; count++) {
       if (people[count].rule == object) {
         found.push(people[count]);
       }
    }
  } else if (identifier == 'title') {
    console.log('searching title');
    for (let count = 0; count < people.length; count++) {
       if (people[count].title == object) {
         found.push(people[count]);
       }
    }
  }
  if (found.length == 1) {
    return found[0];
  } else if (found.length == 0) {
    reportError(identifier + ' ' + object + ' not found')
  } else {
    return found;
  }
}


class Trait {
  constructor(name, effectHP, effectXPG, description) {
    this.name = name;
    this.effectHP = effectHP;
    this.effectXPG = effectXPG;
    this.description = description;
  }
}

class Stats {
  country = new Country('rgb(0,0,0 / 100%','None');
  human = new Human(0,0,0,0,'None',0,0,0,[]);
}


class Human {
  constructor(lvl, xp, gold, name, prestiege, religion, nationality, country, traits, title, rule, Title) {
    this.country = country;
    this.title = title;
    if (Title) {
      this.Title = Title;
    } else {
      this.Title = '';
    }
    if (rule) {
      this.rule = rule;
    } else {
      this.rule = '';
    }
    if (religion) {
      this.religion = religion;
    } else {
      this.religion = '';
    }
    this.health = 80;
    this.lvl = lvl;
    this.xp = xp;
    this.xpg = 1.0;
    this.gold = gold;
    this.name = name;
    this.prestiege = prestiege;
    this.nationality = nationality;
    this.traits = traits;
  }
}

class Country {
  constructor(color,name, ruler) {
    this.color = color;
    this.name = name;
    this.provinces = 0;
    this.ruler = ruler;
  }
}

var people = [];
var provinces = [];
var countries = [];

function compare(a,b,len) {
  for (let i = 0; i < len; i++) {
    if (a[i] != b[i]) {
      return false;
    }
  }
  return true;
}

class Province {

  /** @type {Map<string, Province[]>} */
  static #edgesProvinceMap = new Map;

  #edges;

  /** @param {[ x: number, y: number ][]} vertexPositions  */
  constructor(parent,name,vertexPositions,isCapital,cities) {
    parent.provinces++;
    this.country = parent;
    this.capital = isCapital;
    this.name = name;
    this.vertexPositions = vertexPositions;
    this.#edges = this.#mapEdgesWithInstance();
    this.buildings = [];
    this.cities = cities;
  }

  get edges() {
    return this.#edges;
  }

  #mapEdgesWithInstance() {
    const edges = [];
    for(let indexA = 0; indexA < this.vertexPositions.length; indexA++) {
      const indexB = (indexA + 1) % this.vertexPositions.length;
      const vertexIdA = Province.vertexId(this.vertexPositions[indexA]);
      const vertexIdB = Province.vertexId(this.vertexPositions[indexB]);
      const edgeId = Province.edgeId(vertexIdA, vertexIdB);
      const edgeIdAlt = Province.edgeId(vertexIdB, vertexIdA);
      //console.log(Province.#edgesProvinceMap)
      if(Province.#edgesProvinceMap.has(edgeId)) {
        Province.#edgesProvinceMap.get(edgeId).push(this);
        edges.push(edgeId);
      } else if(Province.#edgesProvinceMap.has(edgeIdAlt)) {
        Province.#edgesProvinceMap.get(edgeIdAlt).push(this);
        edges.push(edgeIdAlt);
      } else {
        Province.#edgesProvinceMap.set(edgeId, [ this ]);
        edges.push(edgeId);
      }
    }
    return edges;
  }

  getEdgeProvinces(edgeIndex) {
    return Province.getEdgesProvinceMap().get(this.#edges[edgeIndex]);
  }

  static getEdgesProvinceMap() {
    return this.#edgesProvinceMap;
  }

  /** @param {[ x: number, y: number ]} vertex */
  static vertexId(vertex) {
    return vertex[0] + "," + vertex[1];
  }

  static edgeId(vertexId1, vertexId2) {
    return vertexId1 + ":" + vertexId2;
  }
}

/*
class Province {
  constructor(parent,name,vertexPositions,isCapital,cities) {
    parent.provinces++;
    this.country = parent;
    this.capital = isCapital;
    this.name = name;
    this.vertexPositions = vertexPositions;
    this.buildings = [];
    this.cities = cities;
    /*
    let selVtx = [];
    loading = true;
    for (let i = 0; i < provinces.length; i++) {
      for (let j = 0; j < provinces[i].vertexPositions.length; j++) {
        for (let k = 0; k < this.vertexPositions.length; k++) {
          if (selVtx.length == 0) {
            console.log('looking for first vertex')
            if (compare(provinces[i].vertexPositions[j], this.vertexPositions[k],2)) {
              selVtx.push(provinces[i].vertexPositions[j]);
              console.log('pushed first vertex')
            }
          } else {
            console.log('looking for second vertex')
            if (compare(provinces[i].vertexPositions[j], this.vertexPositions[k],2)) {
              selVtx.push(provinces[i].vertexPositions[j]);
              borders.push(new border(false, 'l-l', selVtx, [provinces[i], this]));
              console.log('new border!')
            }
            console.log('cleared selVtx')
            selVtx = [];
          }
        }
      }
    }
    loading = false;
    * /
  }
}
*/

function findCountry(name) {
  for (var i = 0; i < countries.length; i++) {
    if (countries[i].name == name) {
      return countries[i];
    }
  }
  a = new Country(`rgb(${Math.floor(Math.random()*255)} ${Math.floor(Math.random()*255)} ${Math.floor(Math.random()*255)} / 100%)`, name) //75%
  countries.push(a)
  return a;
}

var loading = true;

function newRun() {
  loading = true;
  
  people.push(new Human(14, 52, 108, 'Drest IX', 72, 'Catholic', 'Scottish', 'Scotland', [], 'King', 'Scotland'));
  
  countries.push(new Country('rgb(50 50 150 / 100%)','Scotland', findPerson('rule', 'Scotland'))); //75%
  
  provinces.push(new Province(findCountry("Scotland"),"Sutherland",[[77,30],[68,28],[72,24],[64,24],[60,35],[62,35]],false,['Durness']));
  provinces.push(new Province(findCountry("Scotland"),"Perth",[[77,33],[77,30],[62,35],[60,42],[65,38],[74,40]],true,['Perth']));
  provinces.push(new Province(findCountry("Scotland"),"Lanark",[[65,38],[74,40],[70,45],[63,46]],false,['Edinburough','Glasgow']));
  console.log(provinces[0].edges);
  
  people.push(new Human(15,51,86,'Aethelred I',71,'Catholic','English','England',[],'King','England'));
  
  countries.push(new Country('rgb(150 50 50 / 100%)','England', findPerson('rule', 'England'))); //75%
  
  provinces.push(new Province(findCountry("England"),"Cumberland",[[70,45],[74,40],[79,42],[80,46],[72,50],[70,49],[71,45]],false,['Newcastle']));
  provinces.push(new Province(findCountry("England"),"Yorkshire",[[80,46],[72,50],[72,55],[80,57],[89,58],[87,51]],false,['York','Lincoln']));
  provinces.push(new Province(findCountry("England"),"Essex",[[89,58],[80,57],[73,65],[82,62],[90,65],[95,63],[94,58]],false,['Bury St.Edmonds']));
  provinces.push(new Province(findCountry("England"),"London",[[73,65],[82,62],[90,65],[90,66],[72,67]],true,['London']));
  provinces.push(new Province(findCountry("England"),"Sussex",[[90,66],[72,67],[75,71],[91,70],[94,67]],false,['Canterbury']));
  
  people.push(new Human(12, 76, 24, 'Merfyn Frych', 107, 'Catholic', 'Welsh', 'Wales', [], 'King', 'Wales','the Great'));
  
  countries.push(new Country('rgb(170 135 50 / 100%)','Wales', findPerson('rule', 'Wales'))); // 75%
  
  provinces.push(new Province(findCountry("Wales"),"Wales",[[72,55],[80,57],[73,65],[64,64],[70,62],[65,56]],true,['Shrewsbury']));
  provinces.push(new Province(findCountry("Wales"),"Cornwall",[[72,67],[75,71],[65,74],[62,74],[67,69]],false,['Bristol']));
  
  people.push(new Human(18,105,67,'Lóegaire mac Néill',104,'Catholic','Irish','Ireland',[],'King','Ireland'));
  
  countries.push(new Country('rgb(50 150 50 / 100%)','Ireland', findPerson('rule', 'Ireland')));
  
  provinces.push(new Province(findCountry("Ireland"),"Ulster",[[58,44],[61,50],[58,52],[54,49],[52,50],[49,48],[52,45]], true,['Belfast']));
  
  provinces.push(new Province(findCountry("Ireland"),"Connacht",[[52,45],[49,48],[47,56],[44,56],[40,55],[39,50],[45,50],[45,48],[48,44]],true,['Galway']));
  
  provinces.push(new Province(findCountry("Ireland"),"Dublin",[[49,48],[47,56],[53,62],[57,60],[58,52],[54,49],[52,50]],true,['Dublin']));
  
  provinces.push(new Province(findCountry("Ireland"),"Munster",[[47,56],[53,62],[50,63],[41,66],[38,61],[42,60],[44,56]],true,['Cork','Limerick']));
  
  people.push(new Human(22,86,103,'Alan I',92,'Catholic','Breton','Brittany',[],'King','Brittany', 'the Great'));
  
  countries.push(new Country('rgb(170 90 130 / 100%)','Brittany', findPerson('rule', 'Brittany')));
  
  provinces.push(new Province(findCountry("Brittany"),"Brittany",[[65,84],[66,87],[77,90],[79,87],[80,84],[75,84],[73,82]],false,[]));
  
  people.push(new Human(22,86,103,'Charles',92,'catholic','French','West Francia',[],'King','West Francia', 'the Simple'));
  
  countries.push(new Country('rgb(70 90 130 / 100%)','West Francia', findPerson('rule', 'West Francia')));
  
  provinces.push(new Province(findCountry("West Francia"),"Dutchy of Normandy",[[79,87],[80,84],[79,77],[81,77],[88,79],[88,77],[91,76],[96,74],[95,77],[91,80],[87,81],[83,83]],false,['Caen']));
  
  provinces.push(new Province(findCountry("West Francia"),"Dutchy of Anjou",[[91,80],[87,81],[83,83],[79,87],[84,91],[88,92],[94,86]],false,[]));
  
  provinces.push(new Province(findCountry("West Francia"),"Île de France",[[95,77],[91,80],[94,86],[100,85],[104,83],[103,77]],true,['Paris']));
  
  provinces.push(new Province(findCountry("West Francia"),"Dutchy of Poitou",[[77,90],[79,87],[84,91],[88,92],[91,97],[86,101],[83,100],[84,98],[79,96]],false,[]));
  
  provinces.push(new Province(findCountry("West Francia"),"Dutchy of Aquitaine",[[91,97],[86,101],[83,100],[81,107],[87,109],[92,105]],false,[]));
  
  provinces.push(new Province(findCountry("West Francia"),"Dutchy of Gascogne",[[81,107],[87,109],[89,112],[89,118],[81,116],[80,115]],false,[]));
  
  provinces.push(new Province(findCountry("West Francia"),"Dutchy of Toulouse",[[92,105],[87,109],[89,112],[89,118],[92,117],[95,120],[102,120],[102,116],[97,108]],false,[]));

  provinces.push(new Province(findCountry("West Francia"),"Dutchy of Auvergne",[[102,116],[97,108],[101,101],[106,103],[108,110],[108,113],[106,113]],false,[]));

  provinces.push(new Province(findCountry("West Francia"),"Dutchy of Bourbon",[[97,108],[101,101],[97,98],[91,97],[92,105]],false,[]))

  provinces.push(new Province(findCountry("West Francia"),"Dutchy of Maine",[[97,98],[91,97],[88,92],[94,86],[100,85],[101,88],[97,90],[98,94]],false,[]));

  provinces.push(new Province(findCountry("West Francia"),"Dutchy of Burgundy",[[100,85],[101,88],[97,90],[98,94],[97,98],[101,101],[106,103],[108,98],[111,96],[112,90],[109,86],[104,83]],false,[]));

  provinces.push(new Province(findCountry("West Francia"),"Prince-Archbishopric of Champagne",[[109,86],[104,83],[103,77],[110,75],[116,78],[115,82]],false,[]));
  
  people.push(new Human(22,86,103,'Dirk I',92,'Catholic','Frisian', 'Frisia',[],'King','Frisia'));
  
  countries.push(new Country('rgb(250 170 50 / 100%)','Frisia', findPerson('rule', 'Frisia')));
  
  provinces.push(new Province(findCountry("Frisia"),"Picardy",[[96,74],[95,77],[103,77],[110,75],[101,69],[96,70]],false,[]));
  
  provinces.push(new Province(findCountry("Frisia"),"Flanders",[[110,75],[101,69],[104,67],[112,66],[117,69],[112,72]],false,[]));
  
  provinces.push(new Province(findCountry("Frisia"),"Wallonia",[[117,69],[112,72],[110,75],[116,78],[119,76],[117,75],[119,73]],false,[]));
  
  provinces.push(new Province(findCountry("Frisia"),"Netherlands",[[104,67],[112,66],[117,69],[118,66],[117,64],[121,64],[123,61],[121,59],[122,59],[123,56],[121,55],[116,55],[114,56],[114,58],[115,58],[116,61],[112,62],[114,58],[111,58],[110,62]],true,['Utrecht']));

  people.push(new Human(22,86,103,'Louis',92,'Catholic','Burgundian','Burgundy',[],'King','Burgundy','the Blind'));

  countries.push(new Country('rgb(130 70 70 / 100%)','Burgundy',findPerson('rule', 'Burgundy')));

  provinces.push(new Province(findCountry("Burgundy"),"Dutchy of Provence",[[108,110],[108,113],[112,114],[115,116],[118,116],[125,111],[121,109],[122,105],[114,107]],true,['Aix']));

  provinces.push(new Province(findCountry("Burgundy"),"Dutchy of Dauphine",[[106,103],[108,110],[114,107],[113,101],[111,96],[108,98]],false,[]));

  provinces.push(new Province(findCountry("Burgundy"),"Prince-Archbishopric of Savoy",[[122,105],[114,107],[113,101],[111,96],[114,95],[117,97],[120,96],[121,100]],false,[]));
  
  provinces.push(new Province(findCountry("Burgundy"),"Dutchy of Franche Comte",[[115,82],[109,86],[112,90],[111,96],[114,95],[116,90]],false,[]));

  provinces.push(new Province(findCountry("Burgundy"),"Dutchy of Franche Comte",[[114,95],[116,90],[115,82],[119,86],[122,89],[117,97]],false,[]));

  provinces.push(new Province(findCountry("Burgundy"),"Corsica",[[134,126],[135,120],[134,120],[134,117],[133,119],[130,119],[131,125]],false,[]));
  
  people.push(new Human(22,86,103,'Louis',92,'Catholic','Lotharignian','Lotharignia',[],'King','Lotharignia','the Child'));

  countries.push(new Country('rgb(100 70 50 / 100%)','Lotharignia',findPerson('rule', 'Lotharignia')));

  provinces.push(new Province(findCountry("Lotharignia"),"Lorraine",[[115,82],[119,86],[122,89],[124,89],[125,84],[128,81],[124,80],[122,80],[120,78],[119,76],[116,78]],false,[]));

  provinces.push(new Province(findCountry("Lotharignia"),"Rhineland",[[124,80],[122,80],[120,78],[119,76],[117,75],[119,73],[117,69],[118,66],[117,64],[121,64],[123,69],[125,76]],true,['Aachen']));
  
  try {deSel();} catch {}
  //console.log(Province.getEdgesProvinceMap(),100);
}

function update() {
  cvs.width = (window.innerWidth-17);
  scale = cvs.width / 384;
  cvs.height = 216*scale;
  ctx.fillStyle = 'rgb(200 230 255)';
  ctx.fillRect(0, 0, cvs.width, cvs.height);
  if (bool) { ctx.drawImage(img, 0, 0, 400*scale, 300*scale); }
  if (map) {
    for (let i = 0; i < provinces.length; i++) {
      ctx.beginPath()
      ctx.fillStyle = provinces[i].country.color;
      if (provinces[i].country.name == pName) {
        ctx.fillStyle = 'cyan';
      }
      for (let j = 0; j < provinces[i].vertexPositions.length; j++) {
        ctx.lineTo(provinces[i].vertexPositions[j][0]*scale,provinces[i].vertexPositions[j][1]*scale);
      }
      ctx.lineTo(provinces[i].vertexPositions[0][0]*scale,provinces[i].vertexPositions[0][1]*scale);
      ctx.stroke();
      ctx.fill();
    }
    if (!overlap && prev_i >= 0) {
      ctx.beginPath();
      ctx.fillStyle = 'cyan';
      for (let j = 0; j < provinces[prev_i].vertexPositions.length; j++) {
        ctx.lineTo(provinces[prev_i].vertexPositions[j][0]*scale,provinces[prev_i].vertexPositions[j][1]*scale);
      }
      ctx.lineTo(provinces[prev_i].vertexPositions[0][0]*scale,provinces[prev_i].vertexPositions[0][1]*scale);
      ctx.stroke();
      ctx.fill();
    }
  }
}

newRun();
setInterval(update, 250);

