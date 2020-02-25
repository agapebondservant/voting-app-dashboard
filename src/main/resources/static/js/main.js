/**
 * Sample format of chartData:
 * { count: 10, unavailableMessage: '', district: 'red-district' }
 */

var redData,
	redMsg,
	redDistrict,
	blueData,
	blueMsg,
	blueDistrict,
	chartCachedData,
	blueEventSource,
	redEventSource,
	intervalHandler;
var blueDataUri = "http://localhost:7000/blue/votes";
var redDataUri = "http://localhost:7000/red/votes";
	
function init() {
	chartCachedData = {
			red: {
				count:0,
				unavailableMessage: '**No recent data is available. Pie chart shows last known update for <i>Red</i>.**'
			}, 
			blue: {
				count:0,
				unavailableMessage: '**No recent data is available. Pie chart shows last known update for <i>Blue</i>.**'
			}
	};
	
	blueEventSource = initEventSource(blueDataUri,'blue');
	redEventSource = initEventSource(redDataUri,'red');
	
	intervalHandler = setInterval(updateChart, 3000);
	
}

function chartError(ex){
	updateMessages();
	if (!blueEventSource || blueEventSource.readyState == EventSource.CLOSED) {
		setTimeout(function(){blueEventSource = initEventSource(blueDataUri,'blue')},5000);
		
	}
	if (!redEventSource ||  redEventSource.readyState == EventSource.CLOSED) {
		setTimeout(function(){redEventSource = initEventSource(redDataUri,'red')},5000);
		
	}
}

function initEventSource(uri,type){
	var eventSource = new EventSource(uri);
	eventSource.onmessage = function(event){
		chartCachedData[type] = JSON.parse(event.data);
		console.log(chartCachedData);
	}
	eventSource.onerror = chartError;
	return eventSource;
}

function getCachedChartData(){
	return chartCachedData;
}

function updateChart(jQuery){
	var ctx = document.getElementById('myPieChart').getContext('2d');
	chartData = getCachedChartData();
	
	extractDataFromChart(chartData);
	
	var myChart = new Chart(ctx, {
		    type: 'pie',
		    data: {
		        labels: ['Red Squad', 'Blue Squad'],
		        datasets: [{
		            label: ['Total Number of Votes'],
		            data: [redData, blueData],
		            backgroundColor: [
		                'rgba(255, 99, 132, 0.2)',
		                'rgba(54, 162, 235, 0.2)'
		            ],
		            borderColor: [
		                'rgba(255, 99, 132, 1)',
		                'rgba(54, 162, 235, 1)'
		            ],
		            borderWidth: 1
		        }]
		    },
		    options: {
		        scales: {
		            yAxes: [{
		                ticks: {
		                    beginAtZero: true
		                }
		            }]
		        },
		        responsive: true,
		        maintainAspectRatio: false
		    }
		});
		
	updateMessages();
	cacheData();
}

function cacheData(chartData) {
	if (redData)  chartCachedData['red']['count']  = redData;
	if (blueData) chartCachedData['blue']['count'] = blueData;
}

function extractDataFromChart(chartData){
	redData = chartCachedData['red']['count'];
	blueData = chartCachedData['blue']['count'];
	redMsg = chartCachedData['red']['unavailableMessage'];
	blueMsg =  chartCachedData['blue']['unavailableMessage'];
	redDistrict = chartCachedData['red']['district']
	blueDistrict = chartCachedData['blue']['district'];
}

function updateMessages() {
	$('#red-sqd-ctr').html(redData);
	$('#blue-sqd-ctr').html(blueData);
	$('#red-sqd-district').html(redDistrict);
	$('#blue-sqd-district').html(blueDistrict);
	$('#red-sqd-unavailable').html(redMsg);
	$('#blue-sqd-unavailable').html(blueMsg);
	
	if (!redData) {
		$('.red-sqd-available-cls').addClass('invisible');
		$('#red-sqd-unavailable').removeClass('invisible');
	} else {
		$('.red-sqd-available-cls').removeClass('invisible');
		$('#red-sqd-unavailable').addClass('invisible');
	}
	
	if (!blueData) {
		$('.blue-sqd-available-cls').addClass('invisible');
		$('#blue-sqd-unavailable').removeClass('invisible');
	} else {
		$('.blue-sqd-available-cls').removeClass('invisible');
		$('#blue-sqd-unavailable').addClass('invisible');
		
	}
	
}

$( document ).ready( init );
$(window).on('beforeunload', function(){
	blueEventSource.close();
	redEventSource.close();
});
