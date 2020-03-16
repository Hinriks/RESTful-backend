//Sample data for Assignment 3
var express = require("express");
var app = express();
var bodyParser = require('body-parser')
app.use(bodyParser.json())

var prefix = "/api/v1/"

// EXAMPLE DATA
var events = [ 
    { id: 0, name: "The Whistlers", description: "Romania, 2019, 97 minutes", location: "Bio Paradís, Salur 1", capacity: 40, startDate: new Date(Date.UTC(2020, 02, 03, 22, 0)), endDate: new Date(Date.UTC(2020, 02, 03, 23, 45)), bookings: [0,1,2] },
    { id: 1, name: "HarpFusion: Bach to the Future", description: "Harp ensemble", location: "Harpa, Hörpuhorn", capacity: 100, startDate: new Date(Date.UTC(2020, 02, 12, 15, 0)), endDate: new Date(Date.UTC(2020, 02, 12, 16, 0)), bookings: [] }
];
var bookings = [
    { id: 0, firstName: "John", lastName: "Doe", tel: "+3541234567", email: "", spots: 3},
    { id: 1, firstName: "Jane", lastName: "Doe", tel: "", email: "jane@doe.doe", spots: 1},
    { id: 2, firstName: "Meðaljón", lastName: "Jónsson", tel: "+3541111111", email: "mj@test.is", spots: 5},
    { id: 3, firstName: "gunni", lastName: "Jóns", tel: "+3541234567", email: "", spots: 5}
];

// Read all events
app.get(prefix + "events", (req, res) => {
    var result = getAllEvents()
    var resultOutput = result[0]
    var resultCode = result[1]
    res.status(resultCode).json(resultOutput)
});

// Read an individual event
app.get(prefix + "events/:e_id", (req, res) => {
    const e_id = parseInt(req.params.e_id);
    var result = getEvent(e_id)
    var resultOutput = result[0]
    var resultCode = result[1]
    res.status(resultCode).json(resultOutput);
});

// Create a new event
app.post(prefix + "events", (req, res) => { 
    var result = createEvent(req)
    var resultOutput = result[0]
    var resultCode = result[1]
    res.status(resultCode).json(resultOutput)

});

// Update an event
app.put(prefix + "events/:e_id", (req, res) => {
    const e_id = parseInt(req.params.e_id);
    var result = updateEvent(req, e_id)
    var resultOutput = result[0]
    var resultCode = result[1]
    res.status(resultCode).json(resultOutput)
});

// Delete all events
app.delete(prefix + "events", (req, res) => {
    var result = deleteAllEvents()
    var resultOutput = result[0]
    var resultCode = result[1]
    res.status(resultCode).json(resultOutput);
})

// Delete an event
app.delete(prefix + "events/:e_id", (req, res) => {
    const e_id = parseInt(req.params.e_id);
    var result = deleteEvent(e_id)
    var resultOutput = result[0]
    var resultCode = result[1]
    res.status(resultCode).json(resultOutput)
});


// Read all bookings for an event
app.get(prefix + "events/:e_id/bookings", (req, res) => {
    const e_id = parseInt(req.params.e_id);
    var result = getBookingsForEvent(e_id)
    var resultOutput = result[0]
    var resultCode = result[1]
    res.status(resultCode).json(resultOutput)

});

// Read an individual booking
app.get(prefix + "events/:e_id/bookings/:b_id", (req, res) => {
    const e_id = parseInt(req.params.e_id);
    const b_id = parseInt(req.params.b_id);
    var result = getBooking(e_id, b_id)
    var resultOutput = result[0]
    var resultCode = result[1]
    res.status(resultCode).json(resultOutput)
});

// Create a new booking
app.post(prefix + "events/:e_id/bookings", (req, res) => {
    const e_id = parseInt(req.params.e_id);
    var result = createBooking(e_id, req)
    var resultOutput = result[0]
    var resultCode = result[1]
    res.status(resultCode).json(resultOutput)
})

