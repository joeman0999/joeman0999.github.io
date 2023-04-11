window.onload = function () {
    var screenW = Math.max(document.body.scrollWidth, document.documentElement.offsetWidth, document.documentElement.clientWidth);
    var screenH = Math.max(document.body.scrollHeight, document.documentElement.offsetHeight, document.documentElement.clientHeight);
    var min = Math.min(screenW, screenH);
    var size = Math.floor(min * .85);
    Multiplier = size / 500;
    document.addEventListener('click', clickhandler);
}

function clickhandler(e) {
    e = e || window.event;
    var target = e.target;
    var location = null;
    if (GameType == "US") {
        if (target.attributes["data-name"] != undefined) {
            location = target.attributes["data-name"].value;
            if (document.getElementById("location").innerHTML == location) {
                target.style.fill = "green";
                score++;
                document.getElementById("score").innerHTML = "Points: " + score;
            } else {
                var map = document.getElementById("US");
                for (var i = 0; i < map.children.length; i++) {
                    if (map.children[i].attributes["data-name"] != undefined) {
                        if (map.children[i].attributes["data-name"].value == document.getElementById("location").innerHTML) {
                            map.children[i].style.fill = "red";
                            break;
                        }
                    }
                }
            }
            SetNewLocaiton();
        }
    } else {
        var map = document.getElementById("WORLD");
        if (target.attributes["name"] != undefined) {
            location = target.attributes["name"].value;
            if (document.getElementById("location").innerHTML == location) {
                target.style.fill = "green";
                score++;
                document.getElementById("score").innerHTML = "Points: " + score;
            } else {
                for (var i = 0; i < map.children.length; i++) {
                    if (map.children[i].attributes["name"] != undefined) {
                        if (map.children[i].attributes["name"].value == document.getElementById("location").innerHTML) {
                            map.children[i].style.fill = "red";
                            break;
                        }
                    }
                }
                for (var i = 0; i < map.children.length; i++) {
                    if (map.children[i].attributes["group"] != undefined) {
                        if (map.children[i].attributes["group"].value == document.getElementById("location").innerHTML) {
                            map.children[i].style.fill = "red";
                        }
                    }
                }
            }
            SetNewLocaiton();
        } else if (target.attributes["group"] != undefined) {
            location = target.attributes["group"].value;
            if (document.getElementById("location").innerHTML == location) {
                target.style.fill = "green";
                for (var i = 0; i < map.children.length; i++) {
                    if (map.children[i].attributes["group"] != undefined) {
                        if (map.children[i].attributes["group"].value == document.getElementById("location").innerHTML) {
                            map.children[i].style.fill = "green";
                        }
                    }
                }
                score++;
                document.getElementById("score").innerHTML = "Points: " + score;
            } else {

                for (var i = 0; i < map.children.length; i++) {
                    if (map.children[i].attributes["name"] != undefined) {
                        if (map.children[i].attributes["name"].value == document.getElementById("location").innerHTML) {
                            map.children[i].style.fill = "red";
                            break;
                        }
                    }
                }

                for (var i = 0; i < map.children.length; i++) {
                    if (map.children[i].attributes["group"] != undefined) {
                        if (map.children[i].attributes["group"].value == document.getElementById("location").innerHTML) {
                            map.children[i].style.fill = "red";
                        }
                    }
                }
            }
            SetNewLocaiton();
        }
    }
}

