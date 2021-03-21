import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { GeneralService } from './../../services/general.service';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';

const { Camera } = Plugins


@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./new.component.css']
})
export class NewComponent implements OnInit {
  public addForm: FormGroup;
  today = moment().get('year')
  img: any = '';
  success = '';
  error = ''
  loading = false
  @ViewChild('content') content: any;

  constructor(public general: GeneralService, private router: Router, private formBuilder: FormBuilder,private modalService: NgbModal) {
    
    this.addForm = this.formBuilder.group({
      year: [''],
      trailer: [''],
      type: ['', Validators.compose([Validators.required])],
      genre: [[], Validators.compose([Validators.required])],
      from: [[], Validators.compose([Validators.required])],
      title: ['', Validators.compose([Validators.required])],
      description: ['', Validators.compose([Validators.required])],
      link: ['', Validators.compose([Validators.required])],
      cast: [[]],
      producers: [[]],
      language: [[], Validators.compose([Validators.required])]
    });  
  }

  ngOnInit(): void {
    this.general.currentPage = this.router.url
  }

  resetForm () {
    this.addForm.setValue({
      year: '',
      trailer: '',
      type: '',
      genre: [],
      from: [],
      title: '',
      description: '',
      link: '',
      cast: [],
      producers: [],
      language: []
    })
    this.img='';
  }

  open(content: any) {
    this.modalService.open(content, {centered: true, backdropClass: 'light-blue-backdrop', windowClass: 'dark-modal'}).result.then((result) => {
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

  async add(form: any) {
    const {language, link, description, title, from, genre, type } = this.addForm.value
    if(language && link && description && title && from && genre && type  && this.img) {
      this.success = '';
      this.error = ''
      this.loading = true
      try {
        let added = Date.now().toString();
        await this.general.addMovie(form.year, form.genre, form.title, form.description, form.link, form.cast, form.producers, form.language, this.img, added, form.from, form.type, form.trailer).then(() =>{
          this.success = 'Movie Uploaded Successfully'
          this.open(this.content)
        }).catch(() => {
          this.error = "An error occurred, please try again"
        });
      }
      catch(err){
        this.error = err;
      }
      finally{
        this.loading = false
      }
    }
    else {
      alert('Ensure that an Image is uploaded and all field with * are filled')
    }
  }

  addToList(type: string, event: any) {
    let value = event.target.value
    if(value) {
      if(type == 'cast'){
        this.addForm.value.cast.push(value)
        this.addForm.value.cas = ''
      } else if(type == 'prod') {
        this.addForm.value.producers.push(value)
        this.addForm.value.prod = ''
      }
    }
    event.target.value = '';
  }

  remove(i: any, form: any) {
    if(form == 'cast') {
      this.addForm.value.cast.splice(i, 1)
    } else if(form == 'prod') {
      this.addForm.value.producers.splice(i, 1)
    }
  }

  addOption(value: any, type: any, event: any) {
    if(type == 'gen') {
      if(this.addForm.value.genre.includes(value)) {
        let key = this.addForm.value.genre.indexOf(value)
        this.addForm.value.genre.splice(key, 1)
      } else {
        this.addForm.value.genre.push(value)
      }
    } else {
      if(this.addForm.value.language.includes(value)) {
        let key = this.addForm.value.language.indexOf(value)
        this.addForm.value.language.splice(key, 1)
      } else {
        this.addForm.value.language.push(value)
      }
    }
  }

  getArray(arr: any) {
    return arr.length > 0 ? arr.join(', ') : ''
  }
}
