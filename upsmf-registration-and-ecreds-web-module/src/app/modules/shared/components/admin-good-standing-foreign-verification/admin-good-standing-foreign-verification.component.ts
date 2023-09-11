import { Component } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DialogBoxComponent, DialogModel } from '../dialog-box/dialog-box.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from 'src/app/core/services/http-service/http.service';
import { ConfigService } from '../../services/config/config.service';
import { MatDialog } from '@angular/material/dialog';
import { BaseServiceService } from 'src/app/services/base-service.service';
import { Observable } from 'rxjs';
import { applabels } from 'src/app/messages/labels';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-admin-good-standing-foreign-verification',
  templateUrl: './admin-good-standing-foreign-verification.component.html',
  styleUrls: ['./admin-good-standing-foreign-verification.component.scss']
})
export class AdminGoodStandingForeignVerificationComponent {
  candidateDetails: boolean = true;
  links = ['Candidate Details']

  goodStandingForeignVerificationformGroup: FormGroup;
  submitted = false;
  formsReady: boolean = false;

  labels = applabels;
  form1Html: any

  logo = '../../../../../assets/images/sunbird_logo.png';
  internalLogo = '../../../../../assets/images/up_smf_logo-24_x_24.png';
  listOfFiles: any[] = [];
  fileList: File[] = [];
  candidateDetailList: any[] = [];
  listOfCourseFiles: any[] = [];
  courseFileList: File[] = [];

  docsUrl: any[] = [];
  urlData: any[] = [];
  convertUrlList: string;
  urlList: any;
  updatedUrlList: any;
  userRole: any;
  userEmail: any;
  urlDataResponse: string;
  entity: string;
  osid: string;
  stateData: any;
  customData: any;
  type: string;
  endPointUrl: any;
  docsResponseUrl: string;
  paymentDetails: boolean = false;
  selectedLink: string = 'Candidate Details';
  paymentResponse: any;
  isInactive = true;


  profQualificationArray = ['ANM', 'Midwife', 'HW', 'Nurse', 'Bsc Nursing'];

  activity: Observable<any>;

  constructor(private formBuilder: FormBuilder, private baseService: BaseServiceService,
    private router: Router,
    public dialog: MatDialog,
    private configService: ConfigService,
    private http: HttpService,
    private route: ActivatedRoute,
  ) {
    this.userEmail = this.baseService.getUserRole()[0]
    console.log(this.userEmail)
    this.stateData = this.router?.getCurrentNavigation()?.extras.state;

    console.log("stateData:", this.stateData.body)
  }

  ngOnInit() {
    this.initForm();

    this.route.queryParams.subscribe((param) => {
      if (param['resData']) {
        this.paymentResponse = JSON.parse(param['resData'])
        this.paymentDetails = this.paymentResponse.isPayment
      }
    })
    console.log(this.osid)
  }

