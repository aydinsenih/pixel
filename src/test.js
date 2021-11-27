// import * as THREE from "three";
// import Stats from "three/examples/jsm/libs/stats.module";
// import PlayerController from "./PlayerController";
// import Camera from "./Camera";
// import Render from "./Render";
// import Player from "./Objects/Player";
// import Scene from "./World/Scene";
// import World from "./World/World";
// import WebSocketClient from "./Connection/WebSocketClient";
// import { v4 as uuidv4 } from "uuid";
import axios from "axios";
// import { wrapper } from "axios-cookiejar-support";
// import { CookieJar } from "tough-cookie";

// const jar = new CookieJar();
// const client = wrapper(axios.create({ jar }));

// No semicolons used here =)

let auth2, googleUser;

let appStart = function () {
    gapi.load("auth2", initSignInV2);
};

let initSignInV2 = function () {
    auth2 = gapi.auth2.init({
        client_id:
            "215306563787-3li3qfotcaofqaroomuuk6b65365dp6r.apps.googleusercontent.com",
        scope: [
            "https://www.googleapis.com/auth/userinfo.email",
            "https://www.googleapis.com/auth/userinfo.profile",
        ].join(" "), // space seperated string
    });

    // Listen for sign in changes
    auth2.isSignedIn.listen(signinChanged);

    // Listen for user changes
    auth2.currentUser.listen(userChanged);

    // Sign in the user if they are currently signed in.
    if (auth2.isSignedIn.get() == true) {
        auth2.signIn();
    }

    refreshValues();
}; // End of initSignInV2

/**
 * Listener method for sign-out live value.
 *
 * @param {boolean} val the updated signed out state.
 */
var signinChanged = function (val) {
    console.log("Signin state changed to ", val);
    // document.getElementById('signed-in-cell').innerText = val
    if (auth2.isSignedIn.get()) {
        buttonControl(false);
        document
            .getElementById("button-sign-out")
            .addEventListener("click", function () {
                auth2.signOut();
            });
    } else {
        buttonControl(true);
    }
};

/**
 * Listener method for when the user changes.
 *
 * @param {GoogleUser} user the updated user.
 */
var userChanged = function (user) {
    console.log("User now: ", user);
    googleUser = user;

    updateGoogleUser();
    // document.getElementById('curr-user-cell').innerText = JSON.stringify(user, undefined, 2)
};

var buttonControl = function (command) {
    if (command) {
        document.getElementById("sign-in-button-text").innerText =
            "Sign in with Google";
        document
            .getElementById("g-sign-in-wrapper")
            .addEventListener("click", signIn, true);
        document.getElementById("button-sign-out").style.display = "none";
    } else {
        document.getElementById("sign-in-button-text").innerText =
            "Signed in with Google";
        console.log("Removing Event Listener");
        document
            .getElementById("g-sign-in-wrapper")
            .removeEventListener("click", signIn, true);
        document.getElementById("button-sign-out").style.display = "";
    }
};

// Wrapping Google's signIn inside a function expression so we can add/remove it when needed.
var signIn = function () {
    auth2.signIn();
};

axios.defaults.withCredentials = true;
async function user() {
    const auth = await axios.get(
        "http://3.140.210.21:5000/user/authorize?googleIdToken=" +
            googleUser.getAuthResponse().id_token
    );
    window.localStorage.setItem("p_token", auth.data.pToken);

    // const create = await axios.post("http://3.140.210.21:5000/user/create", {
    //     googleIdToken: googleUser.getAuthResponse().id_token,
    // });

    //document.cookie = `p_token=${auth.data.pToken}`;
    const user = await axios.get("http://3.140.210.21:5000/user/", {
        headers: {
            Authorization: "Bearer " + auth.data.pToken,
        },
    });

    console.log(user);
}

// Updates the properties in the Google User table using the current user.

var updateGoogleUser = function () {
    // Check if the user is signed in
    if (auth2.isSignedIn.get()) {
        // axios.defaults.withCredentials = true;
        // axios
        //     .get(
        //         "http://3.140.210.21:5000/user/authorize?googleIdToken=" +
        //             googleUser.getAuthResponse().id_token
        //     )
        //     .then((res) => {
        //         console.log(res);
        //     })
        //     .catch(function (err) {
        //         console.log(err.toJSON().status);
        //         if (err.toJSON().status === 404) {
        //             axios
        //                 .post(
        //                     "http://3.140.210.21:5000/user/create",
        //                     {
        //                         googleIdToken:
        //                             googleUser.getAuthResponse().id_token,
        //                     },
        //                     { withCredentials: true }
        //                 )
        //                 .then((res) => {
        //                     axios
        //                         .get("http://3.140.210.21:5000/user", {
        //                             withCredentials: true,
        //                         })
        //                         .then((res) => {
        //                             console.log(res);
        //                         });
        //                 })
        //                 .catch((err) => {
        //                     console.log(err.toJSON());
        //                 });
        //         }
        //     });
        user();

        var profile = googleUser.getBasicProfile();
        console.log(profile);
        console.log("bumu", googleUser.getAuthResponse());

        // Create a container with user info
        var container = document.createElement("div");
        container.id = "user-details-wrapper";
        var mainHeading = document.createElement("h1");
        mainHeading.className = "main-heading";
        mainHeading.textContent = "User details";
        var heading = document.createElement("h2");
        console.log("test", profile);
        heading.textContent = profile.getName();
        var avatar = document.createElement("img");
        avatar.className = "avatar";
        avatar.src = profile.getImageUrl();
        var email = document.createElement("a");
        email.className = "email";
        email.textContent = profile.getEmail();
        email.href = "mailto:" + profile.getEmail();
        email.target = "_blank";
        var playButton = document.createElement("a");
        playButton.className = "play";
        playButton.textContent = "Play";
        playButton.href = "http://localhost:8080";
        playButton.target = "_blank";

        // Append the container and children to the DOM
        document.body.appendChild(container);
        container.appendChild(mainHeading);
        container.appendChild(heading);
        container.appendChild(avatar);
        container.appendChild(email);
        container.appendChild(playButton);
    } else {
        // Get the user details container
        var userDetailsContainer = document.getElementById(
            "user-details-wrapper"
        );
        // Remove it
        userDetailsContainer.parentNode.removeChild(userDetailsContainer);
    }
};

// Retrieves the current user and signed in states from the GoogleAuth object.
var refreshValues = function () {
    if (auth2.isSignedIn.get()) {
        buttonControl(false);
    } else {
        buttonControl(true);
    }
};

// Begin app
appStart();
