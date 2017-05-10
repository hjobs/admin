// import Reflux from 'reflux';

// import Var from '../services/var';
// import Http from '../services/http';

// import { UserActions } from './userStore';

// // export const JobActions = Reflux.createActions([
// //   "loadJobs"
// // ]);

// export const JobActions = Reflux.createActions({
//   setJob: {},
//   loadJob: {asyncResult: true}
// });

// class EditStore extends Reflux.Store {
//   constructor() {
//     super();
//     this.state = Var.getJobHttpObject();
//     this.listenables = JobActions;
//     if (localStorage.getItem("authToken")) this.loadJobs()
//   }

//   getInitialState()

//   setJob(job, isNew) {

//   }

//   loadJob(id) {
//     const onError = (err) => {
//       console.log(err);
//       this.setState(s => {
//         s.jobModal.loading = false;
//         s.error = err || true;
//         return s;
//       })
//     }

//     Http.request("jobs/" + id, "GET")
//     .then(res => {
//       console.log(res);
//       return res.json();
//     })
//     .then(d => {
//       if (!d || !!d.error) {
//         onError(d.toString());
//       } else this.loadJobCompleted(d);
//     }).catch(err => onError(err.toString()));
//   }

//   loadJobCompleted(data) {

//     this.setState(s => {
//       s = Variable.getStateFromJob(data, false);
//       return s;
//     })
//   }
// }

// export default EditStore;
