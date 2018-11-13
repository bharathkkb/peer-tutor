// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

//TODO: change the API URL to actual backend!
/**
 * apiUrl need to be configured for every new run!
 */
export const environment = {
  production: false,
  // apiUrl: 'http://localhost:4200',
  apiUrl: 'http://192.168.0.100:5000',
};

/*
Note to self:
To run Docker on Windows 7:
download Docker toolbox etc.
run Docker terminal
run commands
change setting: 
  VirtualBox -> 
  docker machine -> 
  setting -> 
  network -> 
  adapter with NAT mode -> 
  port forwarding -> 
  map 5000 to 5000 w/ host 127.0.0.1 and local IP address

Configure firewall to allow port 5000 inbound traffic

 */

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
