"use strict";

//fetch wordpress API posts

fetch("https://maestrobets.com/wp-json/wp/v2/posts?_embed")
  .then(function(response) {
    return response.json();
  })
  .then(function(posts) {
    // appendPosts(posts);
    getPosts(posts);
    updateData(posts);

  });
//fetch wordpress API featured posts
fetch('https://maestrobets.com/wp-json/wp/v2/posts?_embed&categories=13')
  .then(function(response) {
    return response.json();
  })
  .then(function(featuredPost) {
    setFeaturedPost(featuredPost);
  });

// Animation init
AOS.init({
  duration: 500
});

// change header style on scroll
$(window).scroll(() => {
  let scroll = $(window).scrollTop();
  if (scroll > 100) {
    $("header").addClass("header-scrolled");
  } else {
    $("header").removeClass("header-scrolled");
  }
});


// array storing posts
let postsContainer = [];

// Get and store the posts untill needed
let getPosts = posts => {
  for (let post of posts) {
    postsContainer.push(post);
  }
}
// set Featured post
let setFeaturedPost = featuredPost => {
  let htmlTemplate = "";
  for (let featPost of featuredPost) {
    htmlTemplate += markUp(featPost);
  }
  document.querySelector('#featured').innerHTML = `<h4>Featured Lounges</h4> ${htmlTemplate}`;

}

/*------------------- CARDS MARKUP ------------------- */
let markUp = post => `
        <div class="row" data-aos="fade-up">
    <div class="col s12 m6  ">
      <div class="card secondary-color-bg z-depth-3">
       <div class="card-image" data-link = "${post.slug}" onclick="getLoungePage(this)">
          <img src="${post.acf.img}">
          <span class="card-title yellow-text text-darken-3"> ${post.acf.name}</span>
          <a class="btn-floating halfway-fab waves-effect waves-light accent-color-bg floating-map-btn z-depth-3" href="http://maps.google.com/?q=${post.acf.coordinates.lat},${post.acf.coordinates.lng}" ><i class="material-icons">map</i></a>
        </div>
        <div class="card-content">
          <p class="white-text"><i class="material-icons icon-small">near_me</i> ${post.acf.address}, ${post.acf.city}</p>
          <p class="white-text truncate"><i class="material-icons icon-small">loyalty</i> ${post.acf.brands}</p>
          <p class="white-text"><i class="material-icons icon-small">local_atm</i> ${post.acf.price} DKK</p>
        </div>
      </div>
    </div>
    </div>
          `