// Delete a booking
app.delete(prefix + "events/:e_id/bookings/:b_id", (req, res) => {
    const e_id = parseInt(req.params.e_id);
    const b_id = parseInt(req.params.b_id);
    var result = deleteBooking(e_id, b_id)
    var resultOutput = result[0]
    var resultCode = result[1]
    res.status(resultCode).json(resultOutput)
});

// Delete all bookings for an event
app.delete(prefix + "events/:e_id/bookings", (req, res) => {
    const e_id = parseInt(req.params.e_id);

    var result = deleteAllBookings(e_id)
    var resultOutput = result[0]
    var resultCode = result[1]
    res.status(resultCode).json(resultOutput)
});


// Handle Invalid URLs
app.use('*', (req, res) => {
    res.status(405).send('Method not allowed or not implemented');
});

app.listen(process.env.PORT, () => {
 console.log("Server running on a port");
});


// Read all events
function getAllEvents() {
    result = []
    for (let i = 0; i < events.length; i++) {
        result.push({})
        result[i]["id"] = events[i]["id"]
        result[i]["name"] = events[i]["name"]
        result[i]["capacity"] = events[i]["capacity"]
        result[i]["startDate"] = events[i]["startDate"]
        result[i]["endDate"] = events[i]["endDate"]
    }
    return [result, 200]
}

// Read an individual event
function getEvent(e_id) {
    var result = events.find(x => x.id == e_id)
    if (result) {
        return [result, 200]
    } else {
        return [{"message": "Event Not Found"}, 404]
    }
}

// Create a new event
function createEvent(req) {
    var newEvent = {}
    newEvent["id"] = getNewId(events)
    if (req.body.name) {
        newEvent["name"] = req.body.name
    } else { 
        return [{'message':"name is required"}, 400]
    }
    if (req.body.description) {
        newEvent["description"] = req.body.description
    }
    if (req.body.location) {
        newEvent["location"] = req.body.location
    }
    if (req.body.capacity) {
        if (Number.isInteger(parseInt(req.body.capacity)) && req.body.capacity >= 0) {
            newEvent["capacity"] = parseInt(req.body.capacity)
        } else {
            return [{'message': "capacity is invalid"}, 400]
        }
    } else {
        return [{'message':"capacity is required"}, 400]
    }
    if (req.body.startDate) {
        if (Number.isInteger(parseInt(req.body.startDate)) && req.body.startDate.toString().length == 10) {
            newEvent["startDate"] = new Date(parseInt(req.body.startDate) * 1000)
        } else {
            return [{'message':"startDate is invalid"}, 400]
        }
    } else {
        return [{'message':"startDate is required"}, 400]
    }
    if (req.body.endDate) {
        if (Number.isInteger(parseInt(req.body.endDate)) && req.body.endDate.toString().length == 10) {
            newEvent["endDate"] = new Date(parseInt(req.body.endDate) * 1000)
        } else {
            return [{'message':"endDate is invalid"}, 400]
        }
    } else {
        return [{'message':"endDate is required"}, 400]
    }

    var timeNow = Math.round((new Date()).getTime() / 1000);
    if (parseInt(req.body.startDate) < timeNow || parseInt(req.body.endDate) < timeNow) {
        return [{'message': "startDate and endDate have to be in the future"}, 400]
    }
    if (parseInt(req.body.startDate) > parseInt(req.body.endDate)) {
        return [{'message':"startDate has to be before endDate"}, 400]
    }
    newEvent["bookings"] = []
    events.push(newEvent)
    return [newEvent, 201]

}

