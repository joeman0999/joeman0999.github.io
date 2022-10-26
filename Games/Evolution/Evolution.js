var Thecanvas = {
    width: 500,
    height: 500
};

var Objects = {
    Atoms: [],
    AtomSize: 5,
    Molecules: [],
    MoleculeSize: 5,
    Water_Molecules: [], // same size as molecules
    Salt_Molecules: [], // same size as molecules
    Amino_Acids: [],
    Amino_AcidSize: 4,
    Proteins: [] // same size as amino acids as is a chain of them
}

var Structures = {
    Atom: true,
    Protein: false,
    Membrane: false,
    Skeleton: false
}

var State = "Blob";
var Atoms = 0;
var Molecules = 0;
var Water_Molecules = 0;
var Salt_Molecules = 0;
var Amino_Acids = 0;
var Proteins = 0;
var Multiplier = 0;
var SizeMultiplier = 1;
var Frames = {
    Current: 0,
    Molecule: 0
}

var myGameArea = {
    canvas: document.getElementById("GameArea"),
    start: function () {
        this.canvas = document.getElementById("GameArea");
        this.canvas.width = 200 * SizeMultiplier;
        this.canvas.height = 200 * SizeMultiplier;
        this.context = this.canvas.getContext("2d");
        this.frameNo = 0;
    },
    stop: function () {
        //clearInterval(this.interval);
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

window.onload = function () {
    var screenW = Math.max(document.body.scrollWidth, document.documentElement.offsetWidth, document.documentElement.clientWidth);
    var screenH = Math.max(document.body.scrollHeight, document.documentElement.offsetHeight, document.documentElement.clientHeight);
    var min = Math.min(screenW, screenH);
    var size = Math.floor(min * .55);
    SizeMultiplier = size / 200;
    myGameArea.start();
}

function render() {
    myGameArea.clear();
    ObjectCreation();
    if (Structures.Atom) {
        for (var i = 0; i < Objects.Atoms.length; i++) {

            myGameArea.context.fillStyle = Objects.Atoms[i].color;
            myGameArea.context.beginPath();
            myGameArea.context.arc(Objects.Atoms[i].x * SizeMultiplier, Objects.Atoms[i].y * SizeMultiplier, Objects.AtomSize * SizeMultiplier, 0, Math.PI * 2);
            myGameArea.context.closePath();
            myGameArea.context.fill();

            
        }
    }

    for (var i = 0; i < Objects.Molecules.length; i++) {

        myGameArea.context.fillStyle = Objects.Molecules[i].color;
        myGameArea.context.beginPath();
        myGameArea.context.arc(Objects.Molecules[i].x * SizeMultiplier, Objects.Molecules[i].y * SizeMultiplier, Objects.MoleculeSize * SizeMultiplier, 0, Math.PI * 2);
        myGameArea.context.closePath();
        myGameArea.context.fill();
    }

    for (var i = 0; i < Objects.Water_Molecules.length; i++) {

        myGameArea.context.fillStyle = "blue";
        myGameArea.context.beginPath();
        myGameArea.context.arc(Objects.Water_Molecules[i].x * SizeMultiplier, Objects.Water_Molecules[i].y * SizeMultiplier, Objects.MoleculeSize * SizeMultiplier, 0, Math.PI * 2);
        myGameArea.context.closePath();
        myGameArea.context.fill();
    }

    for (var i = 0; i < Objects.Salt_Molecules.length; i++) {

        myGameArea.context.fillStyle = "grey";
        myGameArea.context.beginPath();
        myGameArea.context.arc(Objects.Salt_Molecules[i].x * SizeMultiplier, Objects.Salt_Molecules[i].y * SizeMultiplier, Objects.MoleculeSize * SizeMultiplier, 0, Math.PI * 2);
        myGameArea.context.closePath();
        myGameArea.context.fill();
    }

    if (Structures.Protein || Structures.Membrane) {

        for (var i = 0; i < Objects.Amino_Acids.length; i++) {

            myGameArea.context.fillStyle = Objects.Amino_Acids[i].color;
            myGameArea.context.beginPath();
            myGameArea.context.arc(Objects.Amino_Acids[i].x * SizeMultiplier, Objects.Amino_Acids[i].y * SizeMultiplier, Objects.Amino_AcidSize * SizeMultiplier, 0, Math.PI * 2);
            myGameArea.context.closePath();
            myGameArea.context.fill();
        }

        myGameArea.context.fillStyle = "Chartreuse";
        myGameArea.context.globalAlpha = .95;
        myGameArea.context.beginPath();
        myGameArea.context.moveTo(100 * SizeMultiplier, 50 * SizeMultiplier);
        myGameArea.context.quadraticCurveTo(140 * SizeMultiplier, 20 * SizeMultiplier, 140 * SizeMultiplier, 90 * SizeMultiplier);
        myGameArea.context.quadraticCurveTo(160 * SizeMultiplier, 125 * SizeMultiplier, 130 * SizeMultiplier, 160 * SizeMultiplier);
        myGameArea.context.quadraticCurveTo(90 * SizeMultiplier, 180 * SizeMultiplier, 70 * SizeMultiplier, 160 * SizeMultiplier);
        myGameArea.context.quadraticCurveTo(40 * SizeMultiplier, 120 * SizeMultiplier, 50 * SizeMultiplier, 90 * SizeMultiplier);
        myGameArea.context.quadraticCurveTo(40 * SizeMultiplier, 50 * SizeMultiplier, 100 * SizeMultiplier, 50 * SizeMultiplier);
        myGameArea.context.fill();

        for (var i = 0; i < Objects.Proteins.length; i++) {
            myGameArea.context.lineWidth = 4;
            myGameArea.context.strokeStyle = Objects.Proteins[i].color;
            myGameArea.context.lineCap = 'round';
            myGameArea.context.beginPath();
            myGameArea.context.setLineDash([1 * SizeMultiplier, 4 * SizeMultiplier]);
            myGameArea.context.moveTo(Objects.Proteins[i].x1 * SizeMultiplier, Objects.Proteins[i].y1 * SizeMultiplier);
            myGameArea.context.quadraticCurveTo(Objects.Proteins[i].conx * SizeMultiplier, Objects.Proteins[i].cony * SizeMultiplier, Objects.Proteins[i].x2 * SizeMultiplier, Objects.Proteins[i].y2 * SizeMultiplier);
            myGameArea.context.stroke();
        }
        
        if (Structures.Membrane) {
            myGameArea.context.strokeStyle = "Lime";
            myGameArea.context.beginPath();
            myGameArea.context.setLineDash([]);
            myGameArea.context.moveTo(100 * SizeMultiplier, 50 * SizeMultiplier);
            myGameArea.context.quadraticCurveTo(140 * SizeMultiplier, 20 * SizeMultiplier, 140 * SizeMultiplier, 90 * SizeMultiplier);
            myGameArea.context.quadraticCurveTo(160 * SizeMultiplier, 125 * SizeMultiplier, 130 * SizeMultiplier, 160 * SizeMultiplier);
            myGameArea.context.quadraticCurveTo(90 * SizeMultiplier, 180 * SizeMultiplier, 70 * SizeMultiplier, 160 * SizeMultiplier);
            myGameArea.context.quadraticCurveTo(40 * SizeMultiplier, 120 * SizeMultiplier, 50 * SizeMultiplier, 90 * SizeMultiplier);
            myGameArea.context.quadraticCurveTo(40 * SizeMultiplier, 50 * SizeMultiplier, 100 * SizeMultiplier, 50 * SizeMultiplier);
            myGameArea.context.stroke();
        }
    }

    if (Structures.Skeleton) {
        myGameArea.context.fillStyle = "Chartreuse";
        myGameArea.context.globalAlpha = .95;
        myGameArea.context.beginPath();
        myGameArea.context.arc(100 * SizeMultiplier, 100 * SizeMultiplier, 70 * SizeMultiplier, 0, Math.PI * 2);
        myGameArea.context.closePath();
        myGameArea.context.fill();

        myGameArea.context.strokeStyle = "Lime";
        myGameArea.context.beginPath();
        myGameArea.context.arc(100 * SizeMultiplier, 100 * SizeMultiplier, 70 * SizeMultiplier, 0, Math.PI * 2);
        myGameArea.context.closePath();
        myGameArea.context.stroke();
    }
}

function CreateMolecules(type) {
    switch (type) {
        case 'Atom':
            Atoms++;
        case 'Molecule':
            if (Atoms > 9) {
                Molecules++;
                Atoms -= 10;
            }
            break;
        case 'Water':
            if (Atoms > 2) {
                Water_Molecules++;
                Atoms -= 3;
            }
            break;
        case 'Salt':
            if (Atoms > 1) {
                Salt_Molecules++;
                Atoms -= 2;
            }
            break;
        case 'Amino_Acids':
            if (Atoms > 8) {
                Amino_Acids++;
                Atoms -= 9;
            }
            break;
        case 'Proteins':
            if (Amino_Acids > 29) {
                Proteins++;
                Amino_Acids -= 30;
            }
            break;
    }

    WriteValues();
}

function Upgrade(number) {
    switch(number) {
        case 0:
            Atoms++;
            document.getElementById("GameAreaDiv").hidden = false;
            document.getElementById('Upgrade0').hidden = true;
            document.getElementById('Upgrade1').hidden = false;
            break;
        case 1:
            if (Atoms > 19) {
                Atoms -= 20;
                Molecules++;
                document.getElementById("CreateMolecules").hidden = false;
                document.getElementById("Molecules").hidden = false;
                document.getElementById('Upgrade1').hidden = true;
                document.getElementById('Upgrade2').hidden = false;
                Objects.AtomSize = 3;
            }
            break;
        case 2:
            if (Molecules > 9) {
                Molecules -= 10;
                Water++;
                document.getElementById("CreateWater").hidden = false;
                document.getElementById("Water").hidden = false;
                document.getElementById('Upgrade2').hidden = true;
                document.getElementById('Upgrade3').hidden = false;
            }
            break;
        case 3:
            if (Molecules > 19) {
                Molecules -= 10;
                Salt++;
                document.getElementById("CreateSalt").hidden = false;
                document.getElementById("Salt").hidden = false;
                document.getElementById('Upgrade3').hidden = true;
                document.getElementById('Upgrade4').hidden = false;
            }
            break;
        case 4:
            if (Water_Molecules > 49 && Salt_Molecules > 49) {
                Water_Molecules -= 50;
                Salt_Molecules -= 50;
                Molecules += Water_Molecules + Salt_Molecules;   /// ******turns water and salt into molecules as are not used again
                Multiplier = 1;
                Objects.Atoms = [];
                Objects.MoleculeSize = 3;
                Water_Molecules = 0;
                Salt_Molecules = 0;
                Structures.Atom = false;
                Structures.Protein = true;
                interval = setInterval(Update, 1000);
                document.getElementById("Salt").hidden = true;
                document.getElementById("CreateSalt").hidden = true;
                document.getElementById("CreateWater").hidden = true;
                document.getElementById("Water").hidden = true;
                document.getElementById('Upgrade4').hidden = true;
                document.getElementById('Upgrade5').hidden = false;
            }
            break;
        case 5:
            if (Molecules > 29) {
                Molecules -= 30;
                document.getElementById("CreateAmino_Acids").hidden = false;
                document.getElementById("Amino_Acids").hidden = false;
                document.getElementById('Upgrade5').hidden = true;
                document.getElementById('Upgrade6').hidden = false;
            }
            break;
        case 6:
            if (Amino_Acids > 29) {
                Amino_Acids -= 30;
                Proteins++;
                Objects.MoleculeSize = 2;
                Objects.Amino_AcidSize = 3;
                document.getElementById("CreateProteins").hidden = false;
                document.getElementById("Proteins").hidden = false;
                document.getElementById('Upgrade6').hidden = true;
                document.getElementById('Upgrade7').hidden = false;
            }
            break;
        case 7:
            if (Molecules > 49 && Proteins > 9) {
                Molecules -= 50;
                Proteins -= 10;
                Atoms += Molecules*10;
                Molecules = 0;
                document.getElementById('CreateMolecules').hidden = true;
                document.getElementById("Molecules").hidden = true;
                Multiplier++;
                Structures.Protein = false;
                Structures.Membrane = true;
                document.getElementById('Upgrade7').hidden = true;
                document.getElementById('Upgrade8').hidden = false;
            }
            break;
        case 8:
            if (Proteins > 19) {
                Proteins -= 20;
                Multiplier++;
                Structures.Membrane = false;
                Structures.Skeleton = true;
                document.getElementById('Upgrade8').hidden = true;
                document.getElementById('Upgrade9').hidden = false;
            }
            break;
        case 9:
            if (Proteins > 19 && Amino_Acids > 9) {
                Proteins -= 20;
                Amino_Acids -= 10;
                Multiplier++;
                document.getElementById('Upgrade9').hidden = true;
                document.getElementById('Upgrade10').hidden = false;
                document.getElementById('Upgrade11').hidden = false;
            }
            break;
        case 10:
            if (Proteins > 49) {
                Proteins -= 50;
                Multiplier++;
                State = "Eukaryotic Cell";
                document.getElementById('Upgrade10').hidden = true;
                document.getElementById('Upgrade11').hidden = true;
                document.getElementById('Upgrade12').hidden = false;
            }
            break;
        case 11:
            if (Proteins > 49) {
                Proteins -= 50;
                Multiplier++;
                document.getElementById('Upgrade10').hidden = true;
                document.getElementById('Upgrade11').hidden = true;
                document.getElementById('Upgrade13').hidden = false;
                document.getElementById('Upgrade14').hidden = false;
            }
            break;
        case 12:
            if (Proteins > 99) {
                Proteins -= 100;
                Multiplier++;
                document.getElementById('Upgrade12').hidden = true;
            }
            break;
        case 13:
            if (Proteins > 199) {
                Proteins -= 200;
                Multiplier++;
                State = "Bacteria Cell";
                document.getElementById('Upgrade13').hidden = true;
                document.getElementById('Upgrade14').hidden = true;
            }
            break;
        case 14:
            if (Proteins > 199) {
                Proteins -= 200;
                Multiplier++;
                State = "Archaea Cell";
                document.getElementById('Upgrade13').hidden = true;
                document.getElementById('Upgrade14').hidden = true;
            }
            break;
        default:
            alert('what the hell?');
            break;
    }
    WriteValues();
}

function WriteValues() {
    document.getElementById("State").innerHTML = 'You Are A: ' + State;
    document.getElementById("Atoms").innerHTML = 'Atoms: ' + Atoms;
    document.getElementById("Molecules").innerHTML = 'Molecules: ' + Molecules;
    document.getElementById("Water").innerHTML = 'Water: ' + Water_Molecules;
    document.getElementById("Salt").innerHTML = 'Salt: ' + Salt_Molecules;
    document.getElementById("Amino_Acids").innerHTML = 'Amino_Acids: ' + Amino_Acids;
    document.getElementById("Proteins").innerHTML = 'Proteins: ' + Proteins;
    render();
}

function Update() {
    Frames.Current++;
    if (Frames.Current > Frames.Molecule) {
        Frames.Molecule = Frames.Current;
        Atoms += 5*Multiplier;
        if (Multiplier > 1) {
            Amino_Acids += Multiplier;
        }
    }
    WriteValues();
}

function ObjectCreation() {
    if (Structures.Atom) {
        if (Atoms < Objects.Atoms.length) {
            var ToRemove = Objects.Atoms.length - Atoms;
            for (var i = 0; i < ToRemove; i++) {
                Objects.Atoms.splice(Math.round(Math.random() * (Objects.Atoms.length - 1)), 1);
            }
        } else if (Atoms > Objects.Atoms.length) {
            var colorOption = 0;
            var color = "";
            while (Atoms > Objects.Atoms.length) {
                colorOption = Math.round(Math.random() * 4); // 5 options
                switch (colorOption) {
                    case 0:
                        color = "greenyellow";
                        break;
                    case 1:
                        color = "mediumorchid";
                        break;
                    case 2:
                        color = "darkorange";
                        break;
                    case 3:
                        color = "aquamarine";
                        break;
                    case 4:
                        color = "black";
                        break;
                }
                var newAtom = {
                    color: color,
                    x: Math.random() * 200,
                    y: Math.random() * 200
                }
                Objects.Atoms.push(newAtom);
            }
        }
    }

    if (Water_Molecules < Objects.Water_Molecules.length) {
        var ToRemove = Objects.Water_Molecules.length - Water_Molecules;
        for (var i = 0; i < ToRemove; i++) {
            Objects.Water_Molecules.splice(Math.round(Math.random() * (Objects.Water_Molecules.length - 1)), 1);
        }
    } else if (Water_Molecules > Objects.Water_Molecules.length) {
        while (Water_Molecules > Objects.Water_Molecules.length) {

            var newMolecule = {
                x: Math.random() * 200,
                y: Math.random() * 200
            }
            Objects.Water_Molecules.push(newMolecule);
        }
    }

    if (Salt_Molecules < Objects.Salt_Molecules.length) {
        var ToRemove = Objects.Salt_Molecules.length - Salt_Molecules;
        for (var i = 0; i < ToRemove; i++) {
            Objects.Salt_Molecules.splice(Math.round(Math.random() * (Objects.Salt_Molecules.length - 1)), 1);
        }
    } else if (Salt_Molecules > Objects.Salt_Molecules.length) {
        while (Salt_Molecules > Objects.Salt_Molecules.length) {

            var newMolecule = {
                x: Math.random() * 200,
                y: Math.random() * 200
            }
            Objects.Salt_Molecules.push(newMolecule);
        }
    }

    if (Molecules < Objects.Molecules.length) {
        var ToRemove = Objects.Molecules.length - Molecules;
        for (var i = 0; i < ToRemove; i++) {
            Objects.Molecules.splice(Math.round(Math.random() * (Objects.Molecules.length - 1)), 1);
        }
    } else if (Molecules > Objects.Molecules.length) {
        var colorOption = 0;
        var color = "";
        while (Molecules > Objects.Molecules.length) {
            colorOption = Math.round(Math.random() * 3); // 4 options
            switch (colorOption) {
                case 0:
                    color = "orangered";
                    break;
                case 1:
                    color = "cyan";
                    break;
                case 2:
                    color = "pink";
                    break;
                case 3:
                    color = "lime";
                    break;
            }
            var newMolecule = {
                color: color,
                x: Math.random() * 200,
                y: Math.random() * 200
            }
            Objects.Molecules.push(newMolecule);
        }
    }

    if (Amino_Acids < Objects.Amino_Acids.length) {
        var ToRemove = Objects.Amino_Acids.length - Amino_Acids;
        for (var i = 0; i < ToRemove; i++) {
            Objects.Amino_Acids.splice(Math.round(Math.random() * (Objects.Amino_Acids.length - 1)), 1);
        }
    } else if (Amino_Acids > Objects.Amino_Acids.length) {
        var colorOption = 0;
        var color = "";
        while (Amino_Acids > Objects.Amino_Acids.length) {
            colorOption = Math.round(Math.random() * 3); // 4 options
            switch (colorOption) {
                case 0:
                    color = "orange";
                    break;
                case 1:
                    color = "green";
                    break;
                case 2:
                    color = "yellow";
                    break;
                case 3:
                    color = "blue";
                    break;
            }
            var newAmino_Acid = {
                color: color,
                x: Math.random() * 200,
                y: Math.random() * 200
            }
            Objects.Amino_Acids.push(newAmino_Acid);
        }
    }

    if (Proteins < Objects.Proteins.length) {
        var ToRemove = Objects.Proteins.length - Amino_Acids;
        for (var i = 0; i < ToRemove; i++) {
            Objects.Proteins.splice(Math.round(Math.random() * (Objects.Proteins.length - 1)), 1);
        }
    } else if (Proteins > Objects.Proteins.length) {
        var colorOption = 0;
        var color = "";
        while (Proteins > Objects.Proteins.length) {
            colorOption = Math.round(Math.random() * 3); // 4 options
            switch (colorOption) {
                case 0:
                    color = "orange";
                    break;
                case 1:
                    color = "green";
                    break;
                case 2:
                    color = "blue";
                    break;
                case 3:
                    color = "yellow";
                    break;
            }
            var x1 = Math.random() * 160 + 20;
            var y1 = Math.random() * 160 + 20;
            var length = Math.random() * 20 + 20;
            var angle = Math.random() * Math.PI * 2;
            var midx = x1 + (length * Math.cos(angle))/2;
            var midy = y1 + (length * Math.sin(angle))/2;

            var length2 = (Math.random() * 20 + 10);
            var angle2 = (Math.PI * 4 / 8 * Math.random()) + (Math.PI * 2 / 8);
            if (Math.random() > .5) {
                var conx = length2 * Math.cos(angle + angle2) + midx;
                var cony = length2 * Math.sin(angle + angle2) + midy;
            } else {
                var conx = length2 * Math.cos(angle - angle2) + midx;
                var cony = length2 * Math.sin(angle - angle2) + midy;
            }
            var newProtein = {
                color: color,
                x1: x1,
                y1: y1,
                x2: (length * Math.cos(angle)) + x1,
                y2: (length * Math.sin(angle)) + y1,
                conx: conx,
                cony: cony
            }
            Objects.Proteins.push(newProtein);
        }
    }
}