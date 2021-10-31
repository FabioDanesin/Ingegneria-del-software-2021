# Ingegneria-del-software-2021
##Parametri di sviluppo: 
	- IDE usato: Visual Studio Code(JS), Android Studio(Java/Android)
	- Versione NPM: 5.6.0
	- Versione NodeJS: 10.0.0
# Setup Progetto
- Windows: 

	* Setup NPM:
 		Scaricare npm da [NPM download per windows](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm#windows-node-version-managers).
  	Se l'installer dà l'opzione scegliere la versione 5.6.0 . 
  	Se l'installer NON dà l'opzione, finire di installare e aggiungere NPM alle variabili di ambiente per poterlo chiamare dal prompt dei comandi e digitare ```npm install npm@5.6.0``` sul prompt dei comandi. 
  * Setup NodeJS:
  	Scaricare NodeJS da [Download per NodeJS 10.0.0](https://nodejs.org/download/release/v10.0.0/)
 
- Linux(Ubuntu/Debian): 
	* Setup NPM:
		Aprire il terminale e digitare ```sudo apt-get install npm```. Dopo aver installato, fare ```npm install -g npm@5.6.0```.
	* Setup NodeJS: 
		Aprire il terminale e digitare ```npm install -g n 10.0.0```
- Archlinux/Manjaro: 
	Idem a Linux Ubunti ma rimpiazza apt-get con pacman -Sy

- Tutte le altre distro di linux: 
	Usa Ubuntu
	
#Comune a tutti i sistemi:
	Dopo aver completato il setup di npm e Node, aprire un terminale nella cartella di Families_Share-Platform-Master e digitare ```npm install```.
	Per runnare il backend dev server, è possibile farlo da terminale digitando ```npm run dev-server``` o aprendo il file package.json, posizionare il mouse sopra  
	a "dev-server" sotto il tag "clients" e cliccare Run Script(o Debug Script) nella finestra a scomparsa che appare.
