import resolvePromise from "./resolvePromise.js";
import firebase from 'firebase/app';
import "firebase/database";
import { getHotels, getHotelsReview } from "./geoSource.js";

class TravelBuddyModel {

  accommodationList;
  currentAccommodationID;
  locationToLng;
  locationToLat;
  LocationTo;
  currentFlight;
  searchParams;
  searchResultsPromiseState;
  currentAccPromiseState;
  currentAccReviews;
  accPhotos;
  currentAccPhoto;
  startDate;
  endDate;
  photoIndex;
  observers;
  position;

  constructor(accArray = [], flightArray=[], activityArray = [], currentAccommodation){
    this.accommodationList = [];
    this.observers = [];
    this.startDate = {};
    this.endDate = {};
    this.searchParams = {};
    this.searchResultsPromiseState = {};
    this.currentAccPromiseState = {};
    this.currentAccReviews= [];
    this.accPhotos = [];
    this.currentAccommodationID = currentAccommodation;
    this.accomondations = accArray; 
    this.flights = flightArray;
    this.activities = activityArray;
    this.currentAccPhoto = [];
    this.photoIndex = 0;
    this.locationToLat = 59.334591;
    this.locationToLng = 18.063240;

  }
  setSearchLongQuery(long){this.searchParams.query.longitute=long}
  setSearchLatQuery(lat){this.searchParams.query.latitute=lat}

  addObserver(callback) {
      this.observers = [...this.observers, callback];
  }


  removeObserver(callback) {
      function removeCallbackCB(element) {
          if(element !== callback) return true;
          return false;
      }

      this.observers = this.observers.filter(removeCallbackCB);
  }

  notifyObservers(payload) {
    console.log(this.observers);
      this.observers.forEach(
          function invokeObserverCB(obs) { 
              try {
                  obs(payload);
              }catch(err) {
                  console.error(err);
              }
          }
      )
  }

  /**
   * Set current location.
   * @param {*} query 
   */
  setCurrentLocation(from){
    this.searchParams.from = from;
  }

  /**
   * Set destination of users choice.
   * @param {*} query 
   */
  setSearchDestination(to){
    this.searchParams.to = to;
  }
  setPosition(arr){
    this.position = arr;
    console.log("Position array:" + this.position);
  }

  doSearch(){
    
    let fromOkey = true;
    let toOkey = true;

    // try because empty or wrong params in search input will crash this function 
    try {
      console.log("from: " + this.searchParams.from);
      console.log("to: " + this.searchParams.to);

      let from = this.searchParams.from.toLowerCase();
      let to = this.searchParams.to.toLowerCase();

      let fromSnapshot;
      let toSnapshot;

      // Get info about From location
      const promiseClusterFuck = new Promise((resolve, reject) => {
        firebase.database().ref("Cities").child(from).get().then((snapshot) => {
          if(snapshot.exists()) {
            console.log("snap 1" + snapshot.val());
            fromSnapshot = snapshot.val();
            resolve(fromSnapshot);
          } else {
            console.log("No data available");
            fromOkey = false;
            reject(null);
          }
        }).catch((error) => {
          console.error(error);
          fromOkey = false;
          reject(null);
        })
      }).then((value) => {
        // Get info about To location 
        console.log("getFrom value "+value);
        const result = []
        result[0] = value;
        return new Promise((resolve, reject) => {
        firebase.database().ref("Cities").child(to).get().then((snapshot) => {
          if(snapshot.exists()) {
            console.log("snap 2: " + snapshot.val());
            toSnapshot = snapshot.val();
            result[1] = toSnapshot;
            resolve(result);
          } else {
            console.log("No data available");
            toOkey = false;
            reject(null);
          }
        }).catch((error) => {
          console.error(error);
          toOkey = false;
          reject(null);
        })});
      }).then((value) => {
        this.setLat(value[1].lat);
        this.setLng(value[1].lng);
        this.notifyObservers();
        window.location.hash="activities"
      
        //console.log("startdate: " + this.startDate + "enddate: " +  this.endDate + "to lat: " + value[1].lat + "to lng" + value[1].lng);
        //this.setPosition([this.locationToLat,this.locationToLng]);
        // if(this.startDate &&  this.endDate && this.locationToLat && this.locationToLng){
        //   // REQUIRES OBJECT {startDate, endDate, lat, lng}
        //   getHotels({startDate: this.startDate, endDate: this.endDate, lat: this.locationToLat, lng: this.locationToLng})
        //   .then(response => response.json())
        //   .then(response => { // Response is query.json, response.result contains hotels.
        //           console.log(response);
        //           this.setAccommodationList(response.result);
        //           firebase.database().ref("model/accommodationList").set(this.accommodationList);
        //           this.notifyObservers();
        //           window.location.hash = "hotels";
        //           }
        //     ).catch(err => console.error(err));
        // }
      });

      // const theModel = this;
      // function notifyACB(){
      //   theModel.notifyObservers();
      // }
      // resolvePromise(promiseClusterFuck, this.searchResultsPromiseState, notifyACB);

    } catch(error) {
      console.log("Error in doSearch: " + error);
      fromOkey = false;
      toOkey = false;
      // FIX: Reroute back to search (or dont reroute until results are given from this function)
    }
  }

