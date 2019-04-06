# Daily-report-mail

Chrome extension to mail of daily reporter

## Install Published Version

1. Clone git repository

```
g clone https://github.com/rhythm191/daily-report-mail.git
```

2. Create src/test_data.json

```
// src/test_data.json
{
  "name": "rhythm191",
  "address": "to_send_address@example.com",
  "list_id": "your_list_id"
}
```

3. Build script

```
yarn install
yarn run build
```

4. Install chrome extension build directory

open `chrome://extensions/` and load unpacked extension `daily-report-mail/build`

## Usage

1. From a board, click on the board title
2. Click on Share, print, and export...
3. Click on Mail to