// Update an event
function updateEvent(req, e_id) {
    var event = events.find(x => x.id == e_id)
    if (!event) {
        return [{'message': "Event Not Found"}, 404]
    }
    if (event["bookings"].length == 0) {
        if (req.body.name) {
            event["name"] = req.body.name
        }
        if (req.body.description) {
            event["description"] = req.body.description
        }
        if (req.body.location) {
            event["location"] = req.body.location
        }
        if (req.body.capacity) {
            if (Number.isInteger(parseInt(req.body.capacity)) && req.body.capacity >= 0) {
                event["capacity"] = parseInt(req.body.capacity)
            } else {
                return [{'message': "capacity is invalid"}, 400]
            }
        }
        if (req.body.startDate && req.body.endDate) {
            if (parseInt(req.body.startDate) > parseInt(req.body.endDate)) {
                return [{'message':"startDate has to be before endDate"}, 400]
            }
            var timeNow = Math.round((new Date()).getTime() / 1000);
            if (parseInt(req.body.startDate) < timeNow || parseInt(req.body.endDate) < timeNow) {
                return [{'message': "startDate and endDate have to be in the future"}, 400]
            }
        } else {
            if (req.body.startDate) {
                var timeNow = Math.round((new Date()).getTime() / 1000);
                var oldEndDate = Math.round(new Date(event["endDate"]).getTime() / 1000)
                if (parseInt(req.body.startDate) > oldEndDate) {
                    return [{'message':"startDate has to be before endDate"}, 400]
                }
                if (parseInt(req.body.startDate) < timeNow) {
                    return [{'message': "startDate has to be in the future"}, 400]
                }
            }
            if (req.body.endDate) {
                var timeNow = Math.round((new Date()).getTime() / 1000);
                var oldStartDate = Math.round(new Date(event["startDate"]).getTime() / 1000)
                if (parseInt(req.body.endDate) < oldStartDate) {
                    return [{'message':"endDate has to be after startDate"}, 400]
                }
                if (parseInt(req.body.endDate) < timeNow) {
                    return [{'message': "endDate has to be in the future"}, 400]
                }
            }
        }
        if (req.body.startDate) {
            if (Number.isInteger(parseInt(req.body.startDate)) && req.body.startDate.toString().length == 10) {

                event["startDate"] = new Date(parseInt(req.body.startDate) * 1000)
            } else {
                return [{'message': "startDate is invalid"}, 400]
            }
        }
        if (req.body.endDate) {
            if (Number.isInteger(parseInt(req.body.endDate)) && req.body.endDate.toString().length == 10) {
                event["endDate"] = new Date(parseInt(req.body.endDate) * 1000)
            } else {
                return [{'message': "endDate is invalid"}, 400]
            }
        }

        return [event, 200]
    } else {
        return [{'message': "Cannot update event with existing bookings"}, 400]
    }
}

// Delete all events
function deleteAllEvents(){
    var deletedEvents = []
    events.forEach(event => {
        var deletedBookings = []

        event["bookings"].forEach(b_id => {
            var booking = bookings.find(x => x.id == b_id)
            deletedBookings.push(booking)
        })
        event["bookings"] = deletedBookings
        deletedEvents.push(event)
    })
    // Remove all events and bookings
    events = []
    bookings = []

    return [deletedEvents, 200]
}

// Delete an event
function deleteEvent(e_id){
    var event = events.find(x => x.id == e_id)
    if(event){
        if (event["bookings"].length == 0) {
            eventIndex = events.findIndex(x => x.id == e_id)
            events.splice(eventIndex, 1); 
            return [event, 200]
        } else {
            return [{"message": "Cannot delete event with existing bookings"}, 400]
        }
    } else {
        return [{"message": "Event Not Found"}, 404]
    }
}

// Read all bookings for an event
function getBookingsForEvent (e_id){
    var result = []
    var event = events.find(x => x.id == e_id)
    if (event) {
        var resultIds = event["bookings"]
        resultIds.forEach(b_id => {
            var bookingIndex = bookings.findIndex(x => x.id == b_id)
            result.push(bookings[bookingIndex])
        }); 
        return [result, 200]
    } else {
        return [{"message":"Event Not Found"}, 404]
    }
}

