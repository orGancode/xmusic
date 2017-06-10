import './style.css';
import $ from '../static/jquery-3.0.0.js';

(function(){
  const musicList = [
    { name:'DJ - Melody from heaven.mp3', src: './music'},
    { name:'Dragon Rider.mp3', src: './music'},
    { name:'Enya - Amarantine.mp3', src: './music'},
    { name:'Era - The Mass.mp3', src: './music'},
  ]
  // 获取页面唯一的播放器
  const playerDom = document.getElementsByTagName('audio')[0];
  let defaultVol = 1;
  initList($('.m-list ul'), musicList);

  // open or hide player
  $('.info .xm-more').on('click', () => {
    $('.player').toggleClass('hide');
  });

  // prev play pause next and stop player
  $('.js-ctr').on('click', '.xm-prev', (evt) => {
    switchMusic($('.m-list li.active').index(), -1);
  });
  $('.js-ctr').on('click', '.xm-pause', (evt) => {
    handlePlay(false);
    playerDom.pause();
  });
  $('.js-ctr').on('click', '.xm-play', (evt) => {
    handlePlay(true);
    playerDom.play();
  });
  $('.js-ctr').on('click', '.xm-next', (evt) => {
    switchMusic($('.m-list li.active').index(), 1);
  });
  $('.js-ctr').on('click', '.xm-stop', (evt) => {
    playerDom.currentTime = 0;
    playerDom.pause();
    handlePlay(false);
  });

  // quite volume
  $('.js-vol').on('click', '.xm-voice', () => {
    handleQuite(true)
  })
  $('.js-vol').on('click', '.xm-quite', () => {
    handleQuite(false)
  })

  function handleQuite(quite) {
    if (quite) {
      playerDom.volume = 0;
      $('.js-vol .xmusic').addClass('xm-quite').removeClass('xm-voice');
    } else {
      playerDom.volume = defaultVol;
      $('.js-vol .xmusic').addClass('xm-voice').removeClass('xm-quite');
    }
  }

  function handlePlay(play) {
    if(play) {
      $('.js-play').addClass('xm-pause').removeClass('xm-play');
    } else {
      $('.js-play').addClass('xm-play').removeClass('xm-pause');
    }
  }

  function switchMusic(curr, next) {
    const listLength = $('.m-list ul li').length; //曲目条数
    if ((curr < listLength - 1 && next > 0) || (curr > 0 && next < 0) ) {
      const nextStep = curr + next;
      playerDom.setAttribute('src', `${musicList[nextStep].src}/${musicList[nextStep].name}`)
      $('.m-list li.active').removeClass('active').closest('ul').find('li').eq(nextStep).addClass('active');
      handlePlay(true);
      playerDom.play();
    }
  }

  function initPlayer(audio) {
    const l = decodeURIComponent(audio.src).split('/');
    const musicName = l[l.length - 1];
    const musicDuration = formatSeconds(audio.duration);
    $('.m-list li').eq(0).addClass('active');
    $('.pro .time-dura').html(musicDuration);
    $('.pro marquee').html(musicName);
    $('.m-operate').append(audio);
    playerDom.setAttribute('src',audio.getAttribute('src'));
    defaultVol = playerDom.volume;
  }

  function initList($list, mList) {
    mList.forEach((item, index) => {
      const audio = document.createElement('audio');
      audio.setAttribute('src', `${item.src}/${item.name}`);
      audio.addEventListener("canplay", function(){
        $('.m-list ul').append(`<li>${item.name}<span>${formatSeconds(audio.duration)}</span></li>`)
        if (index === 0) {
          initPlayer(audio);
        }
      });
    });
  }

  function formatSeconds(sec, type) {
    const hours = parseInt(sec / 3600);
    const min = parseInt((sec % 3600) / 60);
    const second = parseInt(sec % 60);
    if (!type) {
      return hours === 0 ? `${min}:${second}` : `${hours}:${min}:${second}`
    }
    return (type).replace('H', hours).replace('M', min).replace('S', second);
  }


})();