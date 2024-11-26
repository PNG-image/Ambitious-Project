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


const img = new Image();
img.src = "Ref.png";

var bool = true;
function Bool() {
  bool = !bool;
}
var map = true;
function Map() {
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

class Province {
  constructor(parent,name,vertexPositions,isCapital,cities) {
    parent.provinces++;
    this.country = parent;
    this.capital = isCapital;
    this.name = name;
    this.vertexPositions = vertexPositions;
    this.buildings = [];
    this.cities = cities;
  }
}

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

people.push(new Human(14, 52, 108, 'Drest IX', 72, 'Catholic', 'Scottish', 'Scotland', [], 'King', 'Scotland'));

countries.push(new Country('rgb(50 50 150 / 100%)','Scotland', findPerson('rule', 'Scotland'))); //75%

provinces.push(new Province(findCountry("Scotland"),"Sutherland",[[77,30],[68,28],[72,24],[64,24],[60,35],[62,35]],false,['Durness']));
provinces.push(new Province(findCountry("Scotland"),"Perth",[[77,33],[77,30],[62,35],[60,42],[65,38],[74,40]],true,['Perth']));
provinces.push(new Province(findCountry("Scotland"),"Lanark",[[65,38],[74,40],[70,45],[63,46]],false,['Edinburough','Glasgow']));

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

provinces.push(new Province(findCountry("West Francia"),"Normandy",[[79,87],[80,84],[79,77],[81,77],[88,79],[88,77],[91,76],[96,74],[95,77],[91,80],[87,81],[83,83]],false,['Caen']));

people.push(new Human(22,86,103,'Dirk I',92,'Catholic','Frisian', 'Frisia',[],'King','Frisia'));

countries.push(new Country('rgb(250 170 50 / 100%)','Frisia', findPerson('rule', 'Frisia')));

provinces.push(new Province(findCountry("Frisia"),"Picardy",[[96,74],[95,77],[103,77],[110,75],[101,69],[96,70]],false,[]));

provinces.push(new Province(findCountry("Frisia"),"Flanders",[[110,75],[101,69],[104,67],[112,66],[117,69],[112,72]],false,[]));

provinces.push(new Province(findCountry("Frisia"),"Wallonia",[[117,69],[112,72],[110,75],[116,78],[119,76],[117,75],[119,73]],false,[]));

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

setInterval(update, 250);

