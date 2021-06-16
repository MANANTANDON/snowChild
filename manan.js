//get data.....
//state change......
const timestamp = firebase.firestore.FieldValue.serverTimestamp;
let displayPicture = document.getElementById("DP");
let smalldisplayPicture = document.getElementById("dp");
let UDDP = document.getElementById("userDisplayPic");
let UDP = document.getElementById("udp");
var highl = document.getElementById("signInPassword");
let profileImage;
let imgId;
let postImage;
let imageStoringId;
let center;



auth.onAuthStateChanged(user => {

   if(user){
     imgId = user.uid;
     FullName(user);
    storage.ref('users/' + user.uid + '/profile.jpg').getDownloadURL().then(imgUrl => {
        displayPicture.src = imgUrl;
        smalldisplayPicture.src = imgUrl;
        profileImage = imgUrl;
    }).catch(error => {
         
    })


    db.collection('guides').orderBy("createdAt", "desc").onSnapshot(snapshot => {
      setUpGuides(snapshot.docs);
      setupUI(user); 
      }, err => {
        console.log(err.message);
      });

      storage.ref('users/' + imgId + '/post.jpg').getDownloadURL().then(img => {
            postImage = img
      }).catch(error => {
        
      })

      db.collection('users').doc(user.uid).get().then(doc => {
          center = doc.data().displayName + doc.data().sName;
          console.log(center);
        })
      db.collection('users').onSnapshot(snap => {
        setUpFriends(snap.docs);
      })
   }else{
       console.log("user logged out: ", user);
       setUpGuides([]);
       setupUI(user);
   }
  
});

let file = {};
function chooseFile(e){
    file = e.target.files[0];
}
//this is signup method 
const signup = document.getElementById('signUpForm');
if(signup){
    signup.addEventListener('submit', (e) => {
   
        e.preventDefault();

        //get user info...
        const email = signup['signUpEmail'].value;
        const pass = signup['signUpPassword'].value;

        console.log("SignedUp!! "+email+" "+pass);

    //create a user
    auth.createUserWithEmailAndPassword(email, pass).then(cred => {

      storage.ref('users/' + cred.user.uid + '/profile.jpg').put(file).then(function () {
          console.log("uploaded");
      }).catch(e => {
        console.log(e);
      })
      return db.collection('users').doc(cred.user.uid).set({
         displayName: signup["firstName"].value,
         sName: signup["surname"].value,
         email: signup["signUpEmail"].value,
         date: signup["dd"].value,
         month: signup["mm"].value,
         year: signup["yy"].value,
         place: signup['location'].value  
      });
    }).then(() => {
      const modal = document.querySelector('#ck78');
      signup.reset();
      window.location = "second.html";
      
     });
  });
}

// login method
const login = document.getElementById("loginForm");
if(login){
    login.addEventListener('submit', (e) => {

        e.preventDefault();

        //get login credentials....

        const user = login["signInEmail"].value;
        const password = login['signInPassword'].value;


        //SignIn User......

        auth.signInWithEmailAndPassword(user, password).then(cred => {
            console.log(cred);
            login.reset();
            window.location = "second.html"
        }).catch(error => {
          window.alert("password is incorrect! " + error);
          highlight();

        })
    });
}

function highlight(){
   highl.style.border = "1px solid red";
}

//logout method...
const logout = document.getElementById("out");
if(logout){
logout.addEventListener("click", (e)=>{
 
   e.preventDefault();
   auth.signOut().then(() =>{
      window.location = "index.html";
   });
});
}

const creatForm = document.querySelector("#cForm");
if(creatForm){
  creatForm.addEventListener('submit', (e) => {
  e.preventDefault()
  if(creatForm['userBlog'].value != ""){
    if(document.getElementById("images").files.length == 0) {
      console.log("You havent selected any file!!");
      db.collection('guides').add({
        content: creatForm['userBlog'].value,
        person: center,
        createdAt: timestamp(),
        profileIm: profileImage,
      }).then(()=>{
        const Fform = document.getElementById('cForm');
        Fform.reset()
      }).catch(err =>{
        console.log(err.message);
      })
   }else{
     console.log("yeah man i got a file !")
     storage.ref('users/' + imgId + '/post.jpg').put(file).then(function () {
      console.log("uploaded");
    }).catch(e => {
    
    })
    db.collection('guides').add({
      content: creatForm['userBlog'].value,
      person: center,
      createdAt: timestamp(),
      profileIm: profileImage,
      post: postImage
    }).then(()=>{
      const Fform = document.getElementById('cForm');
      Fform.reset()
    }).catch(err =>{
      console.log(err.message);
    })
   }
      
      
  }else{
    console.log("Enter something!!")
  }

  })
}

    


//setUp guides