var answered = [];
var locations = {};
var score = 0;
var worldMap = {
    "AF": "Afghanistan",
    "AL": "Albania",
    "AB": "Antigua and Barbuda",
    "DZ": "Algeria",
    "AI": "Anguilla",
    "AN": "Angola",
    "AM": "Armenia",
    "AR": "Argentina",
    "AU": "Australia",
    "AW": "Aruba",
    "AS": "American Samoa",
    "AT": "Austria",
    "AZ": "Azerbaijan",
    "BH": "Bahamas",
    "BH": "Bahrain",
    "BD": "Bangladesh",
    "BB": "Barbados",
    "BY": "Belarus",
    "BE": "Belgium",
    "BZ": "Belize",
    "BJ": "Benin",
    "BM": "Bermuda",
    "BT": "Bhutan",
    "BO": "Bolivia",
    "BA": "Bosnia and Herzegovina",
    "BW": "Botswana",
    "BR": "Brazil",
    "VG": "British Virgin Islands",
    "BN": "Brunei Darussalam",
    "BG": "Bulgaria",
    "BF": "Burkina Faso",
    "BI": "Burundi",
    "CA": "Canada",
    "KH": "Cambodia",
    "CE": "Cameroon",
    "CF": "Central African Republic",
    "TD": "Chad",
    "CN": "China",
    "CI": "Cayman Islands",
    "CL": "Chile",
    "CM": "Comoros",
    "CO": "Colombia",
    "CR": "Costa Rica",
    "HR": "Croatia",
    "CU": "Cuba",
    "CV": "Cape Verde",
    "CW": "Curaçao",
    "CY": "Cyprus",
    "CZ": "Czech Republic",
    "CI": "Côte d'Ivoire",
    "KP": "Dem. Rep. Korea",
    "CD": "Democratic Republic of the Congo",
    "DN": "Denmark",
    "DJ": "Djibouti",
    "DM": "Dominica",
    "DO": "Dominican Republic",
    "EC": "Ecuador",
    "EG": "Egypt",
    "SV": "El Salvador",
    "GQ": "Equatorial Guinea",
    "ER": "Eritrea",
    "EE": "Estonia",
    "ET": "Ethiopia",
    "FI": "Finland",
    "FG": "Fiji",
    "FA": "France",
    "GF": "French Guiana",
    "GA": "Gabon",
    "GE": "Georgia",
    "DE": "Germany",
    "GH": "Ghana",
    "GL": "Greenland",
    "GD": "Grenada",
    "GU": "Guam",
    "GT": "Guatemala",
    "GN": "Guinea",
    "GR": "Greece",
    "GW": "Guinea-Bissau",
    "GY": "Guyana",
    "HT": "Haiti",
    "HN": "Honduras",
    "HU": "Hungary",
    "IS": "Iceland",
    "IN": "India",
    "IO": "Indonesia",
    "IR": "Iran",
    "IQ": "Iraq",
    "IE": "Ireland",
    "IL": "Israel",
    "IT": "Italy",
    "JM": "Jamaica",
    "JA": "Japan",
    "JO": "Jordan",
    "KZ": "Kazakhstan",
    "KE": "Kenya",
    "XK": "Kosovo",
    "KW": "Kuwait",
    "KG": "Kyrgyzstan",
    "LA": "Lao PDR",
    "LV": "Latvia",
    "LB": "Lebanon",
    "LS": "Lesotho",
    "LR": "Liberia",
    "LY": "Libya",
    "LT": "Lithuania",
    "LU": "Luxembourg",
    "MO": "Malaysia",
    "MJ": "Mauritius",
    "MK": "Macedonia",
    "MG": "Madagascar",
    "MI": "Micronesia",
    "MW": "Malawi",
    "MV": "Maldives",
    "ML": "Mali",
    "MH": "Marshall Islands",
    "MQ": "Martinique",
    "MR": "Mauritania",
    "MT": "Malta",
    "YT": "Mayotte",
    "MX": "Mexico",
    "MD": "Moldova",
    "MN": "Mongolia",
    "ME": "Montenegro",
    "MS": "Montserrat",
    "MA": "Morocco",
    "MZ": "Mozambique",
    "MM": "Myanmar",
    "NA": "Namibia",
    "NR": "Nauru",
    "NP": "Nepal",
    "NL": "Netherlands",
    "NI": "Nicaragua",
    "NE": "Niger",
    "NG": "Nigeria",
    "NZ": "New Zealand",
    "NO": "Norway",
    "OM": "Oman",
    "PK": "Pakistan",
    "PW": "Palau",
    "PS": "Palestine",
    "PA": "Panama",
    "PN": "Papua New Guinea",
    "PY": "Paraguay",
    "PE": "Peru",
    "PH": "Philippines",
    "PL": "Poland",
    "PT": "Portugal",
    "QA": "Qatar",
    "CG": "Republic of Congo",
    "KR": "Republic of Korea",
    "RE": "Reunion",
    "RO": "Romania",
    "RU": "Russia",
    "RW": "Rwanda",
    "LC": "Saint Lucia",
    "VC": "Saint Vincent and the Grenadines",
    "BL": "Saint-Barthélemy",
    "MF": "Saint-Martin",
    "SA": "Saudi Arabia",
    "SE": "Seychelles",
    "SN": "Senegal",
    "RS": "Serbia",
    "SL": "Sierra Leone",
    "SM": "Solomon Islands",
    "SK": "Saint Kitts and Nevis",
    "SX": "Sint Maarten",
    "SK": "Slovakia",
    "SI": "Slovenia",
    "SO": "Somalia",
    "ZA": "South Africa",
    "SS": "South Sudan",
    "ES": "Spain",
    "LK": "Sri Lanka",
    "SD": "Sudan",
    "SR": "Suriname",
    "ST": "São Tomé and Principe",
    "SZ": "Swaziland",
    "SE": "Sweden",
    "CH": "Switzerland",
    "SY": "Syria",
    "TW": "Taiwan",
    "TJ": "Tajikistan",
    "TZ": "Tanzania",
    "TH": "Thailand",
    "GM": "The Gambia",
    "TL": "Timor-Leste",
    "TG": "Togo",
    "TO": "Tonga",
    "TN": "Tunisia",
    "TM": "Turkmenistan",
    "TR": "Trinidad and Tobago",
    "TU": "Turkey",
    "TV": "Tuvalu",
    "UG": "Uganda",
    "UA": "Ukraine",
    "AE": "United Arab Emirates",
    "UK": "United Kingdom",
    "US": "United States",
    "UY": "Uruguay",
    "UZ": "Uzbekistan",
    "VE": "Venezuela",
    "VA": "Vanuatu",
    "VN": "Vietnam",
    "EH": "Western Sahara",
    "YE": "Yemen",
    "ZM": "Zambia",
    "ZW": "Zimbabwe"
}

