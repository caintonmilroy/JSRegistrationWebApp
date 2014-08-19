var DataStore = DataStore || {
    peopleStorage: window.sessionStorage
};

DataStore.getPersonByIndex = function(index) {
    var key = this.peopleStorage.key( index );
    var someone = Person.createPersonFromJSON( this.peopleStorage.getItem( key ) );
    return someone;
};

DataStore.getNumberOfPeople = function() {
    return this.peopleStorage.length;
};

DataStore.addPersonToStorage = function( someone ) {
    this.peopleStorage.setItem( String( this.peopleStorage.length ), JSON.stringify( someone ) );
};

DataStore.removePersonByIndex = function ( index ) {
    this.peopleStorage.removeItem( this.peopleStorage.key(index) );
};

DataStore.clearPeopleStorage = function() {
    this.peopleStorage.clear();
};

DataStore.getPeopleAsCommaSeparatedString = function() {
    var bigString = " ";
    for ( var i = 0; i < this.getNumberOfPeople(); i++) {
        var someone = this.getPersonByIndex(i);
        bigString += someone.firstname + "," + someone.lastname + "," + someone.dateOfBirth + ",";
    }
    bigString = bigString.replace(/,$/,'');
    return bigString;
};

DataStore.addPeopleFromCommaSeparatedString = function(bigString) {
    var fields  = bigString.split(",");
    for (var i = 0; i < fields.length; i += 3) {
        DataStore.addPersonToStorage( Person(fields[i], fields[i + 1], fields[i + 2]) );
    }
};

DataStore.addNewFile = function(filename, fileContents) {
    localStorage.setItem( filename, fileContents );
};

DataStore.getFilenames = function() {
    var filenames = [], i, key;
    for (i = 0; i < localStorage.length; i++) {
        key = localStorage.key(i);
        filenames.push( localStorage.key(i) );
    }
    return filenames;
};

DataStore.replacePeopleWithFileContents = function(filename) {
      var fileContents = localStorage.getItem(filename);
      this.peopleStorage.clear();
      DataStore.addPeopleFromCommaSeparatedString(fileContents);
};