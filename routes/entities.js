var Datastore = require('nedb') , db = new Datastore();

var express = require('express');
var router = express.Router();

router.get('/:geokey/list', (req, res) => {

    var geokey = req.params.geokey;

    db.find({ geokey: geokey}, function (err, docs) {
        res.json(docs);
      });
});

router.get('/:geokey/:id', (req, res) => {

    var geokey = req.params.geokey;
    var id = req.params.id;

    db.findOne({ geokey: geokey, _id: id}, function (err, doc) {
        res.json(doc);
      });

});

router.post('/:geokey', function(req, res) {

    var geokey = req.params.geokey;
    var content = req.body;

    console.log('adding new entity', geokey, content);

    var entity = {
        geokey: geokey,
        content: content
    };

    db.insert(entity, function(err, savedEntity) {
        if(!err) {
            res.json({id: savedEntity._id});
        }
    });
});

router.put('/:geokey/:id', function(req, res) {

    var geokey = req.params.geokey;
    var id = req.params.id;
    var content = req.body;

    var updatedEntity = {

        geokey: geokey,
        _id: id,
        content: content
    };

    db.update({ geokey: geokey, _id: id }, updatedEntity, {}, function (err, numReplaced) {
    
        if(!err && numReplaced == 1) {
            res.sendStatus(200);
        } else {
            res.sendStatus(400);
        }
    });

});

module.exports = router;