var MAGIC_DATE_FORMAT_CODE = 31557600000;//to be used for calculation
function addPersonToTable(someone) {
    'use strict';
// use var when you create tabularForm
    var tabularForm, tablerow, fname, lname, dob, myBirthDay;
    tabularForm = document.createDocumentFragment();
    tablerow = document.createElement('tr');
    // append to the dom the latest person (ie., myArray)
    fname = document.createElement('td');//Start of First Name
    fname.innerHTML = someone.firstname;
    tablerow.appendChild(fname);//End of First Name
    lname = document.createElement('td');//Start Lastname
    lname.innerHTML = someone.lastname;
    tablerow.appendChild(lname);//End Lastname
    dob = document.createElement('td');//Start DOB
    dob.innerHTML = someone.dateOfBirth;
    tablerow.appendChild(dob);//End DOB
    myBirthDay = document.createElement('td'); //Start of Birth Day
    myBirthDay.innerHTML = someone.age();
    tablerow.appendChild(myBirthDay);//End of Birth Date
    tabularForm.appendChild(tablerow);
    document.getElementById("details").appendChild(tabularForm);
}

function updateStatistics(total) {
'use strict';
    var numPeople = DataStore.getNumberOfPeople();
    var sum = 0;
    var sumSquare = 0;
    var stdeviation = 0;
    for (var i = 0; i < numPeople; i += 1) {
        var someone = DataStore.getPersonByIndex(i);
        sum += someone.age();
        sumSquare = sumSquare + someone.age() * someone.age();
        stdeviation = Math.sqrt(sumSquare / numPeople);
    }
    document.getElementById("count").innerHTML = numPeople; // Count declaration
    document.getElementById('sumofAge').innerHTML = sum;

    var mean = 0;
    if (numPeople > 0 )
        mean = sum / numPeople;
    document.getElementById("mean").innerHTML = mean;

    document.getElementById("standardDeviation").innerHTML = stdeviation;
}

function registerAPerson( someone ) {
	 'use strict';
    DataStore.addPersonToStorage(someone);
    updatePage();
    whenFirstPersonDisplayInfo(someone);
}

function clearTable() {
    var table = document.getElementById('details');
    var lastRow = table.rows.length - 1;
    for (var i = lastRow; i > 0; i--) {
        table.deleteRow(i);
    }
}

function updatePage() {
    document.getElementById("inputFrom").reset();
    clearTable();
    document.getElementById("newLocalStoreFilename").value = "";
    clearListbox(document.getElementById('registeredPeople'));
    clearListbox(document.getElementById("filesInStorage"));
    var numPeople = DataStore.getNumberOfPeople();
    for (var i = 0; i < numPeople; i += 1) {
        var someone = DataStore.getPersonByIndex(i);
        addPersonToTable(someone);
        addPersonToListbox(someone);
    }
    updateFilesInStorageListbox();
    updateStatistics();
}

function storedFileSelected(evt) {
    var listbox = evt.target;
    var selectedFilename = listbox.options[listbox.selectedIndex].text;
    document.getElementById('newLocalStoreFilename').value = selectedFilename;
}


function whenFirstPersonDisplayInfo(someone) {
    if (DataStore.getNumberOfPeople() === 1)
        displaySomeonesInfo(someone);
}

function addPersonToListbox(someone) {//Listbox addittion
    var listbox = document.getElementById("registeredPeople");
    var option = document.createElement("option");
    option.text = someone.firstname + " " + someone.lastname;
    listbox.add(option);
}

function removePerson(evt) {
    var listbox = document.getElementById('registeredPeople');
    var index = listbox.selectedIndex;
    if (index !== -1) {
        DataStore.removePersonByIndex(index);
        updatePage();
    }
}

function displayPersonInfo(evt) {
    var index = evt.target.selectedIndex;
    displaySomeonesInfo( DataStore.getPersonByIndex(index) );
}

function displaySomeonesInfo(someone) {
    var output = document.getElementById("registeredPersonInfo");
    output.innerHTML = '';
    var info = someone.firstname + " " + someone.lastname + " is " + someone.age() + " years old.";
    output.appendChild( document.createTextNode(info) );
}

function registerBirthFromPage() {
    var someone = Person.createPersonFromPage(document);

    try {
//        validatePerson(someone);
        registerAPerson( someone );
    } catch(e) {
        alert(e);
    }
}

function getPeopleFromText(evt) {
	 'use strict';
    var text = evt.target.result;
    text = text.replace(/\"/g,'');//strip out apostrophes
    var fields  = text.split(",");
    var listOfPeople = [];
    for (var i = 0; i < fields.length; i += 3) {
        listOfPeople.push( Person(fields[i], fields[i + 1], fields[i + 2]) );
    }
    return listOfPeople;//text from the source done by stripping of the commas
}

function registerBirthsFromFile(evt) {
	 'use strict';
    var reader, people;
    reader = new FileReader;
    reader.onload = function(e) {
        people = getPeopleFromText(e);
        for (var i = 0; i < people.length; i++)
            registerAPerson( people[i] );
    };
    reader.readAsText(evt.target.files[0]);
}

function savePeopleIntoFileInLocalStorage(evt) {
    var fileContents, filename;
    'use strict';
    fileContents = DataStore.getPeopleAsCommaSeparatedString();
    filename = document.getElementById("newLocalStoreFilename").value;
    DataStore.addNewFile(filename, fileContents);
    updatePage();
}

function clearListbox(listbox) {
    'use strict';
    var start = listbox.options.length - 1;
    for (var i = start; i >= 0; i--) {
        listbox.remove(i);
    }
    
}

function updateFilesInStorageListbox() {
    'use strict';
    var filenames, listbox, option;
    filenames = DataStore.getFilenames();
    listbox = document.getElementById("filesInStorage");
    filenames.forEach( function(filename) {
         option = document.createElement("option");
        option.text = filename;
        listbox.add( option );
    });
}

function loadFromStore() {
    var filename = getSelectedFilenameFromStorageListbox();
    DataStore.replacePeopleWithFileContents(filename);
    updatePage();
}

function getSelectedFilenameFromStorageListbox() {
    var listbox = document.getElementById("filesInStorage");
    return listbox.options[listbox.selectedIndex].text;
}