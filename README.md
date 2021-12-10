# web-app

Web Application for Polkadot Hackathon.

## Introducation

Here is the source code of the web application FMD-CESS, which is the entrance to the user side. The platform supports users to upload, share, and purchase data.

click 👉: http://data.cesslab.co.uk/data/

Generally speaking, you may also need to install [*The Polkadot-JS Extension*](https://docs.substrate.io/v3/integration/polkadot-js/#polkadot-js-extension) in advance and go to the [*faucet*](http://data.cesslab.co.uk/faucet/) to receive a sufficient balance.

## Features

### Faucet

![Image](https://raw.githubusercontent.com/CESSProject/W3F-illustration/main/hackathon/faucet1.png)

- Fill in the account address to receive 10000 TCESS.
- Meanwhile, we have also added the time limit, and can only submit once every 24 hours.

### Home

![Image](https://raw.githubusercontent.com/CESSProject/W3F-illustration/main/hackathon/home1.png)

- Clear homepage design style.
- You can enter the data list page by clicking the search button.

### Market

![Image](https://raw.githubusercontent.com/CESSProject/W3F-illustration/main/hackathon/market2.png)

- Display all market data in the form of a list.
- Support keyword search, as well as correlation or price sorting.
- Support filtering based on file type with single selection or multiple selection.

### Data Detail

![Image](https://raw.githubusercontent.com/CESSProject/W3F-illustration/main/hackathon/data-detail-2.png)

- Data details show rich information including data name, data ID, data size, etc.
- Buy the data by clicking the buy button in the upper right corner.
- The sidebar can also display similar files, which is realized by similarity hash (At present, only the similarity comparison between txt and image format is supported).

### My Data

![Image](https://raw.githubusercontent.com/CESSProject/W3F-illustration/main/hackathon/my-data-2.png)

- We can click the upload button on this page to upload the file.
- All the uploaded data will be displayed on this page.
- Support uploaded files to be downloaded at any time within the validity period (Tips: the files just uploaded need to wait a while before they can be downloaded).

### Upload

![Image](https://raw.githubusercontent.com/CESSProject/W3F-illustration/main/hackathon/upload1.png)

- We will check every file upload. If the file has been uploaded by someone or is more than 50% similar (At present, only the similarity comparison between txt and image format is supported) to the existing file in the system, we will convert the file status to private if you originally wanted to make it public.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```


