/**Example:
 ```
 {
    "comment": "Excellent tutor",
    "given": "03",
    "rating_id": "01",
    "rating_score": "4",
    "received": "02"
  }
 ```
 * 
 */
export interface Rating{
    /**Comment given to the receiver */
    "comment": string;
    /**Student ID who gave the rating */
    "given": string;
    /**Rating ID. Perhaps use UUID? */
    "rating_id": string,
    /**The Score. Keep it a string of number */
    "rating_score": string,
    /**Student ID who receive the rating */
    "received": "02"
}