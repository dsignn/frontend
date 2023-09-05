/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { LocalizeMixin } from "@dsign/polymer-mixin/localize/localize-mixin.js";
import { AclMixin } from "@dsign/polymer-mixin/acl/acl-mixin";
import { ServiceInjectorMixin } from "@dsign/polymer-mixin/service/injector-mixin.js";
import { lang } from './language.js';
// TODO add to widget load
import { Auth } from "../../../../src/authentication/Auth";


/**
 * @class DashboardIndex
 */
class DashboardIndex extends LocalizeMixin(AclMixin(ServiceInjectorMixin(PolymerElement))) {

  static get template() {
    return html`
      <style>
      
        :host {
            display: block;
            position: relative;
            padding-top: 12px;
            background: white;
        }
      
        .section {
            @apply --layout-horizontal;
            position: relative; 
        }
        
        .column {
            @apply --layout-vertical;
        }
        
        .row {
            @apply --layout-horizontal;
        }
        
        .row-responsive {
            @apply --layout-horizontal;
        }

        .center {
          @apply --layout-center-center;           
        }
        
        .space-between {
          @apply --layout-justified;           
        }
        
         .flex-1 {
          flex: 1;
         }
        
                
        .container {
            @apply --layout-horizontal;
            width:100%;
            max-width: 1080px;
            min-height: 400px;
        }

        .container.box {
          margin: auto auto;
      }
      

      .welcome {
        border: none;
        width: 100%;
        margin: 160px auto 0;
        background: url(https://dsign-asset.s3.eu-central-1.amazonaws.com/table-background.jpg);
        text-align: center;
        background-repeat: no-repeat;
        background-size: cover;
    }


    .welcome .container.box {
      margin: 50px 10%;
  }
        
    .gradient {
      background: linear-gradient(180deg, black, transparent);
      display: inline-block;
      width: 100%;
  }

  h2 {
    color: white;
    font-size: 3em;
    line-height: 1.1em;
    font-weight: normal;
    text-transform: uppercase;
    }

    h3 {
      font-size: 1.8em;
      text-align:center;
      text-transform: uppercase;
      font-weight: normal;
    }
    
    .welcome h2 {
      max-width: 600px;
      width:100%;
      text-align: left
    }
    
    .button {
      color: white;
      font-size: 1.7em;
      text-transform: uppercase;
      text-decoration: none;
      background: #015b63;
      border-radius: 10px;
      padding: 10px 40px;
      display: inline-block;
      margin-top: 30px;
    }
    
    .button:hover {
      transform:scale(1.1);
      transition: all ease 0.2s;
    }
    
    .button.yellow {
      color: black;
      background: #f0b906;
      transition: all ease 0.2s;
    }
    
    .menu {
      background: #f0b906;
      margin-top: -40px;
      text-align: center;
      padding-top: 80px;
    }
    
    .menu:after {
      content: "";
      display: inline-block;
      width: 60px;
      height: 60px;
      background: #f0b906;
      transform: rotate(45deg);
      margin: 0 auto -33px;
    }
    
    .text-block {
      max-width: 1000px;
      width: 90%;
      font-size: 26px;
      margin: 50px auto;
      padding: 0;
      text-align: center;
    }
    
    .flex {
      display: flex;
      justify-content: space-between;
      margin-top: 80px;
    }
    
    .flex div {
      display:block;
      width:16.6%;  
    }
    
    
    .icon {
      display: block;
      background: #015b63;
      border-radius: 17px;
      text-align: center;
      margin: auto 10%;
      line-height: 1;
      padding: 15%;
    }
    
    .icon:hover {
      transition: all ease 0.2s;
      padding: 10%;
    }
    
    .icon img {
      max-width: 100%;
    }
    
    .flex div p {
      font-size: 18px;
      margin: 5px 10%;
      line-height: 1.3em;
    }
    
    .menu h2{
      color: black;
    }
    
    .row.strengths {
      width: 90%;
      max-width: 1600px;
      margin: auto auto;
      text-align: center;
    }
    
    .blue {
      background: #015b63;
      padding: 50px 0;
    }
    
    .blue:after{
      content: "";
      display: inline-block;
      width: 60px;
      height: 60px;
      background: #015b63;
      transform: rotate(45deg);
      margin: 0 auto -80px;
    }

    .c-green {
      color:#015b63 !important;
    }
    
    .boxed{
      border-radius:25px;
      border:5px solid #f0b906;
      text-align:center;
      padding:50px;
      display:inline-block;
      margin:auto auto;
    }
    
    .boxed ul {
      margin: 0;
      padding: 0;
    }
    
    .boxed ul li {
      color: #015b63;
      list-style-type: none;
      font-weight: 500;
      margin: 20px 0;
      font-size: 22px;
      max-width: 300px;
    }
    
    .boxed ul li span{
      font-size:40px;
      font-weight:bold;
    }
    
    .boxed hr {
      border-color: black;
      max-width: 80%;
      margin: 10px auto;
    }
    
    .white {
      display: block;
      text-align: center;
      padding-bottom: 80px;
      z-index:10;
    }

    .blue {
      text-align: center;
    }
    
    .white:after {
      content: "";
      display: inline-block;
      width: 60px;
      height: 60px;
      background: white;
      transform: rotate(45deg);
      margin: 0 auto -117px;
    }
    
    .second.white:after {
      content: "";
      display: inline-block;
      width: 60px;
      height: 60px;
      background: white;
      transform: rotate(45deg);
      margin: 0 auto -77px;
    }
    
    .white h2{
      color: black;
      margin-top: 100px;
    }
    
    .people {
      margin-top: 80px;
      width:100%;
      text-align: center;
      margin: 80px auto 50px;
    }
    
    .quote {
      color: black;
      text-align: center;
      margin: 60px auto;
      max-width: 960px;
      font-size: 22px;
      display: flex;
      justify-content: space-between;
    }
    
    .review {
        position: absolute;
        transition: right ease 1s;
    }
    
    .review.active{
      display:block;
      align-self:center;
      width:100%;
    }
    
      .navigation{
    
      }
    
      .navigation .dot {
        height: 16px;
        width: 16px;
        border-radius: 50%;
        background: #015b63;
        margin: 0 10px;
        display: inline-block;
    }
    
    .navigation .dot:hover, .navigation .dot.active{
      cursor:pointer;
      background: white;
    }
      
      .row.team {
        width: 100%;
        max-width: 1600px;
        justify-content: space-around;
        margin: 50px auto 20px;
    }
    
    footer {
         padding-top: 70px;
         background-color: #015b63;
         color: white; 
         display: flex;
         align-items: center;
         justify-content: center;
    }
    
    footer div {
        padding-bottom: 25px;
    }
    
    footer div:nth-child(2) {
        padding-left: 25px;
    }
    
    footer div a {
        padding-left: 25px;
    }
    
    .slideshow-container {
      width: 60%;
      min-height: 180px;
      position: relative;
      overflow: hidden;
    }
    
    .left, .right {
      font-size: 60px;
      font-family: auto;
      line-height: 160px;
      width: 20%;
      color: #015b63;
    }
    
    .left:hover, .right:hover {
      color:white;
      cursor:pointer;
    }
    
    #how{
      display:block;
      color:white;
    }
    
    #how .text-block{
      max-width:1200px;
    }
    
    #how .text-block .flex .step {
      width: 24%;
    }
    
    #how .text-block .flex .step div {
      display: block;
      border-radius: 15px;
      position: relative;
      background-size: cover !important;
      background-repeat: no-repeat !important;
      background-position: center center !important;
      padding-bottom: 50px;
      width: 100%;
      min-height: 500px;
    }
    
    #how .text-block .flex .step:first-child div {
      color: #015b63;
      background: url(https://dsign-asset.s3.eu-central-1.amazonaws.com/info-registration.gif);
    }

    #how .text-block .flex .step:nth-child(2) div {
      color: #015b63;
      background: url(https://dsign-asset.s3.eu-central-1.amazonaws.com/info-create-qrcode.gif);
    }
    
    #how .text-block .flex .step:nth-child(3) div {
      color: #015b63;
      background: url(https://dsign-asset.s3.eu-central-1.amazonaws.com/info-create-menu.gif);
    }
    
    #how .text-block .flex .step:nth-child(4) div {
      color: #015b63;
      background: url(https://dsign-asset.s3.eu-central-1.amazonaws.com/info-table.jpg);
    }
    
    #how .text-block .flex .step div:after {
      content: "";
      display: inline-block;
      font-size: 1.6em;
      height: 80px;
      width: 80px;
      background: white;
      border-radius: 50%;
      border: 5px solid #f0b906;
      position: absolute;
      bottom: -50px;
      left: 50%;
      line-height: 80px;
      z-index: 100;
      transform: translateX(-50%);
    }
    
    #how .text-block .flex .step:first-child div:after {
      content:"1";
      }
    
    #how .text-block .flex .step:nth-child(2) div:after {
        content:"2";
      }
        
    #how .text-block .flex .step:nth-child(3) div:after {
        content:"3";
      }
      
      #how .text-block .flex .step:nth-child(4) div:after {
        content:"4";
        color:#015b63;
      }
      
    
    #how .text-block .flex .step img{
      width: 100%;
      filter: brightness(0.5);
    }
    
    #how .text-block .flex .step p{
      margin-top: 70px;
      font-size: 22px;
    }
    
    #team{
      display:block;
    }

    #partner {
      display:flex;
      flex-direction: column;
    }
    
    #team .text-block,
    #partner .text-block {
      max-width:1200px;
    }

    .partner-container {
      display:flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: space-between;
    }

    .partner-card {
      flex-basis:24%;
      margin-bottom:10px;
      border: 4px solid #f0b906;
      border-radius: 6px;
      background-color: white;
    }


    .partner-card .card-container {
      height: 120px;
      display:flex;
      flex-direction: row;
    }

    .logo-restaurant {
      height: 120px;
      width: 100px !important;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center center;
      background-color: #F0F0F0;
    }

    .partner-card .header {
      display:flex;
      flex-direction: column;
      height: 120px;
      flex:1;
    }

    .partner-card .title {
      font-size: 22px;
      line-height: 26px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 4px;
      flex:1;
    }

    .partner-card .card-menu {
      font-size: 16px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding: 6px 8px;
      background-color: #f0b906;
      color: white;
    }

    .partner-card .card-menu :nth-child(1),
    .partner-card .card-menu :nth-child(2) {
      cursor:pointer;
    }
    
    #team .flex {
    
      margin-top: 250px;
    }
    
    #team .text-block .flex .step{
      width: 30%;
    }
    
    #team .text-block .flex .step div {
      display: block;
      background: #ddd;
      border-radius: 15px;
      position: relative;
      padding: 120px 20px 50px;
      width: 100%;
      min-height: 200px;
    }
    
    #team .text-block .flex .step:hover div {
      background: #f0b906;
    }
    
    #team .text-block .flex .step:hover div p {
      color:white;
    }
    
    #team .text-block .flex .step div:before {
      content: "";
      display: inline-block;
      font-size: 3em;
      height: 150px;
      width: 150px;
      background: white;
      border-radius: 50%;
      border: 6px solid #015b63;
      position: absolute;
      top: -80px;
      left: 50%;
      line-height: 150px;
      z-index: 100;
      transform: translateX(-50%);
    }
    
    #team .text-block .flex .step:hover div:before {
      font-size: 4em;
      height: 200px;
      width: 200px;
      top: -110px;
      left: 50%;
      line-height: 200px;
      border:6px solid #f0b906;
    }
    
    #team .text-block .flex .step:first-child div:before {
      content: "";
      background: url(https://dsign-asset.s3.eu-central-1.amazonaws.com/av-avatar.jpeg);
      background-size: contain;
    }
    
    #team .text-block .flex .step:nth-child(2) div:before {
      content: "";
      background: url(https://dsign-asset.s3.eu-central-1.amazonaws.com/ps-avatar.jpeg);
      background-size: contain;
      }
        
    #team .text-block .flex .step:nth-child(3) div:before {
      content: "";
      background: url(https://dsign-asset.s3.eu-central-1.amazonaws.com/mb-avatar.jpeg);
      background-size: contain;
      }
    
      #team .text-block .flex p.name {
        font-size: 24px;
        margin-bottom: 15px;
    }
    
    #team .text-block .flex p.role {
      font-size: 20px;
      margin-bottom: 50px;
    }
     
    .padding-34 {
        padding: 34px;
    }
    
    .team-title {
        text-align: center;
    }
    
    .container-logo {
      display: block;
      height: 280px;
      width: 280px;
      background: white;
      border-radius: 50%;
      margin: -160px auto 0px;
  }
        
  .logo {
    height: 300px;
    width: 300px;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 100%;
    background-image: url(https://dsign-asset.s3.eu-central-1.amazonaws.com/logo.png);
    transform: translate(-10px, -25px);
    }
    
    .facebook {
        width: 40px;
        height: 40px;
    }

    .intro-description {
      text-align: left;
      font-size: 18px;
      padding-top: 50px;
      max-width: 600px;
  }
    
    .padding-top-30 {
        padding-top: 30px;
    }


    
    .strengths {
        flex-wrap: wrap;
    }
    
    paper-card[strengths] {
        min-width: 300px;
        margin-bottom: 20px;
    }
    
    .card-content {
        padding: 10px;
        text-align: center;
    }
    
    .margin-0 {
        margin: 0;
    }
    
    .icon-footer {
        color: white;
        width: ;
        --iron-icon-height: 50px;
        --iron-icon-width: 50px;
    }
    
    .icon-work {
        color: var(--app-primary-color);
        --iron-icon-height: 20px;
        --iron-icon-width: 20px;
    }
    
     .row-responsive.mail {
            padding-left: 20px;
         }

    @media only screen and (max-width: 1000px) {
      .team {
        flex-direction: column;
        align-items: center;
      }
      
      paper-card[strengths] {
        min-width: 400px;
      }
    }
    
    @media only screen and (max-width: 1250px) {
      .partner-card {
           flex-basis:32%;
       }
   }

   @media only screen and (max-width: 1000px) {
    .partner-card {
         flex-basis:48%;
     }
   }

   @media only screen and (max-width: 700px) {
    .partner-card {
         flex-basis:100%;
     }
   }

    @media only screen and (max-width: 883px) {
       paper-card[strengths] {
            min-width: 300px;
        }
    }
    
    @media only screen and (max-width: 699px) {
      .strengths,
      .example {
        flex-direction: column;
        align-items: center;
      }
    }

    @media only screen and (max-width: 900px) {
      #how .flex,
      #team .flex {
        margin-top: 50px;
        flex-direction: column;
      }

      #team .text-block .flex .step div {
        padding: 120px 10px 50px;
        width: auto;
      }

      #how .text-block .flex .step {
        width: 100%;
      }

      #team .text-block .flex .step {
        width: 100%;
        margin: 130px 0 0;
     }
     
    }

    @media only screen and (max-width: 600px) {
    
      .row-responsive {
            @apply --layout-vertical;
        }
        
      .logo {
        transform: translate(-7px, -20px);
        height: 270px;
        width: 270px;
        }
    
        .container-logo {
          height: 256px;
          width: 256px;
        }
    
        h2, .welcome h2 {
            font-size: 2.3em;
            text-align:center;
        }
          
        .flex {
          flex-flow: row wrap;
          justify-content: center;
        }
    
        .flex div {
            display: block;
            width: 49.5%;
        }
    
        #how .text-block .flex .step {
            width: 100%;
        }
    
        #how .text-block .flex .step p {
          margin-top: 60px;
          margin-bottom: 35px;
        }
    
        .intro-description {
            max-width: 90%;
            text-align: center;
        }
              
          .welcome .container.box {
            margin: 50px 5%;
          }
    
          .left, .right {
            font-size: 80px;
            width: 15%;
         }
    
        .slideshow-container {
          min-height: 150px;
         }  
    
          #team .flex {
            margin-top: 50px;
          }
    
          #team .text-block .flex .step div {
            padding: 120px 10px 50px;
            width: auto;
          }
    
          #team .text-block .flex .step {
            width: 100%;
            margin: 130px 0 0;
         }
         
         footer {
            flex-direction: column;
            
         }
     
         footer div:nth-child(2) {
            padding-left:  0;
         }
    
         footer div a {
             padding-right: 25px;
             padding-bottom: 25px;
         }
         
         .row-responsive.mail {
            padding-left: 0;
         }
    }
        
      </style>
      <template is="dom-if" if="{{isAllowed('dashboard', 'index-view')}}">
          <div class="section padding-top-30">
          <div class="welcome">
          <div class="gradient">
           <div class="container-logo">
                  <div class="logo"></div>
              </div>
              <div class="container box">
                <div class="intro-description center start">
                    <h2 class="margin-0">{{localize('thinking')}}</h2>
                    <a class="button yellow" on-tap="openLogin">{{localize('find-more')}}</a>
                </div>
                </div>
                </div>
              </div>      
          </div>
          <div class="menu">
          <div class="inside">
                  <h2>Dsign Menù</h2>
              <div class="text-block">
                    <p class="">Di addio alle continue ristampe dei menù cartacei, all'usura e alla loro poca igienicità.<br/>Da oggi c'è Dsign Menu, il primo <b>menu interamente digitale</b>, l'ideale per i tuoi clienti!<br/>FACILE, VELOCE E PERSONALIZZABILE.</p>
                    <div class="flex">
                    <div class="">
                    <a class="icon"><img src="https://dsign-asset.s3.eu-central-1.amazonaws.com/ico1.png" /></a><p>Innovativo</p>
                    </div>
                    <div class="">
                    <a class="icon"><img src="https://dsign-asset.s3.eu-central-1.amazonaws.com/ico2.png" /></a><p>Personalizzabile</p>
                    </div>
                    <div class="">
                    <a class="icon"><img src="https://dsign-asset.s3.eu-central-1.amazonaws.com/ico3.png" /></a><p>Sempre aggiornato</p>
                    </div>
                    <div class="">
                    <a class="icon"><img src="https://dsign-asset.s3.eu-central-1.amazonaws.com/ico7.png" /></a><p>Nessuna APP da scaricare</p>
                    </div>
                    <div class="">
                    <a class="icon"><img src="https://dsign-asset.s3.eu-central-1.amazonaws.com/ico4.png" /></a><p>Semplicemente Veloce</p>
                    </div>
                    <div class="">
                    <a class="icon"><img src="https://dsign-asset.s3.eu-central-1.amazonaws.com/ico5.png" /></a><p>Rispettoso dell'ambiente</p>
                    </div>
                </div>
                </div>
            </div>
          </div>  
          <div class="section column white team">
              <div class="container box">
                  <div class="people center start">
                      <h2 class="margin-0">PERCHE’ SCEGLIERCI?</h2>
                      <div class="text-block">
                          <p>
                          I menù cartacei ormai sono obsoleti. Necessitano di continue attenzioni igieniche e aggiornamenti.
                          Con Design menù l’ordine si fa più velocemente, il cliente viene fornito di un menù digitale e personalizzato sul quale cercare i vostri piatti con filtri avanzati per soddisfare ogni richiesta e si sa.... cliente felice, cliente fidelizzato!
                          </p>
                        </div>
                  </div>
              </div>
          </div>  
          <div class="section column blue">
            <div id="how" class="row center">
                <h2>Come Funziona?</h2>
                <div class="text-block">
                  <p class="">Ti basteranno quattro semplici passaggi per avere il tuo menù digitale pronto all'uso!</p>
                  <div class="flex">
                    <div class="step">
                      <div class=""></div><p>Registrati gratuitamente cliccando l'icona in alto a destra</p>
                    </div>
                    <div class="step">
                      <div class=""></div><p>Genera il QrCode che hai intenzione di utilizzare, sala e/o delivery</p>
                    </div>
                    <div class="step">
                      <div class=""></div><p>Inserisci i dati del tuo ristorante e crea il menù</p>
                    </div>
                    <div class="step">
                      <div class=""></div><p>Metti il tuo QrCode sui tavoli o invalo ai tuoi contatti</p>
                    </div>
                  </div>
                </div>         
                <a class="button yellow" on-tap="openLogin" style="margin-bottom: 20px;">Provalo subito</a>
            </div>     
          </div>
          <div class="section column second white">
             <div class="row center">
                <h2 class="c-green">Quanto mi costa?</h2>
             </div>
             <div class="text-block">
                <div class="boxed">
                  <ul>
                    <li>Inserimento di menu ILLIMITATO</li>
                    <li>Attivazione singola oppure di due diversi menù (delivery o in loco)</li>
                    <li>Due diversi template per il tuo menu</li>
                    <li>Generatore del menù cartaceo</li>
                    <li>Generatore QR CODE</li>
                    <li>Filtri di ricerca avanzati</li>
                    <hr/>
                    <li>
                      <span>1 ANNO GRATIS</span>
                      <div>poi 14,90€/Mese</div>
                    </li>
                  </ul>
                </div>
             </div>
          </div>
          <div class="menu">
              <div class="container box">
                <div class="people center start">
                    <h2 class="margin-0">Dicono di noi</h2>
                    <div class="quote">
                      <a class="left prev" on-tap="prevReview">&#10094;</a>
                      <div class="slideshow-container">
                          <div class="review active">Ottima iniziativa. Vista la pandemia, avere il mio menù interamente digitale mi risparmia un sacco di lavoro e di preoccupazioni.<br/><i>Claudio</i></div>
                          <div class="review" style="display: block; right: 1500px;">I miei clienti mi hanno fatto i complimenti! App ben fatta, intuitiva e soprattutto igienicamente sicura!<br/><i>Antonio</i></div>
                          <div class="review" style="display: block; right: 1500px;">Inizialmente ero un po' preoccupata visto la mia clientela di tutte le età. L'idea però mi è piaciuta fin da subito, l'ho provata e i miei clienti sono soddisfatti.<br/><i>Gabriella</i></div>      
                      </div>
                      <a class="right next" on-tap="nextReview">&#10095;</a>
                    </div>
                    <div class="navigation">
                        <span class="dot active"></span>
                        <span class="dot"></span>
                        <span class="dot"></span>
                    </div>
                </div>
              </div>      
          </div>
          <div class="section column blue">
              <div id="partner" class="row center">
                <h2>I nostri ristoranti</h2>
                <div class="text-block partner-container">
                  <dom-repeat id="menu" items="{{restaurants}}" as="restaurant">
                    <template>
                      <div class="partner-card">
                        <div class="card-container">
                          <div class="logo-restaurant" style="background-image:url({{getBackgroundCard(restaurant)}})"></div>
                          <div class="header">
                            <div class="title">{{restaurant.name}}</div>
                            <div class="card-menu" restaurant={{restaurant}}>
                              <div style="display:{{enableMenuCard(restaurant, 'indoor')}}" on-tap="openIndoor">Menu in sala</div>
                              <div style="display:{{enableMenuCard(restaurant, 'delivery')}}" on-tap="openDelivery">Menu delivery</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </template>
                  </dom-repeat>
                </div>
              </div>
          </div>
          <div class="section column white team">
            <div id="team" class="row center">
                <h2>Il Team</h2>
                <div class="text-block">
                  <p class="">Siamo un gruppo di ragazzi con la passione per il web, per le nuove tecnologie e la comunicazione digitale. La nostra proposta è un'idea fresca e innovativa che pensiamo possa venire in soccorso ai ristoratori che vogliono stare al passo con i tempi.</p>
                  <div class="flex">
                    <div class="step">
                      <div class="">
                        <p class="name">Antonio</p>
                        <p class="role">
                            CTO
                            <a class="icon-work" href="https://www.linkedin.com/in/antonino-visalli-7996a4a2/" target="_blank" !important;">
                                <iron-icon icon="linkedin"></iron-icon>     
                            </a>
                        </p>
                        <p class="desc">01110011 01100011 01100101 01101101 01101111 00100000 01100011 01101000 01101001 00100000 01101100 01100101 01100111 01100111 01100101</p>
                      </div>
                    </div>
                    <div class="step">
                      <div class="">
                        <p class="name">Paolo</p>
                        <p class="role">
                          Full Stack developer
                          <a class="icon-work" href="https://www.linkedin.com/in/paolo-sartorio-83039b66/" target="_blank" !important;">
                            <iron-icon icon="linkedin"></iron-icon>     
                          </a>
                        </p>
                        <p class="desc">Bisogna saper prendere la palla al balzo, come diceva il castratore di canguri</p>
                        </div>
                    </div>
                    <div class="step">
                      <div class="">
                        <p class="name">Martina</p>
                        <p class="role">
                          Creative
                          <a class="icon-work" href="https://www.linkedin.com/in/martina-bertinazzi-224192196/" target="_blank" !important;">
                            <iron-icon icon="linkedin"></iron-icon>     
                          </a>  
                        </p>
                        <p class="desc">Appassionata di comunicazione e grafica, martina una ne fa e mille ne pensa</p>
                        </div>
                    </div>
                  </div>
                </div>        
            </div>     
          </div>
          <footer>
            <div>© 2020 Dsign - Buon appetito</div> 
            <div class="row-responsive">
                <a class="icon-footer" href="https://www.facebook.com/Ds-ign-106670881473065/" target="_blank">
                    <iron-icon icon="facebook"></iron-icon>
                </a>
                <a class="icon-footer" href="https://www.instagram.com/ds_ign_/" target="_blank">
                    <iron-icon icon="instagram"></iron-icon>     
                </a>
                <a class="icon-footer" href="mailto:info@ds-ign.it">
                    <iron-icon icon="mail"></iron-icon>     
                </a>
              </div>
              <div class="row-responsive mail">
                   info@ds-ign.it
              </div>
          </footer>
        </template>
        <template is="dom-if" if="{{isAllowed('dashboard', 'index-logged')}}">
            dashboard
        </template>`;
  }

