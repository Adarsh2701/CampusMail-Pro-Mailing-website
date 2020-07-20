let recipients, subject, body, id
document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  // document.querySelector('#mail-newDiv').addEventListener('click', open_mail(`${id}`));

  // By default, load the inbox
  load_mailbox('inbox');
})

function compose_email() {
    debugger;
      document.querySelector('#emails-view').style.display = 'none';
      document.querySelector('#compose-view').style.display = 'block';

      document.querySelector('#compose-recipients').value = '';
      document.querySelector('#compose-subject').value = '';
      document.querySelector('#compose-body').value = '';

    document.querySelector('#compose-form').onsubmit = () => {

    recipients = document.querySelector('#compose-recipients').value;
    subject = document.querySelector('#compose-subject').value;
    body = document.querySelector('#compose-body').value;

    fetch('/emails', {
        method: 'POST',
        body: JSON.stringify({
            recipients: recipients,
            subject: subject,
            body: body
        })
    })
    .then(res => res.json())
    .then(result => {
        console.log(result)
    })

  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
  location.replace("http://127.0.0.1:8000/")

    return false;
  }
}

// To archive an email
function archive(id) {
  fetch(`emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      archived: true
    })
  })
}
  
// To mark read and unread
function read(id) {
  fetch(`emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      read: true 
    })
  })
  
}


function load_mailbox(mailbox) {
debugger;
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  
  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  if(mailbox === "archive") {

  }
  console.log("Above fetch")
  fetch(`emails/${mailbox}`)
  .then((response) => response.json())
  .then((emails) => {
  emails.forEach((element) => {
    console.log(element)
    
    const newDiv = document.createElement('div');
    newDiv.id = "mail-newDiv";
    newDiv.innerHTML = `<div><b>${element.sender}</b>   ${element.subject}   ${element.timestamp}</div>`;
    document.querySelector('#emails-view').appendChild(newDiv);


    // if(element.read === true) {
    //   document.querySelector('#mail-newDiv').style.background = "white";
    // }
    // else {
    //   document.querySelector('#mail-newDiv').style.background = "#99989861";
    // }
    
    document.querySelector('#mail-newDiv').addEventListener("click", function () {
      open_mail(element.id);

      // Creating a reply button
      const replyBtn = document.createElement('button');
      replyBtn.className = "btn btn-sm btn-outline-primary";
      replyBtn.id = "reply";
      replyBtn.innerHTML = "Reply";

      // Creating a archive button
      const archiveBtn = document.createElement('button');
      archiveBtn.className = "btn btn-sm btn-outline-primary";
      archiveBtn.id = "archive";
      archiveBtn.innerHTML = "Archive";
      document.querySelector('#emails-view').append(replyBtn, archiveBtn)
      }
    );
    // document.querySelector('#archive').addEventListener('click', archive(element.id))
  })
})
  .catch((error) => {
    document.querySelector('#emails-view').innerHTML = error;
  })
 }


// Function to read the mail
 function open_mail(id) {
   // Calling the read function
   read(id)
   fetch(`emails/${id}`)
   .then(response => response.json())
   .then(data => {
     // New div for displaying the contents of the mail
     const view_email = document.createElement('div')
     view_email.innerHTML = `<div>
     <p><b>Sender:</b> ${data.sender}</p>
     <p><b>Recipients: </b>${data.recipients}</p>
     <p><b>Timestamp: </b>${data.timestamp}</p>
     <p><b>Subject: </b>${data.subject}</p>
     <br><br>
     <h3>Body</h3>
     <p>${data.body}</p>
     </div>`
     document.querySelector('#emails-view').appendChild(view_email)

    //  document.querySelector('#emails-view').style.display = 'none';
    //  document.querySelector('#view-email').style.display = 'block';  
   })
 }

//  function readHTML(content) {
//    debugger;
//     htmlValue = `<div>
//     <p><b>Sender:</b> ${content.sender}</p>
//     <p><b>Recipients: </b>${content.recipients}</p>
//     <p><b>Timestamp: </b>${content.timestamp}</p>
//     <p><b>Subject: </b>${content.subject}</p>
//     <br><br>
//     <h3>Body></h3>
//     <p>${content.body}</p>
//     </div>`
//  }
