import GoogleMapsLoader = require("google-maps");

export function initializeGoogleMaps(){
  return () => {
    GoogleMapsLoader.KEY = "AIzaSyBCptJVdxT9qytWXFkm4cVfXa6qdDWOncI";
    if (typeof (localStorage.getItem("set_lng")) == "undefined" || localStorage.getItem("set_lng") == "" || localStorage.getItem("set_lng") == null) {
      GoogleMapsLoader.LANGUAGE = 'en';
      GoogleMapsLoader.REGION = 'GB';
    } else {
      GoogleMapsLoader.LANGUAGE = localStorage.getItem("set_lng");
      GoogleMapsLoader.REGION = localStorage.getItem('set_location');
    }
    console.log("initializeGoogleMaps");
    GoogleMapsLoader.LIBRARIES = ['places'];
    console.log(GoogleMapsLoader);
    return new Promise<void>(resolve => GoogleMapsLoader.load(() => {
      resolve();
    }));
  }
}

export function initializeUserGeoposition(provider){
  return ()=>{
    return new Promise((resolve, reject) => {    
      resolve();
    });
  }
}
