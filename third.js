let snowChildID;

auth.onAuthStateChanged(user => {

    if(user){
     snowChildID = user.uid;
     storage.ref('users/' + user.uid + '/profile.jpg').getDownloadURL().then(imgUrl => {
         UDDP.src = imgUrl;
         UDP.src = imgUrl;
     }).catch(error => {

     })

     db.collection('users').doc(user.uid).collection('userPost').orderBy("time", "desc").onSnapshot(snaps => {
         console.log(snaps.docs);
         setUpPost(snaps.docs);
         userDetails(user);
     }, err => {
        console.log(err.message);
      });

    }
     
   
 });

 // creating self post in th database......
const userForm = document.querySelector("#selfForm");
if(userForm){
  userForm.addEventListener('submit', (e) => {
  e.preventDefault()
  if(userForm['UBS'].value != ""){

    db.collection('users').doc(snowChildID).collection('userPost').add({
      post: userForm['UBS'].value,
      time: timestamp()
    }).then(()=>{
      const Fform = document.getElementById('selfForm');
      Fform.reset()
    }).catch(err =>{
      console.log(err.message);
    })
  }else{
    console.log("Enter something!!")
  }

  })
}

const postList = document.querySelector('.userConsole'); 
const setUpPost = (data) => {
 
if(data.length){
  console.log(data.length);
 let html = ''
 data.forEach(doc => {
      const guide = doc.data();
      const div = `
      <div class = "RTBoxes" style="background-color: rgb(36,37,38); color: white; font-family: Open Sans; word-wrap: break-word; font-size: 15px; color: rgb(170,171,172);" >${guide.post}</div>
       `;
      html += div 
    });
    postList.innerHTML = html;
 }
}

const det = document.getElementById("detail");
const userDetails = (user) => {
  if(user){
    db.collection('users').doc(user.uid).get().then(doc => {
      const html = `
      <div style = "box-sizing: border-box; margin-left: 50px; padding: 10px; color: rgb(170,171,172)">
        <div><div class = "material-icons">person</div>&nbsp&nbsp&nbsp${doc.data().displayName} ${doc.data().sName}</div><br>
        <div><div class = "material-icons">send</div>&nbsp&nbsp&nbsp${doc.data().email}<div><br>
        <div><div class = "material-icons">cake</div>&nbsp&nbsp&nbsp${doc.data().date}/${doc.data().month}/${doc.data().year}<div><br>
        <div><div class = "material-icons">location_on</div>&nbsp&nbsp&nbsp${doc.data().place}</div>
      </div>
      `
      det.innerHTML = html;
    })
  }
}