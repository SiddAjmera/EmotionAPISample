import { EmotionAPIDemoPage } from './app.po';

describe('emotion-apidemo App', () => {
  let page: EmotionAPIDemoPage;

  beforeEach(() => {
    page = new EmotionAPIDemoPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
