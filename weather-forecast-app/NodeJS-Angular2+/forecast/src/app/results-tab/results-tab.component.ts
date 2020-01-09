import {Component, OnInit, ViewChild} from '@angular/core';
import {CurrentWeatherService} from '../current-weather.service';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import CanvasJS from '../../assets/canvasjs.min';
import {BaseChartDirective} from 'ng2-charts';

@Component({
  selector: 'app-results-tab',
  templateUrl: './results-tab.component.html',
  styleUrls: ['./results-tab.component.css']
})
export class ResultsTabComponent implements OnInit {

  forecast: any = {};
  detail: any = {};
  sealURL = '';
  hourlySelect: string;
  city = '';
  longitude = '';
  latitude = '';
  state = '';
  detailDate = '';
  isFavorite = false;
  invalidAddress = true;

  public barChartOptions = {
    legend: {
      onClick: (e, legendItem) => {
      }
    },
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
      xAxes: [{
        ticks: {
          suggestedMin: 0,
          suggestedMax: 24
        },
        scaleLabel: {
          display: true,
          labelString: 'Time difference from current hour'
        }
      }],
      yAxes: [{
        ticks: {
          suggestedMin: 0,
          suggestedMax: 20,
        },
        scaleLabel: {
          display: true,
          labelString: 'Fahrenheit'
        }
      }]
    }
  };
  public barChartLabels = ['0', '1', '2', '3', '4', '5',
    '6', '7', '8', '9', '10', '11',
    '12', '13', '14', '15', '16', '17',
    '18', '19', '20', '21', '22', '23'];
  public barChartLegend = true;
  public barChartData = [];
  public chartColors: any[] = [{backgroundColor: '#9AD1F1'}];

  @ViewChild(BaseChartDirective, {static: false}) chart: BaseChartDirective;
  @ViewChild('modalBtn', {static: false}) button;
  public dataPoints = [];

  // chart: any;

  constructor(private router: ActivatedRoute,
              private httpClient: HttpClient,
              private currentWeatherService: CurrentWeatherService) {
  }

  ngOnInit() {
    this.router.queryParams.subscribe(parmas => {
      this.forecast = {};
      this.sealURL = '';
      const parm = JSON.parse(JSON.stringify(parmas));
      this.city = parm.city;
      this.longitude = parm.longitude;
      this.latitude = parm.latitude;
      this.state = parm.state;
      if (localStorage.getItem(parm.city) !== null) {
        this.isFavorite = true;
      }
      const params = new HttpParams().set('state', parm.state);
      this.httpClient.get('http://nodejsapp-cshi5131.us-west-1.elasticbeanstalk.com/getSeal', {params})
        .subscribe(
          data => {
            const obj = JSON.parse(JSON.stringify(data));
            this.sealURL = obj.seal;
          },
          error => console.log(error)
        );
      this.currentWeatherService.getCurrentWeatherResults(this.city, this.latitude, this.longitude)
        .subscribe(
          data => {
            this.invalidAddress = true;
            const obj = JSON.parse(JSON.stringify(data));
            this.forecast = obj;
            this.dataPoints = [];
            for (let i = 0; i < this.forecast.daily.data.length; i++) {
              this.dataPoints.push({
                x: (this.forecast.daily.data.length - i) * 10,
                y: [this.forecast.daily.data[i].temperatureLow, this.forecast.daily.data[i].temperatureHigh],
                label: this.convertToDate(this.forecast.daily.data[i].time),
                name: this.forecast.daily.data[i].time
              });
            }
            CanvasJS.addColorSet('rangeBarColor', ['#9AD1F1']);
            this.barChartData = [{data: this.forecast.hourly.temperature, label: 'Temperature'}];
            this.chart.chart.options.scales.yAxes[0].scaleLabel.labelString = 'Fahrenheit';
            this.suggestedNumber(this.forecast.hourly.temperature);
          },
          error => this.invalidAddress = false
        );
    });

  }

  setBarChart() {
    if (this.hourlySelect === '' || this.hourlySelect === null || typeof this.hourlySelect === 'undefined') {
      this.hourlySelect = 'Temperature';
    }
    switch (this.hourlySelect) {
      case 'Temperature':
        this.barChartData = [{data: this.forecast.hourly.temperature, label: 'Temperature'}];
        this.chart.chart.options.scales.yAxes[0].scaleLabel.labelString = 'Fahrenheit';
        this.suggestedNumber(this.forecast.hourly.temperature);
        break;
      case 'Pressure':
        this.barChartData = [{data: this.forecast.hourly.pressure, label: 'Pressure'}];
        this.chart.chart.options.scales.yAxes[0].scaleLabel.labelString = 'Millibars';
        this.suggestedNumber(this.forecast.hourly.pressure);
        break;
      case 'Humidity':
        this.barChartData = [{data: this.forecast.hourly.humidity, label: 'Humidity'}];
        this.chart.chart.options.scales.yAxes[0].scaleLabel.labelString = '% Humidity';
        this.suggestedNumber(this.forecast.hourly.humidity);
        break;
      case 'Ozone':
        this.barChartData = [{data: this.forecast.hourly.ozone, label: 'Ozone'}];
        this.chart.chart.options.scales.yAxes[0].scaleLabel.labelString = 'Dobson Units';
        this.suggestedNumber(this.forecast.hourly.ozone);
        break;
      case 'Visibility':
        this.barChartData = [{data: this.forecast.hourly.visibility, label: 'Visibility'}];
        this.chart.chart.options.scales.yAxes[0].scaleLabel.labelString = 'Miles (Maximum 10)';
        this.suggestedNumber(this.forecast.hourly.visibility);
        break;
      case 'Wind Speed':
        this.barChartData = [{data: this.forecast.hourly.windSpeed, label: 'Wind Speed'}];
        this.chart.chart.options.scales.yAxes[0].scaleLabel.labelString = 'Miles per hour';
        this.suggestedNumber(this.forecast.hourly.windSpeed);
        break;
      default:
        break;
    }
  }

  setRangeBar() {

    const rangeChart = new CanvasJS.Chart('chartContainer', {
      colorSet: 'rangeBarColor',
      animationEnabled: true,
      dataPointWidth: 20,
      legend: {verticalAlign: 'top'},
      toolTip: {content: '{label}: {y[0]} to {y[1]}'},
      title: {text: 'Weekly Weather'},
      axisX: {title: 'Days'},
      axisY: {includeZero: false, title: 'Temperature in Fahrenheit', interval: 10, gridThickness: 0},
      data: [{
        type: 'rangeBar',
        showInLegend: true,
        legendText: 'Day wise temperature range',
        indexLabel: '{y[#index]}',
        click: e => {
          const detailParams = new HttpParams()
            .set('city', this.city)
            .set('longitude', this.longitude)
            .set('latitude', this.latitude)
            .set('time', e.dataPoint.name);
          this.httpClient.get('http://nodejsapp-cshi5131.us-west-1.elasticbeanstalk.com/dailyWeather', {params: detailParams})
            .subscribe(
              detailData => {
                const detailObj = JSON.parse(JSON.stringify(detailData));
                this.detail = detailObj;
                this.detailDate = e.dataPoint.label;
                this.button.nativeElement.click();
              },
              error => console.log(error)
            );
        },
        dataPoints: this.dataPoints
      }]
    });
    setTimeout(f => {
      rangeChart.render();
    }, 300);
  }

  convertToDate(time: number) {
    const date = new Date(time * 1000).toLocaleDateString('en-US', {timeZone: this.forecast.timezone});
    const dateArray = date.split('/');
    return dateArray[1] + '/' + dateArray[0] + '/' + dateArray[2];
  }

  favorite() {
    this.isFavorite = !this.isFavorite;
    if (this.isFavorite) {
      const obj = {
        image: this.sealURL, city: this.forecast.city, state: this.state,
        longitude: this.longitude, latitude: this.latitude
      };
      localStorage.setItem(this.forecast.city, JSON.stringify(obj));
    } else {
      localStorage.removeItem(this.forecast.city);
    }
  }

  suggestedNumber(arr: []) {
    this.chart.chart.options.scales.yAxes[0].ticks.suggestedMin = Math.floor(Math.min(...arr) > 2 ? Math.min(...arr) - 2 : 0);
    this.chart.chart.options.scales.yAxes[0].ticks.suggestedMax = Math.ceil(Math.max(...arr) + 2);
  }

}
