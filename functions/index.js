/* eslint-disable no-loop-func */
/* eslint-disable promise/no-nesting */
/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

var db = admin.firestore();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });



exports.createPairs = functions.firestore
        .document('seminars/{seminarId}').onWrite((change, context) =>
        {
            if(change.before.data().closed === false && change.after.data().closed === true)
            {
                //block more people from being added 
                //then
                let seminar = change.after.data();
                let participantList = seminar.participantList;
                let pairs = make_random_pairs(participantList);
                let conversationRef = db.collection('conversations');

                // let batch = db.batch();
                // really inefficient for now, later add batch writes
                for(pair of pairs)
                {
                    conversationRef.add({name: seminar.name, questionSetLink: seminar.questionSetLink, active: true, messageCount: 0, participants: pair, dateCreated: seminar.dateCreated}).then(ref => {
                        console.log('Added document with ID: ', ref.id);
                      });
                }
                console.log("this works");
            }
            return null;
        })


function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
    
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
    
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function make_random_pairs(array) {
    let shuffled_array = shuffle(array)
    let pairs = []
    for(let i = 0; i < array.length; i = i + 2)
    {
        pairs.push(array.slice(i, i + 2))
    }
    return pairs
}