  getCandidatePersonalDetails() {
    console.log("getting getCandidatePersonalDetails")
    this.osid = this.stateData.body.entityId
    this.entity = this.stateData.body.entity
    console.log("entity", this.entity)
    if (this.entity === "StudentGoodstanding" && this.userEmail === "Regulator") {
      this.baseService.getCandidatePersonalDetailsRegulator$(this.entity,this.osid)
        .subscribe(
          (response: any) => {
            console.log("data", response)
            this.urlDataResponse = response.responseData.docproof;
            if (!!this.urlDataResponse) {
              this.urlData = this.urlDataResponse?.split(",").filter(url => url.trim() !== "");
              console.log('urlDaaaa', this.urlData)
              if (this.urlData.length) {
                this.listOfFiles = this.urlData?.map(url => {
                  const parts = url.split('=');
                  const fileNameWithQueryParams = parts[1];
                  const fileName = fileNameWithQueryParams.split('/').pop();
                  const extractLastPart = fileName?.split('_').pop();
                  const getuploadObject = {
                    name: extractLastPart,
                    url: url
                  }
                  return getuploadObject;
                });
              }
            }
            this.goodStandingForeignVerificationformGroup.patchValue({
              maidenName: response.responseData.name,
              mrdName: response.responseData.marriedName,
              email: response.responseData.email,
              mobNumber: response.responseData.phoneNumber,
              applicantName: response.responseData.name,
              adhr: response.responseData.aadhaarNo,
              fatherName: response.responseData.fathersName,
              dob: response.responseData.dob,
              gender: response.responseData.gender,
              al1: response.responseData.presentAddress,
              al2: response.responseData.presentAddress,
              state: response.responseData.state,
              pin: response.responseData.pincode,
              district: response.responseData.district,
              country: response.responseData.country,
              placeOfWork: response.responseData.workPlace,
              tcName: response.responseData.trainingCenter,
              regnNum: response.responseData.registrationNumber,
              proQual: response.responseData.professionalQualification

            });
          });
    }

  }
  getCandidatePersonalDetailsForeign() {
    console.log("getting getCandidatePersonalDetails")
    console.log("getting getCandidatePersonalDetails")
    this.osid = this.stateData.body.entityId
    this.entity = this.stateData.body.entity
    if (this.entity === "StudentForeignVerification" && this.userEmail === "Regulator") {
      this.baseService.getCandidatePersonalDetailsRegulator$(this.entity,this.osid)
        .subscribe(
          (response: any) => {
            this.urlDataResponse = response.responseData.docproof;
            if (!!this.urlDataResponse) {
              this.urlData = this.urlDataResponse?.split(",").filter(url => url.trim() !== "");
              console.log('urlDaaaa', this.urlData)
              if (this.urlData.length) {
                this.listOfFiles = this.urlData?.map(url => {
                  const parts = url.split('=');
                  const fileNameWithQueryParams = parts[1];
                  const fileName = fileNameWithQueryParams.split('/').pop();
                  const extractLastPart = fileName?.split('_').pop();
                  const getuploadObject = {
                    name: extractLastPart,
                    url: url
                  }
                  return getuploadObject;
                });
              }
            }
            this.goodStandingForeignVerificationformGroup.patchValue({
              maidenName: response.responseData.name,
              mrdName: response.responseData.marriedName,
              email: response.responseData.email,
              mobNumber: response.responseData.phoneNumber,
              applicantName: response.responseData.name,
              adhr: response.responseData.aadhaarNo,
              fatherName: response.responseData.fathersName,
              dob: response.responseData.dob,
              gender: response.responseData.gender,
              al1: response.responseData.presentAddress,
              al2: response.responseData.presentAddress,
              state: response.responseData.state,
              pin: response.responseData.pincode,
              district: response.responseData.district,
              country: response.responseData.country,
              placeOfWork: response.responseData.workPlace,
              tcName: response.responseData.trainingCenter,
              regnNum: response.responseData.registrationNumber,
              proQual: response.responseData.professionalQualification

            });
          });

    }




  }

