import Component from 'vue-class-component'
import * as Vue from "vue";
import {Junk, JunkUser, JunkItem} from "./junk"
declare var CodeMirror: any;
declare var TssCompiler: any;
declare var TsdPlayer: any;
declare var AudioLooper: any;
declare var BiquadFilterChannel: any;
declare var MasterChannel: any;

var sample = `#TITLE <test>
#CHANNEL 1
#A	t120 %1 @4 v3 $
	[<c8>f8<c8>f.< c>f<c> f2.<c2.> f8<c8>f8<c.> f<c>f< c2.>f2.
	b8e8b8e. beb e2.b2. e8b8e8b. ebe b2.<e2.>]
	l8 <[cc4f4g^2 gga-4.b-4. | >ff4b-4<c^2 >fga-4.b-4.<] ff4b-4<c^2.^2.
#END
`


@Component({
  props: {
  },
  template: `
    <div>
      <h1>scoredraft</h1>
      <div class="header">
        <button v-if="!user" @click="login">login</button>
        <button v-if="user" @click="logout">logout</button>
        <span v-if="user">{{user.displayName}}</span>
      </div>

      <div id="code" style="height:300px; width: 100%"></div>
      <button @click="send(message)">Post</button>
      <button @click="play(message)">Play</button>
      <div v-for="item in itemsRev" class="item" track-by="$index">{{item}}</div>
    </div>
  `
})
export class App extends Vue {
  junk: Junk;
  user: JunkUser;
  message: string;
  items: any[];
  looper: any;
  filter: any;
  ins: any;

  data(): any {
    return {
      user: {},
      message: "",
      items: []
    }
  }

  get itemsRev(): any[] {
    return this.items.reverse()
  }

  ready() {
    this.ins = CodeMirror(document.getElementById("code"), {
      mode: "text/html",
      theme: "monokai",
      lineWrapping: true,
      lineNumbers: true,
      styleActiveLine: true,
      matchBrackets: true,
      value: sample
    });
    this.ins.on("change", (e: any) => {
      this.message = e.getValue();
    })
    this.message = sample;

    this.junk = new Junk((user: JunkUser) => {
      this.user = user;
      this.junk.fetch(30, (item: JunkItem) => {
        this.items.push(item.val().text)
      })
    });

    this.looper = new AudioLooper(512);
    this.filter = new BiquadFilterChannel();

  }
  login() {
    this.junk.login();
  }
  logout() {
    this.junk.logout();
  }  

  send(message: string) {
    this.junk.post(
      message
    )
    this.ins.getDoc().setValue("");
  }

  play() {
    this.looper.setChannel(this.filter);
    var master8 = new MasterChannel();
    master8.setVolume(1);
    var player8 = new TsdPlayer();
    player8.setMasterChannel(master8);
    if (this.looper && !this.looper.isActive())
      this.looper.activate();
    var tsc = new TssCompiler();
    player8.play(tsc.compile(this.message));
    this.filter.setChannel(master8);
  }
  stop() {
    this.filter.setChannel(null);
  }
}