var USMap = {
    "MA": "Massachusetts",
    "MN": "Minnesota",
    "MT": "Montana",
    "ND": "North Dakota",
    "HI": "Hawaii",
    "ID": "Idaho",
    "WA": "Washington",
    "AZ": "Arizona",
    "CA": "California",
    "CO": "Colorado",
    "NV": "Nevada",
    "NM": "New Mexico",
    "OR": "Oregon",
    "UT": "Utah",
    "WY": "Wyoming",
    "AR": "Arkansas",
    "IA": "Iowa",
    "KS": "Kansas",
    "MO": "Missouri",
    "NE": "Nebraska",
    "OK": "Oklahoma",
    "SD": "South Dakota",
    "LA": "Louisiana",
    "TX": "Texas",
    "CT": "Connecticut",
    "NH": "New Hampshire",
    "RI": "Rhode Island",
    "VT": "Vermont",
    "AL": "Alabama",
    "FL": "Florida",
    "GA": "Georgia",
    "MS": "Mississippi",
    "SC": "South Carolina",
    "IL": "Illinois",
    "IN": "Indiana",
    "KY": "Kentucky",
    "NC": "North Carolina",
    "OH": "Ohio",
    "TN": "Tennessee",
    "VA": "Virginia",
    "WI": "Wisconsin",
    "WV": "West Virginia",
    "DE": "Delaware",
    "MD": "Maryland",
    "NJ": "New Jersey",
    "NY": "New York",
    "PA": "Pennsylvania",
    "ME": "Maine",
    "MI": "Michigan",
    "AK": "Alaska"
}

var GameType = null;

function New_Game(type) {
    document.getElementById("Menu").hidden = true;
    document.getElementById("ButtonArea").hidden = false;
    var map;
    if (type == "US" || GameType == "US") {
        GameType = "US";
        locations = USMap;
        map = document.getElementById("US");
    } else {
        GameType = "WORLD";
        locations = worldMap;
        map = document.getElementById("WORLD")
    }
    map.style.display = "inline";
    for (var i = 0; i < map.children.length; i++) {
        map.children[i].style.fill = "#f9f9f9";
    }
    var length = Object.keys(locations).length;
    answered = new Array(length);
    for (var i = 0; i < length; i++) {
        answered[i] = false;
    }
    score = 0;
    document.getElementById("score").innerHTML = "Points: 0";
    SetNewLocaiton();
}

function Menu() {
    GameType = null;
    document.getElementById("ButtonArea").hidden = true;
    document.getElementById("Menu").hidden = false;
    document.getElementById("WORLD").style.display = "none";
    document.getElementById("US").style.display = "none";
}

function SetNewLocaiton() {
    var options = [];
    for (var i = 0; i < answered.length; i++) {
        if (answered[i] == false) {
            options.push(i);
        }
    }
    if (options.length > 0) {
        var option = options[Math.floor(Math.random() * options.length)];
        answered[option] = true;
        document.getElementById("location").innerHTML = locations[Object.keys(locations)[option]];
    } else {
        alert("Game Over you scored " + score + " points!!");
    }
}