/*------------------- LOUNGE PAGES ------------------- */
let getLoungePage = obj => {
  //gets the data-ling attribute value from the clicked post
  let link = `https://maestrobets.com/wp-json/wp/v2/posts?slug=${obj.getAttribute("data-link")}`
  //fetches the post from wordpress
  fetch(link)
    .then(response => {
      return response.json();
    })
    .then(posts => {
      //calls function with lounge page markup
      loungePage(posts);

    });

}
//lounge page html markup
let loungePage = post => {
  let htmlTemplate = `<div class="row no-margin ">
  <div class="col s12 m6 no-padding">
  <div class="card secondary-color-bg no-margin">
  <div class="card-image" data-link = "${post[0].slug}">

    <img src="${post[0].acf.img}">
    <span class="card-title yellow-text text-darken-3" id="lounge-name"> ${post[0].acf.name}</span>
    <a class="btn-floating halfway-fab waves-effect waves-light accent-color-bg floating-map-btn z-depth-3" href="http://maps.google.com/?q=${post[0].acf.coordinates.lat},${post[0].acf.coordinates.lng}" ><i class="material-icons">map</i></a>
  </div>
  <div class="card-content">
    <p class="card-text"><i class="material-icons icon-small">near_me</i> ${post[0].acf.address}, ${post[0].acf.city}</p>
    <p class="card-text"><i class="material-icons icon-small">loyalty</i> ${post[0].acf.brands}</p>
    <p class="white-text"><i class="material-icons icon-small">local_atm</i> ${post[0].acf.price} DKK</p>
    <p class="card-text"><i class="material-icons icon-small">today</i> ${post[0].acf.working_days}</p>
    <p class="card-text"><i class="material-icons icon-small">timer</i> ${post[0].acf.working_hours}</p>
  </div>
  </div>
  <div><ul class="collapsible no-margin" id="lounge-collapsible">
  <li>
    <div class="collapsible-header secondary-color-bg white-text"><i class="material-icons">menu_book</i>Flavours menu</div>
    <div class="collapsible-body black white-text" ><ul id="flavours-menu"></ul></div>
  </li>

</ul></div>
<div id="lounge-content">${post[0].content.rendered}</div>

<form class="col s12 secondary-color-bg z-depth-4" id="rate-lounge">
  <div class="row">
  <div class="input-field col s12 right-align" id="star-rating-wrapper">
    <span class="star-rating">
      <input type="radio" name="getRating" value="1"><i></i>
      <input type="radio" name="getRating" value="2"><i></i>
      <input type="radio" name="getRating" value="3"><i></i>
      <input type="radio" name="getRating" value="4"><i></i>
      <input type="radio" name="getRating" value="5"><i></i>
    </span>
  </div>
    <div class="input-field col s12" id="textarea-container">
    <textarea id="rate-comment" class="white-text"></textarea>
        <label id="textarea-label" for="rate-comment">Your comment</label>
    </div>

    <div class="input-field col s3">
    <button onclick="rate()" id="submit-rate" class="btn accent-color-bg waves-effect waves-light" type="button" >Submit
    <i class="material-icons right">send</i>
  </button>
    </div>
  </div>
</form>

<div class="clearfix"></div>
<div>
<ul class="collection no-border no-margin" id="comments">
</ul>
</div>
  </div>
  </div>`;
  document.querySelector('#lounge-page').innerHTML = htmlTemplate;
  loungeName = document.querySelector("#lounge-name").innerHTML;

  //cycles through all the flavours and appends them to the page
  let flavoursAvailable = post[0].acf.flavours;
  for (let flavour of flavoursAvailable) {
    document.querySelector('#flavours-menu').innerHTML += `<li><i class="fas fa-apple-alt"></i> ${flavour}</li>`
  }
  updateComments();
  //adds a new collapsible element from materialize
  let collapsibleElements = document.querySelectorAll('#lounge-collapsible');
  let collapsibleInstances = M.Collapsible.init(collapsibleElements);

  //shows page and scrolls it to the top
  $("#home").hide();
  $(document).scrollTop();
  showLoader(500);
  $("#lounge-page").show();
  $("#backBtn").removeClass("hidel");
  location.href = `#lounge`;
}
let comments = rate => {
  let responseRate = rate.rating;
  let responseComment = rate.comment;
  let responseUser = rate.userid;
  let avatar = '';

  if (responseRate <= 2) {
    avatar = `<i class="material-icons circle red" id="avatar">sentiment_dissatisfied</i>`
  } else if (responseRate >= 3 && responseRate <= 4) {
    avatar = `<i class="material-icons circle green lighten-2" id="avatar">sentiment_satisfied</i>`
  } else {
    avatar = `<i class="material-icons circle green darken-2" id="avatar">mood</i>`
  }


  document.querySelector('#comments').innerHTML += `
        <li class="collection-item avatar black white-text">
          ${avatar}
          <span class="title accent-color" id="display-comment-userid">${responseUser}</span>
          <p id="display-comment">${responseComment}</p>
          <a href="#!" class="secondary-content accent-color">${responseRate}<i class="material-icons">grade</i></a>
        </li>
      `
};

/*------------------- SEARCHES AND AUTOCOMPLETES ------------------- */

//stores data for search
let autocompleteData = {};
let cityData = {};
//updates data for search based on searchable variables from wordpress posts (brands,name,flavours)
let updateData = posts => {
  for (let lounge of posts) {
    let name = lounge.acf.name;
    let brands = lounge.acf.brands;
    let flavours = lounge.acf.flavours;
    let city = lounge.acf.city;

    //add names
    autocompleteData[name] = 'images/lounge.png';
    //add brands
    for (let brand of brands) {
      autocompleteData[brand] = 'images/brand.png';
    }
    // add flavours
    for (let flavour of flavours) {
      autocompleteData[flavour] = 'images/apple.png';
    }
    //add cities
    cityData[city] = 'images/location.png';
  }
}


/*------------------- CITY SEARCH ------------------- */


