import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import emailjs, { type EmailJSResponseStatus } from '@emailjs/browser';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private http: HttpClient) { 
    emailjs.init("25r7rF8Gug9aB4zfB");
  }


  public sendMailToRegistration(name: string, jelszo: string, cegnev: string, to: string): Promise<EmailJSResponseStatus> {
    const templateParams = {
        neve: name,
        jelszo: jelszo,
        link: "hernyikstudio.eu",
        cegnev: cegnev,
        to_email: to,
    };
    return emailjs.send("service_yhpq1ww", "registration", templateParams);
  }
}