  constructor() {
    super();
    this.resources = lang;
  }

  connectedCallback() {
    super.connectedCallback();
    this.initReviewDiv();
  }


  static get properties() {
    return {

      services: {
        value: {
          _notify: "Notify",
          _localizeService: 'Localize',
          _aclService: "Acl",
          _authService: "Auth",
          _config: "config"
        }
      },

      _authService: {
        observer: 'changeAuthService'
      },

      _config: {

      },

      restaurants: {
        value: [],
      }
    };
  }

  /**
   * @param next
   * @private
   */
  _updateDot(next) {
    let dots = this.shadowRoot.querySelectorAll('.navigation span');
    for (let index = 0; dots.length > index; index++) {
      dots[index].classList.remove('active');
      if (index === next) {
        dots[index].classList.add('active');
      }
    }
  }

  prevReview() {
    let elements = this.shadowRoot.querySelectorAll('.review');
    let current = this._getCurrentActiveReviewIndex(elements);
    let next = current === 0 ? elements.length - 1 : current - 1;

    this._updateDot(next);

    setTimeout(
      () => {
        elements[next].style.display = 'none';
        elements[next].style.right = '-1500px';
      },
      10
    );

    setTimeout(
      () => {
        elements[next].style.display = 'block';
      },
      50
    );

    setTimeout(
      () => {
        elements[current].style.right = '1500px';
        elements[current].classList.remove('active');
        elements[next].style.right = '0';
        elements[next].classList.add('active');
      },
      100
    );
  };

