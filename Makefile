npm-install:
	docker run  --user 1000:1000 -v ${PWD}:/usr/src/app -w /usr/src/app node:16 npm install

npm-build:
	docker run  --user 1000:1000 -v ${PWD}:/usr/src/app -w /usr/src/app node:16 npm run build