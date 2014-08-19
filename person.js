var Person = function(first, last, dob) {
    'use strict';
    return {
        firstname: first,
        lastname: last,
        dateOfBirth: dob,
        age: function() {
            var today, dobAsDate;
            today = new Date();
            dobAsDate = new Date(this.dateOfBirth);
            return Math.floor((today - dobAsDate) / MAGIC_DATE_FORMAT_CODE);//Date of birth properly formatted
        }};
};

Person.createPersonFromJSON = function( string ) {
    var data = JSON.parse( string );
    return Person( data.firstname, data.lastname, data.dateOfBirth );
};

Person.createPersonFromPage = function(document) {
    var fname, lname, dob;
    fname = document.getElementById('firstname').value; //Object one
    lname = document.getElementById('lastname').value;//Object two
    dob = document.getElementById('birthDate').value;//Object three
    return Person(fname, lname, dob);
};