  initForm() {
    this.goodStandingForeignVerificationformGroup = this.formBuilder.group({
      maidenName: new FormControl('', [
        Validators.required]),
      mrdName: new FormControl('', [
        Validators.required]),
      fatherName: new FormControl('', [
        Validators.required]),
      dob: new FormControl('', [
        Validators.required]),
      al1: new FormControl('', [
        Validators.required]),
      al2: new FormControl('', [
        Validators.required]),
      district: new FormControl('', [
        Validators.required]),
      state: new FormControl('', [
        Validators.required]),
      pin: new FormControl('', [
        Validators.required]),
      country: new FormControl('', [
        Validators.required]),
      adhr: new FormControl('', [
        Validators.required]),
      proQual: new FormControl('', [
        Validators.required]),
      regnNum: new FormControl('', [
        Validators.required]),
      tcName: new FormControl('', [
        Validators.required]),
      placeOfWork: new FormControl('', [
        Validators.required]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      mobNumber: new FormControl('', [
        Validators.required,
        Validators.pattern("^(0|91)?[6-9][0-9]{9}$")]),
    });
    this.goodStandingForeignVerificationformGroup.disable();
    { { (this.stateData.body.entity === "StudentForeignVerification" ? this.getCandidatePersonalDetailsForeign() : this.getCandidatePersonalDetails()) } }



  }
  navigateToUrl(item: any) {
    window.open(item, "_blank");
  }
  getStatusColorClass(status: string): string {
    switch (status) {
      case 'OPEN':
        return 'open';
      case 'CLOSED':
        return 'closed';
      case 'REJECTED':
        return 'rejected';
      default:
        return '';
    }
  }

  onGoodStandingForeignVerificationformSubmit(value: any) {
    const osid = this.stateData.body.id
    console.log("id....", osid)

    // if(this.entity==="StudentForeignVerification" && this.userEmail==="Regulator"){
    const message = `Enter the email`;
    const message1 = `Upload Document`;

    const shouldShowFileUpload = true;
    const resDialog = new DialogModel(message, message1);

    let dialogRef = this.dialog.open(DialogBoxComponent, {
      disableClose: true,
     
      data: { message, message1, shouldShowFileUpload }
    });
    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        this.urlList = this.updatedUrlList ? this.updatedUrlList : [...this.docsUrl, ...this.urlData]
        if (this.urlData.length) {
          this.listOfFiles = this.urlData?.map(url => {
            const parts = url.split('=');
            if (parts.length === 2) {
              return decodeURIComponent(parts[1]);
            }
            return null;
          });

        }
        const details = JSON.parse(this.stateData.body.propertyData);
        //convert to string with commaa separated
        this.convertUrlList = this.listOfFiles.join(',')
        const mailBody = {
          outsideEntityMailId: result.reason,
          name: this.goodStandingForeignVerificationformGroup.value.applicantName,
          gender: this.goodStandingForeignVerificationformGroup.value.gender,
          council: details.council,
          email: this.goodStandingForeignVerificationformGroup.value.email,
          examBody: value.examBody,
          docProofs: [this.convertUrlList],
          diplomaNumber: value.diplomaNumber,
          nursingCollage: value.collegeName,
          courseState: "aaaaa",
          courseCouncil: "BBB",
          state: this.goodStandingForeignVerificationformGroup.value.state,
          country: this.goodStandingForeignVerificationformGroup.value.country,
          // state: this.newRegCertDetailsformGroup.value.state,
          attachment: result.file,

        }
        this.baseService.sendMailOutsideUp$(mailBody).subscribe((response) => {
        })

      }

    });
  }
  onReset() {
    this.createQRCode().then((qrCodeURL: any) => {
      this.generatePDF(qrCodeURL.toString())
    })

  }
  async createQRCode() {
    const qrCodeData = 'https://example.com'; // Replace with your QR code data
    return await QRCode.toDataURL(qrCodeData);
  }
  generatePDF(qrCodeString: string) {
    const doc = new jsPDF()
    autoTable(doc, {
      margin: { top: 50 },
      rowPageBreak: 'auto',
      bodyStyles: { valign: 'top' },

      head: [],
      body: [
        [this.labels.maidenName, this.goodStandingForeignVerificationformGroup.controls['maidenName'].value],
        [this.labels.mrdName, this.goodStandingForeignVerificationformGroup.controls['mrdName'].value],
        [this.labels.fatherName, this.goodStandingForeignVerificationformGroup.controls['fatherName'].value],
        [this.labels.dob, this.goodStandingForeignVerificationformGroup.controls['dob'].value],
        [this.labels.al1, this.goodStandingForeignVerificationformGroup.controls['al1'].value],
        [this.labels.al2, this.goodStandingForeignVerificationformGroup.controls['al2'].value],
        [this.labels.district, this.goodStandingForeignVerificationformGroup.controls['district'].value],
        [this.labels.state, this.goodStandingForeignVerificationformGroup.controls['state'].value],
        [this.labels.pin, this.goodStandingForeignVerificationformGroup.controls['pin'].value],
        [this.labels.country, this.goodStandingForeignVerificationformGroup.controls['country'].value],
        [this.labels.mobNumber, this.goodStandingForeignVerificationformGroup.controls['mobNumber'].value],
        [this.labels.email, this.goodStandingForeignVerificationformGroup.controls['email'].value],
        [this.labels.proQual, this.goodStandingForeignVerificationformGroup.controls['proQual'].value],
        [this.labels.tcName, this.goodStandingForeignVerificationformGroup.controls['tcName'].value],
        [this.labels.regnNum, this.goodStandingForeignVerificationformGroup.controls['regnNum'].value],
        // [this.labels.attach,this.newRegCertDetailsformGroup.controls['attach'].value ],  
        [this.labels.placeOfWork, this.goodStandingForeignVerificationformGroup.controls['placeOfWork'].value],


      ],
      didDrawPage: (data) => {
        doc.text(this.labels.header, 14, 40);
        doc.addImage(this.logo, 10, 8, 80, 20);
        doc.addImage(qrCodeString, 160, 10, 30, 30);
        doc.addImage(this.internalLogo, 173, 23, 5, 5);
        const text = 'Please scan this QR code to approve / reject the claim'; // Replace with your desired text
        doc.setFontSize(7)
        doc.text(text, 145, 40);
      }

    });
    doc.save(`Application_${this.goodStandingForeignVerificationformGroup.controls['regnNum'].value}_.pdf`)
  }

}
