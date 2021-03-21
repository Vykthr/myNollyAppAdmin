import { GeneralService } from './../../services/general.service';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';

const { Camera } = Plugins

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./movies.component.css']
})
export class MoviesComponent implements OnInit {
  public editForm: FormGroup;
  today = moment().get('year')
  closeResult = '';
  img: any = '';
  success = '';
  error = ''
  loading = false
  deleting = false
  deleteOp: any;
  @ViewChild('alertContent') alertContent: any;
  showing: any = {
    id: '',
    details: {
      title: "", img: "", producers: [], language: [], cast: [], link: "", description: "", from: "", type: "", genre: "", trailer: "", year: "" 
    }
  };
  constructor(public general: GeneralService, private router: Router, private formBuilder: FormBuilder,private modalService: NgbModal) {
    this.editForm = this.formBuilder.group({
      year: [this.showing?.details.year],
      trailer: [this.showing?.details.trailer],
      genre: [this.showing?.details.genre, Validators.compose([Validators.required])],
      type: [this.showing?.details.type, Validators.compose([Validators.required])],
      from: [this.showing?.details.from, Validators.compose([Validators.required])],
      title: [this.showing?.details.title, Validators.compose([Validators.required])],
      description: [this.showing?.details.description, Validators.compose([Validators.required])],
      link: [this.showing?.details.link, Validators.compose([Validators.required])],
      cast: [this.showing?.details.cast],
      producers: [this.showing?.details.producers],
      language: [this.showing?.details.language, Validators.compose([Validators.required])]
    });
  }

  ngOnInit(): void {
    this.general.currentPage = this.router.url
  }

  open(content: any, movie: any) {
    this.closeResult = ''
    this.showing = movie;
    this.editForm.setValue({
      year: movie.details.year ? movie.details.year : '',
      trailer: movie.details.trailer ? movie.details.trailer : '',
      type: movie.details.type ? movie.details.type : '',
      genre: movie.details.genre,
      from: movie.details.from,
      title: movie.details.title,
      description: movie.details.description,
      link: movie.details.link,
      cast: movie.details.cast,
      producers: movie.details.producers,
      language: movie.details.language
    })
    this.modalService.open(content, {centered: true, backdropClass: 'light-blue-backdrop', windowClass: 'dark-modal'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    });
  }

  
  async update(form: any) {
    this.success = '';
    this.error = ''
    this.loading = true
    try {
      if(this.img) {
        await this.general.update(form, this.showing.id, this.img).then(() => {
          this.modalService.dismissAll()
          alert('Movie Updated Successfully')
        }).catch(() => {
          alert("An error occurred, please try again")
        });
      } else{
        await this.general.update(form, this.showing.id).then(() => {
          this.modalService.dismissAll()
          alert('Movie Updated Successfully')
        }).catch(() => {
          alert("An error occurred, please try again")
        });
      }
    }
    catch(err){
      this.error = err;
      alert("An error occurred, please try again")
    }
    finally{
      this.loading = false
    }
  }

  async deleteMovie(id: any) {
    this.deleting = true
    try {
      await this.general.deleteMovie(id).then(() => {
        this.modalService.dismissAll()
        alert("Movie Deleted")
      }).catch(() => {
        alert("Error deleting movie, try again")
      })
    }
    catch(err){
      this.error = err;
      alert("An error occurred, please try again")
    }
    finally{
      this.loading = false
    }
  }

  openAlertModal(alertContent: any, movie: any) {
    this.deleteOp = movie;
    this.modalService.open(alertContent, {centered: true, backdropClass: 'light-blue-backdrop', windowClass: 'dark-modal'}).result.then((result) => {
    });
  }

  upload() {
    Camera.getPhoto({
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos,
    }).then((res) => {
      this.img = res.base64String;
    }).catch(() => {
      this.img = ''
    })
  }

  addToList(type: string, event: any) {
    let value = event.target.value
    if(value) {
      if(type == 'cast'){
        this.editForm.value.cast.push(value)
        this.editForm.value.cas = ''
      } else if(type == 'prod') {
        this.editForm.value.producers.push(value)
        this.editForm.value.prod = ''
      }
    }
    event.target.value = '';
  }

  remove(i: any, form: any) {
    if(form == 'cast') {
      this.editForm.value.cast.splice(i, 1)
    } else if(form == 'prod') {
      this.editForm.value.producers.splice(i, 1)
    }
  }


  addOption(value: any, type: any, event: any) {
    if(type == 'gen') {
      if(this.editForm.value.genre.includes(value)) {
        let key = this.editForm.value.genre.indexOf(value)
        this.editForm.value.genre.splice(key, 1)
      } else {
        this.editForm.value.genre.push(value)
      }
    } else {
      if(this.editForm.value.language.includes(value)) {
        let key = this.editForm.value.language.indexOf(value)
        this.editForm.value.language.splice(key, 1)
      } else {
        this.editForm.value.language.push(value)
      }
    }
  }

  getArray(arr: any) {
    return arr.length > 0 ? arr.join(', ') : ''
  }
}
