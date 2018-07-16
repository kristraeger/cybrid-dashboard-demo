//custom filter to display tag times in readable format
app.filter('convertUnix', function() {
    return function(input) {
		var tempdate = new Date(parseInt(input))
		//create specific variables for hour, min and sec to add 0 for values < 10
		var hour = tempdate.getHours() < 10 ? '0' + tempdate.getHours() : tempdate.getHours()
		var min = tempdate.getMinutes() < 10 ? '0' + tempdate.getMinutes() : tempdate.getMinutes()
		var sec = tempdate.getSeconds() < 10 ? '0' + tempdate.getSeconds() : tempdate.getSeconds()
		var date = (tempdate.getMonth()+1)+"/"+tempdate.getDate()+"/"+tempdate.getFullYear() +" "+ hour +":"+ min
        return date
    }
});

app.filter('convertUnixDay', function() {
    return function(input) {
    	var type = typeof input
    	
    	if(type === "string"){
    		return input
    	}
    	
    	var date 
    	
		var tempdate = new Date(parseInt(input))
    	
    	var tempyear = tempdate.getFullYear()
    	var tempday = tempdate.getDate()
    	var tempmonth = (tempdate.getMonth()+1)
    	var tempweekday = tempdate.getDay()

		var inputdate = tempmonth+"/"+tempday +"/"+tempyear
		var inputsum = tempyear - tempmonth - tempday

		
		var now = new Date()
    	var nowyear = now.getFullYear()
    	var nowday = now.getDate()
    	var nowmonth = (now.getMonth()+1) 
    	
		var currentsum = nowyear - nowmonth - nowday
		
		var diff = currentsum - inputsum
		
		function getWeekDay(day){

    		var name
    		
    		if(day == 0){
    			name = "Sunday"
    		} else if(day == 1){
    			name = "Monday"
    		} else if(day == 2){
    			name = "Tuesday"
    		} else if(day == 3){
    			name = "Wednesday"
    		} else if(day == 4){
    			name = "Thursday"
    		} else if(day == 5) {
    			name = "Friday"
    		} else if(day == 6){
    			name = "Saturday"
    		} else {
    			name = "Past Week"
    		}

    		return name
    		
    	}
		
		// if difference between dates shorter than a week
		if(diff > -7 && diff < 1){
			
			if(diff ===  0) {
				date = "Today"
			} else if (diff === -1) {
				date = "Yesterday"
			} else {
				date = getWeekDay(tempweekday)
			}
				
		} else {
			date = inputdate
		}
		
        return date
    }
});

app.filter('convertUnixHour', function() {
    return function(input) {
    	if(typeof input == "string"){
    		return input
    	}
		var tempdate = new Date(parseInt(input))
		//create specific variables for hour, min and sec to add 0 for values < 10
		var hour = tempdate.getHours() < 10 ? '0' + tempdate.getHours() : tempdate.getHours()
		var min = tempdate.getMinutes() < 10 ? '0' + tempdate.getMinutes() : tempdate.getMinutes()
		var date = hour +":"+ min
        return date
    }
});

app.filter('searchFor', function(){
    return function(arr, searchString){
    	data = arr.loadedPages[0]
    	console.log(data)
        if(!searchString){
            return arr;
        }
        var result = [];
        searchString = searchString.toLowerCase();
        console.log(searchString)
        angular.forEach(data, function(item){
            if(item.info.type.toLowerCase().indexOf(searchString) !== -1){
            result.push(item);
        	console.log(item)
            }
        });
        
        return result
    };
});

app.filter('customerState', function(){
    return function(input){
    	var result
    	if(input === "California") {
    		result = "CA"
    	} else {
    		result = input
    	}
        
        return result
    };
});



