import { MySky, SkynetClient } from "skynet-js";
import { randomSkylink } from "./utils";
import { ContentRecordDAC } from "content-record-library";

// TODO: is this correct?
const SKAPP_DOMAIN = document.referrer;

export default class ExampleSkapp {
  private list: HTMLElement;
  private listCount: number;

  private mySky: MySky;
  private crDAC: ContentRecordDAC;

  constructor(public client: SkynetClient) {
    this.crDAC = new ContentRecordDAC()
    this.list = document.getElementById("ulContentList") as HTMLElement;
    this.listCount = 0;
  }

  public async init(): Promise<void> {
    // load mysky
    this.mySky = await this.client.loadMySky(SKAPP_DOMAIN)

    // load DACs
    await this.mySky.loadDacs(this.crDAC)

    // check login
    try {
      await this.mySky.checkLogin();
    } catch (error) {
      // should switch UI
      console.log('login failed', error)
    }
  }

  public async create(): Promise<void> {
    const cntr = this.listCount++;

    // upload content -> generates skylink
    const skylink = randomSkylink()

    // create list item
    const item = document.createElement('li');
    const itemId = `btnInteract${cntr}`;
    item.className="contentItem"
    item.innerHTML = `
      <p>${cntr+1}. I am a piece of content</p>
      <input type="button" id="${itemId}" data-id=${cntr} data-skylink=${skylink} value="Like Me"/>
    `;
    this.list.appendChild(item);

    // set onclick event
    document.getElementById(itemId)!.onclick = skapp.like.bind(this);

    // record create
    const create = {
      content: skylink,
      metadata: { identifier: cntr }
    }
    console.log('recording creation', create)
    const result = await this.crDAC.recordNewContent(create);
    console.log(result)
  }

  public async like(e: MouseEvent): Promise<void> {
    const element = e.target as HTMLElement;
    const interaction = {
      content: element.dataset.skylink as string,
      metadata: { identifier: element.dataset.id }
    }
    console.log('recording interaction', interaction)
    const result = await this.crDAC.recordInteraction(interaction);
    console.log(result)
  }
}

let skapp: ExampleSkapp;

(async () => {
  const client = new SkynetClient("https://siasky.net");
  skapp = new ExampleSkapp(client);
  await skapp.init()
  console.log('ExampleSkapp initialized');
    
  // bind functions
  document.getElementById("btnCreate")!.onclick = skapp.create.bind(skapp);
  // document.getElementById("btnLogin")!.onclick = skapp.login.bind(skapp);
})();
