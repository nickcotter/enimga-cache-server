# enimga-cache-server
A service to store data keyed by geographical coordinates


Building The Client JavaScript
-------------------------------

> browserify -r crypto-js -o static/crypto-js-bundle.js
> browserify -r escape-html -o static/escape-html-bundle.js


To Run Locally
--------------

> node server.js

Local Datastore Emulator
-------------------------

For full instructions see [here](https://cloud.google.com/datastore/docs/tools/datastore-emulator)

Run it via this script:

> ./local-datastore.sh

Then apply the environment variables before running node:

> $(gcloud beta emulators datastore env-init)


When finished with the emulator unset the variables:

> $(gcloud beta emulators datastore env-unset)


Docker
------

To build:

> ./build.sh

To run:

> ./run.sh