document.addEventListener('DOMContentLoaded', () => {
  //autocomplete date
  let autocompleteOptions = {
    data: cityData,
    //on autocomplete swithces off user location, clears search and saves input to variable
    onAutocomplete: () => {
      locationChecked = false;
      $("#show-nearby-switch").removeClass("location-active");
      document.querySelector('#search-input').value = '';
      let input = document.querySelector("#city-input").value.toLowerCase();

      //displays the results
      let htmlTemplate = "";
      for (let post of postsContainer) {
        if (input.includes(post.acf.city.toLowerCase())) {
          htmlTemplate += markUp(post);
        }
      }
      document.querySelector('#search-lounges').innerHTML = `
      <div class="center-align">
        <a onclick="clearSearch();" class="waves-effect waves-red btn-small center-align transparent border">
          <i class="material-icons left red-text">close</i>Clear Search
          </a>
      </div>
      <h4>Lounges in ${input}</h4>
       ${htmlTemplate}`;
      $("#search-results").show();
      $("#featured").hide();
    }
  }
  //initializes materialize autocomplete element on city search
  let autocompleteElem = document.querySelectorAll('#city-input');
  let autocompleteInstances = M.Autocomplete.init(autocompleteElem, autocompleteOptions);
});

//city search end

/*------------------- SEARCH ------------------- */

//initializes autocomplete with data for search field
document.addEventListener('DOMContentLoaded', () => {
  let autocompleteOptions = {
    data: autocompleteData,
    onAutocomplete: () => {
      let input = document.querySelector("#search-input").value.toLowerCase();
      searchLounges(input);
    }
  }
  let autocompleteElem = document.querySelectorAll('#search-input');
  let autocompleteInstances = M.Autocomplete.init(autocompleteElem, autocompleteOptions);
});

//Search lounges on different variables
let searchLounges = value => {
  let htmlTemplate = '';
  let cityInput = document.querySelector("#city-input").value;
  //prevent function if input is less than 2, to fix showing lounges multiple times
  if (value.length < 2) {
    return false;
  }
  //cycles through lounges
  for (let lounge of postsContainer) {
    let name = lounge.acf.name.toLowerCase();
    let brands = lounge.acf.brands;
    let flavours = lounge.acf.flavours;
    let city = lounge.acf.city;
    //check name
    if (name.includes(value.toLowerCase())) {
      //if location is on, show only nearby results (<= 30km)
      if (locationChecked) {
        let latLngA = new google.maps.LatLng(userPosition);
        let latLngB = new google.maps.LatLng(lounge.acf.coordinates.lat, lounge.acf.coordinates.lng);
        let distance = google.maps.geometry.spherical.computeDistanceBetween(latLngA, latLngB);
        if (distance <= 30000) {
          htmlTemplate += markUp(lounge);
        }
        //else if city input is empty or matching the lounge city, display as result
      } else if (cityInput === city || cityInput === '') {
        htmlTemplate += markUp(lounge);
      }
    }
    //check brand
    for (let brand of brands) {
      if (brand.toLowerCase().includes(value.toLowerCase())) {
        if (locationChecked) {
          let latLngA = new google.maps.LatLng(userPosition);
          let latLngB = new google.maps.LatLng(lounge.acf.coordinates.lat, lounge.acf.coordinates.lng);
          let distance = google.maps.geometry.spherical.computeDistanceBetween(latLngA, latLngB);
          if (distance <= 30000) {
            htmlTemplate += markUp(lounge);
          }
        } else if (cityInput === city || cityInput === '') {
          htmlTemplate += markUp(lounge);
        }
      }
    }
    // check flavours
    for (let flavour of flavours) {
      if (flavour.toLowerCase().includes(value.toLowerCase())) {
        if (locationChecked) {
          let latLngA = new google.maps.LatLng(userPosition);
          let latLngB = new google.maps.LatLng(lounge.acf.coordinates.lat, lounge.acf.coordinates.lng);
          let distance = google.maps.geometry.spherical.computeDistanceBetween(latLngA, latLngB);
          if (distance <= 30000) {
            htmlTemplate += markUp(lounge);
          }
        } else if (cityInput === city || cityInput === '') {
          htmlTemplate += markUp(lounge);
        }
      }
    }


  }
  //if cityinput has value show it in the title and display results
  if (cityInput) {
    document.querySelector('#search-lounges').innerHTML = `
    <div class="center-align">
      <a onclick="clearSearch();" class="waves-effect waves-red btn-small center-align transparent border">
        <i class="material-icons left red-text">close</i>Clear Search
        </a>
    </div>
    <h4>Results for ${value} in ${cityInput}</h4>
      ${htmlTemplate}`;
    //else just display results
  } else {
    document.querySelector('#search-lounges').innerHTML = `
    <div class="center-align">
      <a onclick="clearSearch();" class="waves-effect waves-red btn-small center-align transparent border">
        <i class="material-icons left red-text">close</i>Clear Search
        </a>
    </div>
    <h4>Results for ${value} </h4>
    ${htmlTemplate}`;
  }
  $("#search-results").show();
  $("#featured").hide();
}

