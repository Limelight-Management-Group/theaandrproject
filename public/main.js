  
// // let image = document.querySelector('.form-control-file')
//   console.log(image,'image')
//     var field = $('form-group').find('input[name=image]');
//     let imageArr = [];

// let messageOutput = document.querySelector('.usersMessages')
// console.log(user,'<----------------------messageOutput')
// var upload_image = function(url,form,id) {
//     var file = imageArr[0];
//     console.log(file.type)
//     // var file = field[0].files[0];
//     // var original_name = field.val();
//     // var extension = original_name.substr((original_name.lastIndexOf('.')));
//     // var filename = id + extension;

//     var fd = new FormData();
//     // fd.append('key', filename);
//     fd.append('acl', 'bucket-owner-full-control');
//     fd.append('Content-Type', file.type);
//     fd.append("file",file);
// console.log(fd, '<---FD---<')
//     return $.ajax({
//         type : 'POST',
//         url : url,
//         data : fd,
//         processData: false,  // tell jQuery not to convert to form data
//         contentType: false  // tell jQuery not to set contentType
//     });
// };
    // console.log(field)
// image.addEventListener('change',()=>{
//     console.log('this is the file -->', image.value)
//     imageArr.push(image.value)
//     console.log(imageArr)
// })
// upload_image('/signup', 'user_sign_up', uuidV4())