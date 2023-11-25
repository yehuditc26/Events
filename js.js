//load events
document.addEventListener("DOMContentLoaded", updateView);

//update view in calendar
function updateView() {
    console.log("updateView Func");
    axios.get("https://localhost:7259/api/Events").then((res) => {
        var calendarEl = document.getElementById("calendar");
        var calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: "dayGridMonth",
            events: res.data,
        });
        calendar.render();
    });
}


let navBtn = document.querySelectorAll(".navBtn");
let action;

navBtn.forEach(element => {
    element.onclick = navClick;
});

//when select action
function navClick() {
    document.querySelector("#data").classList.remove("hide");
    action = this.innerHTML;
    console.log(action);
    document.querySelector("#save").innerHTML = action;
    document.querySelector("#save").addEventListener('click', OnSave);

    if (action == "add") {
        document.querySelector("#title").value = "";
        document.querySelector("#dateS").value = "";
        document.querySelector("#dateE").value = "";
        document.querySelector("#inputDiv").classList.remove("hide");
        document.querySelector("#selectDiv").classList.add("hide");
    }

    else if ((action == "delete") || (action == "update")) {
        document.querySelector("#selectDiv").classList.remove("hide");
        document.querySelector("#inputDiv").classList.add("hide");
        OptionSelect();
    }
};

function OptionSelect() {
    //option's to select
    axios.get("https://localhost:7259/api/Events")
        .then((res) => {
            console.log("res:")
            console.log(res);
            events = res.data.map(function (r) {
                return {
                    id: r.id,
                    title: r.title,
                    start: r.start,
                    end: r.end
                };
            })
            document.querySelector("#select").innerHTML = "";
            console.log("events:")
            console.log(events);
            for (e of events) {
                let option = document.createElement("option");
                option.innerHTML = `${e.title}`;
                option.setAttribute("id", `${e.id}`);
                document.querySelector("#select").append(option);
            }
        });
}


function OnSave() {
    console.log("OnSave Func");
    switch (action) {
        case "add":
            AddEvent();
            break;
        case "delete":
            DeleteEvent();
            break;
        case "update":
            UpdateEvent();
            break;
    }
}


document.querySelector("#select").addEventListener('change', OnSelected);
let selected;
let selectedEvent;

//when select option
function OnSelected() {
    console.log("OnSelected Func");

    selected = document.querySelector("#select").value;
    console.log("selected:");
    console.log(selected);
    selectedEvent = events.find(function (value) { return value.title == selected })
    console.log("selectedEvent:");
    console.log(selectedEvent);

    if (action == "update") {
        document.querySelector("#title").value = selectedEvent.title;
        document.querySelector("#dateS").value = selectedEvent.start;
        document.querySelector("#dateE").value = selectedEvent.end;
        document.querySelector("#inputDiv").classList.remove("hide");
    }
}


function AddEvent() {
    console.log("addEvent Func");

    axios.post("https://localhost:7259/api/Events",
        {
            "title": document.querySelector("#title").value,
            "start": document.querySelector("#dateS").value,
            "end": document.querySelector("#dateE").value,
        }).then((res) => {
            console.log(`added ${JSON.stringify(res.data)}`);
            updateView()
        });
}


function DeleteEvent() {
    console.log("DeleteEvent Func");
    console.log(selectedEvent);

    axios.delete(`"https://localhost:7259/api/Events/${selectedEvent.id}`
    ).then((res) => {
        OptionSelect();
        updateView();
    });
}


function UpdateEvent() {
    console.log("UpdateEvent Func");
    console.log(selectedEvent);

    axios.put(`"https://localhost:7259/api/Events/${selectedEvent.id}`,
        {
            "title": document.querySelector("#title").value,
            "start": document.querySelector("#dateS").value,
            "end": document.querySelector("#dateE").value,
        }
    ).then((res) => {
        OptionSelect();
        updateView();
    });
}







