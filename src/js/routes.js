
// import HomePage from '../pages/home.jsx';
// import AboutPage from '../pages/about.jsx';
// import FormPage from '../pages/form.jsx';
// import DynamicRoutePage from '../pages/dynamic-route.jsx';
// import RequestAndLoad from '../pages/request-and-load.jsx';

import NotFoundPage from '../pages/404.jsx';
import AgendaPage from '../pages/agenda.jsx'

var _ = require('lodash');
var dayjs = require('dayjs')
var utc = require('dayjs/plugin/utc')
var timezone = require('dayjs/plugin/timezone') // dependent on utc plugin
dayjs.extend(utc)
dayjs.extend(timezone)

const axios = require('axios');

var routes = [
  {
    path: '/',
    async: function ({ router, to, resolve }) {
      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // User ID from request
      
      var userId = to.query.userId;

      function getUser(recordId) {
        return axios({
          url: `https://api.airtable.com/v0/appw2hvpKRTQCbB4O/Directory%3A%20People/${recordId}`,
          method: 'get',
          headers: {
            "Authorization": "Bearer keyYNFILTvHzPsq1B"
          }
        })
      }

      function getEvents() {
        return axios({
          url: "https://api.airtable.com/v0/appw2hvpKRTQCbB4O/tblqOcPguzuv5UhkG?view=viw83kdbk8vFgZab4",
          method: 'get',
          headers: {
            "Authorization": "Bearer keyYNFILTvHzPsq1B"
          }
        })
      }

      Promise.all([getEvents(), getUser(userId)])
      .then(response => {
        console.log("preloading data: ",response)
        
        app.preloader.hide();
        // Resolve route to load page
        resolve(
          {
            component: AgendaPage,
          },
          {
            props: {
              user: response[1].data,
              events: response[0].data.records.map(event => {
                // event.localTime = event.fields["Start time"].local().format()
                return(event)
              })
            }
          }
        );
      })
      .catch(err => {
        console.log(err)
      })
    },
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  },
];

export default routes;
