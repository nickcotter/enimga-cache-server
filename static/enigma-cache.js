CryptoJS = require('crypto-js')


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


// listing

const getEntities = async (geokey) => {
    var xhr = new XMLHttpRequest();
    return new Promise(function (resolve, reject) {
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status >= 300) {
                    reject("Error, status code = " + xhr.status)
                } else {
                    resolve(xhr.responseText);
                }
            }
        }
        xhr.open('get', '/entities/'+geokey+'/list', true);
        xhr.send();
    });
};

const displayEntities = async (geokey) => {

    try {
        let entities = await getEntities(geokey);

        console.log('entities', entities);

    } catch(error) {
        console.log(error);
    }

};

const addNewEntity = (event) => {

    
};

const findLocation = (event) => {
    if (navigator.geolocation) {
        geoLookup((coords) => {
            document.getElementById("latitude").value = coords.latitude;
            document.getElementById("longitude").value = coords.longitude;


            var geokey = generateKey(coords);

            document.getElementById("geokey").value = geokey;

            displayEntities(geokey);

        }, (error) => { console.log('error:', error) });
    } else {
        alert("location finding not allowed");
    }
};