//Search End
//GEt location

/*------------------- SHOW NEARBY ------------------- */


// get current location of user
let pos;
let currentLocation = () => {
  if (navigator && navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      //dispay you are here
      let infoWindow = new google.maps.InfoWindow;
      infoWindow.setPosition(pos);
      infoWindow.setContent('You are here!');
      infoWindow.open(map);
      //center map on user position
      map.setCenter(pos);
      //if map page is hidden, show the nearby lounges
      if (document.querySelector("#map-page").style.display === "none") {
        showNearby(pos);
      }

    }, () => {
      handleLocationError(true, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, map.getCenter());
  }
}
//error handler
let handleLocationError = (browserHasGeolocation, infoWindow, pos) => {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}

//show nearby lounges (<= 30km)
let locationChecked = false;
let userPosition
let showNearby = pos => {
  userPosition = pos;
  let htmlTemplate = "";
  //if location isn't active
  if (locationChecked === false) {
    for (let lounge of postsContainer) {
      var latLngA = new google.maps.LatLng(userPosition);
      var latLngB = new google.maps.LatLng(lounge.acf.coordinates.lat, lounge.acf.coordinates.lng);
      let distance = google.maps.geometry.spherical.computeDistanceBetween(latLngA, latLngB);
      //shows lounges in a 30km radius
      if (distance <= 30000) {
        htmlTemplate += markUp(lounge);
      }
    }
    document.querySelector('#search-input').value = '';
    document.querySelector('#city-input').value = '';
    document.querySelector('#search-lounges').innerHTML = `<h4>Near me</h4> ${htmlTemplate}`;
    $("#search-results").show();
    $("#featured").hide();
    $("#show-nearby-switch").addClass("location-active");
    //changes value to true
    locationChecked = true;
    //if location is clicked (true), clears search
  } else {
    clearSearch();
  }
}



//show featured page and clear all searches and deactivate location
let clearSearch = () => {
  $("#featured").show();
  $("#search-results").hide();
  document.querySelector("#city-input").value = '';
  document.querySelector("#search-input").value = '';
  $("#show-nearby-switch").removeClass("location-active");
  locationChecked = false;
}






/*------------------- MAP ------------------- */


let map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 56.1576461,
      lng: 10.202390199999968
    },
    zoom: 12,
    styles: mapStyles
  });
}
//on map open calls function to check location and add markers
document.querySelector("#map-tab-menu").addEventListener("click", () => {
  addCoordinates(postsContainer);
  currentLocation();
});



//transform coords into markers
let addCoordinates = coordinates => {
  for (let coords of coordinates) {
    let newMarker = new google.maps.LatLng(coords.acf.coordinates.lat, coords.acf.coordinates.lng);
    addMarker(newMarker);
  }
}
//add marker to map

let addMarker = location => {
  let marker = new google.maps.Marker({
    position: location,
    map: map,
    url: `http://maps.google.com/?q=${location}`
  });
  //on click on marker, open location in google maps
  marker.addListener('click', () => {
    console.log(marker);
    window.open(this.url);
  });
}

/*------------------- FIRST TIME USER TUTORIAL SCREEN ------------------- */


//if first time user, show welcome screen
let firstTimeUser = () => {
  let firstTimeUser = localStorage.getItem("firstTimeUser");
  console.log("firstTimeUser", firstTimeUser);
  if (firstTimeUser === null) {
    $("#welcome-message").show();
    $("#home").hide();

    localStorage.setItem("firstTimeUser", false);
  }
}
firstTimeUser();

//welcome carousel
document.addEventListener('DOMContentLoaded', () => {
  let welcomeElement = document.querySelectorAll('#welcome-carousel');
  let welcomeOptions = {
    fullWidth: true,
    indicators: true
  };
  let welcomeInstances = M.Carousel.init(welcomeElement, welcomeOptions);
});

//enter page button
let enterPage = () => {
  $("#welcome-message").hide();
  $("#home").show();
}


/*------------------- FIREBASE ------------------- */

var firebaseConfig = {
  apiKey: "AIzaSyB5CvNo4mWv7j_bqnjyodp-aIksTODcJus",
  authDomain: "myshishaplace.firebaseapp.com",
  databaseURL: "https://myshishaplace.firebaseio.com",
  projectId: "myshishaplace",
  storageBucket: "myshishaplace.appspot.com",
  messagingSenderId: "222871668180",
  appId: "1:222871668180:web:c92921be200bfdbeea8241"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const uiConfig = {
  credentialHelper: firebaseui.auth.CredentialHelper.NONE,
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID
  ],
  signInSuccessUrl: '#home',
};

