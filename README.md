<p align="center">
  <h1 class="glitch">SUBOBJ</h1>
  <br>
  <a href="https://travis-ci.org/lucagez/subobj"><img src="https://travis-ci.com/lucagez/subobj.svg?branch=master" alt="travis"></a>
  <a href="https://www.npmjs.org/package/subobj"><img src="https://img.shields.io/npm/v/subobj.svg?style=flat" alt="npm"></a>
  <img src="https://img.shields.io/badge/license-MIT-f1c40f.svg" alt="MIT">
  <img src="https://img.shields.io/badge/PRs-welcome-6574cd.svg" alt="PR's welcome">
  <a href="https://unpkg.com/subobj"><img src="https://img.badgesize.io/https://unpkg.com/subobj/dist/subobj.js?compression=gzip" alt="gzip size"></a>
</p>

(setq markdown-xhtml-header-content
  "<style type='text/css'>
    .glitch {
      color: black;
      font-size: 100px;
      position: relative;
      width: 400px;
      margin: 0 auto;
    }

    @keyframes noise-anim {
      0% {
        clip: rect(71px, 9999px, 10px, 0);
      }
      5% {
        clip: rect(24px, 9999px, 100px, 0);
      }
      10% {
        clip: rect(84px, 9999px, 17px, 0);
      }
      15% {
        clip: rect(94px, 9999px, 95px, 0);
      }
      20% {
        clip: rect(68px, 9999px, 18px, 0);
      }
      25% {
        clip: rect(82px, 9999px, 16px, 0);
      }
      30% {
        clip: rect(42px, 9999px, 24px, 0);
      }
      35% {
        clip: rect(44px, 9999px, 100px, 0);
      }
      40% {
        clip: rect(28px, 9999px, 37px, 0);
      }
      45% {
        clip: rect(79px, 9999px, 74px, 0);
      }
      50% {
        clip: rect(3px, 9999px, 89px, 0);
      }
      55% {
        clip: rect(66px, 9999px, 86px, 0);
      }
      60% {
        clip: rect(91px, 9999px, 95px, 0);
      }
      65% {
        clip: rect(75px, 9999px, 50px, 0);
      }
      70% {
        clip: rect(4px, 9999px, 20px, 0);
      }
      75% {
        clip: rect(98px, 9999px, 59px, 0);
      }
      80% {
        clip: rect(29px, 9999px, 3px, 0);
      }
      85% {
        clip: rect(35px, 9999px, 71px, 0);
      }
      90% {
        clip: rect(46px, 9999px, 64px, 0);
      }
      95% {
        clip: rect(42px, 9999px, 66px, 0);
      }
      100% {
        clip: rect(70px, 9999px, 27px, 0);
      }
    }
    .glitch:after {
      content: attr(data-text);
      position: absolute;
      left: 2px;
      text-shadow: -1px 0 red;
      top: 0;
      color: black;
      background: palevioletred;
      overflow: hidden;
      clip: rect(0, 900px, 0, 0);
      animation: noise-anim 2s infinite linear alternate-reverse;
    }

    @keyframes noise-anim-2 {
      0% {
        clip: rect(98px, 9999px, 25px, 0);
      }
      5% {
        clip: rect(87px, 9999px, 55px, 0);
      }
      10% {
        clip: rect(84px, 9999px, 95px, 0);
      }
      15% {
        clip: rect(69px, 9999px, 97px, 0);
      }
      20% {
        clip: rect(88px, 9999px, 79px, 0);
      }
      25% {
        clip: rect(97px, 9999px, 40px, 0);
      }
      30% {
        clip: rect(43px, 9999px, 43px, 0);
      }
      35% {
        clip: rect(45px, 9999px, 96px, 0);
      }
      40% {
        clip: rect(27px, 9999px, 89px, 0);
      }
      45% {
        clip: rect(15px, 9999px, 10px, 0);
      }
      50% {
        clip: rect(62px, 9999px, 38px, 0);
      }
      55% {
        clip: rect(37px, 9999px, 40px, 0);
      }
      60% {
        clip: rect(26px, 9999px, 85px, 0);
      }
      65% {
        clip: rect(85px, 9999px, 47px, 0);
      }
      70% {
        clip: rect(68px, 9999px, 98px, 0);
      }
      75% {
        clip: rect(38px, 9999px, 6px, 0);
      }
      80% {
        clip: rect(67px, 9999px, 88px, 0);
      }
      85% {
        clip: rect(27px, 9999px, 74px, 0);
      }
      90% {
        clip: rect(78px, 9999px, 3px, 0);
      }
      95% {
        clip: rect(33px, 9999px, 64px, 0);
      }
      100% {
        clip: rect(84px, 9999px, 73px, 0);
      }
    }
    .glitch:before {
      content: attr(data-text);
      position: absolute;
      left: -2px;
      text-shadow: 1px 0 blue;
      top: 0;
      color: white;
      background: black;
      overflow: hidden;
      clip: rect(0, 900px, 0, 0);
      animation: noise-anim-2 3s infinite linear alternate-reverse;
    }

  </style>")