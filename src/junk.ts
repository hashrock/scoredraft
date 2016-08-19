declare var firebase: any;

export class Junk {
  private auth: any
  private database: any
  private storage: any
  private messagesRef: any

  constructor(onAuthStateChanged: OnAuthStateChangedCallback) {
    this.auth = firebase.auth();
    this.database = firebase.database();
    this.storage = firebase.storage();
    this.messagesRef = this.database.ref('users');
    this.auth.onAuthStateChanged(onAuthStateChanged);
  };

  fetch(num: number, cb: FetchCallback) {
    var currentUser = this.auth.currentUser;
    var userRef = this.messagesRef.child(currentUser.uid)
    userRef.off();
    userRef.limitToLast(num).on('child_added', cb);
    userRef.limitToLast(num).on('child_changed', cb);
  }
  login() {
    var provider = new firebase.auth.GoogleAuthProvider();
    this.auth.signInWithPopup(provider);
  }

  logout() {
    this.auth.signOut();
  }

  post(text: string) {
    var currentUser = this.auth.currentUser;
    return this.messagesRef.child(currentUser.uid).push({
      user_id: currentUser.uid,
      name: currentUser.displayName,
      text: text,
      date: new Date().getTime()
    })
  }

  get user() {
    return this.auth.currentUser;
  }
}

interface UploadCallback { (filePath: string): void }
interface FetchCallback { (item: JunkItem): void }
class JunkItemBody{
  user_id: string
  name: string
  text: string
  photoUrl: string
}

interface JunkItemValue { (): JunkItemBody }
export class JunkItem{
  key: string
  val: JunkItemValue
}

interface OnAuthStateChangedCallback {(user: JunkUser): void}
export class JunkUser{
  photoURL: string
  displayName: string
}
