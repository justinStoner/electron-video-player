const Config = require('electron-config');
const elec = new Config();

const defaults={
  'skipBack':10,
  'skipForward':30,
  'scrollAmount':1
}
if(elec.get('configSet')!=true){
  for(prop in defaults){
    elec.set(prop, defaults[prop])
  }
  elec.set('configSet', true)
}