/*------------------- AUTHENTICATION ------------------- */

// Init Firebase UI Authentication
const ui = new firebaseui.auth.AuthUI(firebase.auth());
let currentUser
// Listen on authentication state change
firebase.auth().onAuthStateChanged(user => {
  if (user) { // if user exists and is authenticated
    currentUser = user;
    $("#login").hide();
    $("#logoutBtn").show();
    document.querySelector("#user-profile-name").innerHTML = `Welcome ${currentUser.displayName}!`;
    // Change login icon to profile
    document.querySelector("#profileBtn").innerHTML = `<i class="material-icons prefix">person_outline</i>`;
  } else { // if user is not logged in
    $("#logoutBtn").hide();
    document.querySelector("#profileBtn").innerHTML = `Login`;
    ui.start('#firebaseui-auth-container', uiConfig);
  }
});

let login = () => {
  if (currentUser) {
    showPage('profile-page')
  } else {
    $("#login").toggle();
  }
}

// sign out user
let logout = () => {
  firebase.auth().signOut();
  document.querySelector("#user-profile-name").innerHTML = '';
  location.reload();
}

/*------------------- RATING ------------------- */

const db = firebase.firestore();
const loungeRef = db.collection("lounges");
const starsRef = db.collection("stars");
let loungeName;

let rate = () => {
  if (currentUser) {
    // references to the input fields
    let name = currentUser.displayName;
    loungeName = document.querySelector("#lounge-name").innerHTML;
    let userRating = document.querySelector('input[name="getRating"]:checked').value;
    let rateComment = document.querySelector("#rate-comment").value;
    // Creates a new rating object containing the variables above
    let newRating = {
      userid: name,
      loungeid: loungeName,
      rating: userRating,
      comment: rateComment
    };
    M.toast({
      html: 'Thank you for your rating!'
    })
    //creating a new document with a custom ID, consisting of the user's name and the lounge name,
    // to prevent from rating more than once
    starsRef.doc(`${name}_${loungeName}`).set(newRating);
  } else {
    login();
    M.toast({
      html: 'Please log in first.'
    })
  }
}

let updateComments = () => {
  document.querySelector('#comments').innerHTML = '';
  starsRef.get()
    .then(response => {
      response.docs.map(doc => {

        if (doc.data().loungeid === loungeName) {
          comments(doc.data());
        }

        return doc.data();
      });
    });
}

starsRef.onSnapshot(() => {
  updateComments();
});



/*------------------- NAVIGATION ------------------- */

// tabs
let navOptions = {
  duration: 500
};
let nav = document.querySelector('#tabs');
var instanceNav = M.Tabs.init(nav, navOptions);
instanceNav.updateTabIndicator();


let hideAllPages = () => {
  let pages = document.querySelectorAll(".page");
  for (let page of pages) {
    page.style.display = "none";
  }
}
// show page or tab
let showPage = pageId => {
  hideAllPages();
  document.querySelector(`#${pageId}`).style.display = "block";
  location.href = `#${pageId}`;
  $("#backBtn").addClass("hidel");
  showLoader(500);
}
// set default page
let setDefaultPage = () => {
  let page = "home";
  if (location.hash) {
    page = location.hash.slice(1);
  }
  showPage(page);
}
let showLoader = (duration) => {
  $("#splash").show();
  setTimeout(function() {
    $("#splash").hide();
  }, duration);
}
setTimeout(() => {
  $("#splash").hide();
}, 1500);

/*------------------- MAP STYLES ------------------- */
let mapStyles = [{
    elementType: 'geometry',
    stylers: [{
      color: '#330000'
    }]
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [{
      color: '#565656'
    }]
  },
  {
    elementType: 'labels.text.fill',
    stylers: [{
      color: '#ffffff'
    }]
  },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{
      color: '#ffffff'
    }]
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{
      color: '#ffffff'
    }]
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{
      color: '#263c3f'
    }]
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{
      color: '#ffffff'
    }]
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{
      color: '#5d3405'
    }]
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{
      color: '#5d3405'
    }]
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{
      color: '#ffffff'
    }]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{
      color: '#5d3405'
    }]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{
      color: '#5d3405'
    }]
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{
      color: '#ffffff'
    }]
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{
      color: '#2f3948'
    }]
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{
      color: '#d59563'
    }]
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{
      color: '#17263c'
    }]
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{
      color: '#ffffff'
    }]
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{
      color: '#ffffff'
    }]
  }
]
