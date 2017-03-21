const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

class Variable {
  constructor() {
    this.salaryChoices = {
      root: [
        {
          name: "Salary",
          value: "monetary",
          prevPointer: null,
          selfPointer: "root",
          nextPointer: "monetary1"
        },
        // {
        //   name: "Certification",
        //   value: "cert",
          // prevPointer: null,
          // selfPointer: "root",
        //   nextPointer: "cert1"
        // },
        {
          name: "Others",
          value: "others",
          prevPointer: null,
          selfPointer: "root",
          nextPointer: "textarea"
        }
      ],
      monetary1: [
        {
          name: "Range",
          value: "range",
          prevPointer: "root",
          nextPointer: "moneyRange",
          selfPointer: "monetary1"
        },
        {
          name: "specific",
          value: "specific",
          prevPointer: "root",
          selfPointer: "monetary1",
          nextPointer: "moneySpecific"
        },
        {
          name: "Negotiable",
          value: "negotiable",
          prevPointer: "root",
          selfPointer: "monetary1",
          nextPointer: null
        }
      ]
    };
    this.jobType = [
      {
        name: "Quick Job",
        value: "quick"
      },
      {
        name: "Stable Job",
        value: 'stable'
      },
      {
        name: "Internship",
        value: 'intern'
      },
      {
        name: "Project",
        value: 'project'
      }
    ];
  }

  /** @return {number} - 2 digit @param {number} num - 1 to 2 digit */
  pad2(num) { return (num < 10) ? '0' + num.toString() : num; }
  /** @return {"Jan"| "Feb"| "Mar"| "Apr"| "May"| "Jun"| "Jul"| "Aug"| "Sep"| "Oct"| "Nov"| "Dec"} @param {0|1|2|3|4|5|6|7|8|9|10|11} num */
  getMonth(num) { return months[num]; }
  /** @return {string} @param {string} word */
  capitalize(word) { const arr = word.split(""); arr[0].toUpperCase(); return arr.join(""); }

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
