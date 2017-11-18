export const langObjects = [
  {key: "en", text: "English", value: "en"},
  {key: "zh_can", text: "Cantonese (Chinese)", value: "zh_can"},
  {key: "zh_man", text: "Mandarin (Chinese)", value: "zh_man"}
];

export const salaryChoices = {
  root: [
    {
      name: "Salary",
      value: "monetary",
      prevPointer: null,
      selfPointer: "root",
      nextPointer: "monetary1"
    }
    // {
    //   name: "Certification",
    //   value: "cert",
      // prevPointer: null,
      // selfPointer: "root",
    //   nextPointer: "cert1"
    // },
    // {
    //   name: "Others",
    //   value: "others",
    //   prevPointer: null,
    //   selfPointer: "root",
    //   nextPointer: "others"
    // }
  ],
  monetary1: [
    {
      name: "Range",
      value: "range",
      fieldName: "salary_type",
      prevPointer: "root",
      nextPointer: "moneyRange",
      selfPointer: "monetary1"
    },
    {
      name: "Specific",
      value: "specific",
      fieldName: "salary_type",
      prevPointer: "root",
      selfPointer: "monetary1",
      nextPointer: "moneySpecific"
    },
    {
      name: "Negotiable",
      value: "negotiable",
      fieldName: "salary_type",
      prevPointer: "root",
      selfPointer: "monetary1",
      nextPointer: null
    }
  ],
  moneyRange: {customRender: true, value: "moneyRange"},
  moneySpecific: {customRender: true, value: "moneySpecific"},
  others: {customRender: true, value: "others"}
}

export const jobSalaryFields = ["salary_high", "salary_low", "salary_value", "salary_unit", "salary_type"];

export const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const jobType = [
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
  }
  // {
  //   name: "Project",
  //   value: 'project'
  // }
]
