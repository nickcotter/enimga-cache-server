CryptoJS = require('crypto-js')


// visual stuff

const show = (elem) => {
	elem.style.display = 'block';
};

const hide = (elem) => {
	elem.style.display = 'none';
};


const removeChildren = (id) => {
    const parentNode = document.getElementById(id);
    while(parentNode.firstChild) {
        parentNode.removeChild(parentNode.lastChild);
    }
};

// encryption

const generateKey = (coordinates) => {

    const plainKey = coordinates.latitude + ":" + coordinates.longitude;

    return btoa(CryptoJS.SHA256(plainKey));
};


// geo location

const localCoordinates = (position) => {

    return {
        latitude: position.coords.latitude.toFixed(4),
        longitude: position.coords.longitude.toFixed(4)
    }
};

const geoLookup = (successCallback, errorCallback) => {

    navigator.geolocation.getCurrentPosition(
        (position) => {
            successCallback(localCoordinates(position));
        },
        (error) => {
            errorCallback(error);
        }
    );
};

// ui

const addEntityToList = (entity) => {

    console.log('adding entity to list', entity);

    const listNode = document.getElementById("entryList");

    const titleNode = document.createElement("dt");
    titleNode.appendChild(document.createTextNode(entity.content.title));

    const textNode = document.createElement("dd");
    textNode.appendChild(document.createTextNode(entity.content.text));

    listNode.appendChild(titleNode);
    listNode.appendChild(textNode);
};

const loadEntities = async (geokey) => {

    console.log("loading entities for geokey", geokey);

    removeChildren("entryList");

    let response = await fetch("/entities/" + geokey + "/list");
    let entities = await response.json();

    entities.forEach(addEntityToList);

    console.log("loaded " + entities.length + " entities");
};

const geokeyLoaded = async (geokey) => {

    Array.from(document.getElementsByClassName("geokeyDependent")).forEach(show);

    document.getElementById("geokey").value = geokey;
    
    await loadEntities(geokey);

};

const addNewEntity = async (event) => {

    console.log('adding new entity');

    const title = document.getElementById("titleField").value;
    const text = document.getElementById("textArea").value;
    const geokey = document.getElementById("geokey").value;

    const content = {
        title: title,
        text: text
    };

    let response = await fetch("/entities/" + geokey, {
        method: 'post',
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          },
        body: JSON.stringify(content)
    });

    let result = await response.json();

    console.log("new entity id", result);

    resetAddNewEntityForm();

    await loadEntities(geokey);
};

const resetAddNewEntityForm = () => {
    document.getElementById("titleField").value = "";
    document.getElementById("textArea").value = "";
    document.querySelector('#addNewButton').disabled = true;
};

const checkAddNewAllowed = (event) => {

    const button = document.querySelector('#addNewButton');

    const title = document.getElementById("titleField").value;
    const text = document.getElementById("textArea").value;

    if(title && text) {
        button.disabled = false;
    } else {
        button.disabled = true;
    }
};

const findLocation = (event) => {
    if (navigator.geolocation) {
        geoLookup((coords) => {
            document.getElementById("latitude").value = coords.latitude;
            document.getElementById("longitude").value = coords.longitude;

            const geokey = generateKey(coords);

            geokeyLoaded(geokey);

        }, (error) => { console.log('error:', error) });
    } else {
        alert("location finding not allowed");
    }
};