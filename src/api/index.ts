import http from './http';

declare var window:any;

export function wxconfig() {
  return http.get('/api/weixin/getSign');
}

export function login(data = {}) {
  return http.post('/api/accounts/login', data);
}

export function getTeams() {
  return http.get('/api/corps/all', null);
}

export function selectTeam(corp_id) {
  return http.post('/api/corps', {corp_id});
}

// export function getQuestionList() {
//   return http.get('/api/questions');
// }

export function startAnswer () {
  return http.get('/api/questions/begin');
}

export function nextQuestion(){
  return http.get('/api/questions/next');
}

export function queryResult(id, result) {
  return http.get(`/api/questions/${id}`, {result});
}

export function submitPaper() {
  // let correct_number = window.correctAnsweredNumbers;
  // let cost_time = Date.now() - window.answerStartedAt;
  return http.post('/api/questions');
}

export function getTranscript() {
  return http.get('/api/transcript');
}

export function getTeamRankings() {
  return http.get('/api/corps/sort');
}