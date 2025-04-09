import store from '../Redux/store';
import axios from 'axios';
const uploadUrl = 'https://uatapi.stemicathaid.com/upload';
const token = store.getState().auth?.user
  ? store.getState().auth.user.token
  : '';
const globalProps = {
  timezoneOffset: -330,
  platform: 'web',
};
const uploadImage = async ({file, options = {}}) => {
  console.log('token--->', token);
  console.log('file--->', file);
  let {multiPart = true} = options;
  if (multiPart) {
    let formData = new FormData();
    formData.append('token', token);
    formData.append('timezoneOffset', -330);
    formData.append('platform', 'web');

    formData.append('s3', true);

    if (file && Array.isArray(file)) {
      file.map(fileData => {
        (fileData.type = 'image/jpeg'), formData.append('', fileData);
      });
    }
    console.log('🚀 ~ uploadImage ~ uploadUrl:', uploadUrl, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    try {
      const response = await axios.post(`${uploadUrl}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('uploadResult---->', response.data.response);

      return response.data.response;
    } catch (error) {
      console.log('>>>>uploaderror', e);
    }
  } else {
    console.log(new Error('Upload not supported without multiPart'), 2000);
  }
};

export default uploadImage;


// launchImageLibrary({mediaType:'photo',selectionLimit: 1,storageOptions: {
//   skipBackup: true,
//   path: 'tmp_files',
//   }}, async response => {
//   console.log("response>>>>>>", response)
//   this.imageResize(response);
// });

// uploadOptions = { s3: true, async: true }

// after uploading to S3
// const uriProps = {
//   timezoneOffset: -330,
//   platform: 'web',
//   token: 'a91641e91b2f712314ad9d49e01b92ac7bab6c86',
//   paramValue: {
//     _allPageSelected: false,
//     _query: {},
//     updates: {
//       _updates: {
//         update: {
//           _id: '65dd88a7da19870e4c170bad',
//           changes: {
//             photo: {
//               key: '9a2e4330-bdf9-4d0b-8e08-a4bad1aec1da__thumb__4da9cc5e-bf88-48aa-8f9a-c9e04dac57bb.JPEG',
//               name: '4da9cc5e-bf88-48aa-8f9a-c9e04dac57bb.JPEG',
//               orginalKey:
//                 'fbb12954-156f-4777-b8ce-4711d20e4b45__4da9cc5e-bf88-48aa-8f9a-c9e04dac57bb.JPEG',
//             },
//           },
//         },
//       },
//     },
//     model: 'User',
//   },
//   id: '_save',
// };

// you can also make changes to local user and put localUri
