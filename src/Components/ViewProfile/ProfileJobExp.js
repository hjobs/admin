import React from 'react';
import Reflux from 'reflux';
import { Icon } from 'semantic-ui-react';

import { getLocale } from '../../stores/translationStore';
const locale = getLocale();

import { customTimeStamp } from '../../services/var';

const tStrings = {
  en: {
    notGiven: "Did not provide",
    jobExperience: "Job Experience",
    present: "present"
  },
  "zh-HK": {
    notGiven: "沒有提供",
    jobExperience: "工作紀驗",
    present: "目前"
  }
};

class ProfileJobExp extends Reflux.Component {
  renderDetail() {
    const t = tStrings[locale],
          notGiven = t.notGiven,
          { user } = this.props;
    if (!user.job_exps || user.job_exps.length <= 0) return <p className="text-center">{notGiven}</p>;
    const jobExpContainerClassName = "job-exp-container"
    
    const arr = user.job_exps.map(job_exp => {
      const companyName = job_exp.company_name || (!job_exp.org ? notGiven  : job_exp.org.name);
      const timeFrom = !job_exp.time_from ? notGiven : customTimeStamp(new Date(job_exp.time_from));
      const timeTo = job_exp.working ? t.present : (!job_exp.date_to ? notGiven : customTimeStamp(new Date(job_exp.date_to)));
      return (
        <div
          key={'job-exp-' + job_exp.id}
          className={jobExpContainerClassName}
        >
          <h3>{job_exp.position}</h3>
          <div className="job-exp-detail-container">
            <div className="detail-company-name">{companyName}</div>
            <div className="detail-time">{timeFrom} - {timeTo}</div>
            {!job_exp.location ? null : <div className="detail-location">{job_exp.location}<br /></div>}
            {!job_exp.description ? null : <div className="detail-description">{job_exp.description}</div>}
          </div>
        </div>
      );
    });
    return arr;
  }
  
  render() {
    const t = tStrings[locale];

    return (
      <div className="job-exps-container">
        <h3 className="text-center"><Icon name="briefcase"/> {t.jobExperience}</h3>
        <div style={{padding: "15px 0px"}}>
          {this.renderDetail()}
        </div>
      </div>
    );
  }
}

export default ProfileJobExp;
