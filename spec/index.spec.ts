let $ = document.querySelector;
let $$ = document.querySelectorAll;

describe('boot', () => {
  it('boot page has a stat bottom', (done: DoneFn) => {
    expect($('.start-button')).toBeTruthy(null);
    done();
  });
});