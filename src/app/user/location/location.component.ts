import { Component, OnInit } from '@angular/core';
import { State } from './state.model';
import { City } from './city.model';
import { LocationService } from './location.service';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {
  states: State[];
  cities: City[];

  constructor(private _dataService: LocationService) {
    this._dataService.getStates().subscribe(
      userResponse => {
        this.states = userResponse.body;
      }
    );
  }

  ngOnInit(): void {
  }

  onSelect(countryid) {
    this._dataService.getStates().subscribe(
      userResponse => {
        this.states = userResponse.body.filter((item) => item.countryId == countryid);
      }
    );
  }

  select(stateid) {
    this._dataService.getCities().subscribe(
      userResponse => {
        this.cities = userResponse.body.filter((item) => item.stateId == stateid);
      }
    );
  }
}
