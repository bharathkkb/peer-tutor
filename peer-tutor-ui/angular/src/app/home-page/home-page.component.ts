import { Component, OnInit } from '@angular/core';
import { ClassDataService, LocalStorageService } from '../_services';
import { UniClass } from '../_models/uniclass';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import {map, startWith} from 'rxjs/operators';

/**
 * Sumary of a UniClass
 */
class ClassSum {
  "_id": string;
  "class-name": string;
  "start-dates": string;
  "end-dates": string;
  "days": string;
  "instructor": string;
  "location": string;
  "start-time": string;
  "end-time": string;
  "title": string;
  "section": string;
}

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  /**Flags that control which elements inside modal to be shown */
  modalFlag = {
    deptName: false,
    className: false,
    classSections: false,
  }

  modalDeptInputCtrl = new FormControl();
  filteredDeptName : Observable<any[]>;
  modalClassInputCtrl = new FormControl();
  filteredClassName : Observable<any[]>;

  classes$: ClassSum[];

  addClasses$: Observable<ClassSum[]>;

  constructor( 
    private classDataService:ClassDataService, 
    private router:Router,
    private localStorageService:LocalStorageService,
  ) { }

  ngOnInit() {
    this.enrolledClassInitSubRoutine();

    this.filteredDeptName = this.modalDeptInputCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    )
  }

  private enrolledClassInitSubRoutine(){
    //TODO: change to get class by student id
    this.classDataService.getAll().subscribe(
      classes => { 
        this.classes$ = classes.map((c:UniClass)=>{
          let result:ClassSum = {
            "_id": c._id,
            "class-name": c["class-name"],
            "start-dates": c.dates.substring(0, 8),
            "end-dates": c.dates.substring(9, 17),
            "days": c.days,
            "instructor": c.instructor,
            "location": c.location,
            "start-time": c.time.substring(0, 4),
            "end-time": c.time.substring(5, 10),
            "title": c.title,
            "section": c.section,
          }
          return result
        }); 
      },
      error=>{
        console.log(error)
        // this.router.navigate(["/login"])
      }
    )
  }

  getDepartmentList(){

  }

  options: string[] = ['One', 'Two', 'Three'];

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }
  



  addClassButtonOnClick(){
    console.log("Add button clicked!")
    this.modalFlag.deptName=true;
  }

}


/* Reference:
HTML:
vvvvvvvvvvvvv
<form class="example-form">
  <mat-form-field class="example-full-width">
    <input type="text" placeholder="Pick one" aria-label="Number" matInput [formControl]="myControl" [matAutocomplete]="auto">
    <mat-autocomplete #auto="matAutocomplete">
      <mat-option *ngFor="let option of filteredOptions | async" [value]="option">
        {{option}}
      </mat-option>
    </mat-autocomplete>
  </mat-form-field>
</form>
^^^^^^^^^^^^^
ts:
vvvvvvvvvvvvv
import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'autocomplete-filter-example',
  templateUrl: 'autocomplete-filter-example.html',
  styleUrls: ['autocomplete-filter-example.css'],
})
export class AutocompleteFilterExample implements OnInit {
  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }
}
^^^^^^^^^^^^^


*/