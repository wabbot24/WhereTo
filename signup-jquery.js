$(document).ready(function () {
    console.log("loaded");
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyCJ5AUAec0lqTFvGmAuTS83TaVR3LPDxak",
        authDomain: "whereto-d2fee.firebaseapp.com",
        databaseURL: "https://whereto-d2fee.firebaseio.com",
        projectId: "whereto-d2fee",
        storageBucket: "whereto-d2fee.appspot.com",
        messagingSenderId: "179070727740"
    };
    firebase.initializeApp(config);


    var login = $("#btnLogin");
    var signUp = $("#btnSignUp");
    var logOut = $("#btnLogOut");
    var submit = $("#submit");

    var database = firebase.database();
    var auth = firebase.auth();
    var clearBtn = $("<button>").addClass("remove btn btn-secondary").text("Clear");

    console.log($("#btnLogin"));
    document.getElementById("btnLogin");

    console.log(document.getElementById("btnLogin"));
    $("#btnLogin").on("click", function(e){
        console.log("Login clicked");
        var email = $("#txtEmail").val().trim();
        var pass = $("#txtPassword").val().trim();
        auth.signInWithEmailAndPassword(email, pass)
            .then(result => {
                window.location.replace("nancyui.html")
                // $("#txtEmail").css("display", "none");
                // $("#txtPassword").css("display", "none");
                // $("#btnLogin").css("display", "none");
                // $("#btnSignUp").css("display", "none");
                info()

            });
    });

    function info() {
        var user = auth.currentUser;
        var uid = user.uid;
        console.log("successfully logged in");

        var ref = database.ref('/trips');
        ref.orderByChild("userId").equalTo(uid).on('value', gotData, errData);


        function gotData(data) {
            $("tbody").empty();
            var trips = data.val();
            console.log(trips)
            // Object.keys(users).forEach(function (trips) {
            // var userTrips = users['trips']
            console.log("looping through trips")
            // console.log(userTrips)
            Object.values(trips).forEach(function (t) {
                console.log("next loop")
                console.log(t)
                var start = (t.startLocation)
                var end = (t.endLocation)
                var newInfo = $("<tr>").attr("data-key", t.key).append(
                    $("<td>").text(start),
                    $("<td>").text(end),
                    $("<td>").html(clearBtn)
                );
                $("#savedLocations > tbody").append(newInfo);
            })

        }

        function errData(err) {
            console.log("error!");
            console.log(err);
        };
    }

    $(document).on("click", ".remove", function () {
        console.log("Remove")
        var tr = $(this).closest("tr");
        var key = tr.attr("data-key");
        console.log(key);

        database.ref(`/trips/${key}`).remove();
        tr.remove();
        console.log("deleted!");

        $("#savedLocations > tbody").empty();
        info()

    });
    // console.log($("#btnSignUp"));
    $(signUp).on("click", e => {
        console.log("workingsignup");
        console.log($("#txtEmail"));
        var email = $("#txtEmail").val().trim();
        var pass = $("#txtPassword").val().trim();
        console.log(email);
        console.log(pass);
        auth.createUserWithEmailAndPassword(email, pass)
        

            .then(result => {
                console.log("successfully created user");
                var user = auth.currentUser;
                var addedUser = database.ref("users/" + user.uid).set({
                    email: user.email,
                    userId: user.uid
                });
            })
            .catch(e => console.log(e.message));

    });

    $(logOut).on("click", e => {
        auth.signOut()
        console.log("signed out");
        $("tbody").empty()
        $("#txtEmail").css("display", "inline");
        $("#txtEmail").val(" ")
        $("#txtPassword").css("display", "block");
        $("#txtPassword").val("")
        $("#btnLogin").css("display", "inline");
        $("#btnSignUp").css("display", "inline");

    });

    $(submit).on("click", e => {
        console.log("in submit");
        var user = auth.currentUser;
        var start = $("#start").val().trim();
        var end = $("#end").val().trim();
        $("#start").val("")
        $("#end").val("")

        var tripRef = database.ref(`/trips`).push();
        var tripKey = tripRef.key;

        var tripData = {
            startLocation: start,
            endLocation: end,
            key: tripKey,
            userId: user.uid
        }

        database.ref(`/trips/${tripKey}`).update(tripData)

    });
});