export default defineNuxtPlugin((nuxtApp) => {
    return {
        provide:{
            parseJwt : (token)=> {
                if(token == null){
                    return null;
                }
                var base64Url = token.split('.')[1];
                var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                
                return JSON.parse(jsonPayload);
            },
           
              readInputFile:(file)=>{
                return new Promise((resolve, reject) => {
                  //var _URL = window.URL || window.webkitURL;
                  var img = new Image();
                  //var objectUrl = _URL.createObjectURL(file);
                  img.onload = function () {
                    //_URL.revokeObjectURL(objectUrl);
                    var reader = new FileReader();
                    reader.onload = function (e) {
                      resolve(e.target.result);
                    }
                    reader.readAsDataURL(file);
                  };
                  //img.src = objectUrl;
                })
              },
              formatAngka:(angka)=>{
                return new Intl.NumberFormat('ID',{
                  maximumFractionDigits:0
                }).format(angka);
              },
              formatDate(dateStr) {
                return new Intl.DateTimeFormat('id', {
                 //weekday: 'long',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                }).format(new Date(dateStr));
                
                
              },
              formatDateTime(dateStr) {
                return new Intl.DateTimeFormat('id', {
                 //weekday: 'long',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: "numeric",
                  minute: "numeric",
                }).format(new Date(dateStr));
              },

              formatUtcDateTime(dateStr) {
                return new Intl.DateTimeFormat('id', {
                 //weekday: 'long',
                  year: 'numeric',
                  month:'short',
                  day: 'numeric',
                  timeZone: "Asia/Jakarta",
                  hour: "numeric",
                  minute: "numeric",
                }).format(new Date(dateStr));
              },
              dataTableOptions(url,token,body = null){
                return {
                  serverSide: true,
                  processing: true,
                  responsive: true,
                  ajax: {
                    url: url,
                    type: 'POST',
                    headers: {
                      Authorization: "Bearer " + token,
                    },
                    data: (d) => {
                      if (body !== null) {
                        for (let key in body) {
                          d[key] = body[key];
                        }
                      }
                    },
                    error: function (jqXHR, textStatus, error) {
                      console.log("Error Status", jqXHR.status)
                    }
                  },
                }
              },
              isAuthorized(user,page){
                if(user.roles == null){
                  return false;
                }
                if(user.roles == 'admin'){
                  return true;
                }
                return user.roles.toLowerCase() == page.toLowerCase();
              }
        }
    }
});