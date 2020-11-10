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
import {LocalizeMixin} from "@dsign/polymer-mixin/localize/localize-mixin.js";
import {ServiceInjectorMixin} from "@dsign/polymer-mixin/service/injector-mixin.js";
import {lang} from './language.js';

/**
 * @class DashboardIndex
 */
class DashboardIndex extends ServiceInjectorMixin(PolymerElement) {

  static get template() {
    return html`
      <style>
      
        :host {
            display: block;
            position: relative;
            margin-top: 12px;
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
            width: 1080px;
            min-height: 400px;
        }

        .container.box {
          margin: auto auto;
      }
      

      .welcome {
        border: none;
        width: 100%;
        margin: 160px auto 0;
        background: url(http://127.0.0.1:8081/images/sfondo.jpg);
        text-align: center;
        background-repeat: no-repeat;
        background-size: cover;
    }

      /*.welcome:after {
        content: "";
        display: inline-block;
        width: 60px;
        height: 60px;
        background: white;
        transform: rotate(45deg);
        margin: 0 auto -33px;
    }*/

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

.boxed ul li{
  color: white;
  list-style-type: none;
  text-transform: uppercase;
  margin: 20px 0;
  font-size:22px;
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

.review{
    display: none;
    transition: all ease 0.2s;
}

.review.active{
  display:block;
  align-self:center;
    margin:0 50px;
}

  .navigation{

  }

  .navigation .dot{
    height: 20px;
    width: 20px;
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

.slideshow-container {
  width: 60%;
  min-height: 200px;
  position:relative;
}

.left, .right {
  font-size: 130px;
  font-family: auto;
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
  background: url(http://127.0.0.1:8081/images/sfondo.jpg);
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
        
        .user_team {
            height: 400px;
            width: 300px;
        }
        
        .user_photo {
            height: 300px;
            width: 300px;
            border-radius: 50%;
            background-image: url("http://placehold.it/300x300/015b63/ffffff");
        }
        
        .user_team .name,
        .user_team .role {
            text-align: center;
        }

        .user_team .name {
            font-size: 18px;
        }

        .user_team .role {
            font-size: 24px;
        }
        
        .card-content .description {
            word-wrap: break-word;
            max-width: 280px;
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
        background-image: url(http://127.0.0.1:8081/images/android-chrome-384x384.png);
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
        
        @media only screen and (max-width: 400px) {
          .logo  {
            background-size: 80%;
          }
          
          .user_photo {
              height: 200px;
              width: 200px;
              border-radius: 50%;
              background-image: url("http://placehold.it/300x300/015b63/ffffff");
          }
          
          .user_team {
            height: 300px;
            width: 200px;
          }
        }
        
      </style>
      
      <div class="section padding-top-30">
      <div class="welcome">
      <div class="gradient">
       <div class="container-logo">
              <div class="logo"></div>
          </div>
          <div class="container box">
            <div class="intro-description center start">
                <h2 class="margin-0">Hai mai pensato a un menu digitale per il tuo ristorante?</h2>
                <a class="button yellow" href="#how">Scopri di piu</a>
            </div>
            </div>
            </div>
          </div>      
      </div>
      <div class="menu">
      <div class="inside">
              <h2>Dsign Menu</h2>
          <div class="text-block">
                <p class="">Di addio alle continue ristampe dei menu cartacei, all'usura e alla loro poco igienicità.<br/>Da oggi c'è Dsign Menu, il primo <b>menu interamente digitale</b>, l'ieale per i tuoi clienti!<br/>FACILE, VELOCE E PERSONALIZZABILE.</p>
                <div class="flex">
                <div class="">
                <a class="icon"><img src="http://127.0.0.1:8081/images/ico1.png" /></a><p>Facile</p>
                </div>
                <div class="">
                <a class="icon"><img src="http://127.0.0.1:8081/images/ico2.png" /></a><p>Personalizzabile</p>
                </div>
                <div class="">
                <a class="icon"><img src="http://127.0.0.1:8081/images/ico3.png" /></a><p>Sempre aggiornato</p>
                </div>
                <div class="">
                <a class="icon"><img src="http://127.0.0.1:8081/images/ico6.png" /></a><p>Garantito dai clienti</p>
                </div>
                <div class="">
                <a class="icon"><img src="http://127.0.0.1:8081/images/ico4.png" /></a><p>Veloce</p>
                </div>
                <div class="">
                <a class="icon"><img src="http://127.0.0.1:8081/images/ico5.png" /></a><p>Rispettoso dell'ambiente</p>
                </div>
            </div>
            </div>
            </div>
          </div>     
      <div class="section column white">
        <div id="how" class="row center">
            <h2>Come Funziona?</h2>
            <div class="text-block">
              <p class="">Niente di più semplice, registrati gratuitamente, crea il tuo menu, stampa il QR Code per i tuoi tavoli e guarda i tuoi clienti utilizzare il tuo menu!</p>
              <div class="flex">
                <div class="step">
                  <div class=""></div><p>Registrati</p>
                </div>
                <div class="step">
                  <div class=""></div><p>Crea il tuo menu</p>
                </div>
                <div class="step">
                  <div class=""></div><p>Stampa il tuo QR Code</p>
                </div>
              </div>
            </div>         
            <a class="button" href="#how">Provalo subito</a>
        </div>     
      </div>
      <div class="section column blue">
         <div class="row center">
            <h2>Quanto mi costa?</h2>
         </div>
         <div class="text-block">
            <div class="boxed">
              <ul>
              <li>Piatti illimitati</li>
              <li>2 template predefiniti</li>
              <li>Nessuna APP da scaricare</li>
              <li>Generazione e stampa QR code</li>
              <hr/>
              <li><span>Gratis</span></li>
              </ul>
            </div>
         </div>
      </div>
      <div class="menu">
          <div class="container box">
            <div class="people center start">
                <h2 class="margin-0">Dicono di noi</h2>
                <div class="quote">
                  <a class="left prev" onclick="plusSlides(-1)">&#10094;</a>
                  <div class="slideshow-container">
                    <div class="review mySlides fade">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard</div>
                    <div class="review mySlides fade">Lorem Ipsum doloret sit amet, consectetuer adipiscing elit, sed diam n. Duis autem vel eum iriure dolor in hendrerit in vuluputate velit esse molestie consequat</div>
                    <div class="review mySlides fade">Lorem Ipsum doloret sit amet, is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard</div>
                  </div>
                  <a class="right next" onclick="plusSlides(1)">&#10095;</a>
                </div>
                <div class="navigation"><span class="dot" onclick="currentSlide(1)"></span><span class="dot" onclick="currentSlide(1)"></span><span class="dot" onclick="currentSlide(1)"></span>
                </div>
            </div>
          </div>      
          <div class="section column white team">
            <div id="team" class="row center">
                <h2>Il Team</h2>
                <div class="text-block">
                  <p class="">Lorem Ipsum doloret sit amet, is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard</p>
                  <div class="flex">
                    <div class="step">
                      <div class="">
                        <p class="name">Antonino Visalli</p>
                        <p class="role">CTO</p>
                        <p class="desc">Lorem Ipsum doloret sit amet, is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard</p>
                      </div>
                    </div>
                    <div class="step">
                      <div class="">
                        <p class="name">Paolo Sartorio</p>
                        <p class="role">Web Designer</p>
                        <p class="desc">Lorem Ipsum doloret sit amet, is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard</p>
                        </div>
                    </div>
                    <div class="step">
                      <div class="">
                        <p class="name">Martina Bertinazzi</p>
                        <p class="role">Graphic</p>
                        <p class="desc">Lorem Ipsum doloret sit amet, is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard</p>
                        </div>
                    </div>
                  </div>
                </div>        
            </div>     
          </div>
          <script>
          var slideIndex = 1;
          showSlides(slideIndex);
          function plusSlides(n) {
            showSlides(slideIndex += n);
          }
            function currentSlide(n) {
            showSlides(slideIndex = n);
          }
          function showSlides(n) {
            var i;
            var slides = document.getElementsByClassName("mySlides");
            var dots = document.getElementsByClassName("dot");
            if (n > slides.length) {slideIndex = 1}
            if (n < 1) {slideIndex = slides.length}
            for (i = 0; i < slides.length; i++) {
                slides[i].style.display = "none";
            }
            for (i = 0; i < dots.length; i++) {
                dots[i].className = dots[i].className.replace(" active", "");
            }
            slides[slideIndex-1].style.display = "block";
            dots[slideIndex-1].className += " active";}</script>`;
  }

  constructor() {
    super();
    this.resources = lang;
  }


  static get properties() {
    return {

      services : {
        value : {
          _notify : "Notify",
          _localizeService: 'Localize',
        }
      }
    };
  }
}

window.customElements.define('dashboard-index', DashboardIndex);

