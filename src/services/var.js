const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

class Variable {

  /** @return {number} - 2 digit @param {number} num - 1 to 2 digit */
  pad2(num) { return (num < 10) ? '0' + num.toString() : num; }
  /** @return {"Jan"| "Feb"| "Mar"| "Apr"| "May"| "Jun"| "Jul"| "Aug"| "Sep"| "Oct"| "Nov"| "Dec"} @param {0|1|2|3|4|5|6|7|8|9|10|11} num */
  getMonth(num) { return months[num]; }

  /** @return {'? to ?'|'?'|'negotiable'} */
  getSalaryDescription(job) {
    let salaryDescription = "";
    switch (job.salary_type) {
      case "range":
        salaryDescription = job.salary_high + " - " + job.salary_low;
        break;
      case "specific":
        salaryDescription = job.salary_value;
        break;
      case "negotiable": default:
        salaryDescription = "negotiable";
        break;
    }
    return salaryDescription;
  }
}

export default Variable;