  setLat(lat){
    this.locationToLat = lat;
    console.log("Position latii:" +this.locationToLat);
 
   
    firebase.database().ref("model/locationToLat").set( this.locationToLat);
   

  }
  setLng(lng){
    this.locationToLng = lng;
    console.log("Position longiii:" +  this.locationToLng);
    firebase.database().ref("model/locationToLng").set(this.locationToLng);

  }

  setStartDate(date){
    this.startDate = date;
  }

  setAccommodationList(l){
    this.accommodationList = l;
  }

  setEndDate(date){
    this.endDate = date; 
  }

  /**
   * Accomondation currently checked by user.
   */
  setCurrentAccomodationID(id){
    this.currentAccommodationID=id;
    firebase.database().ref("model/currentAccommodationID").set(this.currentAccommodationID);
    
  }
  setAccomodationReviews(list){
    this.currentAccReviews=list;
    firebase.database().ref("model/currentAccReviews").set(this.currentAccReviews);
    
  }
  setAccomodationPhotos(list){
    this.accPhotos=list;
    firebase.database().ref("model/accPhotos").set(this.accPhotos);
    
  }

  setPhotoIndex(index){
    this.photoIndex = index;
      firebase.database().ref("model/photoIndex").set(this.photoIndex);
  }

  setCurrentAccPhoto(){
    //if(this.photoIndex !== index || index === 0){
      this.currentAccPhoto = this.accPhotos[0];
      firebase.database().ref("model/currentAccPhoto").set(this.currentAccPhoto);
      this.notifyObservers();
      // console.log("index:" + this.photoIndex);
      // console.log(this.currentAccPhoto);
    //}
    //else console.log("fel foto index: "+this.photoIndex);
    

  }
  viewDetailsOfAccomodation(id){
    if(id !== this.currentAccommodationID){
    let arr = [];
      Promise.all(getHotelsReview(id)).then(function(responses){
        return  Promise.all(responses.map(response => {return response.json()}))
      }
       
      ).then(responses => {
            this.setCurrentAccomodationID(id);
            this.setAccomodationReviews(responses[0].result);
            arr = responses[1].map(({url_max}) => url_max); 
            this.setAccomodationPhotos(arr);
            this.setPhotoIndex(0)
            this.setCurrentAccPhoto();
          //   console.log(this.currentAccReviews);
          //  console.log("photos array:");
          //   console.log(this.accPhotos);
          //  console.log("current photo:");
          // console.log(this.currentAccPhoto);
            this.notifyObservers();
            window.location.hash="#details_acc";
        }
      ).catch(error => console.log(error));
     
     // resolvePromise(getHotelsReview(id), this.currentAccPromiseState, notifyACB);
    } else { window.location.hash="#details_acc"; }
  }



  /**
   * Add accomondation to list.
   */
  addToAccommodation(){
    //TODO 
  }

  /**
   * Remove accommodation from list.
   */
  removeFromAccommodation(){
    //TODO
  }

  /**
   * Acitivity currently checked by user.
   */
  setCurrentActivity(){
    //TODO
  }

  /**
   * Add activity to list.
   */
  addToActivities(){
  //TODO
  }

  /**
   * Remove activity from list.
   */
  removeFromActivities(){
    //TODO
  }

  /**
   * Flight currently checked by user.
   */
  setCurrentFlight(){
    //TODO
  }

}


export default TravelBuddyModel;