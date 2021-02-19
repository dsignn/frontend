/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import {LocalizeMixin} from "@dsign/polymer-mixin/localize/localize-mixin.js";
import {AclMixin} from "@dsign/polymer-mixin/acl/acl-mixin";
import {ServiceInjectorMixin} from "@dsign/polymer-mixin/service/injector-mixin.js";
import {lang} from './language.js';
// TODO add to widget load
import './../../../restaurant/element/widget/active-menu/active-menu.js';
import {Auth} from "../../../../src/authentication/Auth";


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
    
    .boxed{
      border-radius:25px;
      border:5px solid white;
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
      color: white;
      list-style-type: none;
      margin: 20px 0;
      font-size: 22px;
      max-width: 300px;
    }
    
    .boxed ul li span{
      font-size:42px;
      font-weight:bold;
    }
    
    .boxed hr {
      border-color: black;
      max-width: 60%;
      margin: 50px auto;
    }
    
    .white {
      display: block;
      text-align: center;
      padding-bottom: 80px;
      z-index:10;
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
      background: #015b63;
      transform: rotate(45deg);
      margin: 0 auto -120px;
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
        padding-top: 30px;
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
    }
    
    #how .text-block{
      max-width:1200px;
    }
    
    #how .text-block .flex .step{
      width: 30%;
    }
    
    #how .text-block .flex .step div {
      display: block;
      background: url(https://dsign-asset.s3.eu-central-1.amazonaws.com/table-background.jpg);
      border-radius: 15px;
      position: relative;
      background-size: cover;
      padding-bottom: 50px;
      width: 100%;
      min-height: 500px;
    }
    
    #how .text-block .flex .step:first-child div {
      background-position:top left;
    }
    
    #how .text-block .flex .step:nth-child(2) div {
      background-position:center center;
    }
    
    #how .text-block .flex .step:nth-child(3) div {
      background-position:bottom right;
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
    
    #team .text-block{
      max-width:1200px;
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
      background: url(https://previews.123rf.com/images/jemastock/jemastock1608/jemastock160801531/61219186-flat-design-face-of-man-icon-vector-illustration.jpg);
      background-size: contain;
    }
    
    #team .text-block .flex .step:nth-child(2) div:before {
      content: "";
      background: url(https://previews.123rf.com/images/jemastock/jemastock1608/jemastock160801531/61219186-flat-design-face-of-man-icon-vector-illustration.jpg);
      background-size: contain;
      }
        
    #team .text-block .flex .step:nth-child(3) div:before {
      content: "";
      background: url(https://previews.123rf.com/images/jemastock/jemastock1608/jemastock160801531/61219186-flat-design-face-of-man-icon-vector-illustration.jpg);
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

    @media only screen and (max-width: 1000px) {
      .team {
        flex-direction: column;
        align-items: center;
      }
      
      paper-card[strengths] {
        min-width: 400px;
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
    
    @media only screen and (max-width: 600px) {
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
        width: 90%;
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
                    <p class="">Di addio alle continue ristampe dei menù cartacei, all'usura e alla loro poca igienicità.<br/>Da oggi c'è Dsign Menu, il primo <b>menu interamente digitale</b>, l'ieale per i tuoi clienti!<br/>FACILE, VELOCE E PERSONALIZZABILE.</p>
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
          <div class="section column white">
            <div id="how" class="row center">
                <h2>Come Funziona?</h2>
                <div class="text-block">
                  <p class="">Ti basteranno tre semplici passaggi per avere il tuo menù digitale pronto all'uso!</p>
                  <div class="flex">
                    <div class="step">
                      <div class=""></div><p>Registrati gratuitamente cliccando l'icona in alto a destra</p>
                    </div>
                    <div class="step">
                      <div class=""></div><p>Scegli tra i template predefiniti e crea il tuo menù</p>
                    </div>
                    <div class="step">
                      <div class=""></div><p>Scarica e stampa il QR code per i tuoi tavoli</p>
                    </div>
                  </div>
                </div>         
                <a class="button" on-tap="openLogin">Provalo subito</a>
            </div>     
          </div>
          <div class="section column blue">
             <div class="row center">
                <h2>Quanto mi costa?</h2>
             </div>
             <div class="text-block">
                <div class="boxed">
                  <ul>
                  <li>Inserimento piatti ILLIMITATO</li>
                  <li>Due template predefiniti</li>
                  <li>Generazione e stampa QR CODE immediata</li>
                  <hr/>
                  <li><span>GRATIS</span></li>
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
          <div class="section column white team">
            <div id="team" class="row center">
                <h2>Il Team</h2>
                <div class="text-block">
                  <p class="">Siamo un gruppo di ragazzi con la passione per il web, per le nuove tecnologie e la comunicazione digitale. La nostra proposta è un'idea fresca e innovativa che pensiamo possa venire in soccorso ai ristoratori che vogliono stare al passo con i tempi.</p>
                  <div class="flex">
                    <div class="step">
                      <div class="">
                        <p class="name">Antonio</p>
                        <p class="role">CTO</p>
                        <p class="desc">01110011 01100011 01100101 01101101 01101111 00100000 01100011 01101000 01101001 00100000 01101100 01100101 01100111 01100111 01100101</p>
                      </div>
                    </div>
                    <div class="step">
                      <div class="">
                        <p class="name">Paolo</p>
                        <p class="role">Web Designer</p>
                        <p class="desc">Bisogna saper prendere la palla al balzo, come diceva il castratore di canguri</p>
                        </div>
                    </div>
                    <div class="step">
                      <div class="">
                        <p class="name">Martina</p>
                        <p class="role">Creative</p>
                        <p class="desc">Lorem Ipsum doloret sit amet, is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard</p>
                        </div>
                    </div>
                  </div>
                </div>        
            </div>     
          </div>
          <footer style="line-height: 120px; background-color: #015b63; color: white; text-align:center;">© 2020 Dsign - Buon appetito </footer>
        </template>
        <template is="dom-if" if="{{isAllowed('dashboard', 'index-logged')}}">
            <active-menu></active-menu>
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
                    _authService: "Auth"
                }
            },

            _authService: {
                observer: 'changeAuthService'
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
        if(!authService) {
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

    nextReview() {
        let elements = this.shadowRoot.querySelectorAll('.review');
        let current = this._getCurrentActiveReviewIndex(elements);
        let next = current === (elements.length - 1) ? 0 : current + 1;

        this._updateDot(next);

        setTimeout(
            () => {
                elements[next].style.display = 'none';
                elements[next].style.right = '1500px';
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
                elements[current].style.right = '-1500px';
                elements[current].classList.remove('active');
                elements[next].classList.add('active');
                elements[next].style.right = '0';
            },
            100
        );
    }

    /**
     * @returns {number}
     * @private
     */
    _getCurrentActiveReviewIndex(elements) {
        let index;
        for (index = 0; index < elements.length; index++) {
            if (elements[index].classList.contains('active')) {
                break;
            }
        }
        return index;
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

}

window.customElements.define('dashboard-index', DashboardIndex);

