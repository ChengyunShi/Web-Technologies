<?php

	$GOOGLE_API="";
	$FORECAST_API="";

	if(isset($_POST["search"]) && $_POST["search"]) 
	{
		$lat = "";
		$lng = "";
		if(!(isset($_POST["lat"]) && $_POST["lat"])) 
		{
			$street = urlencode($_POST["street"]);
			$city = urlencode($_POST["city"]);
			$state = urlencode($_POST['state']);
			$url = "https://maps.googleapis.com/maps/api/geocode/xml?address=[$street,$city,$state]&key=$GOOGLE_API";
    		$xmlstr = file_get_contents($url);
    		$xml = new SimpleXMLElement($xmlstr);
    		$lat = $xml->result->geometry->location[0]->lat;
    		$lng = $xml->result->geometry->location[0]->lng;
		}
		else
		{
			$lat = $_POST["lat"];
			$lng = $_POST["lon"];
		}
    	$forecast_url = "https://api.forecast.io/forecast/$FORECAST_API/$lat,$lng?exclude=minutely,hourly,alerts,flags";
    	$json_file = file_get_contents($forecast_url);
    	echo $json_file;
    	exit();
    }

    if(isset($_POST["time"]) && $_POST["time"])
    {
    	$lat = $_POST["lat"];
		$lng = $_POST["lon"];
    	$time = $_POST["time"];
    	$daily_weather_detail_url = "https://api.darksky.net/forecast/$FORECAST_API/$lat,$lng,$time?exclude=minutely";
    	$detail_json = file_get_contents($daily_weather_detail_url);
    	echo $detail_json;
    	exit();
    }
	
