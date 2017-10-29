
function getUsersByPage(page) {
	$.ajax({
		url: window.location.href+"/loadUsersForAdminPanel",
		data: {adminFilter: adminFilter, searchWord: searchWord, page: page},
		success: function(result) {
			console.log("ajax result: ", result);

			//Clear table of users (if already loaded)
			var tableBody = document.getElementById("tableBody");
			while (tableBody.firstChild) {
				tableBody.removeChild(tableBody.firstChild);
			}

			//Show loading
			var progress = document.getElementById("progress");
			progress.className = "progress";
			var indeterminate = document.createElement("div");
			indeterminate.className = "indeterminate";
			progress.appendChild(indeterminate);

			//Put new users in table
			var users = result.users;
			if (users.length > 0) {
				for (var u in users) {
					var row = document.createElement("tr");

					//Name
					var item = document.createElement("td");
					item.innerHTML = users[u].name;
					row.appendChild(item);

					//Email
					var item = document.createElement("td");
					item.innerHTML = users[u].email;
					row.appendChild(item);

					//totalMessages
					var item = document.createElement("td");
					item.innerHTML = users[u].totalMessages;
					row.appendChild(item);

					//Admin toggle
					var item = document.createElement("td");
					if (users[u].isAdmin == true){
						item.innerHTML = '<div class="switch"><label>False<input checked id="'+users[u].id+' "type="checkbox"><span class="lever"></span>True</label></div>';
					}else {
						item.innerHTML = '<div class="switch"><label>False<input id="'+users[u].id+' "type="checkbox"><span class="lever"></span>True</label></div>';
					}
					row.appendChild(item);

					tableBody.appendChild(row);

				}
			}

			//Remove loading bar
			progress.className = "";
			while (progress.firstChild) {
				progress.removeChild(progress.firstChild);
			}

			//On click on switch (isAdmin toggle)
			$(".switch").find("input[type=checkbox]").on("change",function() {
			    var boolean = $(this).prop('checked');
				var userId = $(this).attr('id');

			     $.ajax({
					type: 'POST',
			 		url: window.location.href+"/adminToggle",
			 		data: {userId: userId, isAdmin: boolean, _csrf: _csrf},
			 		success: function(result) {
						if (result.response == "OK"){Materialize.toast('Successfully updated user.', 4000);}
						else {Materialize.toast('Failed to update user.. :(', 4000);}
					}
				});
			});
		}
	});
}

//On pressing enter while typing in search input
$("#search").on('keyup', function (e) {
    if (e.keyCode == 13) {
        searchButton();
    }
});

//Search button
function searchButton() {
	//Get search value
	var searchWord = document.getElementById('search').value;
	var adminFilter = document.getElementById("adminFilter").checked;
	console.log("pressed search button with value: ",searchWord);

	//Reload current page with hidden post form containing new search word
    var form = document.createElement('form');
    form.method = 'post';
    form.action = '';

    var input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'search';
    input.value = searchWord;
    form.appendChild(input);

    var isAdmin = document.createElement('input');
    isAdmin.type = 'hidden';
    isAdmin.name = 'adminFilter';
    isAdmin.value = adminFilter;
    form.appendChild(isAdmin);

    var csrf = document.createElement('input');
    csrf.type = 'hidden';
    csrf.name = '_csrf';
    csrf.value = _csrf;
    form.appendChild(csrf);
	document.body.appendChild(form);
    form.submit();
}

//On webpage load
$(document).ready(function() {

	//Initialize materialize pagination addon (with new pages count)
	var pageCount = pagination.pageCount;
	$('#pagination').materializePagination( {
		align: 'center',
		lastPage:  pageCount,
		firstPage:  1,
		urlParameter: 'page',
		useUrlParameter: false,
		//On click on page number
		onClickCallback: function(requestedPage){
			getUsersByPage(requestedPage);
		}
	});

	//Toast after receiving users
	if (searchWord != ""){
		if (pagination.userCount <= 0){Materialize.toast('Could not find any users matching "'+searchWord+'".', 4000);}
		else {Materialize.toast('Found ('+pagination.userCount+') users matching "'+searchWord+'".', 4000);}
	}else{
		Materialize.toast('Found ('+pagination.userCount+') total users.', 4000);
	}

	//Default page
	getUsersByPage(1);
})
