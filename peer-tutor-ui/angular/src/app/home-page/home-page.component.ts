import { Component, OnInit } from '@angular/core';
import { ClassDataService, LocalStorageService, UserService, CURRENT_USER } from '../_services';
import { UniClass, UniClassSum } from '../_models/uniclass';
import { Router } from '@angular/router';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import {map, startWith, filter} from 'rxjs/operators';
import { of, Subscription } from 'rxjs';


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
    classNameNotFound: false,
    classSections: false,
  }
  
  /**Modal Form, for adding class */
  modalForm: FormGroup;
  /**Filtered Department Name option for material autocomplete */
  filteredDeptName : Observable<any[]>;
  /**Filtered Class Name option for material autocomplete */
  filteredClassName : Observable<any[]>;

  /**List of department name. Waiting to be filtered */
  deptOpt$: string[] = [];
  /**List of class name. Waiting to be filtered */
  classNameOpt$: string[] = [];

  /**Class Section waiting to be picked by the user */
  addClasses$: Observable<UniClassSum[]>;

  /**Currently enrolled class */
  enrolledClasses$: UniClassSum[];

  constructor( 
    private classDataService:ClassDataService,
    private userService:UserService,
    private router:Router,
    private localStorageService:LocalStorageService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {    
    this.enrolledClassInitSubRoutine();

    this.modalForm = this.formBuilder.group({
      deptName: '',
      className: '',
    })

    // this.filteredDeptName = this.modalDeptInputCtrl.valueChanges.pipe(
    //   // startWith(''),
    //   map(value => this._filter(value)),
    // )
    this.filteredDeptName = this.modalForm.get('deptName').valueChanges.pipe(
      startWith(''),
      map(v=>this._filterDeptName(v))
    )

    this.filteredClassName = this.modalForm.get('deptName').valueChanges.pipe(
      startWith(''),
      map(v=>this._filterClassName(v))
    ) 
    // this.modalClassInputCtrl.valueChanges.pipe(
    //   startWith(''),
    //   map(value => this._filter2(value)),
    // )
  }

  /**Render currently enrolled UniClass
   */
  private enrolledClassInitSubRoutine(){
    //TODO: make an LocalStorage Behaviour Subject

    this.userService.getByStudentId(this.localStorageService.getCurrentUser()[CURRENT_USER.student_id.key]).pipe(
      map(u=>u[CURRENT_USER.enrolled_classes.key])
    ).subscribe(
      (classes:UniClass[]) => { this.enrolledClasses$ = classes ? classes.map(this.classDataService.toClassSum) : []  },
      err => {console.log(err)}
    )
    
    this.localStorageService.refreshCurrentUser();

  }


  private _filterDeptName(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.deptOpt$.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }
  private _filterClassName(value: string): string[] {
    const filterValue = value.toLowerCase();
    const enrolledClassesName = this.enrolledClasses$.map(c=>c["class-name"].toLowerCase()) //Exclude current enrolling class

    const untrimmedResult = this.classNameOpt$.filter(option => {
      return option.toLowerCase().indexOf(filterValue) === 0 //filterValue is beginning of substring of option
        && !enrolledClassesName.includes(option.toLowerCase()) //exclude currently enrolled classes
    });

    return this._trimDuplicateInArray(untrimmedResult);
  }
  private _trimDuplicateInArray(arr: any[]):any[]{
    let seen: {[x:string]:any} = {};
    return arr.filter(function(item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
  }

  addClassButtonOnClick(){
    this.classDataService.getAllDept().subscribe(d=>this.deptOpt$ = d)
  }

  deptClickNext(){

    // if (this.testSubscriptClass) this.testSubscriptClass.unsubscribe();

    this.modalFlag.className=true;

    let deptName:string = this.modalForm.get('deptName').value;
    
    this.classNameOpt$=[];

    this.classDataService.getByDeptName(deptName).subscribe(
      (d:UniClass[])=>{
        this.classNameOpt$=d.map((c:UniClass) => c["class-name"]); //subcribe to get UniClass[], but we only need ["class-name"] for classNameOpt$
      },
      err => {
        console.log(err);
        this.modalFlag.classNameNotFound = true
      }
    )
  }

  classClickSearch(){
    this.modalFlag.classSections = true;
    let pickedClassName:string = this.modalForm.get("className").value;

    this.addClasses$ = this.classDataService.getByClassName(pickedClassName).pipe(
      map(data=>data.map(c=>this.classDataService.toClassSum(c))) //map to a Observable<UniClassSum[]>
    )
  }

  classSectionAdded(classCode:string){
    console.log(classCode)
    //Send PUT
    let tempUser = this.localStorageService.getCurrentUser();
    console.log (JSON.stringify(tempUser))
    tempUser[CURRENT_USER.enrolled_classes.key] = tempUser[CURRENT_USER.enrolled_classes.key].map(c=>c["class-code"])
    tempUser[CURRENT_USER.enrolled_classes.key].push(classCode)
    console.log (JSON.stringify(tempUser))
    this.userService.update(tempUser).subscribe(
      d=>this.localStorageService.setCurrentUser(d)
    )

    
    //Refresh main page rendering
    this.enrolledClassInitSubRoutine();
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