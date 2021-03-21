import { Injectable } from '@angular/core';
import firebase from 'firebase/app'
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/auth';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { resolve } from '@angular/compiler-cli/src/ngtsc/file_system';
const { Storage, Camera } = Plugins;

const firebaseConfig = {
  apiKey: "AIzaSyAxnvBRSsx5bW1IVf5YTWgR0cb7bUkg7vw",
  authDomain: "mynollyapp-39d23.firebaseapp.com",
  databaseURL: "https://mynollyapp-39d23.firebaseio.com",
  projectId: "mynollyapp-39d23",
  storageBucket: "mynollyapp-39d23.appspot.com",
  messagingSenderId: "204569611961",
  appId: "1:204569611961:web:cadebe4ab0778cb84d1568",
  measurementId: "G-G3KBSG41XM"
};
const TOKEN_KEY = 'myNollyApp-Admin-Token';


@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  public userProfile: any;
  public currentUser: any;
  public userDetails: any;
  movieList: any = [];
  currentPage = '/';
  img: any;
  users = 0;  
  years = new Array(20);
  cast = [];
  producers = [];
  year = [];
  genres = ['crime', 'comedy', 'action', 'love', 'romance', 'drama', 'fiction', ];
  languages = ['english', 'hausa', 'igbo', 'yoruba'];
  froms = ['youtube', 'ibaka', 'iroko', 'netflix', 'amazon', 'cinemas', 'default']
  types = ['Movie', 'Series', 'Short Film']

  constructor() {
    firebase.initializeApp(firebaseConfig);
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.currentUser = user;
        this.userProfile = firebase.firestore().doc(`/users/${user.uid}`);
      }
    });
    this.initialize()
  }
  async initialize(){
    this.getUsers();
    return this.getMovies().then(() => {
    }).catch(() => {
    });
  }

  async getMovies(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      firebase.firestore().collection('movies').onSnapshot(async (snapShot) => {
        this.movieList = [];
        snapShot.forEach(async (snap) => {
          await firebase.firestore().collection('movies').doc(snap.id).get()
          .then((details) => {
            const search = this.movieList.map((itm: any) => {
            return itm.id; }).indexOf(details.id);
            if(search == -1) {
              this.movieList.push({
                id: details.id,
                details: details.data()
              });
              // this.searchInfo(details.data());
              this.sort()
              

            }
          }).catch((err) => {
            reject(err);
          });
        });
          resolve(this.movieList)
      })
    }).catch((err) => {
      console.log(err);
    });
  }

  async getUsers(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      firebase.firestore().collection('users').onSnapshot(async (snapShot) => {
        this.users = snapShot.size;
      })
    }).catch((err) => {
      console.log(err);
    });
  }

  uploadImage(){
    Camera.getPhoto({
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos
    }).then((res) => {
      this.img = null;
      this.img = res.base64String;
      // this.presentToast('Image Uploaded');
    }).catch((err) => {
      console.log(err)
      alert(err.message);
    })
  }

  
  async addMovie(year: string, genre: [], title: string, description: string, link: string, cast: [], producers: [], language: [], img: string, added: string, from: string, type: string, trailer:string): Promise<any> {
    return new Promise(async (resolve, reject) => { 
      await firebase.firestore().collection('movies').add({title, description, link, year, genre, votes : 0, views: 1, cast, producers, language, added, from, type, trailer }).then((docRef) => {
        const storageRef = firebase.storage().ref(`/movies/${docRef.id}.png`);
        return storageRef.putString(img, 'base64', { contentType: 'image/png' }).then(() => {
          return storageRef.getDownloadURL().then(downloadURL => {
            return firebase.firestore().collection('movies').doc(docRef.id).update({ img: downloadURL }).then(() => {
              resolve(true)
            }).catch((err) => reject(err));
          }).catch((err) => reject(err));
        }).catch((err) => reject(err));
      }).catch((err) => reject(err));
    });
  }

  async update(form: any, id: any, img?: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      await firebase.firestore().doc(`/movies/${id}`).update({
        title: form.title,
        link: form.link,
        cast: form.cast,
        producers: form.producers,
        description: form.description,
        language: form.language,
        from: form.from,
        genre: form.genre,
        year: form.year,
        trailer: form.trailer,
        type: form.type
      }).then(() => {
        if(img) {
          const storageRef = firebase.storage().ref(`/movies/${id}.png`);
          return storageRef.putString(img, 'base64', { contentType: 'image/png' }).then(() => {
            return storageRef.getDownloadURL().then(downloadURL => {
              return firebase.firestore().collection('movies').doc(id).update({ img: downloadURL }).then(() => {
                resolve(true)
              }).catch((err) => reject(err));
            }).catch((err) => reject(err));
          }).catch((err) => reject(err));
        } else {
          resolve(true)
          return true
        }
      }).catch((err)=>{
        reject(err)
      });
    });
  }

  async deleteMovie(id: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const storageRef = firebase.storage().ref(`/movies/${id}.png`);
      await storageRef.delete().then(()=>{
        firebase.firestore().collection('movies').doc(id).delete().then(()=> {
          // File deleted successfully
          const removeIndex = this.movieList.map((itm: any) => {
            return itm.id; }).indexOf(id);
            // remove object
          this.movieList.splice(removeIndex, 1);
          resolve(true)
        }).catch((error) => {
          reject(error)
        });
      })
    })
  }

  sort(){
    return this.movieList.sort((a: any, b: any) => {
      // tslint:disable-next-line:prefer-const
      let nameA = a.details.title.toUpperCase(); // ignore upper and lowercase
      // tslint:disable-next-line:prefer-const
      let nameB = b.details.title.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      // names must be equal
      return 0;
    });
  }


  login(email: string, password: string): Promise<firebase.auth.UserCredential> {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  getUserProfile(): Promise<any> {
    return new Promise((resolve, reject) => {
      firebase.firestore().doc(`/users/${this.currentUser.uid}`).onSnapshot(userProfileSnapshot => {
        this.userDetails = userProfileSnapshot.data() as any;
        resolve(this.userDetails);
      })
    });
  }

  logout(): Promise<void> {
    return firebase.auth().signOut();
  }


}
