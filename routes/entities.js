import { v4 as uuidv4 } from 'uuid';

const {Datastore} = require('@google-cloud/datastore');
const datastore = new Datastore();

var express = require('express');
var router = express.Router();


const getEntities = (geokey) => {
    const query = datastore
      .createQuery('EnigmaCache', 'Entity')
      .filter('geokey', geokey);

    return datastore.runQuery(query);
};

router.get('/:geokey/list', async (req, res) => {

    var geokey = req.params.geokey;

    const [entities] = await getEntities(geokey);

    res.json(entities).end();
});

const getEntity = (id, geokey) => {
    const query = datastore
      .createQuery('EnigmaCache', 'Entity')
      .filter('geokey', geokey)
      .filter('id', id);

    return datastore.runQuery(query);
};

router.get('/:geokey/:id', async (req, res) => {

    var geokey = req.params.geokey;
    var id = req.params.id;

    const [entities] = await getEntity(id, geokey);

    if(!entities || entities.length == 0) {
        res.status(404).end();
    } else{
        res.json(entities[0]).end();
    }

});


const addEntity = (id, geokey, content) => {

    return datastore.save({
        key: datastore.key({namespace: 'EnigmaCache', path: ["Entity", id]}),
        data: {
            id: id,
            geokey: geokey,
            content: content
        }
    });
};

router.post('/:geokey', async (req, res) => {

    var geokey = req.params.geokey;
    var content = req.body;

    const id = uuidv4();
    
    await addEntity(id, geokey, content);

    res.json({id: id}).end();
});

const updateEntity = (id, geokey, content) => {

    return datastore.update({
        key: datastore.key({namespace: 'EnigmaCache', path: ["Entity", id]}),
        data: {
            id: id,
            geokey: geokey,
            content: content
        }
    });
};

router.put('/:geokey/:id', async (req, res) => {

    var geokey = req.params.geokey;
    var id = req.params.id;
    var content = req.body;

    // disabled https://github.com/nickcotter/enimga-cache-server/issues/3
    // await updateEntity(id, geokey, content);

    res.status(200).end();
});

module.exports = router;