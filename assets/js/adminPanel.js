
function getUsersByPage(page) {
	$.ajax({
		url: window.location.href+"/loadUsersForAdminPanel",
		data: {page: page},
		success: function(result) {
			console.log("ajax result: ", result);

			var tableBody = document.getElementById("tableBody");

			//Put new users in table
			var users = result.users;
			if (typeof(users) !== 'undefined') {
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

			//On click on switch (isAdmin toggle)
			$(".switch").find("input[type=checkbox]").on("change",function() {
				console.log("toggling");
			    var boolean = $(this).prop('checked');
				var userId = $(this).attr('id');

			     $.ajax({
					type: 'POST',
			 		url: window.location.href+"/adminToggle",
			 		data: {userId: userId, isAdmin: "test"},
			 		success: function(result) {
						console.log("result: ", result);
					}
				});
			});
		}
	});
}

//On webpage load
$(document).ready(function() {
	//Initialize materialize pagination addon
	$('#pagination').materializePagination( {
		align: 'center',
		lastPage:  pagination.pageCount,
		firstPage:  1,
		urlParameter: 'page',
		useUrlParameter: false,
		//On click on page number
		onClickCallback: function(requestedPage){

			//Clear table of users (if already loaded)
			var tableBody = document.getElementById("tableBody");
			while (tableBody.firstChild) {
				tableBody.removeChild(tableBody.firstChild);
			}

			getUsersByPage(requestedPage);
		}
	});

	//Default page
	getUsersByPage(1);
})
