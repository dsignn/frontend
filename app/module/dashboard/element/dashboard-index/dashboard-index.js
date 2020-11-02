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
  border-radius: 15px;
  padding: 9px 30px;
  display: inline-block;
  margin-top: 30px;
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


.flex div a {
  display: block;
  background: #015b63;
  width: 80%;
  padding-top: 80%;
  border-radius: 17px;
  margin: auto auto;
}

.flex div p {
  font-size: 18px;
  max-width: 80%;
  margin: 5px auto;
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
  max-width: 800px;
  font-size: 22px;
}

.review{

}

.quote:hover .review{
display:none;
}

  .review2{
    display: none;
    margin-right: -800px;
    transition: all ease 0.2s;
}

.quote:hover .review2 {
  display:block;
  transition: all ease 0.2s;
margin-right:0;
}

  .navigation{

  }
  
  .row.team {
    width: 100%;
    max-width: 1600px;
    justify-content: space-around;
    margin: 50px auto 20px;
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
                <a class="button" href="#how">Scopri di piu</a>
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
                <a class="icon" href="#"></a><p>Facile</p>
                </div>
                <div class="">
                <a class="icon" href="#"></a><p>Personalizzabile</p>
                </div>
                <div class="">
                <a class="icon" href="#"></a><p>Sempre aggiornato</p>
                </div>
                <div class="">
                <a class="icon" href="#"></a><p>Garantito dai clienti</p>
                </div>
                <div class="">
                <a class="icon" href="#"></a><p>Veloce</p>
                </div>
                <div class="">
                <a class="icon" href="#"></a><p>Rispettoso dell'ambiente</p>
                </div>
            </div>
            </div>
            </div>
          </div>     
      <div class="section column white">
      <div>     
        <div id="how" class="row center">
            <h2>Come Funziona?</h2>
        </div>
        <div class="row strengths padding-34 space-between">
            <paper-card strengths image="http://placehold.it/300x150/015b63/ffffff">
                <div class="card-content">
                    <h3>Gratuito</h3>
                      <div class="description">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard</div>
                </div>
            </paper-card>
            <paper-card strengths image="http://placehold.it/300x150/015b63/ffffff">
                <div class="card-content">
                    <h3>Personalizzabile</h3>
                    <div class="description">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard</div>
                </div>
            </paper-card>
            <paper-card strengths image="http://placehold.it/300x150/015b63/ffffff">
                <div class="card-content">
                    <h3>Personalizzabile</h3>
                    <div class="description">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard</div>
                </div>
            </paper-card>
            <paper-card strengths image="http://placehold.it/300x150/015b63/ffffff">
                <div class="card-content">
                    <h3>Utile</h3>
                      <div class="description">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard</div>
                </div>
            </paper-card>
            <paper-card strengths image="http://placehold.it/300x150/015b63/ffffff">
                <div class="card-content">
                    <h3>Facile</h3>
                      <div class="description">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard</div>
                </div>
            </paper-card>
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
              <li>Assistenza online</li>
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
                  <div class="review">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard</div>
                  <div class="review2">Lorem Ipsum doloret sit amet, consectetuer adipiscing elit, sed diam n. Duis autem vel eum iriure dolor in hendrerit in vuluputate velit esse molestie consequat</div>
                </div>
                <div class="navigation"> x x x </div>
                </div>
            </div>
          </div>      
      <div class="section column second white">
           <div class="row center">
                <h2 class="team-title">Il Team</h2>
           </div>
           <div class="row team">
                <div class="user_team">
                    <div class="user_photo"></div>
                    <div class="role">CTO</div>
                    <div class="name">Antonino Visalli</div>
                </div>
                <div  class="user_team">
                    <div class="user_photo"></div>
                    <div class="role">Web Designer</div>
                    <div class="name">Paolo Sartorio</div>
                </div>
                <div  class="user_team">
                    <div class="user_photo"></div>
                    <div class="role">Web Designer</div>
                    <div class="name">Paolo Sartorio</div>
                </div>
           </div>
      </div>`;
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

