import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private loginUsername = "";
  private loginPassword = "";

  private testUsername = "";
  private testPassword = "";
  
  /**
   * try to log in
   */
  tryLogin() {
    if (this.checkUser(this.loginUsername).pass) {this.testUsername = this.loginUsername;}
    else {this.testUsername = this.checkUser(this.loginUsername).msg}
    if (this.checkPassword(this.loginPassword).pass) {this.testPassword = this.loginPassword;}
    else {this.testPassword = this.checkPassword(this.loginPassword).msg}
    
  }


  /**
   * check password and see if pass
   * @param p password to be checked
   */
  checkPassword(p:string):{pass:boolean, msg?:string}{
    if (p.length<8) return {pass:false, msg:"Too short"};
    return {pass:true};
  }

  /**
   * check password and see if pass
   * @param p password to be checked
   */
  checkUser(p:string):{pass:boolean, msg?:string}{
    if (p.length<=0) return {pass:false, msg:"No name"};
    return {pass:true};
  }

  constructor() { }

  ngOnInit() {
  }

}
