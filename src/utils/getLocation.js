import { Locations } from "../constants/HospitalLocations"
export const getLocationInfo = (givenName)=>{
   if(!givenName) return
   const locationObj = Locations.filter(loc => loc.name === givenName)
   if(locationObj.length > 0){
      return Locations.filter(loc => loc.name === givenName)[0];
   }
}