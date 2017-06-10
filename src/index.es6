import './style.css';
import $ from '../static/jquery-3.0.0.js';

(function(){
  const musicList = [
    { name:'DJ - Melody from heaven.mp3', src: './music'},
    { name:'Dragon Rider.mp3', src: './music'},
    { name:'Enya - Amarantine.mp3', src: './music'},
    { name:'Era - The Mass.mp3', src: './music'},
  ]
  initList($('.m-list ul'), musicList);

  function initList($list, mList) {
    mList.forEach((item) => {
      const audio = document.createElement('audio');
      audio.setAttribute('src', `${item.src}/${item.name}`);
      audio.addEventListener("canplay", function(){
        $('.m-list ul').append(`<li>${item.name}<span>${formatSeconds(audio.duration)}</span></li>`)
      });
    });
  }
  function formatSeconds(sec, type) {
    const hours = parseInt(sec / 3600);
    const min = parseInt((sec % 3600) / 60);
    const second = parseInt(sec % 60);
    return (type || 'H:M:S').replace('H', hours).replace('M', min).replace('S', second);
  }
})();