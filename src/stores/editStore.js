import Reflux from 'reflux';

import Var from '../services/var';
import Http from '../services/http';

// export const JobActions = Reflux.createActions([
//   "loadJobs"
// ]);

export const JobActions = Reflux.createActions({
  setJob: {},
  loadJob: {asyncResult: true}
});

class EditStore extends Reflux.Store {
  constructor() {
    super();
    this.state = Var.getJobHttpObject();
    this.listenables = JobActions;
    if (localStorage.getItem("authToken")) this.loadJobs()
  }

  
}

export default EditStore;
