//const typescript = require("typescript")

/*var m = [
    [1,0,0],
    [0,1,0],
    [0,0,1]
]*/

var test = "Cu4GG2"
var formula = "C6H14 + O2 => CO2 + H2O";

class Element {
    constructor(name,quantity) {
        this.name = name;
        this.quantity = quantity;
        if (this.quantity == 0) {
            this.quantity = 1;
        }
    }
}
class Molecule {
    constructor() {
        this.elements = [];
        this.multiplier = 1;
    }
    addElement(newEl) {
        this.elements.push(newEl);
    }
    list() {
        //console.log("Start.")
        this.elements.forEach(el => {
            console.log(el.name,el.quantity);
        });
        //console.log("End.")
    }
    getMultiplier() {
        return this.multiplier;
    }
    getElements() {
        var a = [];
        this.elements.forEach(el => {
            a.push([el.name,el.quantity*this.multiplier]);
        });
        return a;
    }
}




var moleculeList = createMolecules(separate(formula));

printFormula(moleculeList);
/*for (var i=0;i<moleculeList[0].length;i++) {
    console.log("Mol "+(i+1))
    moleculeList[0][i].list();
}
console.log("==>");
for (var i=0;i<moleculeList[1].length;i++) {
    console.log("Mol "+(i+1))
    moleculeList[1][i].list();
}*/
//var balancedMolecules = balance(moleculeList[0],moleculeList[1])
//console.log(getElements(moleculeList[0]));

var matrix = createMatrix(moleculeList[0],moleculeList[1]);
/*for (var y=0;y<matrix.length;y++) {
    console.log(matrix[y]);
}*/


function createMatrix(a,b) {
    var yCol = getElements(a);
    var xCol1 = a.length;
    var xCol2 = b.length;
    var m =[];
    for (var y=0;y<yCol.length;y++)
        m.push([]);
    
    for (var y=0;y<yCol.length;y++) {
        var el = yCol[y];
        for (var x=0;x<xCol1;x++) {
            m[y].push(0);
            //console.log(a[x].elements[x])
        }
        for (var x=0;x<xCol2;x++) {
            m[y].push(0);
        }
    }
    for (var y=0;y<m.length;y++) {
        for (var x=0;x<a.length;x++) {
            a[x].elements.forEach(element => {
                //console.log(element.quantity)
                if (element.name == yCol[y])
                    m[y][x] = element.quantity;
            });
        }
        for (var x=0;x<b.length;x++) {
            b[x].elements.forEach(element => {
                //console.log(element.quantity)
                if (element.name == yCol[y])
                    m[y][x+2] = -element.quantity;
            });
        }
    }
    return m;
}

function balance(a,b) {
    //'C6H14 + O2 => CO2 + H2O'
    //'2(C6H14) + 19(O2) => 12(CO2) + 14(H2O)'
    var toRet = [[],[]];
    var aEleList = [];
    var bEleList = [];
    //a[0].multiplier = 4;
    for (var i=0;i<a.length;i++) {
        var temp = a[i].getElements();
        for (var j=0;j<temp.length;j++) {
            //temp[j].push(i)
            aEleList.push(temp[j])
        }
    }
    for (var i=0;i<b.length;i++) {
        var temp = b[i].getElements();
        for (var j=0;j<temp.length;j++) {
            //temp[j].push(i)
            bEleList.push(temp[j])
        }
    }
    //Group.
    aEleList = group(aEleList);
    bEleList = group(bEleList);
    

    aEleList.forEach(i => {
        console.log(i[0],i[1]);
    });
    console.log("-------------------------------");
    bEleList.forEach(i => {
        console.log(i[0],i[1]);
    });
    //return toRet;
}

function printFormula(list) {
    var line = "\'";
    for (var i=0;i<list[0].length;i++) {
        var mol = list[0][i];
        for (var j=0;j<mol.elements.length;j++) {
            var el = mol.elements[j]
            if (el.quantity > 1)
                line += el.name + el.quantity;
            else
                line += el.name
        }
        if (i < mol.elements.length)
            line += " + "
    }
    line += " ==> "
    for (var i=0;i<list[1].length;i++) {
        var mol = list[1][i];
        for (var j=0;j<mol.elements.length;j++) {
            var el = mol.elements[j]
            if (el.quantity > 1)
                line += el.name + el.quantity;
            else
                line += el.name
        }
        if (i < mol.elements.length-1)
            line += " + "
    }
    line += "\'"
    console.log(line);
    return line;
}

function createMolecules(listRaw) {
    var eleListRet = [[],[]]
    var newMol = true;
    var k = 0;
    for (var i=0;i<listRaw.length;i++) {
        if (newMol) {
            eleListRet[k].push(new Molecule);
            newMol = false;
        }
        var e = listRaw[i]
        if (e.name == "+") {
            newMol = true;
            continue;
        }
        if (e.name == "=") {
            k = 1;
            newMol = true;
            continue;
        }
        if (e.name == ">") {
            k = 1;
            continue;
        }
        eleListRet[k][eleListRet[k].length-1].addElement(e)
    }
    return eleListRet;
}
function separate(form) {
    var toRet = [];
    var t = 0;
    var currentN = null;
    var currentQ = 0;
    for (var i=0;i<form.length+1;i++) {
        var d = form.substring(i,i+1)
        if (d!=" ") {

            if (isNumber(d)) {
                currentQ += d
            } else if (d == d.toUpperCase()) {
                //New Element.
                if (currentN != null) {
                    toRet.push(new Element(currentN,parseInt(currentQ)))
                }
                currentN = d;
                currentQ = 0;
            } else {
                //Continuation of Element.
                currentN += d;
            }
        }
    }
    return toRet
}

function isNumber(n) {
    return !isNaN(parseInt(n))
}
function getElements(arr) {
    var toRet=[];
    for (var i=0;i<arr.length;i++) {
        var mol = arr[i].getElements();
        for (var j=0;j<mol.length;j++) {
            //console.log(mol[j][0]);
            toRet.push(mol[j][0]);
        }
    }
    toRet.sort(function(i,j){return i[0]>j[0]});
    for (var i=0;i<toRet.length;i++) {
        if (!toRet[i+1])
            continue;
        if (toRet[i] == toRet[i+1]) {
            toRet.splice(i+1,1);
        }
    }
    return toRet;
}

function group(ar) {
    ar.sort(function(i,j){return i[0]>j[0]});
    
    for (var i=0;i<ar.length;i++) {
        if (!ar[i+1])
            continue;
        if (ar[i][0] == ar[i+1][0]) {
            ar[i][1] += ar[i+1][1];
            ar.splice(i+1,1);
        }
        
    }
    return ar;
}