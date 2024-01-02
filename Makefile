npm-install:
	docker run -v ${PWD}:/usr/src/app -w /usr/src/app node:20 npm install

npm-build:
	docker run -v ${PWD}:/usr/src/app -w /usr/src/app node:20 npm run build