?>
<html>
<head>
	<title>forecast</title>
	<style>
		body{
			font-family:'Times New Roman';
		}
		#searchBox{
			background-color: #06b823;
	    	color: white;
	    	height: 200px;
	    	width: 700px;
	    	border-radius: 10px;
	    	margin: auto;
		}
		#searchBox h1{
			width: max-content;
    		margin: auto;
    		font-style: italic;
		}
		#form_table{
			width: 600px;
			margin: auto;
			height: 160px;
			color: white;
		}
		#check_input{
			margin: 10px auto;
		    width: 360px;
		    background-color: #d9d9d9;
		    border: 2px solid #8d8d8d;
		    text-align: center;
		}
		.center{
			text-align: center;
		}
		.flex-container {
		  display: flex;
		  flex-wrap: nowrap;
		}
		.flex-container > div{
			width: 60px;
			margin: 10px;
			font-weight: bold;
			font-size: 20px;
			text-align: center;
		}
		.flex-container img{
			width: 26px;
			height: 26px;
		}
		#forecast_table {
			border-collapse: collapse;
			text-align: center;
			margin: auto;
		}
		#forecast_table th, #forecast_table td{
			background-color: #8bc3f0;
			border: 2px solid #378fb9;
			color: white;
			font-weight: bold;
			padding: 2px 5px;
		}
		#forecast_table img{
			width: 30px;
			height: 30px;
		}
		#detail_table{
			color: white;
			font-weight: bold;
			font-size: 18px;
			clear: left;
			margin: auto 140px;
    		width: max-content;
		}
		#detail_table .left{
			text-align: left;
		}
		#detail_table .right{
			text-align: right;
		}
		#detail_table tr{
			line-height: 22px;
		}
		#detail_table .large{
			font-size: 26px;
		}
		#detail_table .small{
			font-size: 14px;
		}
	</style>
	<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
	<script type="text/javascript">
   	
    	google.charts.load('current', {packages: ['corechart', 'line']});
		google.charts.setOnLoadCallback(drawBasic);
    	
      	function drawBasic(json) {
      		if(typeof(json)=="undefine" || json==null) return;
      		if(json=="") return;
      		var html_text = "<h1 style='width:max-content;margin: auto auto 15px;'>Day's Hourly Weather</h1>";
			html_text += "<img src='http://csci571.com/hw/hw6/images/arrow_up.png' onclick='draw_chart("+JSON.stringify(json)+")' style='width:30px;cursor:pointer;'>";
			document.getElementById("chart_title").innerHTML = html_text;
        	var data = new google.visualization.DataTable();
		    data.addColumn('number', 'X');
		    data.addColumn('number', 'T');

		    var value = json.hourly.data;

		    for(var i=0; i<value.length; i++)
		    {
		    	data.addRows([[i,value[i].temperature]]);
		    }	

		    var options = {
		        hAxis: {
		          title: 'Time'
		        },
		        vAxis: {
		          title: 'Temperature',
		          textPosition: 'none'
		        },
		        colors:['#a7d6e1']
		    };

		    var chart = new google.visualization.LineChart(document.getElementById('data_chart'));

		    chart.draw(data, options);
      	}
    </script>
	<script type="text/javascript">
		var lat;
		var lon;
		var city;
    	function send_request(){
    		document.getElementById("detail_card").innerHTML = "";
    		document.getElementById("chart_title").innerHTML = "";
    		document.getElementById("data_chart").innerHTML = "";
    		var xmlhttp = new XMLHttpRequest();
    		var params = "";
    		if(document.getElementById("currentLocation").checked) {
    			document.getElementById("check_input").setAttribute("hidden","");
    			params = "lat="+lat+"&lon="+lon+"&search=search";
    		}
    		else {
    			if(document.getElementById("street").value == "") {error_input();return;}
    			else if(document.getElementById("city").value == "") {error_input();return;}
    			else if(document.getElementById("state").value == "State") {error_input();return;}
    			else {
    				document.getElementById("street").setAttribute("style", "width: 140px;");
    				document.getElementById("city").setAttribute("style", "width: 140px;");
    				document.getElementById("state").style = null;
    				document.getElementById("check_input").setAttribute("hidden","");
    			}
    			params = "street="+document.getElementById("street").value+"&city="+document.getElementById("city").value+"&state="+document.getElementById("state").value+"&search=search";
    		}
    		params = encodeURI(params);
    		xmlhttp.onreadystatechange = function(){
	        if(xmlhttp.readyState==4 && xmlhttp.status == 200){
	            	var json = JSON.parse(xmlhttp.responseText);
	            	if(json.error != null) {
	            		document.getElementById("card").innerHTML = "";
    					document.getElementById("data_table").innerHTML = "";
	            		error_input();
	            		return;
	            	}
	            	lat = json.latitude;
	            	lon = json.longitude;
	            	card_view(json);
	            	forecast_table(json);
	        	}
	   	 	}
    		xmlhttp.open("POST","/forecast.php",false);
    		xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    		xmlhttp.send(params);
    	}

    	function send_detail_request(time){
    		document.getElementById("card").innerHTML = "";
    		document.getElementById("data_table").innerHTML = "";
    		document.getElementById('data_chart').innerHTML = "";
    		var xmlhttp = new XMLHttpRequest();
    		var params = "lat="+lat+"&lon="+lon+"&time="+time;
    		params = encodeURI(params);
    		xmlhttp.onreadystatechange = function(){
	        if(xmlhttp.readyState==4 && xmlhttp.status == 200){ 
	            	var json = JSON.parse(xmlhttp.responseText);
	            	daily_weather_detail(json);
	            	draw_chart(json);
	        	}
	   	 	}
    		xmlhttp.open("POST","/forecast.php",false);
    		xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    		
    		xmlhttp.send(params);
    	}
    </script>
	
    <script type="text/javascript">
		function card_view(json) {
			var html_text = "";

			if(document.getElementById("currentLocation").checked == false) 
				city = document.getElementById("city").value;
			
		    html_text += "<div style='width:400px;background-color:#5dcdff;color:white;border-radius:15px;margin: auto;padding:20px;'>";
		    html_text += "<span style='font-size: 28px;font-weight: bold;'>"+city + "</span><br>";
		    html_text += "<span style='font-size: 13px;'>"+json.timezone + "</span><br>";
		    html_text += "<div style='font-weight: bold;'><span style='font-size:80px;'>"+Math.round(json.currently.temperature)+"</span>";
		    html_text += "<img src='https://cdn3.iconfinder.com/data/icons/virtual-notebook/16/button_shape_oval-512.png' style='width:10px;position: relative;top: -52px;'></img>";
		    html_text += "<span style='font-size:40px;'>F</span></div>";
		    html_text += "<b style='font-size: 30px;'>"+json.currently.summary+"</b>";
		 	html_text += "<div class='flex-container'>";
		 	if(json.currently.humidity != null && typeof(json.currently.humidity)!="undefine")
		 		html_text += "<div><img src='https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-16-512.png' title='Humidity'><br>"+ json.currently.humidity+"</div>";
		 	if(json.currently.pressure != null && typeof(json.currently.pressure)!="undefine")
		 		html_text += "<div><img src='https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-25-512.png' title='Pressure'><br>"+ json.currently.pressure+"</div>";
		 	if(json.currently.windSpeed != null && typeof(json.currently.windSpeed)!="undefine")
		 		html_text += "<div><img src='https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-27-512.png' title='WindSpeed'><br>"+ json.currently.windSpeed+"</div>";
		 	if(json.currently.visibility != null && typeof(json.currently.visibility)!="undefine")
		 		html_text += "<div><img src='https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-30-512.png' title='Visibility'><br>"+ json.currently.visibility+"</div>";
		 	if(json.currently.cloudCover != null && typeof(json.currently.cloudCover)!="undefine")
		 		html_text += "<div><img src='https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-28-512.png' title='CloudCover'><br>"+ json.currently.cloudCover+"</div>";
		 	if(json.currently.ozone != null && typeof(json.currently.ozone)!="undefine")
		 		html_text += "<div><img src='https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-24-512.png' title='Ozone'><br>"+ json.currently.ozone+"</div>";
		    html_text += "</div>";
		    document.getElementById("card").innerHTML = html_text;
		}

		function forecast_table(json) {

			var weather_icon = {"clear-day":"https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-12-512.png",
		    "clear-night":"https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-12-512.png",
		    "rain":"https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-04-512.png",
		    "snow":"https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-19-512.png",
		    "sleet":"https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-07-512.png",
		    "wind":"https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-27-512.png", 
		    "fog":"https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-28-512.png", 
		    "cloudy":"https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-01-512.png", 
		    "partly-cloudy-day":"https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-02-512.png", 
		    "partly-cloudy-night":"https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-02-512.png"
			};

			var html_text = "";
			html_text += "<table id='forecast_table'>";
		    html_text += "<tr>";
		    html_text += "<th>Date</th>";
		    html_text += "<th>Status</th>";
		    html_text += "<th>Summary</th>";
		    html_text += "<th>TemperatureHigh</th>";
		    html_text += "<th>TemperatureLow</th>";
		    html_text += "<th>Wind Speed</th>";
		    html_text += "</tr>";
		    var data = json.daily.data;
		    for(var i in data) {
		    	var date = new Date(data[i].time * 1000).toLocaleDateString("en-US", {timeZone: json.timezone});
		    	var date_array = date.split("/");

		    	html_text += "<tr>";
		    	html_text += "<td>"+date_array[2]+"-"+date_array[0]+"-"+date_array[1]+"</td>";
		    	html_text += "<td><img src='"+weather_icon[data[i].icon]+"'></img></td>";
		    	html_text += "<td><a onclick='javascript:send_detail_request("+data[i].time+")' style='cursor:pointer;'>"+data[i].summary+"</a></td>";
		    	html_text += "<td>"+data[i].temperatureHigh+"</td>";
		    	html_text += "<td>"+data[i].temperatureLow+"</td>";
		    	html_text += "<td>"+data[i].windSpeed+"</td>";
		    	html_text += "</tr>";
		    }
		    html_text += "</table>"
		    document.getElementById("data_table").innerHTML = html_text;
		}

		function multiple_hundred(str){
    		var index = str.indexOf('.');
			var res = str;
			if(index!=-1)
			{
				res = str.substring(0,index);
				if(str.length<=index+3)
					res += str.substring(index+1,str.length);
				else 
					res += str.substring(index+1,index+3) + "." + str.substring(index+3,str.length);
				while(res[0]=='0' && res[1]!='.') 
					res = res.substring(1);
				if(res[res.length-1]=='.') 
					res.substring(0, res.length-1);
			}	
			return res;		
    	}

		function daily_weather_detail(json) {

			var weather_icon = {"clear-day":"https://cdn3.iconfinder.com/data/icons/weather-344/142/sun-512.png",
		    "clear-night":"https://cdn3.iconfinder.com/data/icons/weather-344/142/sun-512.png",
		    "rain":"https://cdn3.iconfinder.com/data/icons/weather-344/142/rain-512.png",
		    "snow":"https://cdn3.iconfinder.com/data/icons/weather-344/142/snow-512.png",
		    "sleet":"https://cdn3.iconfinder.com/data/icons/weather-344/142/lightning-512.png",
		    "wind":"https://cdn4.iconfinder.com/data/icons/the-weather-is-nice-today/64/weather_10-512.png", 
		    "fog":"https://cdn3.iconfinder.com/data/icons/weather-344/142/cloudy-512.png", 
		    "cloudy":"https://cdn3.iconfinder.com/data/icons/weather-344/142/cloud-512.png", 
		    "partly-cloudy-day":"https://cdn3.iconfinder.com/data/icons/weather-344/142/sunny-512.png", 
		    "partly-cloudy-night":"https://cdn3.iconfinder.com/data/icons/weather-344/142/sunny-512.png"
			};

			var precipitation;
			if(json.currently.precipIntensity<=0.001) precipitation="None";
			else if(json.currently.precipIntensity<=0.015) precipitation="Very Light";
			else if(json.currently.precipIntensity<=0.05) precipitation="Light";
			else if(json.currently.precipIntensity<=0.1) precipitation="Moderate";
			else if(json.currently.precipIntensity>0.1) precipitation="Heavy";
			else precipitation="N/A";

			var precipProbability = multiple_hundred(json.currently.precipProbability.toString());
			var humidityPercentage = multiple_hundred(json.currently.humidity.toString());

			var sunrise = new Date(json.daily.data[0].sunriseTime * 1000).toLocaleTimeString("en-US", {timeZone: json.timezone});
			var sunriseTime = sunrise.split(":")[0];
			var sunriseUnit = sunrise.split(" ").pop();
			var sunset = new Date(json.daily.data[0].sunsetTime * 1000).toLocaleTimeString("en-US", {timeZone: json.timezone});
			var sunsetTime = sunset.split(":")[0];
			var sunsetUnit = sunset.split(" ").pop();
			var html_text = "";
			html_text += "<h1 style='width:max-content;margin: auto auto 15px;'>Daily Weather Detail</h1>";

		    html_text += "<div style='width:400px;background-color:#a7d6e1;color:white;border-radius:15px;margin: auto;padding:10px;'>";
		    html_text += "<div style='float:left;margin: 40px 10px 0 10px;'><div style='font-size: 30px;font-weight:bold;width:200px;word-wrap:break-word;word-break:break-all; '>"+json.currently.summary+"</div>";
		    html_text += "<div style='font-weight: bold;'><span style='font-size:100px;'>"+Math.round(json.currently.temperature)+"</span>";
		    html_text += "<img src='https://cdn3.iconfinder.com/data/icons/virtual-notebook/16/button_shape_oval-512.png' style='width:10px;position: relative;top: -52px;'></img>";
		    html_text += "<span style='font-size:70px;'>F</span></div></div>";
		    html_text += "<img src='"+weather_icon[json.currently.icon]+"' style='width:160px;height:160px;float:right'></img>";
		    html_text += "<table id='detail_table'>";
		    html_text += "<tr><td class='right'>Precipitation:</td><td class='left'><span class='large'>"+precipitation+"</span></td>";
		    html_text += "<tr><td class='right'>Chance of Rain:</td><td class='left'><span class='large'>"+precipProbability+"</span> <span class='small'>%</span></td>";
		    html_text += "<tr><td class='right'>Wind Speed:</td><td class='left'><span class='large'>"+json.currently.windSpeed+"</span> <span class='small'>mph</span></td>";
		    html_text += "<tr><td class='right'>Humidity:</td><td class='left'><span class='large'>"+humidityPercentage+"</span> <span class='small'>%</td>";
		    html_text += "<tr><td class='right'>Visibility:</td><td class='left'><span class='large'>"+json.currently.visibility+"</span> <span class='small'>mi</span></td>";
		    html_text += "<tr><td class='right'>Sunrise/Sunset:</td><td class='left'><span class='large'>"+sunriseTime+"</span> <span class='small'>"+sunriseUnit+"</span>/<span class='large'>"+sunsetTime+"</span> <span class='small'>"+sunsetUnit+"</span></td>";
		    html_text += "</div>";

			document.getElementById("detail_card").innerHTML = html_text;
		}

		function draw_chart(json) {
			document.getElementById("data_chart").innerHTML = "";
			var html_text = "<h1 style='width:max-content;margin: auto auto 15px;'>Day's Hourly Weather</h1>";
			html_text += "<img src='http://csci571.com/hw/hw6/images/arrow_down.png' onclick='drawBasic("+JSON.stringify(json)+")' style='width:30px;cursor:pointer;'>";
			document.getElementById("chart_title").innerHTML = html_text;
		}
	</script>
    <script type="text/javascript">
    	
    	function clear_form(){
    		document.getElementById("card").innerHTML="";
	    	document.getElementById("data_table").innerHTML="";
	    	document.getElementById("detail_card").innerHTML="";
	    	document.getElementById("chart_title").innerHTML="";
	    	document.getElementById("data_chart").innerHTML="";
	    	document.getElementById("check_input").setAttribute("hidden","");
    		document.getElementById("street").removeAttribute("disabled");
    		document.getElementById("city").removeAttribute("disabled");
    		document.getElementById("state").removeAttribute("disabled");
	    }

	    function error_input(){
	    	if(document.getElementById("street").value == "") document.getElementById("street").setAttribute("style", "width: 140px;border: 1px solid red;");
	    	if(document.getElementById("city").value == "") document.getElementById("city").setAttribute("style", "width: 140px;border: 1px solid red;");
	    	if(document.getElementById("state").value == "State") document.getElementById("state").setAttribute("style", "border: 1px solid red;");
	    	document.getElementById("card").innerHTML="";
	    	document.getElementById("data_table").innerHTML="";
	    	document.getElementById("detail_card").innerHTML="";
	    	document.getElementById("chart_title").innerHTML="";
	    	document.getElementById("data_chart").innerHTML="";
	    	document.getElementById("check_input").removeAttribute("hidden");
	    }
    </script>
    
