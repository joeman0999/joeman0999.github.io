var Thecanvas = {
    width: 500,
    height: 500
};
var Bottom = true;

var Atoms = 0;
var Molecules = 0;
var Water_Molecules = 0;
var Salt_Molecules = 0;
var Amino_Acids = 0;
var Proteins = 0;
var Multiplier = 1;
var Frames = {
    Current: 0,
    Molecule: 0
}


function GainAtoms() {
    Atoms++;
    WriteValues();
}

function CreateMolecules(type) {
    switch (type) {
        case 'Molecule':
            if (Atoms > 9) {
                Molecules++;
                Atoms -= 10;
                WriteValues();
            }
            break;
        case 'Water':
            if (Atoms > 2) {
                Water_Molecules++;
                Atoms -= 3;
                WriteValues();
            }
            break;
        case 'Salt':
            if (Atoms > 1) {
                Salt_Molecules++;
                Atoms -= 2;
                WriteValues();
            }
            break;
        case 'Amino_Acids':
            if (Atoms > 8) {
                Amino_Acids++;
                Atoms -= 9;
                WriteValues();
            }
            break;
        case 'Proteins':
            if (Amino_Acids > 29) {
                Proteins++;
                Amino_Acids -= 30;
                WriteValues();
            }
            break;
    }
}

function Upgrade(number) {
    switch(number) {
        case 0:
            Atoms++;
            document.getElementById("GameAreaDiv").hidden = false;
            document.getElementById('Upgrade1').hidden = true;
            document.getElementById('Upgrade2').hidden = false;
            break;
        case 1:
            if (Atoms > 19) {
                Atoms -= 20;
                Molecules++;
                document.getElementById("CreateMolecules").hidden = false;
                document.getElementById("Molecules").hidden = false;
                document.getElementById('Upgrade2').hidden = true;
                document.getElementById('Upgrade3').hidden = false;
            }
            break;
        case 2:
            if (Molecules > 9) {
                Molecules -= 10;
                Water++;
                document.getElementById("CreateWater").hidden = false;
                document.getElementById("Water").hidden = false;
                document.getElementById('Upgrade3').hidden = true;
                document.getElementById('Upgrade4').hidden = false;
            }
            break;
        case 3:
            if (Molecules > 19) {
                Molecules -= 10;
                Salt++;
                document.getElementById("CreateSalt").hidden = false;
                document.getElementById("Salt").hidden = false;
                document.getElementById('Upgrade4').hidden = true;
                document.getElementById('Upgrade5').hidden = false;
            }
            break;
        case 4:
            if (Water_Molecules > 19 && Salt_Molecules > 4) {
                Water_Molecules -= 20;
                Salt_Molecules -= 5;
                interval = setInterval(Update, 1000);
                document.getElementById("Salt").hidden = true;
                document.getElementById("CreateSalt").hidden = true;
                document.getElementById("CreateWater").hidden = true;
                document.getElementById("Water").hidden = true;
                document.getElementById('Upgrade5').hidden = true;
                document.getElementById('Upgrade6').hidden = false;
            }
            break;
        case 5:
            if (Molecules > 29) {
                Molecules -= 30;
                document.getElementById("CreateAmino_Acids").hidden = false;
                document.getElementById("Amino_Acids").hidden = false;
                document.getElementById('Upgrade6').hidden = true;
                document.getElementById('Upgrade7').hidden = false;
            }
            break;
        case 6:
            if (Amino_Acids > 29) {
                Amino_Acids -= 30;
                Proteins++;
                document.getElementById("CreateProteins").hidden = false;
                document.getElementById("Proteins").hidden = false;
                document.getElementById('Upgrade7').hidden = true;
                document.getElementById('Upgrade8').hidden = false;
            }
            break;
        case 7:
            if (Molecules > 9 && Proteins > 9) {
                Molecules -= 10;
                Proteins -= 10;
                Multiplier++;
                document.getElementById('Upgrade8').hidden = true;
                document.getElementById('Upgrade9').hidden = false;
            }
            break;
        case 8:
            if (Proteins > 19) {
                Proteins -= 20;
                Multiplier++;
                document.getElementById('Upgrade9').hidden = true;
                document.getElementById('Upgrade10').hidden = false;
            }
            break;
        case 9:
            if (Proteins > 19 && Amino_Acids > 9) {
                Proteins -= 20;
                Amino_Acids -= 10;
                Multiplier++;
                document.getElementById('Upgrade10').hidden = true;
                //document.getElementById('Upgrade11').hidden = false;
                //document.getElementById('Upgrade12').hidden = false;
            }
            break;
        default:
            alert('what the hell?');
            break;
    }
    WriteValues();
}

function WriteValues() {
    document.getElementById("Atoms").innerHTML = 'Atoms: ' + Atoms;
    document.getElementById("Molecules").innerHTML = 'Molecules: ' + Molecules;
    document.getElementById("Water").innerHTML = 'Water: ' + Water_Molecules;
    document.getElementById("Salt").innerHTML = 'Salt: ' + Salt_Molecules;
    document.getElementById("Amino_Acids").innerHTML = 'Amino_Acids: ' + Amino_Acids;
    document.getElementById("Proteins").innerHTML = 'Proteins: ' + Proteins;
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