const guideList = document.querySelector('.centerConsole'); 
const setUpGuides = (data) => {
 
if(data.length){
  console.log(data.length);
 let html = ''
 data.forEach(doc => {
      const guide = doc.data();
      // console.log(guide);
      const pre = guide.createdAt.toDate();
      if(guide.post){
      const div = `<div>
        
      <div class = "RTBoxes" style="background-color: rgb(36,37,38); color: white; font-family: Open Sans; word-wrap: break-word; font-size: 15px; color: rgb(170,171,172);" ><img class = "profilePic" style="float: left; height: 40px; width: 40px; margin: -7px 10px 10px -1px" src = "${guide.profileIm}"></img>@${guide.person} <br>
      <div style = "font-size: 10px;">${pre}</div> 
      <hr style = "width: 545px; border: 1px solid rgb(60,61,62);"><br>
      <div style = "font-size: 15px;">${guide.content} </div><br>
      <img style = "height: auto; width: 580px; margin:0 0 0 -15px;" src = "${guide.post}"></img>
      <br><br><br>
      <button class = "like__btn">
        <div class = "material-icons" style = "font-size: 12px;" onclick = changeIcon() id = "like">favorite_border</div>
        <span>Like</span>
      </button>
      </div>
      </div>
     `;
     html += div 
   }else{
    const div = `<div>
        
    <div class = "RTBoxes" style="background-color: rgb(36,37,38); color: white; font-family: Open Sans; word-wrap: break-word; font-size: 15px; color: rgb(170,171,172);" ><img class = "profilePic" style="float: left; height: 40px; width: 40px; margin: -7px 10px 10px -1px" src = "${guide.profileIm}"></img>@${guide.person} <br>
    <div style = "font-size: 10px;">${pre}</div> 
    <hr style = "width: 545px; border: 1px solid rgb(60,61,62);"><br>
    <div style = "font-size: 15px;">${guide.content} </div><br>
    <br><br><br>
    <button class = "like__btn">
      <div class = "material-icons" style = "font-size: 12px;" onclick = changeIcon() id = "like">favorite_border</div>
      <span>Like</span>
    </button>
    </div>
    </div>
   `;
   html += div 
   }
   
    });

    guideList.innerHTML = html;
    
 }
}

const accDetails = document.getElementById("userDetails");
const setupUI = (user) => {
  if(user){

    db.collection('users').doc(user.uid).get().then(doc => {
      const html = `
         <div style =  "border: 2px solid rgb(36,37,38); border-radius: 10px; background-color: rgb(36,37,38); margin: 5px 0 0 0; padding: 10px;">
         <div style = "box-sizing: border-box; padding: 10px; text-align: center; font-family: 'Lucida Grande'; font-size: 33px; color: rgb(170,171,172); left: 2px;">  ${doc.data().displayName} ${doc.data().sName}</div> 
         <div style = "box-sizing: border-box;  margin-left: 20px; margin-right: 20px; border-radius: 10px; padding: -10px; color: rgb(170,171,172);">
         <div class = "material-icons" style = " float: left; margin: -40px 0 0 40px; color: rgb(170,171,172); font-size: 20px;"><br><br>email</div>
         <div style = "box-sizing: border-box; font-family: 'Lucida Grande';">  ${user.email} </div>
        </div>   
        <hr style = "border: 1px solid rgb(60,61,62);">    
        </div>
        <hr style = "border: 1px solid rgb(60,61,62);margin : 400px 0 0 0;"><span style = "color: rgb(110,111,112); font-size: 12px; margin: 12px 0 0 5px;">TM. snowchild all rights reserved.</span>
          `;
       accDetails.innerHTML = html;
    }).catch(error => {
    })
  }
}

const userName = document.getElementById("FGk5");
const FullName = (user) => {
  if(user){
    db.collection("users").doc(user.uid).get().then(doc => {
      const html = `
      <div style = "box-sizing: border-box; padding: 5px; text-align: center; font-family: 'Lucida Grande'; font-size: 15px; color: rgb(170,171,172); float: left; margin: -10px 0 0 8px;">${doc.data().displayName} ${doc.data().sName}</div>
     <br> <hr style = "border: 1px solid rgb(60,61,62);">
      `;
    userName.innerHTML = html;
    }).catch(e =>{
      
    })
  }
}

const friendsList = document.querySelector('.friendsConsole')
const setUpFriends = (data) =>{
    if(data.length){
      console.log(data.length);
      let html = '';
      data.forEach(docs => {
        const friends = docs.data();
        const div = `
          <br><div class = "myFriends">@${friends.displayName} ${friends.sName}</div>
        `;
        html += div;
      });
      friendsList.innerHTML = html;
    }else{
      friendsList.innerHTML = "";
    }
}