// Read an individual booking
function getBooking(e_id, b_id) {
    var event = events.find(x => x.id == e_id)
    var booking = bookings.find(x => x.id == b_id)
    if (event) {
        if (booking) {
            var bookingEventIndex = event["bookings"].findIndex(x => x == b_id)
            if (bookingEventIndex != -1) {
                return [booking, 200]
            } else {
                return [{"message": "Booking does not exist for this event"}, 404]
            }
        } else {
            return [{"message": "Booking Not Found"}, 404]
        }
    } else {
        return [{"message": "Event Not Found"}, 404]
    }
}

// Create a new booking
function createBooking(e_id, req) {
    var newBooking = {}
    var event = events.find(x => x.id == e_id)
    if (!event) {
        return [{"message": "Event Not Found"}, 404]
    }
    if (getEventSpotsLeft(e_id) > 0) {
        newBooking["id"] = getNewId(bookings)
        if (req.body.firstName) {
            newBooking["firstName"] = req.body.firstName
        } else {
            return [{"message": "firstName is required"}, 400]
        }
        if (req.body.lastName) {
            newBooking["lastName"] = req.body.lastName
        } else {
            return [{"message": "lastName is required"}, 400]
        }
        if (req.body.tel || req.body.email) {
            if (req.body.tel) {
                newBooking["tel"] = req.body.tel
            } 
            if (req.body.email) {
                newBooking["email"] = req.body.email
            }
        } else {
            return [{"message": "tel and/or email is required"}, 400]
        }
        if (req.body.spots) {
            if (Number.isInteger(parseInt(req.body.spots)) && req.body.spots > 0) {
                if (getEventSpotsLeft(e_id) >= req.body.spots) {
                    newBooking["spots"] = parseInt(req.body.spots)
                } else {
                    return [{"message": "Not enough spots available"}, 400]
                }
            } else {
                return [{"message": "spots is invalid"}, 400]
            }
        } else {
            return [{"message": "spots is required"}, 400]
        }

        bookings.push(newBooking)

        event["bookings"].push(newBooking["id"])

    } else {
        return [{"message": "Event Capacity reached"}, 400]
    }

    return [newBooking, 201]
}

// Delete a booking
function deleteBooking(e_id, b_id) {
    var event = events.find(x => x.id == e_id)
    var booking = bookings.find(x => x.id == b_id)
    if (event){
        if(booking){
            var bookingIndex = bookings.findIndex(x => x.id == b_id)
            var bookingEventIndex = event["bookings"].findIndex(x => x == b_id)
            if(bookingIndex != -1 && bookingEventIndex != -1) {
                bookings.splice(bookingIndex, 1)
                event["bookings"].splice(bookingEventIndex, 1)
                return [booking, 200]
            }
            else {
                return [{'message':"Booking does not exist for this event"}, 404]
            }
        }    
        else {
            return [{'message':"Booking is not found"}, 404]
        }
    }   
    else{
        return [{'message':"Event is not found"}, 404]
    }   
        
}

// Delete all bookings for an event
function deleteAllBookings(e_id) {
    var deletedBookingsIds = []
    var deletedBookings = []
    var event = events.find(x => x.id == e_id)
    if (event) {
        event["bookings"].forEach(booking => {
            deletedBookingsIds.push(booking)
        });
        event["bookings"] = []
        deletedBookingsIds.forEach(b_id => {
            var bookingIndex = bookings.findIndex(x => x.id == b_id)
            deletedBookings.push(bookings[bookingIndex])
            bookings.splice(bookingIndex, 1)
        });
        return [deletedBookings, 200]
    } else {
        return [{'message':"Event is not found"}, 404]
    }
}

// Find new id for event/booking
function getNewId(array) {
    ids = []
    array.forEach(element => {
        ids.push(element["id"])
    });
    return Math.max(...ids) + 1
}

// Calculate spots left for an event
function getEventSpotsLeft(e_id) {
    eventSpots = 0
    var event = events.find(x => x.id == e_id)
    event["bookings"].forEach(b_id => {
        var booking = bookings.find(x => x.id == b_id)
        eventSpots += booking["spots"]
    });
    eventSpotsLeft = event["capacity"] - eventSpots
    return eventSpotsLeft
}