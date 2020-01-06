const core = require('@actions/core');
const github = require('@actions/github');

const FIREBASE_CONFIG = core.getInput('FIREBASE_CONFIG');
function getFirebaseConfig() {
  return FIREBASE_CONFIG;
}