
// Main block of server-side code
// This file manages each call in correspondance with the client side page

// Declare my initial tools including router, bodyparser, and fs
const express = require('express');
var bodyparser = require('body-parser')
const router = express.Router();
var fs = require('fs');
var bodyParser = bodyparser.json()

// These are practice functions I used to help get a better understanding of the system
// router.get('/', (req, res, next) => {
//     res.status(200).json({
//         message: 'Handling GET requests to /tweets'
//     });
// });

// router.post('/', (req, res, next) => {
//     res.json({
//         message: 'Handling POST requests to /tweets'
//     });
// });

// My tweetDisplay function. A call made here will display the date and text of all currently recorded Tweets within the JSON file.
router.get('/tweetDisplay', (req, res, next) => {
    let thisTweet
    let finishedTweet = [] // The object I used to create a array of statements that will later be displayed in a list
    finishedTweet.push("List of All Recorded Tweets:")
    fs.readFile('favs.json', 'utf8', (err, data) => { // The main function that reads the JSON file. This utilizes the fs class to interpret the data
        let tweetsOjb = JSON.parse(data); // Parsing the data into a controlable array
        for (i = 0; i < Object.keys(JSON.parse(data)).length; i++) { // Looping through each element in the parsed data and adding them to an array to be displayed
            thisTweet = tweetsOjb[i];
            finishedTweet.push(thisTweet.created_at)
            finishedTweet.push(thisTweet.text)
        }
        res.status(200).json(finishedTweet) // Returns all good and the completed array of statements to be displayed
    })
})

router.get('/userIDs', (req, res, next) => {
    let thisID
    let finishedList = [] // The object I used to create a array of statements that will later be displayed in a list
    finishedList.push("List of User ID's:")
    fs.readFile('favs.json', 'utf8', (err, data) => { // The main function that reads the JSON file. This utilizes the fs class to interpret the data
        let idObj = JSON.parse(data); // Parsing the data into a controlable array
        for (i = 0; i < Object.keys(JSON.parse(data)).length; i++) { // For loop to collect all user IDs and store them within the display list
            thisID = idObj[i];
            finishedList.push(thisID.user.id)
        }
        res.status(200).json(finishedList) // Returns all good and the completed array of statements to be displayed
    })
})

router.get('/lookup/:number', (req, res, next) => {
    const num = req.params.number // Transform the number associated with the URL into a usable constant

    let thisID
    let worked = false
    let finishedList = [] // The object I used to create a array of statements that will later be displayed in a list
    fs.readFile('favs.json', 'utf8', (err, data) => { // The main function that reads the JSON file. This utilizes the fs class to interpret the data
        let idObj = JSON.parse(data); // Parsing the data into a controlable array
        for (i = 0; i < Object.keys(JSON.parse(data)).length; i++) { // For loop to scan through all objects in the JSON array to find if one matches the correct user ID
            thisID = idObj[i];

            if (thisID.id_str == num.stringify) {
                finishedList.push("We found the Tweet:")
                finishedList.push(thisID.created_at)
                finishedList.push(thisID.text)
                worked = true
            }
        }
        if (worked != true) { // Checks if worked so a statement may be posted if it fails
            finishedList.push("We could not find the specified Tweet.")
        }
        
        res.status(200).json(finishedList) // Returns all good and the completed array of statements to be displayed
    })
})

router.post('/postTweet', bodyParser, (req, res, next) => {
    var newTweetID = req.body.firstVar // Parsing body-payload variables into usable variables
    var newTweetText = req.body.secondVar // ||
    var finishedTask = [] // The object I used to create a array of statements that will later be displayed in a list

    fs.readFile('favs.json', 'utf8', (err, data) => { // The main function that reads the JSON file. This utilizes the fs class to interpret the data
        let idObj = JSON.parse(data); // Parsing the data into a controlable array
        let i = Object.keys(idObj).length // Locating the next position in the JSON array
        idObj[i] = new Object() // Setting all the new values for a new object
        idObj[i].created_at = Date.now()
        idObj[i].id = newTweetID
        idObj[i].text = newTweetText
        idObj[i].user = new Object()
        idObj[i].user.id = "placeholder" // Note: "placeholder" is used for data not given within the parameters
        idObj[i].user.name = "placeholder" // ||

        fs.writeFile('favs.json', JSON.stringify(idObj), function(err, result) { // Uses fs to write back all the data in the JSON array we manipulated to the original JSON format
            if(err) console.log('error', err);
        })
        finishedTask.push("Tweet posted!") // Alerts the user
        finishedTask.push("Here's your Tweet:")
        finishedTask.push(idObj[i].created_at)
        finishedTask.push(idObj[i].text)
        finishedTask.push("(note: Username and User-ID set to 'placeholder')")

        res.status(200).json(finishedTask) // Returns all good and the completed array of statements to be displayed
    })
})

router.put('/rename', bodyParser, (req, res, next) => {
    var oldU = req.body.oldVar // Parsing body-payload variables into usable variables
    var newU = req.body.newVar // ||
    var finishedTask = [] // The object I used to create a array of statements that will later be displayed in a list
    var worked = false

    fs.readFile('favs.json', 'utf8', (err, data) => { // The main function that reads the JSON file. This utilizes the fs class to interpret the data
        let idObj = JSON.parse(data); // Parsing the data into a controlable array
        for (i = 0; i < Object.keys(JSON.parse(data)).length; i++) { // For loop to scan through users until the correct username is found
            thisUser = idObj[i];
            if (thisUser.user.name == oldU) {
                thisUser.user.name = newU
                fs.writeFile('favs.json', JSON.stringify(idObj), function(err, result) { // Writes back to the JSON file with updated infomration
                    if(err) console.log('error', err);
                })
                finishedTask.push("Username has been changed.")
                finishedTask.push("New username: " + newU)
                worked = true
            } 
        }
        
        if (!worked) { // Check if no matching name was found
            finishedTask.push("Username: `" + oldU + "` not found. Please try again.")
        }
        res.status(200).json(finishedTask) // Returns all good and the completed array of statements to be displayed
    })
})

router.delete('/delete', bodyParser, (req, res, next) => {
    var deleteIndex = req.body.oldVar // Parsing body-payload variables into usable variables
    var finishedTask = [] // The object I used to create a array of statements that will later be displayed in a list
    var worked = false

    fs.readFile('favs.json', 'utf8', (err, data) => { // The main function that reads the JSON file. This utilizes the fs class to interpret the data
        let idObj = JSON.parse(data); // Parsing the data into a controlable array
        for (i = 0; i < Object.keys(JSON.parse(data)).length; i++) { // For loop to scan through JSON file until correct Tweet ID is located
            thisUser = idObj[i];
            if (thisUser.id_str == deleteIndex.stringify) {
                var deletedArr = idObj.splice(i,1) // Splices out the old tweet and discards the contents
                fs.writeFile('favs.json', JSON.stringify(idObj), function(err, result) { // Writes back to the JSON file with updated infomration
                    if(err) console.log('error', err);
                })
                finishedTask.push("Tweet has been deleted.")
                finishedTask.push("You're welcome!")
                worked = true
                break
            } 
        }
        
        if (!worked) { // Checks if given Tweet ID did not match any current Tweets
            finishedTask.push("Tweet ID: `" + deleteIndex + "` not found. Please try again.")
        }
        res.status(200).json(finishedTask) // Returns all good and the completed array of statements to be displayed
    })
})

module.exports = router;