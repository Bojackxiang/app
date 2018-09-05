import { PcPage } from './app.po';

describe('pc App', function() {
  let page: PcPage;

  beforeEach(() => {
    page = new PcPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
