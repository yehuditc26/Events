//load events
document.addEventListener("DOMContentLoaded", updateView);

//update view in calendar
function updateView() {
    console.log("loading events");
    // axios.get("https://eventsapi.onrender.com/api/Events").then((res) => {

    axios.get("https://localhost:7259/api/Events").then((res) => {
        var calendarEl = document.getElementById("calendar");
        var calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: "dayGridMonth",
            events: res.data,
        });
        calendar.render();
    });
}


document.getElementById("addB").onclick = addEvent;
document.getElementById("addBC").onclick = close;
document.getElementById("saveAdd").onclick = addNewEvent;
document.getElementById("deleteB").onclick = deleteEvent;
document.getElementById("deleteBC").onclick = clean;
document.getElementById("updateB").onclick = updateEvent;
document.getElementById("updateBC").onclick = clean;


//show inputs for adding event
function addEvent() {
    document.querySelector("#addDiv").classList.remove("hide");
}

//hide inputs of adding event
function close() {
    let idParent = this.parentElement.getAttribute("id");
    console.log(idParent);
    document.querySelector(`#${idParent}Div`).classList.add("hide");
}

//clean events in DOM
function clean(){
    let idParent = this.parentElement.getAttribute("id");
    console.log(idParent);
    document.querySelector(`#${idParent}Div`).innerHTML="";
}

//add new event + update view
function addNewEvent() {
    console.log("addEventFunc");

    axios.post("https://localhost:7259/api/Events",
        {
            "title": document.querySelector("#title").value,
            "start": document.querySelector("#date").value,
        }).then((res) => {
            console.log(`added ${JSON.stringify(res.data)}`);
            updateView()
        });

};


//get array of events
let events;
function getEvents(res) {
    events = res.data.map(function (r) {
        return {
            id: r.id,
            title: r.title,
            start: r.start,
            end: r.end
        };
    });
    console.log(events);
    return events;
}


//delete event
function deleteEvent() {
    console.log("deleteEventFunc");

    axios.get("https://localhost:7259/api/Events").then((res) => {
        console.log(res);

        select = document.createElement("select");
        select.setAttribute("id", "selectTitle");
        document.querySelector("#deleteDiv").innerHTML = "";
        document.querySelector("#deleteDiv").append(select);

        events = getEvents(res);
        for (t of events) {
            option = document.createElement("option");
            option.innerHTML = `${t.title}`;
            document.querySelector("#selectTitle").append(option);
        }
        document.querySelector("#saveDelete").classList.remove("hide");

        let selected = document.querySelector("#selectTitle").value;
        console.log("selected:" + selected);



        let btns = document.querySelectorAll(".btnDelete");
        console.log(btns);
        btns.forEach(b => {
            addEventListener("click", deleteSelected);
        });
    });
}

//delet selected event + update viewv
function deleteSelected(event) {
    console.log("deleteSelected Func");
    console.log(event);

    const selected = event.target.getAttribute("id");
    console.log(`${selected} deleted`);

    axios.delete(`"https://localhost:7259/api/Events/${selected}`
    ).then((res) => {
        updateView();
    });
}


//update event
function updateEvent() {

    console.log("updateEventFunc");

    axios.get("https://localhost:7259/api/Events").then((res) => {
        console.log(res);

        ul = document.createElement("ul");
        ul.setAttribute("id", "listToUpdate");
        document.querySelector("#updateDiv").innerHTML = "";
        document.querySelector("#updateDiv").append(ul);

        let events = getEvents(res);
        for (t of events) {
            li = document.createElement("li");
            li.innerHTML = `<input id="eTitle${t.id}" value="${t.title}" > <br>
            <input id="eStart${t.id}" value="${t.start}"><br>
            <input id="eEnd${t.id}" value="${t.end}"><br>
            <button id="${t.id}" class="btnUpdate">update</button>`;
            document.querySelector("#listToUpdate").append(li);
        }

        let btns = document.querySelectorAll(".btnUpdate");
        console.log(btns);
        btns.forEach(b => {
            addEventListener("click", updateSelected);
        });
    });

}


//update selected event + update view
function updateSelected(event) {
    console.log("deleteSelected Func");
    console.log(event);

    const selected = event.target.getAttribute("id");
    console.log(`${selected} update`);

    axios.put(`"https://localhost:7259/api/Events/${selected}`,
        {
            "title": document.querySelector(`#eTitle${selected}`).value,
            "start": document.querySelector(`#eStart${selected}`).value,
            "end": document.querySelector(`#eEnd${selected}`).value,
        }
    ).then((res) => {
        updateView();
    });

}

