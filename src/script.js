'use strict';

import $ from 'jquery';
import moment from 'moment';
import test_data from './test_data.json';

// メールを送信する
let exportMail = () => {
  createExportText().then(data => {
    const address = getSendAddress();
    const subjet = `${moment().format('YYYY/MM/DD')} ${test_data.name} 日報`;
    const body = escapeMailBody(data);
    window.location.href = `mailto:${address}?subject=${subjet}&body=${body}`;
  });
};

// 送信先のアドレスを返すPromiseを返す
function getSendAddress() {
  // let member_name = document
  //   .getElementsByClassName('member-avatar')[0]
  //   .getAttribute('title');
  // let user_name = /^.*\((\w+)\)$/.exec(member_name)[1];

  // return fetch(`/1/members/${user_name}?fields=name,email`, {
  //   credentials: 'include'
  // })
  //   .then(res => {
  //     return res.json();
  //   })
  //   .then(json => {
  //     return Promise.resolve(json.email);
  //   });
  return test_data.address;
}

// 送信するボードの本文を作成する
function createExportText() {
  let board_export_url = document
    .getElementsByClassName('js-export-json')[0]
    .getAttribute('href');
  let parts = /\/b\/(\w{8})\.json/.exec(board_export_url);

  if (!parts) {
    console.log('Board menu not open.');
    return Promise.reject();
  }

  const lists_id = test_data.list_id;

  return fetch(`/1/lists/${lists_id}/cards`, {
    credentials: 'include'
  })
    .then(res => {
      return res.json();
    })
    .then(data => {
      let mail_body = `お疲れ様です。${test_data.name}です。\n\n`;
      mail_body += `# 所感\n\n\n`;
      mail_body += `# 業務内容\n`;
      for (let card of data) {
        mail_body += `* ${card.name}\n`;
      }
      mail_body += '\n\n';
      return Promise.resolve(mail_body);
    });
}

// カードリストを作成する
function getCardLists(datas) {
  let lists = [];
  for (let list_data of datas.lists) {
    let list = {
      id: list_data.id,
      name: list_data.name,
      cards: []
    };
    lists.push(list);

    for (let card_data of datas.cards) {
      if (list.id === card_data.idList) {
        list.cards.push({ name: card_data.name });
      } else {
        continue;
      }
    }
  }
  return lists;
}

// メールの文字列をエスケープする
function escapeMailBody(str) {
  return str
    .replace(/%/g, '%25')
    .replace(/\n/g, '%0d%0a')
    .replace(/=/g, '%3D')
    .replace(/&/g, '%26')
    .replace(/,/g, '%2C')
    .replace(/ /g, '%20')
    .replace(/#/g, '%23')
    .replace(/\?/g, '%3f');
}

var add_daily_mail_interval = null;

// メール送信のリンクを作成する
function addDailyMailLink() {
  let $export_btn = $('a.js-export-json');

  if ($('.pop-over-list').find('.js-daily-reporter').length != 0) {
    clearInterval(add_daily_mail_interval);
    return;
  }

  if (!!$export_btn) {
    $('<a>')
      .attr({
        class: 'js-daily-reporter',
        href: '#',
        target: '_blank',
        title: 'Mail to daily report '
      })
      .text('Mail to daily report')
      .click(exportMail)
      .insertAfter($export_btn.parent())
      .wrap(document.createElement('li'));
  }
}

var add_clipboard_interval = null;

// on DOM load
$(document).ready(function($) {
  // the "Share, Print, Export..." link on the board header option list
  $(document).on('mouseup', '.js-share', () => {
    add_daily_mail_interval = setInterval(addDailyMailLink, 300);
  });
});
