import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// Import needed templates
import '../../ui/layouts/body/body.js';
import '../../ui/pages/home/home.js';
import '../../ui/components/calculator/calculator.js';
import '../../ui/pages/add-unit/add-unit.js';
import '../../ui/pages/add-conversion/add-conversion.js';
import '../../ui/pages/edit-unit/edit-unit.js';
import '../../ui/pages/add-compound/add-compound.js';
import '../../ui/pages/edit-compound/edit-compound.js';
import '../../ui/pages/list/list.js';
import '../../ui/pages/not-found/not-found.js';
import '../../ui/pages/conversionGraph/graph';
// Set up all routes in the app
FlowRouter.route('/', {
  name: 'App.home',
  action() {
    BlazeLayout.render('App_body', { main: 'App_home' });
  },
});

FlowRouter.route('/add-unit', {
  name: 'App.add_unit',
  action() {
    BlazeLayout.render('App_body', { main: 'add_unit' });
  },
});

FlowRouter.route('/add-conversion', {
  name: 'App.add_conversion',
  action() {
    BlazeLayout.render('App_body', { main: 'add_conversion' });
  },
});

FlowRouter.route('/edit-unit/:_id', {
  name: 'App.edit_unit',
  action() {
    BlazeLayout.render('App_body', { main: 'edit_unit' });
  },
});

FlowRouter.route('/add-compound', {
  name: 'App.add_compound',
  action() {
    BlazeLayout.render('App_body', { main: 'add_compound' });
  },
});

FlowRouter.route('/edit-compound/:_id', {
  name: 'App.edit_compound',
  action() {
    BlazeLayout.render('App_body', { main: 'edit_compound' });
  },
});

FlowRouter.route('/list', {
  name: 'App.list',
  action() {
    BlazeLayout.render('App_body', { main: 'list' });
  },
});
FlowRouter.route('/list-conversions', {
  name: 'App.list_conversions',
  action() {
    BlazeLayout.render('App_body', { main: 'list_conversions' });
  },
});

FlowRouter.notFound = {
  action() {
    BlazeLayout.render('App_body', { main: 'App_notFound' });
  },
};