</head>
<body>
	<div id="searchBox">
		<h1>Weather search</h1>
		<table id="form_table">
			<form id="search_form">
			<tr style="font-size: 18px;font-weight: bold;">
				<td style="width:300px;border-right: 2px solid white;">
				<label style="display: inline-block;width:50px;line-height: 30px;">Street</label>
				<input type="text" name="street" id="street" style="width: 140px;"><br>
				<label style="display: inline-block;width:50px;line-height: 30px;">City</label>
				<input type="text" name="city" id="city" style="width: 140px;"><br>
				State  <select name="state" id="state">
						<option value="State" selected="selected">State</option>
						<option disabled>------------------------------</option>
						<option value="AL">Alabama</option>
						<option value="AK">Alaska</option>
						<option value="AZ">Arizona</option>
						<option value="AR">Arkansas</option>
						<option value="CA">California</option>
						<option value="CO">Colorado</option>
						<option value="CT">Connecticut</option>
						<option value="DE">Delaware</option>
						<option value="DC">District Of Columbia</option>
						<option value="FL">Florida</option>
						<option value="GA">Georgia</option>
						<option value="HI">Hawaii</option>
						<option value="ID">Idaho</option>
						<option value="IL">Illinois</option>
						<option value="IN">Indiana</option>
						<option value="IA">Iowa</option>
						<option value="KS">Kansas</option>
						<option value="KY">Kentucky</option>
						<option value="LA">Louisiana</option>
						<option value="ME">Maine</option>
						<option value="MD">Maryland</option>
						<option value="MA">Massachusetts</option>
						<option value="MI">Michigan</option>
						<option value="MN">Minnesota</option>
						<option value="MS">Mississippi</option>
						<option value="MO">Missouri</option>
						<option value="MT">Montana</option>
						<option value="NE">Nebraska</option>
						<option value="NV">Nevada</option>
						<option value="NH">New Hampshire</option>
						<option value="NJ">New Jersey</option>
						<option value="NM">New Mexico</option>
						<option value="NY">New York</option>
						<option value="NC">North Carolina</option>
						<option value="ND">North Dakota</option>
						<option value="OH">Ohio</option>
						<option value="OK">Oklahoma</option>
						<option value="OR">Oregon</option>
						<option value="PA">Pennsylvania</option>
						<option value="RI">Rhode Island</option>
						<option value="SC">South Carolina</option>
						<option value="SD">South Dakota</option>
						<option value="TN">Tennessee</option>
						<option value="TX">Texas</option>
						<option value="UT">Utah</option>
						<option value="VT">Vermont</option>
						<option value="VA">Virginia</option>
						<option value="WA">Washington</option>
						<option value="WV">West Virginia</option>
						<option value="WI">Wisconsin</option>
						<option value="WY">Wyoming</option>
					 </select>
				</td>
				<td>
					<div style="float: right;position: relative;top: -30px;">
						<input type="checkbox" id="currentLocation" value="currentLocation">Current Location
					</div>
				</td>
			</tr>
			<tr class="center">
				<td colspan="2">
					<input type="button" name="search" value="search" onclick="send_request()">
					<input type="reset" id="clear" value="clear" onclick="clear_form()">
				</td>
			</tr>
			</form>
			<script>
				var checkbox = document.getElementById("currentLocation");
	    		checkbox.addEventListener("change", function() {
	    			if(this.checked) {
	    				document.getElementById("street").value="";
	    				document.getElementById("city").value="";
	    				document.getElementById("state").value="State";
	    				document.getElementById("street").setAttribute("disabled","");
	    				document.getElementById("city").setAttribute("disabled","");
	    				document.getElementById("state").setAttribute("disabled","");
	    				document.getElementById("street").setAttribute("style", "width: 140px;");
    					document.getElementById("city").setAttribute("style", "width: 140px;");
    					document.getElementById("state").style = null;
    					document.getElementById("check_input").setAttribute("hidden","");
	    				var xhr = new XMLHttpRequest();
			    		xhr.open("GET","http://ip-api.com/json",false);
			    		xhr.send();
			    		var ip_json = JSON.parse(xhr.responseText);
			    		lat = ip_json.lat;
			    		lon = ip_json.lon;    	
			    		city = ip_json.city;			
	    			} else {
	        			document.getElementById("street").removeAttribute("disabled");
	        			document.getElementById("city").removeAttribute("disabled");
	        			document.getElementById("state").removeAttribute("disabled");
	    			}
				});
	    		
			</script>	
		</table>
	</div>
	<div id="check_input" hidden>
		please check the input address
	</div>
	<div id="card" style="margin:30px;"></div>
	<div id="data_table" style="text-align:center;"></div>
	<div id="detail_card" style="margin:30px;"></div>
	<div id="chart_title" style="text-align:center;"></div>
	<div id="data_chart" style="text-align:center;width:800px;margin:auto"></div>

</body>

</html>
