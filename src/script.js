'use strict';

import $ from 'jquery';
import moment from 'moment';
import test_data from './test_data.json';

// メールを送信する
let exportMail = () => {
  createExportText().then(data => {
    const address = test_data.address;
    const subjet = `${moment().format('YYYY/MM/DD')} ${test_data.name} 日報`;
    const body = escapeMailBody(data);
    window.location.href = `mailto:${address}?subject=${subjet}&body=${body}`;
  });
};

// 送信する本文を作成する
function createExportText() {
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