  /**
   * @param authService
   */
  changeAuthService(authService) {
    if (!authService) {
      return;
    }

    authService.eventManager.on(
      Auth.LOGIN,
      (evt) => {
        this.style.backgroundColor = '#eeeeee'
      }
    );

    authService.eventManager.on(
      Auth.LOGOUT,
      (evt) => {
        this.style.backgroundColor = '#ffffff'
      }
    );

    authService.eventManager.on(
      Auth.IDENTITY,
      (evt) => {
        this.style.backgroundColor = '#eeeeee'
      }
    );

    if (authService.getIdentity()) {
      this.style.backgroundColor = '#eeeeee'
    }
  }


  
  /**
   *
   */
  initReviewDiv() {
    let elements = this.shadowRoot.querySelectorAll('.review');
    for (let index = 0; index < elements.length; index++) {
      if (!elements[index].classList.contains('active')) {
        elements[index].style.right = '1200px';
      } else {
        elements[index].style.right = '0';
      }
    }
  }

  /**
   * @param evt
   */
  openLogin(evt) {
    let drawer = document.querySelector('dsign-app').shadowRoot.querySelector('#authDrawer');
    drawer.querySelector('paper-tabs').selected = 1;
    drawer.open();
  }

  /**
   * @param {CustomEvent} evt 
   */
  openIndoor(evt) {
    window.open(`${this._config.app.menuPath}/${evt.target.parentElement.restaurant.normalize_name}`, "_blank")
  }

  /**
   * @param {CustomEvent} evt 
   */
  openDelivery(evt) {
    window.open(`${this._config.app.menuPath}/${evt.target.parentElement.restaurant.normalize_name}?delivery`, "_blank")
  }

}

window.customElements.define('dashboard-index', DashboardIndex);

