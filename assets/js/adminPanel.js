
function getUsersByPage(page) {
	$.ajax({
		url: window.location.href,
		data: {page: page},
		success: function(result) {
			console.log("ajax result: ", result);

			var tableBody = document.getElementById("tableBody");

			//Clear table of users (if already loaded)
			while (tableBody.firstChild) {
				tableBody.removeChild(tableBody.firstChild);
			}

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
						item.innerHTML = '<div class="switch"><label>Off<input checked type="checkbox"><span class="lever"></span>On</label></div>';
					}else {
						item.innerHTML = '<div class="switch"><label>Off<input type="checkbox"><span class="lever"></span>On</label></div>';
					}
					
				row.appendChild(item);

					tableBody.appendChild(row);
				}
			}
		}
	});
}

$(document).ready(function() {
	$('#pagination').materializePagination( {
		align: 'center',
		lastPage:  pagination.pageCount,
		firstPage:  1,
		urlParameter: 'page',
		useUrlParameter: false,
		onClickCallback: function(requestedPage){
			getUsersByPage(requestedPage);
		}
	});

	getUsersByPage(1);
})
