all:
	mvn clean install -DskipTests

clean:
	mvn clean
	rm -rf src/main/webapp/node_modules
	rm -rf src/main/resources/assets

build: clean
	cd src/main/webapp && npm install
	make patch
	cd src/main/webapp && npm run build
	mvn install -DskipTests

deploy:
	scp target/backoffice-1.0-SNAPSHOT.jar rafael@backoffice.legendatours.com:.

test:
	mvn test

run:
	mvn exec:java -Dexec.mainClass="com.legendatours.MainApplication" -Dexec.args="server config.yml"

run-jar:
	java -jar target/backoffice-1.0-SNAPSHOT.jar server config.yml 

dumpdb:
	ssh rafael@backoffice.legendatours.com "pg_dump -h 127.0.0.1 -U postgres -c legendatours" | psql -U postgres -W legendatours -

patch:
	sed -i 's/componentWillMount/UNSAFE_componentWillMount/g' src/main/webapp/node_modules/react-rte/dist/react-rte.js
	sed -i 's/componentWillReceiveProps/UNSAFE_componentWillReceiveProps/g' src/main/webapp/node_modules/react-rte/dist/react-rte.js
	sed -i 's/componentWillUpdate/UNSAFE_componentWillUpdate/g' src/main/webapp/node_modules/react-rte/dist/react-rte.js
